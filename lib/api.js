import axios from 'axios';

// ✅ Fix bug 4: NEVER use an absolute localhost URL for client-side API calls.
// When NEXT_PUBLIC_API_URL=http://localhost:3000 is set and the site is deployed
// to Vercel, every API call from the browser hits localhost on the visitor's
// machine — which obviously doesn't exist → "Network Error".
//
// The correct pattern: use RELATIVE paths (/api/...) for all browser-side calls.
// Next.js routes them to the same host automatically in both dev and prod.
//
// SERVER_API_URL is exported only for server-side code (sitemap, generateMetadata)
// that genuinely needs a full URL because it runs outside the browser.
export const SERVER_API_URL =
    process.env.NEXT_PUBLIC_SITE_URL;

// Axios instance — baseURL intentionally empty so all paths are relative.
const api = axios.create({
    baseURL: '',      // ← relative: resolves to current host automatically
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Attach the stored JWT to every outgoing request automatically.
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('adminToken');
            if (token) config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────────────────
// Only redirect to /admin on 401 for NON-auth routes.
// Auth-endpoint 401s must not trigger a redirect — they are handled by callers.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint = error.config?.url?.includes('/api/auth');
        if (
            error.response?.status === 401 &&
            !isAuthEndpoint &&
            typeof window !== 'undefined'
        ) {
            localStorage.removeItem('adminToken');
            if (window.location.pathname !== '/admin') {
                window.location.href = '/admin';
            }
        }
        return Promise.reject(error);
    }
);

// ── Blog API ──────────────────────────────────────────────────────────────────
export const blogApi = {
    getPosts: async ({ category = 'All', search = '', page = 1, limit = 9 } = {}) => {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);
        if (search) params.append('search', search);
        params.append('page', String(page));
        params.append('limit', String(limit));
        const res = await api.get(`/api/blogs?${params}`);
        return res.data;
    },

    getPostBySlug: async (slug) => {
        const res = await api.get(`/api/blogs/${slug}`);
        return res.data;
    },

    createPost: async (postData) => {
        const res = await api.post('/api/blogs', postData);
        return res.data;
    },

    updatePost: async (slug, postData) => {
        const res = await api.put(`/api/blogs/${slug}`, postData);
        return res.data;
    },

    // ✅ Fix bug 2: was using bare fetch() with no Authorization header.
    // DELETE /api/blogs/[slug] uses verifyAuth() which requires "Bearer <token>".
    // Now uses the shared axios instance which attaches the token automatically
    // via the request interceptor above.
    deletePost: async (slug) => {
        const res = await api.delete(`/api/blogs/${slug}`);
        return res.data;
    },

    getCategories: async () => {
        const res = await api.get('/api/categories');
        return res.data;
    },

    uploadImage: async (imageData, folder = 'blog') => {
        const res = await api.post('/api/upload', { image: imageData, folder });
        return res.data;
    },
};

// ── Work API ──────────────────────────────────────────────────────────────────
export const workApi = {
    getWorks: async ({ category = 'All', status = '', featured, page = 1, limit = 12 } = {}) => {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);
        if (status) params.append('status', status);
        if (featured !== undefined) params.append('featured', String(featured));
        params.append('page', String(page));
        params.append('limit', String(limit));
        const res = await api.get(`/api/works?${params}`);
        return res.data;
    },

    getWorkBySlug: async (slug) => {
        const res = await api.get(`/api/works/${slug}`);
        return res.data;
    },

    createWork: async (workData) => {
        const res = await api.post('/api/works', workData);
        return res.data;
    },

    updateWork: async (slug, workData) => {
        const res = await api.put(`/api/works/${slug}`, workData);
        return res.data;
    },

    // Same fix as deletePost — use the interceptor-aware instance so the token is sent
    deleteWork: async (slug) => {
        const res = await api.delete(`/api/works/${slug}`);
        return res.data;
    },
};

// ── Contact API ───────────────────────────────────────────────────────────────
export const contactApi = {
    submitContact: async (contactData) => {
        const res = await api.post('/api/contacts/submit', contactData);
        return res.data;
    },

    getContacts: async ({ status, search = '', page = 1, limit = 20 } = {}) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        params.append('page', String(page));
        params.append('limit', String(limit));
        const res = await api.get(`/api/contacts?${params}`);
        return res.data;
    },

    getContactById: async (id) => {
        const res = await api.get(`/api/contacts/${id}`);
        return res.data;
    },

    deleteContact: async (id) => {
        const res = await api.delete(`/api/contacts/${id}`);
        return res.data;
    },
};

// ── Dashboard API ─────────────────────────────────────────────────────────────
export const dashboardApi = {
    getOverview: async () => {
        const res = await api.get('/api/dashboard');
        return res.data;
    },
};

// ── Notification API ──────────────────────────────────────────────────────────
export const notificationApi = {
    getNotifications: async () => {
        const res = await api.get('/api/notifications');
        return res.data;
    },
};

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
    // ✅ Fix bug 4: relative /api/auth instead of ${API_URL}/api/auth
    // On Vercel, API_URL was http://localhost:3000 → Network Error on every login.
    login: async (password) => {
        try {
            const res = await axios.post(
                '/api/auth',    // ← relative, resolves correctly on any host
                { password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 15000,
                }
            );
            return res.data;
        } catch (error) {
            if (error.response?.data?.error) throw new Error(error.response.data.error);
            if (error.code === 'ECONNABORTED') throw new Error('Request timed out. Please try again.');
            if (error.code === 'ERR_NETWORK') throw new Error('Network error. Check your connection.');
            throw new Error(error.message || 'Login failed. Please try again.');
        }
    },

    verifyToken: async (token) => {
        if (!token) return false;
        try {
            const res = await axios.get(
                '/api/auth',    // ← relative
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 8000,
                }
            );
            return res.data?.valid === true;
        } catch {
            return false;
        }
    },
};

export default api;