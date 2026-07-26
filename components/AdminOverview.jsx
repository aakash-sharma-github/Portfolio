"use client";

import { useState, useEffect } from 'react';
import { FiMail, FiPackage, FiFileText } from 'react-icons/fi';
import Link from 'next/link';
import { dashboardApi } from '@/lib/api';

const AdminOverview = () => {
    const [stats, setStats] = useState({
        works: 0,
        blogs: 0,
        contacts: 0,
        unreadMessages: 0,
        totalContent: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardApi.getOverview();

                const totalWorks = data.overview?.works?.total || 0;
                const totalBlogs = data.overview?.blogs?.total || 0;
                const totalContacts = data.overview?.contacts?.total || 0;
                const unreadMessages = data.overview?.contacts?.unread || 0;

                setStats({
                    works: totalWorks,
                    blogs: totalBlogs,
                    contacts: totalContacts,
                    unreadMessages,
                    totalContent: totalWorks + totalBlogs + totalContacts,
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            label: 'Total Content',
            value: stats.totalContent,
            icon: <FiFileText />,
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-400',
            href: null,
        },
        {
            label: 'Projects',
            value: stats.works,
            icon: <FiPackage />,
            iconBg: 'bg-purple-500/20',
            iconColor: 'text-purple-400',
            href: '/x7k2-management-9qp/dashboard/works',
        },
        {
            label: 'Blogs',
            value: stats.blogs,
            icon: <FiFileText />,
            iconBg: 'bg-green-500/20',
            iconColor: 'text-green-400',
            href: '/x7k2-management-9qp/dashboard/blogs',
        },
        {
            label: 'Contacts',
            value: stats.contacts,
            icon: <FiMail />,
            iconBg: 'bg-red-500/20',
            iconColor: 'text-red-400',
            href: '/x7k2-management-9qp/dashboard/contacts',
            badge: stats.unreadMessages > 0 ? stats.unreadMessages : null,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {cards.map(({ label, value, icon, iconBg, iconColor, href, badge }) => {
                const content = (
                    <div className="bg-[#1e1e24] p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg
                                    h-full relative">
                        {badge && (
                            <span className="absolute top-3 right-3 bg-red-500 text-white
                                             text-[10px] font-bold rounded-full min-w-[18px] h-[18px]
                                             px-1 flex items-center justify-center">
                                {badge > 99 ? '99+' : badge}
                            </span>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-white/60 text-xs sm:text-sm truncate">{label}</p>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                                    {value}
                                </h3>
                            </div>
                            <div className={`${iconBg} p-2.5 sm:p-3 rounded-full w-fit flex-shrink-0`}>
                                <span className={`${iconColor} text-lg sm:text-xl block`}>
                                    {icon}
                                </span>
                            </div>
                        </div>
                    </div>
                );

                return href ? (
                    <Link
                        key={label}
                        href={href}
                        className="hover:opacity-90 active:scale-[0.98] transition-all duration-150"
                    >
                        {content}
                    </Link>
                ) : (
                    <div key={label}>{content}</div>
                );
            })}
        </div>
    );
};

export default AdminOverview;