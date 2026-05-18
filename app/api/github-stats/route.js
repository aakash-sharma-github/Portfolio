// app/api/github-stats/route.js
// GET  /api/github-stats  → returns { repoCount, totalCommits }
// POST /api/github-stats  → force-revalidates cache (protected by REVALIDATE_SECRET)

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { fetchGitHubStats } from '@/lib/github-client';
import {
  getFromCache,
  setInCache,
  clearCacheByPattern,
  buildCacheKey,
  TTL,
} from '@/lib/cache';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

// Shared cache key used by both GET and POST
const CACHE_KEY = buildCacheKey('github-stats', { login: GITHUB_USERNAME });

// ─── Fallback values — update these to match your current real numbers ────────
// Shown only when the API call fails AND cache is empty.
const FALLBACK = { repoCount: 35, totalCommits: 328 };

// ─── GET /api/github-stats ────────────────────────────────────────────────────

export async function GET() {
  try {
    // 1. Try cache first (6-hour TTL)
    const cached = await getFromCache(CACHE_KEY);

    if (cached) {
      const { repoCount, totalCommits } = cached;
      return NextResponse.json(
        { repoCount, totalCommits },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=600',
            'X-Cache': 'HIT',
          },
        }
      );
    }

    // 2. Cache miss — check credentials
    if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
      console.warn('[github-stats] Credentials not configured — using fallback');
      await setInCache(CACHE_KEY, FALLBACK, TTL.GITHUB_SHORT);
      return NextResponse.json(FALLBACK, { status: 200 });
    }

    // 3. Fetch live from GitHub GraphQL
    const stats = await fetchGitHubStats(GITHUB_USERNAME, GITHUB_TOKEN);
    await setInCache(CACHE_KEY, stats, TTL.GITHUB);

    return NextResponse.json(
      { repoCount: stats.repoCount, totalCommits: stats.totalCommits },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=600',
          'X-Cache': 'MISS',
        },
      }
    );
  } catch (err) {
    console.error('[github-stats] GET error:', err.message);

    // Return fallback — never show an error to visitors
    await setInCache(CACHE_KEY, FALLBACK, TTL.GITHUB_SHORT);
    return NextResponse.json(FALLBACK, { status: 200 });
  }
}

// ─── POST /api/github-stats ───────────────────────────────────────────────────
// Clears cache and fetches fresh data.
// Protect with: curl -X POST /api/github-stats -H "x-revalidate-secret: YOUR_SECRET"

export async function POST(req) {
  const secret = req.headers.get('x-revalidate-secret');

  if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await clearCacheByPattern('github-stats:');

    const stats = await fetchGitHubStats(GITHUB_USERNAME, GITHUB_TOKEN);
    await setInCache(CACHE_KEY, stats, TTL.GITHUB);

    return NextResponse.json(
      { repoCount: stats.repoCount, totalCommits: stats.totalCommits },
      { status: 200, headers: { 'X-Cache': 'REVALIDATED' } }
    );
  } catch (err) {
    console.error('[github-stats] POST error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}