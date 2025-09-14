import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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
            // Handle 401 Unauthorized errors
            if (error.response.status === 401 && typeof window !== 'undefined') {
                // Remove token from local storage
                localStorage.removeItem('adminToken');

                // Only redirect if we're not already on the login page
                if (window.location.pathname !== '/admin') {
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
    getPosts: async ({ category = 'All', search = '', page = 1, limit = 8 } = {}) => {
        try {
            // Don't send category parameter if it's 'All'
            const params = new URLSearchParams();
            if (category !== 'All') {
                params.append('category', category);
            }
            if (search) {
                params.append('search', search);
            }
            params.append('page', page);
            params.append('limit', limit);

            const response = await axios.get(`/api/blogs?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch posts:', error.message);
            throw new Error(`Failed to fetch posts: ${error.message}`);
        }
    },

    // Get a single post by slug
    getPostBySlug: async (slug) => {
        try {
            const response = await api.get(`/blogs/${slug}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch post with slug ${slug}:`, error.message);
            throw new Error(`Failed to fetch post with slug ${slug}: ${error.message}`);
        }
    },

    // Create a new post
    createPost: async (postData) => {
        try {
            // Validate cover image
            if (!postData.coverImage) {
                // Use default cover URL if none provided with cache-busting
                const timestamp = Date.now();
                postData.coverImage = '/api/default-cover?title=' + encodeURIComponent(postData.title) + '&t=' + timestamp;
            }

            const response = await api.post('/blogs', postData);
            return response.data;
        } catch (error) {
            console.error('Failed to create post:', error.message);
            throw new Error(`Failed to create post: ${error.message}`);
        }
    },

    // Update a post
    updatePost: async (slug, postData) => {
        try {
            // Validate cover image
            if (!postData.coverImage) {
                // Use default cover URL if none provided with cache-busting
                const timestamp = Date.now();
                postData.coverImage = '/api/default-cover?title=' + encodeURIComponent(postData.title) + '&t=' + timestamp;
            }

            const response = await api.put(`/blogs/${slug}`, postData);
            return response.data;
        } catch (error) {
            console.error('Failed to update post:', error.message);
            throw new Error(`Failed to update post: ${error.message}`);
        }
    },

    // Delete a post
    deletePost: async (slug) => {
        try {
            const response = await api.delete(`/blogs/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete post:', error.message);
            throw new Error(`Failed to delete post: ${error.message}`);
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch categories:', error.message);
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    },

    // Upload an image
    uploadImage: async (imageData) => {
        try {
            const response = await api.post('/upload', { image: imageData });
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
            params.append('page', page);
            params.append('limit', limit);

            const response = await api.get(`/works?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch works:', error.message);
            throw new Error(`Failed to fetch works: ${error.message}`);
        }
    },

    // Get a single work by slug
    getWorkBySlug: async (slug) => {
        try {
            const response = await api.get(`/works/${slug}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch work with slug ${slug}:`, error.message);
            throw new Error(`Failed to fetch work with slug ${slug}: ${error.message}`);
        }
    },

    // Create a new work
    createWork: async (workData) => {
        try {
            const response = await api.post('/works', workData);
            return response.data;
        } catch (error) {
            console.error('Failed to create work:', error.message);
            throw new Error(`Failed to create work: ${error.message}`);
        }
    },

    // Update a work
    updateWork: async (slug, workData) => {
        try {
            const response = await api.put(`/works/${slug}`, workData);
            return response.data;
        } catch (error) {
            console.error('Failed to update work:', error.message);
            throw new Error(`Failed to update work: ${error.message}`);
        }
    },

    // Delete a work
    deleteWork: async (slug) => {
        try {
            const response = await api.delete(`/works/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete work:', error.message);
            throw new Error(`Failed to delete work: ${error.message}`);
        }
    },
};

// Contact API functions
export const contactApi = {
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
            params.append('page', page);
            params.append('limit', limit);

            const response = await api.get(`/contacts?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch contacts:', error.message);
            throw new Error(`Failed to fetch contacts: ${error.message}`);
        }
    },

    // Get a single contact by ID
    getContactById: async (id) => {
        try {
            const response = await api.get(`/contacts/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch contact with ID ${id}:`, error.message);
            throw new Error(`Failed to fetch contact with ID ${id}: ${error.message}`);
        }
    },

    // Delete a contact
    deleteContact: async (id) => {
        try {
            const response = await api.delete(`/contacts/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete contact:', error.message);
            throw new Error(`Failed to delete contact: ${error.message}`);
        }
    },
};

// Notification API functions
export const notificationApi = {
    // Get notification status
    getNotifications: async () => {
        try {
            const response = await api.get('/notifications');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch notifications:', error.message);
            throw new Error(`Failed to fetch notifications: ${error.message}`);
        }
    }
};

// Dashboard API functions
export const dashboardApi = {
    // Get dashboard overview
    getOverview: async () => {
        try {
            const response = await api.get('/dashboard');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch dashboard overview:', error.message);
            throw new Error(`Failed to fetch dashboard overview: ${error.message}`);
        }
    },
};

// Auth API functions
export const authApi = {
    // Login
    login: async (password) => {
        try {
            const response = await api.post('/auth', { password });
            return response.data;
        } catch (error) {
            console.error('Failed to login:', error.message);
            throw new Error(`Failed to login: ${error.message}`);
        }
    },

    // Verify token
    verifyToken: async (token) => {
        try {
            // Check if token exists
            if (!token) {
                return false;
            }

            // Make sure the token is included in the request
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await api.get('/auth', { headers });
            return response.data.valid || false;
        } catch (error) {
            console.error('Token verification error:', error);
            return false;
        }
    },
};

export default api;