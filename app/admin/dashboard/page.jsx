"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import ClientOnly from '@/components/ClientOnly';
import AdminLayout from '@/components/AdminLayout';
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
    const limit = 10;

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
                <AdminLayout>
                    {/* Blog Posts Table */}
                    <div className="bg-[#1e1e24] rounded-lg overflow-hidden shadow-lg">
                        {/* Table header */}
                        <div className="flex justify-between items-center px-6 py-3 bg-[#2a2a35]">
                            <div className="text-sm text-white/70">
                                {blogPosts.length > 0 ?
                                    `Showing ${blogPosts.length} posts` :
                                    'No posts found'}
                            </div>
                        </div>

                        {/* Loading indicator for "load more" operations */}
                        {isLoadingMore && (
                            <div className="py-2 bg-[#2a2a35]/30 text-center">
                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-accent mr-2"></div>
                                <span className="text-white/70 text-sm">Loading more posts...</span>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#2a2a35]">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2a2a35]">
                                    {Array.isArray(blogPosts) && blogPosts.length > 0 ? (
                                        blogPosts.map((post) => (
                                            <tr key={post._id} className="hover:bg-[#2a2a35]/50 transition-all">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-white">{post.title}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent">
                                                        {post.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-white/70">
                                                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-3">
                                                        <Link
                                                            href={`/blog/${post.slug}`}
                                                            target="_blank"
                                                            className="text-blue-400 hover:text-blue-300 transition-all"
                                                            title="View Post"
                                                        >
                                                            <FiEye size={18} />
                                                        </Link>
                                                        <Link
                                                            href={`/admin/dashboard/edit/${post.slug}`}
                                                            className="text-yellow-400 hover:text-yellow-300 transition-all"
                                                            title="Edit Post"
                                                        >
                                                            <FiEdit2 size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeletePost(post.slug)}
                                                            className="text-red-400 hover:text-red-300 transition-all"
                                                            title="Delete Post"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-white/70">
                                                No blog posts found. Create your first post!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Show More Button */}
                        {hasMore && (
                            <div className="flex justify-center py-4 bg-[#2a2a35]/30">
                                <button
                                    onClick={loadMorePosts}
                                    disabled={isLoadingMore}
                                    className={`px-4 py-2 rounded-md ${isLoadingMore
                                        ? 'bg-accent/50 cursor-not-allowed'
                                        : 'bg-accent hover:bg-accent/80'
                                        } text-white transition-all flex items-center space-x-2`}
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            <span>Loading...</span>
                                        </>
                                    ) : (
                                        <span>Show Older Posts</span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                    <Toaster richColors />
                </AdminLayout>
            )}
        </ClientOnly>
    );
};

export default AdminDashboard;