import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Blog Admin Dashboard",
    description: "Admin dashboard for managing blog posts",
};

export default function AdminLayout({ children }) {
    return (
        <div className={`${inter.className} min-h-screen bg-primary text-white`}>
            {children}
        </div>
    );
} 