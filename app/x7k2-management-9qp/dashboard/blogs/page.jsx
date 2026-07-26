"use client";

import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCalendar, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import { Toaster, toast } from 'sonner';
import { blogApi } from '@/lib/api';

// ─── Shared cover thumbnail ────────────────────────────────────────────────────
const CoverThumb = ({ blog, size = 40 }) => (
    blog.coverImage?.url ? (
        <Image
            src={blog.coverImage.url}
            alt={blog.title}
            width={size}
            height={size}
            className="rounded-lg object-cover flex-shrink-0"
            style={{ width: size, height: size }}
            unoptimized={blog.coverImage.url.includes('localhost')}
        />
    ) : (
        <div
            className="rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0"
            style={{ width: size, height: size }}
        >
            <span className="text-accent text-[10px] font-semibold">IMG</span>
        </div>
    )
);

// ─── Mobile / tablet card ──────────────────────────────────────────────────────
const BlogCard = ({ blog, onDelete }) => (
    <div className="bg-[#1e1e24] border border-white/6 rounded-xl p-4">
        <div className="flex items-start gap-3">
            <CoverThumb blog={blog} size={52} />
            <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
                    {blog.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 text-[11px] rounded-full
                                     bg-accent/15 text-accent border border-accent/25">
                        {blog.category}
                    </span>
                    <span className="flex items-center gap-1 text-white/40 text-[11px]">
                        <FiClock size={11} /> {blog.readTime}
                    </span>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/6">
            <span className="flex items-center gap-1.5 text-white/40 text-xs">
                <FiCalendar size={12} />
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                })}
            </span>
            <div className="flex items-center gap-4">
                <Link href={`/blog/${blog.slug}`} target="_blank"
                    className="text-blue-400 active:text-blue-300 transition-colors p-1"
                    aria-label="View post">
                    <FiEye size={18} />
                </Link>
                <Link href={`/x7k2-management-9qp/dashboard/edit/${blog.slug}`}
                    className="text-yellow-400 active:text-yellow-300 transition-colors p-1"
                    aria-label="Edit post">
                    <FiEdit2 size={18} />
                </Link>
                <button
                    onClick={() => onDelete(blog.slug)}
                    className="text-red-400 active:text-red-300 transition-colors p-1"
                    aria-label="Delete post">
                    <FiTrash2 size={18} />
                </button>
            </div>
        </div>
    </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────
const BlogsManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        limit: 12,
    });

    const fetchBlogs = useCallback(async (page = 1) => {
        try {
            setIsLoading(true);
            const data = await blogApi.getPosts({
                category: selectedCategory === 'all' ? 'All' : selectedCategory,
                page,
                limit: pagination.limit,
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

    const handleDeleteBlog = (slug) => {
        toast.custom((t) => (
            <div className="bg-[#1e1e24] border border-[#2a2a35] p-4 rounded-xl shadow-xl
                            w-[calc(100vw-2rem)] max-w-sm sm:w-auto">
                <p className="text-white mb-1 font-semibold">Delete blog post?</p>
                <p className="text-white/50 text-sm mb-4">This action cannot be undone.</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white
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
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white
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

    return (
        <AdminLayout title="Blogs">
            {/* ── Stats bar ── */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                    { label: 'Total', value: stats.total, color: 'text-white' },
                    { label: 'Published', value: stats.published, color: 'text-green-400' },
                    { label: 'Drafts', value: stats.drafts, color: 'text-yellow-400' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-[#1e1e24] border border-white/6 rounded-xl
                                                 p-3 sm:p-4 text-center sm:text-left">
                        <p className={`text-lg sm:text-2xl font-bold ${color}`}>{value}</p>
                        <p className="text-white/40 text-[11px] sm:text-xs mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Header + New Post button ── */}
            <div className="flex items-center justify-between gap-3 mb-5">
                <h2 className="text-base sm:text-lg font-semibold text-white">Blog Posts</h2>
                <Link
                    href="/x7k2-management-9qp/dashboard/blogs/create"
                    className="bg-accent hover:bg-accent/80 active:bg-accent/70 text-white
                               px-3.5 sm:px-4 py-2.5 rounded-lg flex items-center gap-2
                               text-sm font-medium transition-colors flex-shrink-0"
                >
                    <FiPlus size={16} />
                    <span className="hidden xs:inline">New Post</span>
                    <span className="xs:hidden">New</span>
                </Link>
            </div>

            {/* ── Content ── */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent
                                    rounded-full animate-spin" />
                </div>
            ) : blogs.length === 0 ? (
                <div className="text-center py-20 text-white/40 bg-[#1e1e24] rounded-xl">
                    No blog posts yet.{' '}
                    <Link href="/x7k2-management-9qp/dashboard/blogs/create" className="text-accent underline">
                        Create one
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile + tablet: card grid (< lg) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
                        {blogs.map((blog) => (
                            <BlogCard key={blog._id} blog={blog} onDelete={handleDeleteBlog} />
                        ))}
                    </div>

                    {/* Desktop: table (lg+) */}
                    <div className="hidden lg:block bg-[#1e1e24] rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
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
                                                    <CoverThumb blog={blog} size={40} />
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
                    </div>
                </>
            )}

            {/* ── Pagination ── */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-1.5 sm:gap-2">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        aria-label="Previous page"
                        className="p-2.5 sm:px-3 sm:py-1.5 rounded-lg text-sm bg-[#2a2a35] text-white
                                   hover:bg-[#3a3a45] disabled:opacity-40 disabled:cursor-not-allowed
                                   transition-colors"
                    >
                        <FiChevronLeft className="sm:hidden" size={16} />
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* On mobile, only show current page context to save space */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter((p) => {
                                // Mobile: show only current ± 1; Desktop: show all (handled by CSS)
                                return true;
                            })
                            .map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePageChange(p)}
                                    className={`w-9 h-9 sm:w-8 sm:h-8 rounded-lg text-sm transition-colors
                                        ${Math.abs(p - pagination.currentPage) > 1 && p !== 1 && p !== pagination.totalPages
                                            ? 'hidden sm:inline-flex sm:items-center sm:justify-center'
                                            : 'inline-flex items-center justify-center'
                                        }
                                        ${pagination.currentPage === p
                                            ? 'bg-accent text-white'
                                            : 'bg-[#2a2a35] text-white hover:bg-[#3a3a45]'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        aria-label="Next page"
                        className="p-2.5 sm:px-3 sm:py-1.5 rounded-lg text-sm bg-[#2a2a35] text-white
                                   hover:bg-[#3a3a45] disabled:opacity-40 disabled:cursor-not-allowed
                                   transition-colors"
                    >
                        <FiChevronRight className="sm:hidden" size={16} />
                        <span className="hidden sm:inline">Next</span>
                    </button>
                </div>
            )}
            <Toaster richColors position="bottom-right" />
        </AdminLayout>
    );
};

export default BlogsManagement;