"use client";
import Link from "next/link";
import { FiHome, FiPlusCircle, FiLogOut } from "react-icons/fi";
import { usePathname } from "next/navigation";

const AdminLayout = ({ children }) => {
    const pathname = usePathname();
    const isDashboard = pathname === "/admin/dashboard";
    const isEditingOrCreating = pathname.includes("/create") || pathname.includes("/edit");

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin";
        }
    };

    return (
        <div className="container mx-auto px-4 py-4">
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-700">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">Blog Admin</h1>

                <div className="flex gap-4">
                    {/* Only show Dashboard link when editing or creating */}
                    {isEditingOrCreating && (
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2 bg-[#2a2a35] hover:bg-[#3a3a45] px-4 py-2 rounded-md transition-colors"
                        >
                            <FiHome /> Dashboard
                        </Link>
                    )}

                    {/* Only show New Post link when on dashboard */}
                    {isDashboard && (
                        <Link
                            href="/admin/dashboard/create"
                            className="flex items-center gap-2 bg-[#2a2a35] hover:bg-[#3a3a45] px-4 py-2 rounded-md transition-colors"
                        >
                            <FiPlusCircle /> New Post
                        </Link>
                    )}

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
    );
};

export default AdminLayout;