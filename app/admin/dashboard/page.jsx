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
    const [error, setError] = useState('');
    const router = useRouter();

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
                        throw new Error('Invalid token');
                    }
                } catch (error) {
                    if (error.response) {
                        console.error('Error response data:', error.response.data);
                        console.error('Error response status:', error.response.status);
                    }
                    localStorage.removeItem('adminToken');
                    router.push('/admin');
                    throw new Error('Failed to verify token');
                }

                // Load blog posts
                const response = await blogApi.getPosts();
                setBlogPosts(response.blogs || []);
            } catch (error) {
                setError('Failed to load blog posts. Please try again later.');
                throw new Error('Failed to load blog posts');
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [router]);

    const handleDeletePost = async (slug) => {
        if (toast.confirm('Are you sure you want to delete this post?')) {
            try {
                await blogApi.deletePost(slug);
                setBlogPosts(prevPosts => prevPosts.filter(post => post.slug !== slug));
                toast.success('Post deleted successfully.');
            } catch (error) {
                alert('Failed to delete post. Please try again.');
                toast.error('Failed to delete post. Please try again.');
                throw new Error('Failed to delete post');
            }
        }
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
                    {/* <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
                        <Link
                            href="/admin/dashboard/new"
                            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-all"
                        >
                            <FiPlus /> New Post
                        </Link>
                    </div> */}

                    {/* Blog Posts Table */}
                    <div className="bg-[#1e1e24] rounded-lg overflow-hidden shadow-lg">
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
                                    {Array.isArray(blogPosts) && blogPosts.map((post) => (
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
                                                    <Toaster richColors />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {(!Array.isArray(blogPosts) || blogPosts.length === 0) && (
                            <div className="text-center py-8 text-white/70">
                                No blog posts found. Create your first post!
                            </div>
                        )}
                    </div>
                </AdminLayout>
            )}
        </ClientOnly>
    );
};

export default AdminDashboard; 