"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiHome, FiPlusCircle, FiLogOut, FiMenu, FiBell } from "react-icons/fi";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children, title }) => {
    const pathname = usePathname();
    const isDashboard = pathname === "/x7k2-management-9qp/dashboard";
    const isEditingOrCreating = pathname.includes("/create") || pathname.includes("/edit");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        const fetchUnreadMessages = async () => {
            try {
                const response = await fetch('/api/dashboard');
                const data = await response.json();
                setUnreadMessages(data.overview?.contacts?.unread || 0);
            } catch (error) {
                console.error('Failed to fetch unread messages:', error);
            }
        };

        fetchUnreadMessages();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("adminToken");
            window.location.href = "/x7k2-management-9qp";
        }
    };

    return (
        <div className="flex h-screen bg-[#13131a] overflow-hidden">
            {/* Mobile Sidebar Toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 bg-[#2a2a35] p-2 rounded-lg text-white"
                onClick={toggleSidebar}
            >
                <FiMenu size={24} />
            </button>

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 transform 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 transition-transform duration-300 ease-in-out z-30
            `}>
                <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                <div className="px-8 py-6">
                    {/* Admin Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-700">
                        <h1 className="text-3xl font-bold mb-4 md:mb-0 ml-12 md:ml-0">{title}</h1>

                        <div className="flex gap-4">
                            {/* Notifications Badge */}
                            <Link href="/x7k2-management-9qp/dashboard/contacts?filter=unread" className="relative p-2">
                                <FiBell className="text-white text-xl" />
                                {unreadMessages > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadMessages}
                                    </span>
                                )}
                            </Link>

                            {/* Always show Logout button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-red-700/30 hover:bg-red-700/50 px-4 py-2 rounded-md transition-colors"
                            >
                                <FiLogOut /> Logout
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div>
                        {children}
                    </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
};

export default AdminLayout;