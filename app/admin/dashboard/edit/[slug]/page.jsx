'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import BlogPostForm from '@/components/BlogPostForm';
import { blogApi } from '@/lib/api';
import { toast, Toaster } from 'sonner';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

// ✅ Removed: import ClientOnly — not needed here
// ✅ Removed: import { authApi } — AdminLayout already handles auth redirect
// ✅ Removed: import { NextResponse } — wrong in a client component (it's a server-only API)

const EditBlogPost = ({ params }) => {
    const { slug } = params;
    const router = useRouter();

    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Load post ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!slug) return;

        let cancelled = false;

        const fetchPost = async () => {
            setIsLoading(true);
            try {
                const fetched = await blogApi.getPostBySlug(slug);
                if (cancelled) return;

                if (!fetched) {
                    setError(`Post with slug "${slug}" not found.`);
                    return;
                }
                setPost(fetched);
                setError(null);
            } catch (err) {
                if (!cancelled) {
                    const msg = err?.response?.data?.error || err.message || 'Failed to load post.';
                    setError(msg);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchPost();
        return () => { cancelled = true; };
    }, [slug]);

    // ── Submit handler ────────────────────────────────────────────────────────
    const handleSubmit = async (formData) => {
        try {
            await blogApi.updatePost(slug, formData);
            toast.success('Post updated successfully!');
            router.push('/admin/dashboard/blogs');
        } catch (err) {
            const msg = err?.response?.data?.error || err.message || 'Failed to update post.';
            toast.error(msg);
            // Re-throw so BlogPostForm's try/catch knows it failed
            throw err;
        }
    };

    // ── States ────────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <AdminLayout title="Edit Blog Post">
                <div className="flex justify-center items-center h-64">
                    <div className="w-10 h-10 border-2 border-accent border-t-transparent
                                    rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    if (error || !post) {
        return (
            <AdminLayout title="Edit Blog Post">
                <div className="max-w-lg mx-auto">
                    <div className="bg-red-500/10 border border-red-500/40 text-white
                                    p-6 rounded-2xl">
                        <p className="font-bold text-red-400 mb-1">Failed to load post</p>
                        <p className="text-white/60 text-sm mb-4">{error}</p>
                        <Link href="/admin/dashboard/blogs"
                            className="inline-flex items-center gap-2 text-sm text-accent
                                       hover:underline">
                            <FiArrowLeft size={14} /> Back to posts
                        </Link>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Edit Blog Post">
            <Toaster richColors position="top-right" />

            <div className="max-w-3xl mx-auto">
                <div className="bg-[#1e1e24] border border-white/6 rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-8">
                        <Link href="/admin/dashboard/blogs"
                            className="text-white/40 hover:text-white transition-colors">
                            <FiArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Edit Post</h1>
                            <p className="text-white/40 text-sm mt-0.5 truncate max-w-md">
                                {post.title}
                            </p>
                        </div>
                    </div>

                    <BlogPostForm
                        post={post}
                        onSubmit={handleSubmit}
                        isEditing={true}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default EditBlogPost;