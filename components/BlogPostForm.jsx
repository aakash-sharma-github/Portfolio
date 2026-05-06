'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import Link from 'next/link';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';
import ClientOnly from './ClientOnly';
import { blogCategories } from '@/lib/essentials';
import { Toaster, toast } from 'sonner';
import { NextResponse } from 'next/server';

const BlogPostForm = ({ post, onSubmit, isEditing = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: blogCategories[0] || '',
        coverImage: '',
        readTime: '5 min read',
        author: {
            name: 'Aakash Sharma',
            avatar: '/assets/avatar.jpg',
            bio: 'Full-stack developer with a passion for modern web technologies'
        }
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize form
    useEffect(() => {
        const init = async () => {
            try {
                // If editing, set form data from post
                if (post) {
                    setFormData({
                        ...post,
                        coverImage: post.coverImage?.url || '',
                    });
                }
            } catch (error) {
                return NextResponse.json(
                    { error: 'Failed to load blog post', details: error.message },
                    { status: 500 }
                );
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [post]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug is required';
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
        }

        if (!formData.excerpt.trim()) {
            newErrors.excerpt = 'Excerpt is required';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        }

        if (!formData.coverImage) {
            newErrors.coverImage = 'Cover image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'title' && !isEditing) {
            // Auto-generate slug from title
            const slug = value
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');

            setFormData({
                ...formData,
                title: value,
                slug
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleContentChange = (content) => {
        setFormData({
            ...formData,
            content
        });
    };

    const handleCoverImageChange = (url) => {
        setFormData({
            ...formData,
            coverImage: url
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                await onSubmit(formData);
                toast.success('Post created successfully!');
            } catch (error) {
                toast.error('Failed to create blog post. Please try again.');
                throw new Error('Failed to create blog post', error);
            } finally {
                setIsSubmitting(false);
            }
        }
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            category: blogCategories[0] || '',
            coverImage: '',
            readTime: '5 min read',
            author: {
                name: 'Aakash Sharma',
                avatar: '/assets/avatar.jpg',
                bio: 'Full-stack developer with a passion for modern web technologies'
            }
        });
    };

    if (isLoading) {
        return <div className="text-center py-8 text-white/70">Loading form...</div>;
    }

    return (
        <ClientOnly>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-white/80 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-[#2a2a35] border ${errors.title ? 'border-red-500' : 'border-[#3a3a45]'} rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-white`}
                        placeholder="Enter post title"
                    />
                    {errors.title && <p className="mt-1 text-red-500 text-sm">{errors.title}</p>}
                </div>

                <div>
                    <label htmlFor="slug" className="block text-white/80 mb-2">
                        Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-[#2a2a35] border ${errors.slug ? 'border-red-500' : 'border-[#3a3a45]'} rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-white`}
                        placeholder="enter-post-slug"
                        disabled={isEditing}
                    />
                    {errors.slug && <p className="mt-1 text-red-500 text-sm">{errors.slug}</p>}
                    <p className="mt-1 text-white/50 text-sm">URL-friendly version of the title (e.g., my-blog-post)</p>
                </div>

                <div>
                    <label htmlFor="category" className="block text-white/80 mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-[#2a2a35] border border-[#3a3a45] rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-white"
                    >
                        {blogCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-white/80 mb-2">
                        Cover Image <span className="text-red-500">*</span>
                    </label>
                    <ImageUpload
                        value={formData.coverImage}
                        onChange={handleCoverImageChange}
                        postTitle={formData.title || 'Blog Post'}
                    />
                    {errors.coverImage && <p className="mt-1 text-red-500 text-sm">{errors.coverImage}</p>}
                </div>

                <div>
                    <label htmlFor="readTime" className="block text-white/80 mb-2">
                        Read Time
                    </label>
                    <input
                        type="text"
                        id="readTime"
                        name="readTime"
                        value={formData.readTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-[#2a2a35] border border-[#3a3a45] rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-white"
                        placeholder="5 min read"
                    />
                </div>

                <div>
                    <label htmlFor="excerpt" className="block text-white/80 mb-2">
                        Excerpt <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full px-4 py-2 bg-[#2a2a35] border ${errors.excerpt ? 'border-red-500' : 'border-[#3a3a45]'} rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-white`}
                        placeholder="Brief summary of the post"
                    ></textarea>
                    {errors.excerpt && <p className="mt-1 text-red-500 text-sm">{errors.excerpt}</p>}
                </div>

                <div>
                    <label htmlFor="content" className="block text-white/80 mb-2">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditor
                        value={formData.content}
                        onChange={handleContentChange}
                    />
                    {errors.content && <p className="mt-1 text-red-500 text-sm">{errors.content}</p>}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Link
                        href="/admin/dashboard"
                        className="px-4 py-2 bg-[#2a2a35] hover:bg-[#3a3a45] text-white rounded-md flex items-center gap-2 transition-all"
                    >
                        <FiX />
                        <span>Cancel</span>
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-accent hover:bg-accent-hover text-primary rounded-md flex items-center gap-2 transition-all"
                    >
                        <FiSave />
                        <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'} Post</span>
                    </button>
                    <Toaster richColors />
                </div>
            </form>
        </ClientOnly>
    );
};

export default BlogPostForm; 