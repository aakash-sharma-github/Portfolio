let cache = {};

export const getFromCache = (key) => {
    return cache[key];
};

export const setInCache = (key, value) => {
    cache[key] = value;
};

export const clearCache = (key) => {
    delete cache[key];
};
