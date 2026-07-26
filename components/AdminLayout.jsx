"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiLogOut, FiMenu, FiBell, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children, title }) => {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    // ✅ Auto-close the mobile sidebar whenever the route changes.
    // Without this, navigating to a new page on mobile left the sidebar
    // open, covering the new page's content.
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // ✅ Lock body scroll while the mobile sidebar is open — prevents the
    // page behind the overlay from scrolling on touch devices.
    useEffect(() => {
        document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isSidebarOpen]);

    const toggleSidebar = () => setIsSidebarOpen((v) => !v);

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("adminToken");
            window.location.href = "/x7k2-management-9qp";
        }
    };

    return (
        <div className="flex h-[100dvh] bg-[#13131a] overflow-hidden">
            {/* ── Sidebar ──────────────────────────────────────────────────────
                Desktop (lg+): always visible, static, part of the flex row.
                Mobile: fixed overlay, slides in/out, closes on nav or backdrop tap. */}
            <div
                className={`
                    fixed lg:static inset-y-0 left-0 z-40
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            >
                <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} />
            </div>

            {/* Mobile backdrop — tap anywhere to close */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}

            {/* ── Main content column ── */}
            <div className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
                {/* Sticky mobile top bar — hamburger + title + actions in one row.
                    Desktop uses a taller, roomier header below instead. */}
                <header
                    className="sticky top-0 z-20 flex items-center justify-between gap-3
                               bg-[#13131a]/95 backdrop-blur-sm border-b border-white/8
                               px-4 py-3 lg:hidden"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={toggleSidebar}
                            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                            className="flex-shrink-0 p-2 -ml-2 rounded-lg text-white
                                       hover:bg-white/8 active:bg-white/12 transition-colors"
                        >
                            {isSidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                        <h1 className="text-lg font-bold text-white truncate">{title}</h1>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                            href="/x7k2-management-9qp/dashboard/contacts?filter=unread"
                            className="relative p-2 rounded-lg hover:bg-white/8 transition-colors"
                            aria-label="Unread messages"
                        >
                            <FiBell className="text-white text-lg" />
                            {unreadMessages > 0 && (
                                <span className="absolute top-0.5 right-0.5 bg-red-500 text-white
                                                 text-[10px] font-bold rounded-full w-4 h-4
                                                 flex items-center justify-center">
                                    {unreadMessages > 9 ? '9+' : unreadMessages}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={handleLogout}
                            aria-label="Logout"
                            className="p-2 rounded-lg bg-red-700/25 hover:bg-red-700/40
                                       text-red-300 transition-colors"
                        >
                            <FiLogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* ── Desktop header ── */}
                <div className="hidden lg:flex justify-between items-center gap-4
                                px-6 xl:px-8 pt-6 pb-4 border-b border-gray-700">
                    <h1 className="text-2xl xl:text-3xl font-bold text-white truncate">
                        {title}
                    </h1>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Link
                            href="/x7k2-management-9qp/dashboard/contacts?filter=unread"
                            className="relative p-2 rounded-lg hover:bg-white/8 transition-colors"
                        >
                            <FiBell className="text-white text-xl" />
                            {unreadMessages > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white
                                                 text-xs rounded-full w-5 h-5 flex items-center
                                                 justify-center">
                                    {unreadMessages}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-700/30 hover:bg-red-700/50
                                       px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                        >
                            <FiLogOut size={16} /> Logout
                        </button>
                    </div>
                </div>

                {/* ── Page content ──
                    Padding scales: tight on mobile, roomy on desktop.
                    pb-8 leaves breathing room above the safe-area on mobile. */}
                <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6 pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;