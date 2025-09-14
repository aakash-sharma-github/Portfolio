"use client";

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import StatusBadge from '@/components/StatusBadge';
import { Toaster, toast } from 'sonner';

const WorksManagement = () => {
    const [works, setWorks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0
    });

    useEffect(() => {
        fetchWorks();
    }, []);

    const fetchWorks = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/works');
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(errorData.error || 'Failed to fetch works');
            }
            
            const data = await response.json();
            
            // Check if data and data.works exist
            if (!data || !Array.isArray(data.works)) {
                console.error('Invalid API response format:', data);
                throw new Error('Invalid API response format');
            }
            
            setWorks(data.works);
            
            // Calculate stats
            const completed = data.works.filter(work => work.status === 'completed').length;
            const inProgress = data.works.filter(work => work.status === 'in-progress').length;
            
            setStats({
                total: data.works.length,
                completed,
                inProgress
            });
        } catch (error) {
            console.error('Error fetching works:', error);
            toast.error(error.message || 'Failed to fetch works');
            setWorks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteWork = async (slug) => {
        toast.custom((t) => (
            <div className="bg-[#1e1e24] border border-[#2a2a35] p-4 rounded-lg shadow-lg">
                <p className="text-white mb-4">Are you sure you want to delete this work?</p>
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
                                // Get the authentication token
                                const token = localStorage.getItem('adminToken');
                                if (!token) {
                                    toast.error('Authentication required. Please login again.');
                                    return;
                                }
                                
                                const response = await fetch(`/api/works/${slug}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });
                                
                                if (!response.ok) {
                                    const errorData = await response.json();
                                    throw new Error(errorData.error || 'Failed to delete work');
                                }
                                
                                fetchWorks();
                                toast.success('Work deleted successfully');
                            } catch (error) {
                                console.error('Delete error:', error);
                                toast.error(error.message || 'Failed to delete work');
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

    return (
        <AdminLayout title="Projects">

            {/* Works Table */}
            <div className="bg-[#1e1e24] rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-[#2a2a35]">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Projects</h2>
                    <Link 
                        href="/admin/dashboard/works/create"
                        className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        <FiPlus /> Add New Project
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-sm">
                        <thead>
                            <tr className="bg-[#2a2a35]">
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a35]">
                            {works.map((work) => (
                                <tr key={work._id} className="hover:bg-[#2a2a35]/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img 
                                                src={work.coverImage.url} 
                                                alt={work.title}
                                                className="h-10 w-10 rounded object-cover mr-3"
                                            />
                                            <div className="text-white">{work.title}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent">
                                            {work.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={work.status} size="sm" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <Link
                                                href="/work"
                                                target="_blank"
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                <FiEye size={18} />
                                            </Link>
                                            <Link
                                                href={`/admin/dashboard/works/edit/${work.slug}`}
                                                className="text-yellow-400 hover:text-yellow-300"
                                            >
                                                <FiEdit2 size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteWork(work.slug)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Toaster richColors />
        </AdminLayout>
    );
};

export default WorksManagement;
