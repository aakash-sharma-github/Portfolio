"use client";

import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import { Toaster, toast } from 'sonner';
import { blogApi } from '@/lib/api';

const BlogsManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 }); // ✅ was missing — caused ReferenceError
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        limit: 12,
    });

    // ── Fetch blogs ───────────────────────────────────────────────────────────
    const fetchBlogs = useCallback(async (page = 1) => {
        try {
            setIsLoading(true);
            // ✅ Use blogApi (sends Authorization header) instead of bare fetch()
            const data = await blogApi.getPosts({
                category: selectedCategory === 'all' ? 'All' : selectedCategory,
                page,
                limit: pagination.limit,
                // pass published=all so admin sees drafts too
            });

            const posts = data.blogs || [];
            setBlogs(posts);
            setPagination((prev) => ({
                ...prev,
                currentPage: data.pagination?.page || 1,
                totalPages: data.pagination?.pages || 1,
            }));
            setStats({
                total: data.pagination?.total || 0,
                published: posts.filter((b) => b.published).length,
                drafts: posts.filter((b) => !b.published).length,
            });
        } catch {
            toast.error('Failed to fetch blogs');
        } finally {
            setIsLoading(false);
        }
    }, [selectedCategory, pagination.limit]);

    useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

    // ── Delete ────────────────────────────────────────────────────────────────
    // ✅ Fix bug 2: was `fetch('/api/blogs/${slug}', { method: 'DELETE' })` —
    // bare fetch sends NO Authorization header → verifyAuth returns 401.
    // blogApi.deletePost uses the axios instance with the request interceptor
    // that attaches `Authorization: Bearer <token>` automatically.
    const handleDeleteBlog = (slug) => {
        toast.custom((t) => (
            <div className="bg-[#1e1e24] border border-[#2a2a35] p-4 rounded-xl shadow-xl">
                <p className="text-white mb-1 font-semibold">Delete blog post?</p>
                <p className="text-white/50 text-sm mb-4">This action cannot be undone.</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white
                                   rounded-lg text-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const loadingId = toast.loading('Deleting post…');
                            try {
                                await blogApi.deletePost(slug);
                                toast.dismiss(loadingId);
                                toast.success('Post deleted successfully');
                                fetchBlogs(pagination.currentPage);
                            } catch (err) {
                                toast.dismiss(loadingId);
                                toast.error(err?.response?.data?.error || 'Failed to delete post');
                            }
                        }}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white
                                   rounded-lg text-sm transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: 10000 });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) fetchBlogs(newPage);
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <AdminLayout title="Blogs">
            <Toaster richColors position="top-right" />

            {/* Table */}
            <div className="bg-[#1e1e24] rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 bg-[#2a2a35] border-b border-white/6">

                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <h2 className="text-lg font-semibold text-white">Blog Posts</h2>
                        <Link
                            href="/x7k2-management-9qp/dashboard/blogs/create"
                            className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg
                               flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <FiPlus /> New Post
                        </Link>
                    </div>
                </div>


                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent
                                        rounded-full animate-spin" />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 text-white/40">
                        No blog posts yet.{' '}
                        <Link href="/x7k2-management-9qp/dashboard/blogs/create" className="text-accent underline">
                            Create one
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-sm">
                            <thead>
                                <tr className="bg-[#2a2a35]">
                                    {['Title', 'Category', 'Read Time', 'Date', 'Actions'].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold
                                                               text-white/50 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-white/3 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* ✅ Optional chain on coverImage?.url prevents crash
                                                    when a blog has no cover image set */}
                                                {blog.coverImage?.url ? (
                                                    <Image
                                                        src={blog.coverImage.url}
                                                        alt={blog.title}
                                                        width={40}
                                                        height={40}
                                                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                                        unoptimized={blog.coverImage.url.includes('localhost')}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-accent/20
                                                                    flex items-center justify-center flex-shrink-0">
                                                        <span className="text-accent text-xs">IMG</span>
                                                    </div>
                                                )}
                                                <span className="text-white line-clamp-1">{blog.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 text-xs rounded-full
                                                             bg-accent/15 text-accent border border-accent/25">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white/60">{blog.readTime}</td>
                                        <td className="px-6 py-4 text-white/50">
                                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Link href={`/blog/${blog.slug}`} target="_blank"
                                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                                    title="View post">
                                                    <FiEye size={17} />
                                                </Link>
                                                <Link href={`/x7k2-management-9qp/dashboard/edit/${blog.slug}`}
                                                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                                    title="Edit post">
                                                    <FiEdit2 size={17} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteBlog(blog.slug)}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                    title="Delete post">
                                                    <FiTrash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-3 py-1.5 rounded-lg text-sm bg-[#2a2a35] text-white
                                   hover:bg-[#3a3a45] disabled:opacity-40 disabled:cursor-not-allowed
                                   transition-colors"
                    >
                        Previous
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => handlePageChange(p)}
                            className={`w-8 h-8 rounded-lg text-sm transition-colors
                                ${pagination.currentPage === p
                                    ? 'bg-accent text-white'
                                    : 'bg-[#2a2a35] text-white hover:bg-[#3a3a45]'
                                }`}>
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-3 py-1.5 rounded-lg text-sm bg-[#2a2a35] text-white
                                   hover:bg-[#3a3a45] disabled:opacity-40 disabled:cursor-not-allowed
                                   transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </AdminLayout>
    );
};

export default BlogsManagement;