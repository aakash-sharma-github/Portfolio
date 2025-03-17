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
        } else {
            return NextResponse.json(
                { error: 'Failed to send request to the server', details: error.message },
                { status: 500 }
            );
        }
        return Promise.reject(error);
    }
);

// Blog API functions
export const blogApi = {
    // Get all posts with optional filtering and pagination
    getPosts: async ({ category = 'All', search = '', page = 1, limit = 8 }) => {
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
            return NextResponse.json(
                { error: 'Failed to fetch posts', details: error.message },
                { status: 500 }
            );
        }
    },

    // Get a single post by slug
    getPostBySlug: async (slug) => {
        try {
            const response = await api.get(`/blogs/${slug}`);
            return response.data;
        } catch (error) {
            return NextResponse.json(
                { error: `Failed to fetch post with slug ${slug}`, details: error.message },
                { status: 500 }
            );
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
            return NextResponse.json(
                { error: 'Failed to cteate blogs', details: error.message },
                { status: 500 }
            );
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
            return NextResponse.json(
                { error: 'Failed to update blogs', details: error.message },
                { status: 500 }
            );
        }
    },

    // Delete a post
    deletePost: async (slug) => {
        try {
            const response = await api.delete(`/blogs/${slug}`);
            return response.data;
        } catch (error) {
            return NextResponse.json(
                { error: 'Failed to delete blogs', details: error.message },
                { status: 500 }
            );
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            return NextResponse.json(
                { error: 'Failed to fetch categories', details: error },
                { status: 500 }
            );
        }
    },

    // Upload an image
    uploadImage: async (imageData) => {
        try {
            const response = await api.post('/upload', { image: imageData });
            return response.data;
        } catch (error) {
            return NextResponse.json(
                { error: 'Failed to upload image', details: error.message },
                { status: 500 }
            );
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
            return NextResponse.json(
                { error: 'Failed to login', details: error.message },
                { status: 500 }
            );
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
            // Log more detailed error information
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                return NextResponse.json(
                    { error: 'Failed to fetch blogs', details: error.response.data, status: error.response.status },
                    { status: 500 }
                );
            }
            return false;
        }
    },
};

export default api;