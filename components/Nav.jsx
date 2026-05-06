"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/essentials";

const Nav = () => {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                    <Link
                        key={link.path}
                        href={link.path}
                        className={`
                            relative px-3 py-2 rounded-lg text-sm font-medium capitalize
                            transition-all duration-200
                            ${isActive
                                ? "text-accent"
                                : "text-white/60 hover:text-white"
                            }
                        `}
                    >
                        {/* Animated background pill on hover/active */}
                        {isActive && (
                            <span className="absolute inset-0 bg-accent/10 rounded-lg" />
                        )}
                        <span className="relative">{link.name}</span>

                        {/* Active dot indicator */}
                        {isActive && (
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2
                                             w-1 h-1 rounded-full bg-accent" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
};

export default Nav;