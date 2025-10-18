"use client";

import { useContextApi } from '@/context/contextApi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiPackage, FiFileText, FiMail } from 'react-icons/fi';

const AdminSidebar = () => {
    const pathname = usePathname();
    const font = useContextApi((state) => state.font)

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid /> },
        { name: 'Projects', path: '/admin/dashboard/works', icon: <FiPackage /> },
        { name: 'Blogs', path: '/admin/dashboard/blogs', icon: <FiFileText /> },
        { name: 'Contacts', path: '/admin/dashboard/contacts', icon: <FiMail /> }
    ];

    return (
        <aside className="bg-[#1e1e24] h-screen w-64 px-4 pt-6 shadow-lg">
            <div className="flex items-center justify-center">
                {/* logo */}
                <div className="mt-10 mb-10 text-center text-2xl">
                    <Link href="/">
                        <h1 className={`${font} text-4xl font-semibold`}>
                            Aakash Sharma<span className="text-accent">.</span>
                        </h1>
                    </Link>
                </div>
            </div>
            <nav className="mt-6">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.path} className="mb-4">
                            <Link href={item.path} passHref>
                                <div
                                    className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all hover:bg-[#2a2a35] ${pathname === item.path ? "bg-[#2a2a35]" : ""
                                        }`}
                                >
                                    <span className="text-white text-lg mr-3">
                                        {item.icon}
                                    </span>
                                    <span className="text-white text-base">
                                        {item.name}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;

