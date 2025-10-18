"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogPostForm from '@/components/BlogPostForm';
import AdminLayout from '@/components/AdminLayout';
import { blogApi, authApi } from '@/lib/api';
import ClientOnly from '@/components/ClientOnly';
import { Toaster, toast } from 'sonner';


const CreateBlogPost = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
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
            } catch (error) {
                setError('Authentication failed. Please log in again.');
                router.push('/admin');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleSubmit = async (formData) => {
        try {
            await blogApi.createPost(formData);
            // router.push('/admin/dashboard');
            toast.success('Post created successfully.');
        } catch (error) {
            toast.error('Failed to create blog post. Please try again.');
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
            {isAuthenticated && (
                <AdminLayout title="Create Blog Post">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Create New Blog Post</h1>
                        <p className="text-white/70">Fill in the details below to create a new blog post</p>
                    </div>
                    <BlogPostForm onSubmit={handleSubmit} />
                    <Toaster richColors />
                </AdminLayout>
            )}
        </ClientOnly>
    );
};

export default CreateBlogPost; 