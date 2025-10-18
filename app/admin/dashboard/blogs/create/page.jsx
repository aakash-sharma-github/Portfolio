"use client";

import { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Toaster, toast } from 'sonner';

const CreateBlogPost = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [blogPost, setBlogPost] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        coverImage: null,
        published: true,
        author: {
            name: 'Aakash',
            avatar: '/assets/avatar.jpg',
            bio: 'Full-stack developer with a passion for modern web technologies'
        }
    });

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch('/api/categories', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data || []);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogPost({ ...blogPost, [name]: value });
        
        // Auto-generate slug from title
        if (name === 'title') {
            setBlogPost({
                ...blogPost,
                title: value,
                slug: value.toLowerCase()
                    .replace(/[^\w\s]/gi, '')
                    .replace(/\s+/g, '-')
            });
        }
    };

    const handleImageUpload = (imageData) => {
        setBlogPost({
            ...blogPost,
            coverImage: imageData
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate required fields
            if (!blogPost.title || !blogPost.slug || !blogPost.excerpt || !blogPost.content || !blogPost.category) {
                toast.error('Please fill in all required fields');
                setIsSubmitting(false);
                return;
            }

            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(blogPost),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create blog post');
            }

            toast.success('Blog post created successfully');
            router.push('/admin/dashboard/blogs');
        } catch (error) {
            toast.error(error.message || 'Failed to create blog post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout title="Create Blog Post">
            <div className="bg-[#1e1e24] rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Create New Blog Post</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-white mb-2">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={blogPost.title}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Blog Post Title"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-white mb-2">Slug *</label>
                        <input
                            type="text"
                            name="slug"
                            value={blogPost.slug}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="blog-post-slug"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-white mb-2">Category *</label>
                        <select
                            name="category"
                            value={blogPost.category}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-white mb-2">Excerpt *</label>
                        <textarea
                            name="excerpt"
                            value={blogPost.excerpt}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Short summary of the blog post (max 300 characters)"
                            rows="3"
                            maxLength="300"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-white mb-2">Content *</label>
                        <textarea
                            name="content"
                            value={blogPost.content}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Full blog post content (Markdown supported)"
                            rows="15"
                            required
                        />
                    </div>

                    {/* Published Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="published"
                            name="published"
                            checked={blogPost.published}
                            onChange={(e) => setBlogPost({ ...blogPost, published: e.target.checked })}
                            className="w-5 h-5 text-accent bg-[#2a2a35] border-[#3a3a45] rounded focus:ring-accent focus:ring-2"
                        />
                        <label htmlFor="published" className="text-white ml-2">Publish immediately</label>
                    </div>

                    {/* Cover Image */}
                    <ImageUploader
                        onImageUpload={handleImageUpload}
                        currentImage={blogPost.coverImage}
                        label="Cover Image *"
                        folder="blogs"
                    />
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full ${isSubmitting ? 'bg-accent/50' : 'bg-accent hover:bg-accent/80'} text-white py-3 rounded-lg font-semibold transition-all`}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Blog Post'}
                        </button>
                    </div>
                </form>
            </div>
            <Toaster richColors />
        </AdminLayout>
    );
};

export default CreateBlogPost;
