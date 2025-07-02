"use client";

import { useState, useEffect } from 'react';
import { FiMail, FiPackage, FiFileText, FiBell } from 'react-icons/fi';
import Link from 'next/link';

const AdminOverview = () => {
    const [stats, setStats] = useState({
        works: 0,
        blogs: 0,
        contacts: 0,
        unreadMessages: 0,
        totalContent: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/dashboard');
                const data = await response.json();
                
                // Extract data from the correct structure
                const totalWorks = data.overview?.works?.total || 0;
                const totalBlogs = data.overview?.blogs?.total || 0;
                const totalContacts = data.overview?.contacts?.total || 0;
                const unreadMessages = data.overview?.contacts?.unread || 0;
                
                setStats({
                    works: totalWorks,
                    blogs: totalBlogs,
                    contacts: totalContacts,
                    unreadMessages: unreadMessages,
                    totalContent: totalWorks + totalBlogs
                });
                
                console.log('Dashboard data:', data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Content Card */}
            <div className="bg-[#1e1e24] p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/70 text-sm">Total Content</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{stats.totalContent}</h3>
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded-full">
                        <FiFileText className="text-blue-500 text-xl" />
                    </div>
                </div>
            </div>

            {/* Works Card */}
            <Link href="/admin/dashboard/works" className="bg-[#1e1e24] p-6 rounded-lg shadow-lg hover:bg-[#2a2a35] transition-all">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/70 text-sm">Projects</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{stats.works}</h3>
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-full">
                        <FiPackage className="text-purple-500 text-xl" />
                    </div>
                </div>
            </Link>

            {/* Blogs Card */}
            <Link href="/admin/dashboard/blogs" className="bg-[#1e1e24] p-6 rounded-lg shadow-lg hover:bg-[#2a2a35] transition-all">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/70 text-sm">Blogs</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{stats.blogs}</h3>
                    </div>
                    <div className="bg-green-500/20 p-3 rounded-full">
                        <FiFileText className="text-green-500 text-xl" />
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default AdminOverview;
