import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
console.log('API_URL configured as:', API_URL);

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
            console.log(`Adding token to request: ${config.url}`);
        } else {
            console.log(`No token available for request: ${config.url}`);
        }
    }

    // Log the full request URL for debugging
    console.log(`Making API request to: ${config.baseURL}${config.url}`);

    return config;
}, (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

// Handle API errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);

            // Handle 401 Unauthorized errors
            if (error.response.status === 401 && typeof window !== 'undefined') {
                console.error('Unauthorized request - clearing token');
                localStorage.removeItem('adminToken');

                // Only redirect if we're not already on the login page
                if (window.location.pathname !== '/admin') {
                    window.location.href = '/admin';
                }
            }
        } else {
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Blog API functions
export const blogApi = {
    // Get all posts with optional filtering and pagination
    getPosts: async (options = {}) => {
        try {
            const { category, search, page = 1, limit = 6 } = options;

            // Change from relative to absolute path
            let url = 'api/blogs';  // Removed leading slash
            const params = new URLSearchParams();

            if (category && category !== 'All') {
                params.append('category', category);
            }

            if (search) {
                params.append('search', search);
            }

            params.append('page', page);
            params.append('limit', limit);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            console.log(`getPosts: Fetching from ${url} with baseURL ${API_URL}`);
            // Force a direct URL instead of using the api instance
            // const response = await api.get(url);
            const response = await axios.get(`${window.location.origin}/api/blogs${params.toString() ? '?' + params.toString() : ''}`);
            console.log(`getPosts: Received ${response.data?.blogs?.length || 0} blogs`);
            return response.data;
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            if (error.response) {
                console.error('Error response status:', error.response.status);
                console.error('Error response data:', error.response.data);
            }
            throw error;
        }
    },

    // Get a single post by slug
    getPostBySlug: async (slug) => {
        try {
            const response = await api.get(`/blogs/${slug}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching post with slug ${slug}:`, error);
            throw error;
        }
    },

    // Create a new post
    createPost: async (postData) => {
        try {
            // Validate cover image
            if (!postData.coverImage) {
                // Use default cover URL if none provided
                postData.coverImage = '/api/default-cover?title=' + encodeURIComponent(postData.title);
            }

            const response = await api.post('/blogs', postData);
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    // Update a post
    updatePost: async (slug, postData) => {
        try {
            // Validate cover image
            if (!postData.coverImage) {
                // Use default cover URL if none provided
                postData.coverImage = '/api/default-cover?title=' + encodeURIComponent(postData.title);
            }

            const response = await api.put(`/blogs/${slug}`, postData);
            return response.data;
        } catch (error) {
            console.error(`Error updating post with slug ${slug}:`, error);
            throw error;
        }
    },

    // Delete a post
    deletePost: async (slug) => {
        try {
            const response = await api.delete(`/blogs/${slug}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting post with slug ${slug}:`, error);
            throw error;
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await api.get('/categories');
            console.log(`getCategories: Received ${response.data?.length || 0} categories`);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    // Upload an image
    uploadImage: async (imageData) => {
        try {
            const response = await api.post('/upload', { image: imageData });
            return response.data;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
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
            console.error('Login error:', error);
            throw error;
        }
    },

    // Verify token
    verifyToken: async (token) => {
        try {
            // Check if token exists
            if (!token) {
                console.error('Token verification error: No token provided');
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
            // Log more detailed error information
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            }
            return false;
        }
    },
};

export default api; 