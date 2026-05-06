import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle API errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized errors — only redirect on protected/admin routes
            if (error.response.status === 401 && typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                // Only remove token and redirect for admin routes, not public blog routes
                if (currentPath.startsWith('/admin') && currentPath !== '/admin') {
                    localStorage.removeItem('adminToken');
                    window.location.href = '/admin';
                }
            }
        }
        return Promise.reject(error);
    }
);

// Blog API functions
export const blogApi = {
    // Get all posts with optional filtering and pagination
    // FIX: Accepts both object form { category, search, page, limit } AND positional args (page, limit)
    getPosts: async (pageOrOptions = {}, limitArg) => {
        try {
            let category = 'All', search = '', page = 1, limit = 8;

            // Support both calling conventions:
            // blogApi.getPosts({ category, search, page, limit })  — object form
            // blogApi.getPosts(page, limit)                        — positional form (used in dashboard)
            if (typeof pageOrOptions === 'object' && pageOrOptions !== null) {
                ({ category = 'All', search = '', page = 1, limit = 8 } = pageOrOptions);
            } else if (typeof pageOrOptions === 'number') {
                page = pageOrOptions;
                limit = limitArg || 8;
            }

            const params = new URLSearchParams();
            if (category && category !== 'All') {
                params.append('category', category);
            }
            if (search) {
                params.append('search', search);
            }
            params.append('page', String(page));
            params.append('limit', String(limit));

            const response = await api.get(`/api/blogs?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch posts:', error.message);
            throw new Error(`Failed to fetch posts: ${error.message}`);
        }
    },

    // Get a single post by slug
    getPostBySlug: async (slug) => {
        try {
            const response = await api.get(`/api/blogs/${encodeURIComponent(slug)}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch post with slug ${slug}:`, error.message);
            throw new Error(`Failed to fetch post with slug ${slug}: ${error.message}`);
        }
    },

    // Create a new post
    createPost: async (postData) => {
        try {
            if (!postData.coverImage) {
                const timestamp = Date.now();
                postData.coverImage = '/api/default-cover?title=' + encodeURIComponent(postData.title) + '&t=' + timestamp;
            }

            const response = await api.post('/api/blogs', postData);
            return response.data;
        } catch (error) {
            console.error('Failed to create post:', error.message);
            throw new Error(`Failed to create post: ${error.message}`);
        }
    },

    // Update a post
    updatePost: async (slug, postData) => {
        try {
            if (!postData.coverImage) {
                const timestamp = Date.now();
                postData.coverImage = '/api/default-cover?title=' + encodeURIComponent(postData.title) + '&t=' + timestamp;
            }

            const response = await api.put(`/api/blogs/${encodeURIComponent(slug)}`, postData);
            return response.data;
        } catch (error) {
            console.error('Failed to update post:', error.message);
            throw new Error(`Failed to update post: ${error.message}`);
        }
    },

    // Delete a post
    deletePost: async (slug) => {
        try {
            const response = await api.delete(`/api/blogs/${encodeURIComponent(slug)}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete post:', error.message);
            throw new Error(`Failed to delete post: ${error.message}`);
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await api.get('/api/categories');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch categories:', error.message);
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    },

    // Upload an image
    uploadImage: async (imageData) => {
        try {
            const response = await api.post('/api/upload', { image: imageData });
            return response.data;
        } catch (error) {
            console.error('Failed to upload image:', error.message);
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    },
};

// Work API functions
export const workApi = {
    // Get all works with optional filtering and pagination
    getWorks: async ({ category = 'All', status = '', featured, page = 1, limit = 12 } = {}) => {
        try {
            const params = new URLSearchParams();
            if (category !== 'All') {
                params.append('category', category);
            }
            if (status) {
                params.append('status', status);
            }
            if (featured !== undefined) {
                params.append('featured', featured);
            }
            params.append('page', String(page));
            params.append('limit', String(limit));

            // FIX: was missing /api/ prefix — changed /works to /api/works
            const response = await api.get(`/api/works?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch works:', error.message);
            throw new Error(`Failed to fetch works: ${error.message}`);
        }
    },

    // Get a single work by slug
    getWorkBySlug: async (slug) => {
        try {
            // FIX: was missing /api/ prefix
            const response = await api.get(`/api/works/${encodeURIComponent(slug)}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch work with slug ${slug}:`, error.message);
            throw new Error(`Failed to fetch work with slug ${slug}: ${error.message}`);
        }
    },

    // Create a new work
    createWork: async (workData) => {
        try {
            const response = await api.post('/api/works', workData);
            return response.data;
        } catch (error) {
            console.error('Failed to create work:', error.message);
            throw new Error(`Failed to create work: ${error.message}`);
        }
    },

    // Update a work
    updateWork: async (slug, workData) => {
        try {
            // FIX: was missing /api/ prefix
            const response = await api.put(`/api/works/${encodeURIComponent(slug)}`, workData);
            return response.data;
        } catch (error) {
            console.error('Failed to update work:', error.message);
            throw new Error(`Failed to update work: ${error.message}`);
        }
    },

    // Delete a work
    deleteWork: async (slug) => {
        try {
            // FIX: was missing /api/ prefix
            const response = await api.delete(`/api/works/${encodeURIComponent(slug)}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete work:', error.message);
            throw new Error(`Failed to delete work: ${error.message}`);
        }
    },
};

// Contact API functions
export const contactApi = {
    // Submit a contact form (public endpoint)
    submitContact: async (contactData) => {
        try {
            const response = await api.post('/api/contacts/submit', contactData);
            return response.data;
        } catch (error) {
            console.error('Failed to submit contact form:', error.message);
            throw new Error(`Failed to submit contact form: ${error.message}`);
        }
    },

    // Get all contacts (admin only)
    getContacts: async ({ status, search = '', page = 1, limit = 20 } = {}) => {
        try {
            const params = new URLSearchParams();
            if (status) {
                params.append('status', status);
            }
            if (search) {
                params.append('search', search);
            }
            params.append('page', String(page));
            params.append('limit', String(limit));

            const response = await api.get(`/api/contacts?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch contacts:', error.message);
            throw new Error(`Failed to fetch contacts: ${error.message}`);
        }
    },

    // Get a single contact by ID
    getContactById: async (id) => {
        try {
            const response = await api.get(`/api/contacts/${encodeURIComponent(id)}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch contact with ID ${id}:`, error.message);
            throw new Error(`Failed to fetch contact with ID ${id}: ${error.message}`);
        }
    },

    // Delete a contact
    deleteContact: async (id) => {
        try {
            const response = await api.delete(`/api/contacts/${encodeURIComponent(id)}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete contact:', error.message);
            throw new Error(`Failed to delete contact: ${error.message}`);
        }
    },
};

// Notification API functions
export const notificationApi = {
    getNotifications: async () => {
        try {
            const response = await api.get('/api/notifications');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch notifications:', error.message);
            throw new Error(`Failed to fetch notifications: ${error.message}`);
        }
    }
};

// Dashboard API functions
export const dashboardApi = {
    getOverview: async () => {
        try {
            const response = await api.get('/api/dashboard');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch dashboard overview:', error.message);
            throw new Error(`Failed to fetch dashboard overview: ${error.message}`);
        }
    },
};

// Auth API functions
export const authApi = {
    login: async (password) => {
        try {
            const response = await api.post('/api/auth', { password });
            return response.data;
        } catch (error) {
            console.error('Login error:', error.message);

            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            } else if (error.code === 'ECONNREFUSED') {
                throw new Error('Cannot connect to server. Please make sure the server is running.');
            } else if (error.code === 'ETIMEDOUT') {
                throw new Error('Request timed out. Please try again.');
            } else {
                throw new Error(`Login failed: ${error.message}`);
            }
        }
    },

    verifyToken: async (token) => {
        try {
            if (!token) {
                return false;
            }

            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await api.get('/api/auth', { headers });
            return response.data.valid || false;
        } catch (error) {
            console.error('Token verification error:', error.message);
            return false;
        }
    },
};

export default api;