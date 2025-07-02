"use client";

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter } from 'react-icons/fi';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { Toaster, toast } from 'sonner';

const BlogsManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        limit: 12
    });

    useEffect(() => {
        fetchBlogs();
        fetchCategories();
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchBlogs = async (page = 1) => {
        try {
            setIsLoading(true);
            const limit = pagination.limit;
            const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
            const response = await fetch(`/api/blogs?page=${page}&limit=${limit}${categoryParam}`);
            const data = await response.json();

            setBlogs(data.blogs || []);

            // Update pagination
            setPagination({
                currentPage: data.pagination?.page || 1,
                totalPages: data.pagination?.pages || 1,
                limit: pagination.limit
            });

            // Calculate stats
            setStats({
                total: data.pagination?.total || 0,
                published: data.blogs.filter(blog => blog.published).length,
                drafts: data.blogs.filter(blog => !blog.published).length
            });

            setIsLoading(false);
        } catch (error) {
            toast.error('Failed to fetch blogs');
            setIsLoading(false);
        }
    };

    const handleDeleteBlog = async (slug) => {
        toast.custom((t) => (
            <div className="bg-[#1e1e24] border border-[#2a2a35] p-4 rounded-lg shadow-lg">
                <p className="text-white mb-4">Are you sure you want to delete this blog post?</p>
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
                                await fetch(`/api/blogs/${slug}`, { method: 'DELETE' });
                                fetchBlogs();
                                toast.success('Blog deleted successfully');
                            } catch (error) {
                                toast.error('Failed to delete blog');
                            }
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchBlogs(newPage);
        }
    };

    const togglePublishStatus = async (slug, currentStatus) => {
        try {
            await fetch(`/api/blogs/${slug}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ published: !currentStatus }),
            });

            fetchBlogs();
            toast.success(`Blog ${currentStatus ? 'unpublished' : 'published'} successfully`);
        } catch (error) {
            toast.error('Failed to update blog status');
        }
    };

    return (
        <AdminLayout title="Blogs">

            {/* Category Filter and Add New Button */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4 bg-[#1e1e24] p-2 rounded-lg">
                    <FiFilter className="text-white/70 ml-2" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-transparent text-white border-none focus:ring-0"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <Link
                    href="/admin/dashboard/blogs/create"
                    className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <FiPlus /> New Post
                </Link>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <div key={blog._id} className="bg-[#1e1e24] rounded-lg overflow-hidden">
                        <div className="relative h-48">
                            <img
                                src={blog.coverImage.url}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => togglePublishStatus(blog.slug, blog.published)}
                                    className={`p-2 rounded ${blog.published
                                            ? 'bg-green-500/20 text-green-500'
                                            : 'bg-yellow-500/20 text-yellow-500'
                                        }`}
                                >
                                    {blog.published ? 'Published' : 'Draft'}
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-white font-semibold">{blog.title}</h3>
                                    <span className="text-white/70 text-sm">{blog.readTime}</span>
                                </div>
                                <span className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent">
                                    {blog.category}
                                </span>
                            </div>
                            <p className="text-white/70 text-sm mb-4 line-clamp-2">
                                {blog.excerpt}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-white/50 text-sm">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/blog/${blog.slug}`}
                                        target="_blank"
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        <FiEye size={18} />
                                    </Link>
                                    <Link
                                        href={`/admin/dashboard/blogs/edit/${blog.slug}`}
                                        className="text-yellow-400 hover:text-yellow-300"
                                    >
                                        <FiEdit2 size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteBlog(blog.slug)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className={`px-3 py-1 rounded-md ${pagination.currentPage === 1 ? 'bg-[#2a2a35]/50 text-white/50 cursor-not-allowed' : 'bg-[#2a2a35] text-white hover:bg-[#3a3a45]'}`}
                        >
                            Previous
                        </button>

                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 rounded-md ${pagination.currentPage === page ? 'bg-accent text-white' : 'bg-[#2a2a35] text-white hover:bg-[#3a3a45]'}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className={`px-3 py-1 rounded-md ${pagination.currentPage === pagination.totalPages ? 'bg-[#2a2a35]/50 text-white/50 cursor-not-allowed' : 'bg-[#2a2a35] text-white hover:bg-[#3a3a45]'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <Toaster richColors />
        </AdminLayout>
    );
};

export default BlogsManagement;
