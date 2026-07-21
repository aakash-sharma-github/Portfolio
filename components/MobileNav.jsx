"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/lib/essentials";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useContextApi } from "../context/contextApi";

const MobileNav = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const font = useContextApi((state) => state.font);

    // Close menu when route changes
    useEffect(() => { setOpen(false); }, [pathname]);

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <>
            {/* Hamburger / Close toggle */}
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={open}
                className="relative z-[60] w-10 h-10 flex items-center justify-center
                           rounded-xl text-accent hover:bg-accent/10 transition-colors duration-200"
            >
                <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                        <motion.span
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        >
                            <HiX className="text-2xl" aria-hidden />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="menu"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        >
                            <HiMenuAlt3 className="text-2xl" aria-hidden />
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Full-screen overlay menu */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                        />

                        {/* Slide-in panel */}
                        <motion.div
                            key="panel"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 bottom-0 z-[56] w-[80vw] max-w-sm
                                       bg-[#16161c] border-l border-white/8 flex flex-col"
                        >
                            {/* Panel header */}
                            <div className="px-6 py-6 border-b border-white/8">
                                <Link href="/" onClick={() => setOpen(false)}>
                                    <h1 className={`${font} text-2xl font-semibold text-white`}>
                                        Aakash Sharma
                                        <span className={`${font} text-accent`}>.</span>
                                    </h1>
                                </Link>
                                <p className="text-white/40 text-xs mt-1 tracking-widest uppercase">
                                    Full-Stack Developer
                                </p>
                            </div>

                            {/* Nav links */}
                            <nav className="flex-1 px-4 py-6 flex flex-col gap-1" aria-label="Mobile navigation">
                                {navLinks.map((link, i) => {
                                    const isActive = pathname === link.path;
                                    return (
                                        <motion.div
                                            key={link.path}
                                            initial={{ opacity: 0, x: 24 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.055, duration: 0.25 }}
                                        >
                                            <Link
                                                href={link.path}
                                                className={`
                                                    flex items-center gap-3 px-4 py-3.5 rounded-xl
                                                    text-base font-semibold capitalize transition-all duration-150
                                                    ${isActive
                                                        ? "bg-accent/15 text-accent border border-accent/30"
                                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                                    }
                                                `}
                                            >
                                                {isActive && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                                )}
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </nav>

                            {/* CTA footer */}
                            <div className="px-6 py-6 border-t border-white/8">
                                <Link href="/contact" onClick={() => setOpen(false)}>
                                    <button className="w-full bg-accent hover:bg-accent-hover text-white
                                                       font-bold py-3.5 px-6 rounded-xl transition-all
                                                       duration-200 text-sm tracking-wide">
                                        Hire Me
                                    </button>
                                </Link>
                                <p className="text-center text-white/25 text-xs mt-3">
                                    Available for freelance & full-time
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default MobileNav;