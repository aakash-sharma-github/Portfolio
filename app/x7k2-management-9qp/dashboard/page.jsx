"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ClientOnly from '@/components/ClientOnly';
import AdminLayout from '@/components/AdminLayout';
import AdminOverview from '@/components/AdminOverview';
import { blogApi, authApi } from '@/lib/api';
import { Toaster, toast } from 'sonner';

const AdminDashboard = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const limit = 10;

    // FIX: blogApi.getPosts expects an options object, not positional args
    const loadInitialBlogPosts = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await blogApi.getPosts({ page: 1, limit });

            setBlogPosts(response.blogs || []);
        } catch (err) {
            setError('Failed to load blog posts. Please try again later.');
            toast.error('Failed to load blog posts. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Check authentication and load blog posts
    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    router.push('/x7k2-management-9qp');
                    return;
                }

                try {
                    const isValid = await authApi.verifyToken(token);

                    if (!isValid) {
                        localStorage.removeItem('adminToken');
                        router.push('/x7k2-management-9qp');
                        return;
                    }
                } catch (verifyError) {
                    console.error('Token verification error:', verifyError);
                    localStorage.removeItem('adminToken');
                    router.push('/x7k2-management-9qp');
                    return;
                }

                await loadInitialBlogPosts();
            } catch (err) {
                console.error('Dashboard init error:', err);
                setError('Failed to initialize dashboard.');
                setIsLoading(false);
            }
        };

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    return (
        <ClientOnly>
            <AdminLayout title="Dashboard">
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="loader"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={loadInitialBlogPosts}
                            className="px-4 py-2 bg-accent text-primary rounded-md hover:bg-accent/80"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <AdminOverview blogPosts={blogPosts} />
                )}
                <Toaster richColors />
            </AdminLayout>
        </ClientOnly>
    );
};

export default AdminDashboard;