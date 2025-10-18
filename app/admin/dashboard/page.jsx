"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import ClientOnly from '@/components/ClientOnly';
import AdminLayout from '@/components/AdminLayout';
import AdminOverview from '@/components/AdminOverview';
import { blogApi, authApi } from '@/lib/api';
import { Toaster, toast } from 'sonner';

const AdminDashboard = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 100; // Increased limit to fetch more blogs

    // Load initial blog posts
    const loadInitialBlogPosts = async () => {
        try {
            setIsLoading(true);
            const response = await blogApi.getPosts(1, limit);

            setBlogPosts(response.blogs || []);
            setHasMore((response.total || 0) > response.blogs.length);
            setPage(1);
        } catch (error) {
            setError('Failed to load blog posts. Please try again later.');
            toast.error('Failed to load blog posts. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Load more blog posts
    const loadMorePosts = async () => {
        if (isLoadingMore) return;

        try {
            setIsLoadingMore(true);
            const nextPage = page + 1;
            const response = await blogApi.getPosts(nextPage, limit);

            if (response.blogs && response.blogs.length > 0) {
                setBlogPosts(prev => [...prev, ...response.blogs]);
                setPage(nextPage);
                setHasMore((response.total || 0) > (blogPosts.length + response.blogs.length));
            } else {
                setHasMore(false);
            }
        } catch (error) {
            toast.error('Failed to load more posts. Please try again.');
        } finally {
            setIsLoadingMore(false);
        }
    };

    // Check authentication and load blog posts
    useEffect(() => {
        const init = async () => {
            try {
                // Check if user is authenticated
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    router.push('/admin');
                    return;
                }

                // Verify token
                try {
                    const isValid = await authApi.verifyToken(token);

                    if (!isValid) {
                        localStorage.removeItem('adminToken');
                        router.push('/admin');
                        return;
                    }
                } catch (error) {
                    localStorage.removeItem('adminToken');
                    router.push('/admin');
                    throw new Error('Failed to verify token', error);
                }

                await loadInitialBlogPosts();
            } catch (error) {
                setError('Failed to load blog posts. Please try again later.');
                toast.error('Failed to load blog posts. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [router]);

    const handleDeletePost = async (slug) => {
        // Use a confirmation dialog and handle the result with promise
        toast.custom((t) => (
            <div className="bg-[#1e1e24] border border-[#2a2a35] p-4 rounded-lg shadow-lg">
                <p className="text-white mb-4">Are you sure you want to delete this post?</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await blogApi.deletePost(slug);
                                // Refresh the blog posts after deletion
                                await loadInitialBlogPosts();
                                toast.success('Post deleted successfully.');
                            } catch (error) {
                                toast.error('Failed to delete post. Please try again.');
                            }
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: 10000 }); // Give user enough time to decide
    };

    return (
        <ClientOnly>
            {isLoading ? (
                <div className="min-h-screen bg-primary flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                </div>
            ) : error ? (
                <div className="min-h-screen bg-primary flex items-center justify-center">
                    <div className="bg-red-500/20 border border-red-500 text-white p-6 rounded-md max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-2">Error</h2>
                        <p>{error}</p>
                    </div>
                </div>
            ) : (
                <AdminLayout title="Dashboard">
                    {/* Dashboard Overview */}
                    <AdminOverview />
                    
                    <Toaster richColors />
                </AdminLayout>
            )}
        </ClientOnly>
    );
};

export default AdminDashboard;