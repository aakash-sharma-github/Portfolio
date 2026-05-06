"use client";
import Link from "next/link";
import Nav from "./Nav";
import MobileNav from "./MobileNav";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Header = ({ myFont }) => {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`
                sticky top-0 z-50 w-full transition-all duration-300
                ${scrolled
                    ? "bg-primary/90 backdrop-blur-md border-b border-white/8 py-4 xl:py-5"
                    : "bg-transparent py-4 xl:py-4"
                }
            `}
        >
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="group flex items-center gap-1 select-none">
                    <h1 className={`${myFont.className} text-3xl xl:text-4xl font-semibold
                                    text-white group-hover:text-accent transition-colors duration-200`}>
                        Aakash Sharma
                    </h1>
                    <span className="text-accent text-3xl xl:text-4xl font-semibold
                                     group-hover:scale-125 transition-transform duration-200 inline-block">
                        .
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden xl:flex items-center gap-8">
                    <Nav />
                    <Link href="/contact">
                        <Button className="px-6">Hire Me</Button>
                    </Link>
                </div>

                {/* Mobile nav */}
                <div className="xl:hidden">
                    <MobileNav />
                </div>
            </div>
        </header>
    );
};

export default Header;