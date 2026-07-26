"use client";

import { useContextApi } from '@/context/contextApi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiPackage, FiFileText, FiMail, FiExternalLink } from 'react-icons/fi';

const AdminSidebar = ({ onNavigate }) => {
    const pathname = usePathname();
    const font = useContextApi((state) => state.font);

    const navItems = [
        { name: 'Dashboard', path: '/x7k2-management-9qp/dashboard', icon: <FiGrid /> },
        { name: 'Projects', path: '/x7k2-management-9qp/dashboard/works', icon: <FiPackage /> },
        { name: 'Blogs', path: '/x7k2-management-9qp/dashboard/blogs', icon: <FiFileText /> },
        { name: 'Contacts', path: '/x7k2-management-9qp/dashboard/contacts', icon: <FiMail /> },
    ];

    return (
        <aside
            className="bg-[#1e1e24] h-[100dvh] w-[78vw] max-w-[280px] lg:w-64
                       px-4 pt-6 pb-4 shadow-2xl lg:shadow-lg flex flex-col
                       overflow-y-auto"
        >
            {/* Logo */}
            <div className="flex items-center justify-center flex-shrink-0">
                <div className="mt-2 mb-8 lg:mt-10 lg:mb-10 text-center">
                    <Link href="/" onClick={onNavigate}>
                        <h1 className={`${font} text-2xl sm:text-3xl lg:text-4xl font-semibold`}>
                            AS<span className="text-accent">.</span>
                        </h1>
                    </Link>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1">
                <ul className="space-y-1.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link href={item.path} onClick={onNavigate} passHref>
                                    <div
                                        className={`
                                            flex items-center px-4 py-3.5 lg:py-3 rounded-lg
                                            cursor-pointer transition-all duration-150
                                            active:scale-[0.98]
                                            ${isActive
                                                ? "bg-accent/15 border border-accent/25"
                                                : "hover:bg-[#2a2a35] border border-transparent"
                                            }
                                        `}
                                    >
                                        <span className={`text-lg mr-3 flex-shrink-0
                                                          ${isActive ? "text-accent" : "text-white/70"}`}>
                                            {item.icon}
                                        </span>
                                        <span className={`text-base font-medium
                                                          ${isActive ? "text-white" : "text-white/80"}`}>
                                            {item.name}
                                        </span>
                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                        )}
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer — link back to the live site, useful on mobile where
                there's no separate way back without closing the admin tab */}
            <div className="flex-shrink-0 pt-4 mt-4 border-t border-white/8">
                <Link
                    href="/"
                    target="_blank"
                    onClick={onNavigate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white/40
                               hover:text-white/70 hover:bg-white/5 transition-colors text-sm"
                >
                    <FiExternalLink size={14} />
                    View live site
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar;