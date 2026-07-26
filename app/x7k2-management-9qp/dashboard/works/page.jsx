"use client";

import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import StatusBadge from '@/components/StatusBadge';
import { Toaster, toast } from 'sonner';
import { workApi } from '@/lib/api';

// ─── Shared cover thumbnail ────────────────────────────────────────────────────
// ✅ Fixed: original code did `work.coverImage.url` with no optional chaining —
// this crashed the whole page if any work had no coverImage set.
const CoverThumb = ({ work, size = 40 }) => (
    work.coverImage?.url ? (
        <Image
            src={work.coverImage.url}
            alt={work.title}
            width={size}
            height={size}
            className="rounded-lg object-cover flex-shrink-0"
            style={{ width: size, height: size }}
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
const WorkCard = ({ work, onDelete }) => (
    <div className="bg-[#1e1e24] border border-white/6 rounded-xl p-4">
        <div className="flex items-start gap-3">
            <CoverThumb work={work} size={52} />
            <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
                    {work.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 text-[11px] rounded-full
                                     bg-accent/15 text-accent border border-accent/25">
                        {work.category}
                    </span>
                    <StatusBadge status={work.status} size="xs" />
                </div>
            </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-4 pt-3 border-t border-white/6">
            <Link href="/work" target="_blank"
                className="text-blue-400 active:text-blue-300 transition-colors p-1"
                aria-label="View live projects page">
                <FiEye size={18} />
            </Link>
            <Link href={`/x7k2-management-9qp/dashboard/works/edit/${work.slug}`}
                className="text-yellow-400 active:text-yellow-300 transition-colors p-1"
                aria-label="Edit project">
                <FiEdit2 size={18} />
            </Link>
            <button
                onClick={() => onDelete(work.slug)}
                className="text-red-400 active:text-red-300 transition-colors p-1"
                aria-label="Delete project">
                <FiTrash2 size={18} />
            </button>
        </div>
    </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────
const WorksManagement = () => {
    const [works, setWorks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 });

    // ✅ Fixed: was using bare fetch('/api/works') with no error resilience
    // and no auth on delete. Now uses workApi (axios instance with the
    // Authorization interceptor) consistently for all requests.
    const fetchWorks = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await workApi.getWorks({ limit: 100 });

            const list = Array.isArray(data?.works) ? data.works : [];
            setWorks(list);

            const completed = list.filter((w) => w.status === 'completed').length;
            const inProgress = list.filter((w) => w.status === 'in-progress').length;

            setStats({ total: list.length, completed, inProgress });
        } catch (error) {
            console.error('Error fetching works:', error);
            toast.error(error?.response?.data?.error || 'Failed to fetch projects');
            setWorks([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchWorks(); }, [fetchWorks]);

    const handleDeleteWork = (slug) => {
        toast.custom((t) => (
            <div className="bg-[#1e1e24] border border-[#2a2a35] p-4 rounded-xl shadow-xl
                            w-[calc(100vw-2rem)] max-w-sm sm:w-auto">
                <p className="text-white mb-1 font-semibold">Delete this project?</p>
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
                            const loadingId = toast.loading('Deleting project…');
                            try {
                                await workApi.deleteWork(slug);
                                toast.dismiss(loadingId);
                                toast.success('Project deleted successfully');
                                fetchWorks();
                            } catch (error) {
                                toast.dismiss(loadingId);
                                toast.error(error?.response?.data?.error || 'Failed to delete project');
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

    return (
        <AdminLayout title="Projects">

            {/* ── Stats bar ── */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                    { label: 'Total', value: stats.total, color: 'text-white' },
                    { label: 'Completed', value: stats.completed, color: 'text-green-400' },
                    { label: 'In Progress', value: stats.inProgress, color: 'text-yellow-400' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-[#1e1e24] border border-white/6 rounded-xl
                                                 p-3 sm:p-4 text-center sm:text-left">
                        <p className={`text-lg sm:text-2xl font-bold ${color}`}>{value}</p>
                        <p className="text-white/40 text-[11px] sm:text-xs mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Header + Add button ── */}
            <div className="flex items-center justify-between gap-3 mb-5">
                <h2 className="text-base sm:text-lg font-semibold text-white">Projects</h2>
                <Link
                    href="/x7k2-management-9qp/dashboard/works/create"
                    className="bg-accent hover:bg-accent/80 active:bg-accent/70 text-white
                               px-3.5 sm:px-4 py-2.5 rounded-lg flex items-center gap-2
                               text-sm font-medium transition-colors flex-shrink-0"
                >
                    <FiPlus size={16} />
                    <span className="hidden xs:inline">Add Project</span>
                    <span className="xs:hidden">Add</span>
                </Link>
            </div>

            {/* ── Content ── */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent
                                    rounded-full animate-spin" />
                </div>
            ) : works.length === 0 ? (
                <div className="text-center py-20 text-white/40 bg-[#1e1e24] rounded-xl">
                    No projects yet.{' '}
                    <Link href="/x7k2-management-9qp/dashboard/works/create" className="text-accent underline">
                        Add one
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile + tablet: card grid (< lg) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
                        {works.map((work) => (
                            <WorkCard key={work._id} work={work} onDelete={handleDeleteWork} />
                        ))}
                    </div>

                    {/* Desktop: table (lg+) */}
                    <div className="hidden lg:block bg-[#1e1e24] rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
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
                                        <tr key={work._id} className="hover:bg-[#2a2a35]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <CoverThumb work={work} size={40} />
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
                                                    <Link href="/work" target="_blank"
                                                        className="text-blue-400 hover:text-blue-300 transition-colors">
                                                        <FiEye size={18} />
                                                    </Link>
                                                    <Link href={`/x7k2-management-9qp/dashboard/works/edit/${work.slug}`}
                                                        className="text-yellow-400 hover:text-yellow-300 transition-colors">
                                                        <FiEdit2 size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteWork(work.slug)}
                                                        className="text-red-400 hover:text-red-300 transition-colors">
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
                </>
            )}
            <Toaster richColors position="bottom-right" />
        </AdminLayout>
    );
};

export default WorksManagement;