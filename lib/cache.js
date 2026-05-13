/**
 * lib/cache.js
 *
 * Two-tier cache:
 *   1. Redis (production) — persistent across Vercel serverless invocations,
 *      shared across all function instances
 *   2. In-memory Map (fallback) — used in dev or when Redis is unavailable.
 *      Scoped to a single instance; still useful for burst traffic on the same
 *      warm instance.
 *
 * Public API:
 *   getFromCache(key)                → Promise<data | null>
 *   setInCache(key, value, ttlSecs)  → Promise<void>
 *   clearCache(key)                  → Promise<void>  (key=null clears ALL)
 *   clearCacheByPattern(prefix)      → Promise<void>  (clears all keys starting with prefix)
 *
 * Usage example:
 *   import { getFromCache, setInCache, clearCacheByPattern } from '@/lib/cache';
 *
 *   // Read
 *   const cached = await getFromCache('blogs:list:All:1:8');
 *   if (cached) return cached;
 *
 *   // Write
 *   await setInCache('blogs:list:All:1:8', result, 600); // 10 min
 *
 *   // Invalidate after a blog post is created/updated/deleted
 *   await clearCacheByPattern('blogs:'); // wipes all blog-related keys
 */

// ─── Redis client (lazy, singleton) ──────────────────────────────────────────
let _redis = null;
let _redisDown = false; // circuit breaker — stops hammering a dead Redis

async function getRedis() {
    if (_redisDown || !process.env.REDIS_URL) return null;
    if (_redis) return _redis;

    try {
        const { default: Redis } = await import('ioredis');
        _redis = new Redis(process.env.REDIS_URL, {
            maxRetriesPerRequest: 1,   // fail fast
            connectTimeout: 2000,
            lazyConnect: true,
            enableReadyCheck: false,
        });

        _redis.on('error', (err) => {
            console.warn('[cache] Redis error — falling back to memory:', err.message);
            _redisDown = true;
            _redis = null;
            // Auto-recover after 60s
            setTimeout(() => { _redisDown = false; }, 60_000);
        });

        _redis.on('connect', () => {
            _redisDown = false;
            console.log('[cache] Redis connected');
        });

        return _redis;
    } catch (err) {
        console.warn('[cache] Redis init failed:', err.message);
        _redisDown = true;
        setTimeout(() => { _redisDown = false; }, 60_000);
        return null;
    }
}

// ─── In-memory fallback ───────────────────────────────────────────────────────
// Simple Map with TTL. Cleaned every 5 minutes.
const _mem = new Map();

const mem = {
    get(key) {
        const item = _mem.get(key);
        if (!item) return null;
        if (Date.now() > item.exp) { _mem.delete(key); return null; }
        return item.data;
    },
    set(key, value, ttlSecs) {
        _mem.set(key, { data: value, exp: Date.now() + ttlSecs * 1000 });
    },
    del(key) {
        _mem.delete(key);
    },
    delByPrefix(prefix) {
        for (const k of _mem.keys()) {
            if (k.startsWith(prefix)) _mem.delete(k);
        }
    },
    clear() { _mem.clear(); },
};

// Sweep expired in-memory entries every 5 minutes (only in long-lived processes)
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [k, v] of _mem.entries()) {
            if (now > v.exp) _mem.delete(k);
        }
    }, 5 * 60 * 1000);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get a cached value by key.
 * Returns the parsed data, or null if missing/expired.
 */
export async function getFromCache(key) {
    const client = await getRedis();
    if (client) {
        try {
            const raw = await client.get(key);
            if (raw) return JSON.parse(raw);
        } catch (err) {
            console.warn('[cache] get failed:', err.message);
        }
    }
    return mem.get(key);
}

/**
 * Store a value in cache.
 * @param {string} key
 * @param {*}      value   — must be JSON-serialisable
 * @param {number} ttlSecs — time-to-live in SECONDS (default: 600 = 10 min)
 */
export async function setInCache(key, value, ttlSecs = 600) {
    const client = await getRedis();
    if (client) {
        try {
            await client.set(key, JSON.stringify(value), 'EX', ttlSecs);
            return;
        } catch (err) {
            console.warn('[cache] set failed:', err.message);
        }
    }
    mem.set(key, value, ttlSecs);
}

/**
 * Delete a specific cache key.
 * Pass null to clear EVERYTHING (use with caution in production).
 */
export async function clearCache(key) {
    const client = await getRedis();
    if (client) {
        try {
            if (key) {
                await client.del(key);
            } else {
                await client.flushdb();
            }
            return;
        } catch (err) {
            console.warn('[cache] clear failed:', err.message);
        }
    }
    if (key) { mem.del(key); } else { mem.clear(); }
}

/**
 * Delete all cache keys that START with `prefix`.
 * Used to invalidate a whole category (e.g. all blog list pages at once).
 *
 * Example:
 *   clearCacheByPattern('blogs:') → deletes blogs:list:All:1:8, blogs:post:my-slug, etc.
 *   clearCacheByPattern('works:') → deletes all work-related keys
 */
export async function clearCacheByPattern(prefix) {
    const client = await getRedis();
    if (client) {
        try {
            // SCAN is non-blocking — safe to use in production (unlike KEYS)
            let cursor = '0';
            do {
                const [nextCursor, keys] = await client.scan(
                    cursor, 'MATCH', `${prefix}*`, 'COUNT', 100
                );
                cursor = nextCursor;
                if (keys.length) {
                    await client.del(...keys);
                }
            } while (cursor !== '0');
            return;
        } catch (err) {
            console.warn('[cache] pattern clear failed:', err.message);
        }
    }
    mem.delByPrefix(prefix);
}

/**
 * Cache TTL constants (in seconds) — use these everywhere for consistency.
 */
export const TTL = {
    BLOGS_LIST: 600,   // 10 minutes — blog list pages
    BLOGS_POST: 3600,   // 1 hour    — individual blog post
    WORKS_LIST: 1800,   // 30 minutes — works list (changes less often)
    WORKS_POST: 3600,   // 1 hour    — individual work
    DASHBOARD: 300,   // 5 minutes — admin dashboard stats
    GITHUB: 21600,   // 6 hours   — GitHub stats (already in github-stats route)
};

/**
 * Build a consistent, canonical cache key from request parameters.
 * Ensures the same query always hits the same cache bucket.
 *
 * @param {string} namespace  — e.g. 'blogs:list' or 'works:list'
 * @param {Object} params     — query params that affect the result
 * @returns {string}          — e.g. 'blogs:list:category=All&page=1&limit=8'
 */
export function buildCacheKey(namespace, params = {}) {
    // Sort keys for deterministic order regardless of query param order
    const sorted = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
    return sorted ? `${namespace}:${sorted}` : namespace;
}