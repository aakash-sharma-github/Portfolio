// Enhanced cache system with TTL
let cache = new Map();

export const getFromCache = (key) => {
    const item = cache.get(key);
    if (!item) return null;
    
    // Check if item has expired
    if (Date.now() > item.expiry) {
        cache.delete(key);
        return null;
    }
    
    return item.data;
};

export const setInCache = (key, value, ttlMinutes = 60) => {
    const expiry = Date.now() + (ttlMinutes * 60 * 1000);
    cache.set(key, {
        data: value,
        expiry: expiry
    });
};

export const clearCache = (key) => {
    if (key) {
        cache.delete(key);
    } else {
        cache.clear();
    }
};

// Clean expired items periodically
setInterval(() => {
    const now = Date.now();
    for (let [key, item] of cache.entries()) {
        if (now > item.expiry) {
            cache.delete(key);
        }
    }
}, 5 * 60 * 1000); // Clean every 5 minutes
