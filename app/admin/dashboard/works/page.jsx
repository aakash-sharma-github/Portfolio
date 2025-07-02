"use client";

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
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
            const response = await fetch('/api/works');
            const data = await response.json();
            setWorks(data.works || []);
            
            // Calculate stats
            const completed = data.works.filter(work => work.status === 'completed').length;
            const inProgress = data.works.filter(work => work.status === 'in-progress').length;
            
            setStats({
                total: data.works.length,
                completed,
                inProgress
            });
            
            setIsLoading(false);
        } catch (error) {
            toast.error('Failed to fetch works');
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
                                await fetch(`/api/works/${slug}`, { method: 'DELETE' });
                                fetchWorks();
                                toast.success('Work deleted successfully');
                            } catch (error) {
                                toast.error('Failed to delete work');
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
                <div className="flex justify-between items-center p-6 bg-[#2a2a35]">
                    <h2 className="text-xl font-semibold text-white">Projects</h2>
                    <Link 
                        href="/admin/dashboard/works/create"
                        className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <FiPlus /> Add New Project
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
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
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            work.status === 'completed' 
                                                ? 'bg-green-500/20 text-green-500'
                                                : work.status === 'in-progress'
                                                ? 'bg-yellow-500/20 text-yellow-500'
                                                : 'bg-gray-500/20 text-gray-500'
                                        }`}>
                                            {work.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/work/${work.slug}`}
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
