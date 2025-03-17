'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogPostForm from '@/components/BlogPostForm';
import AdminLayout from '@/components/AdminLayout';
import { blogApi, authApi } from '@/lib/api';
import ClientOnly from '@/components/ClientOnly';
import { toast, Toaster } from 'sonner';

const EditBlogPost = ({ params }) => {
    const { slug } = params;
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthAndFetchPost = async () => {
            try {
                // Check authentication
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    router.push('/admin');
                    return;
                }

                const isValid = await authApi.verifyToken(token);
                if (!isValid) {
                    localStorage.removeItem('adminToken');
                    router.push('/admin');
                    return;
                }

                setIsAuthenticated(true);

                // Fetch post data
                const fetchedPost = await blogApi.getPostBySlug(slug);
                if (!fetchedPost) {
                    setError(`Post with slug "${slug}" not found`);
                    return;
                }

                setPost(fetchedPost);
            } catch (error) {
                setError('Failed to load blog post. Please try again.');
                throw new Error('Failed to load blog post for editing', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthAndFetchPost();
    }, [slug, router]);

    const handleSubmit = async (formData) => {
        try {
            await blogApi.updatePost(slug, formData);
            // router.push('/admin/dashboard');
            toast.success('Post updated successfully.');
        } catch (error) {
            toast.error('Failed to update blog post. Please try again.');
            throw new Error('Failed to update blog post', error);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-md">
                    {error}
                </div>
            </AdminLayout>
        );
    }

    return (
        <ClientOnly>
            {isAuthenticated && post && (
                <AdminLayout>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Edit Blog Post</h1>
                        <p className="text-white/70">Update the details of your blog post</p>
                    </div>
                    <BlogPostForm post={post} onSubmit={handleSubmit} isEditing={true} />
                    <Toaster richColors />
                </AdminLayout>
            )}
        </ClientOnly>
    );
};

export default EditBlogPost; 