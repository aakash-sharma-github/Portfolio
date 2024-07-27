"use client";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import Link from "next/link";
import { useContextApi } from '../context/contextApi';
import { usePathname } from "next/navigation";
import { CiMenuFries } from "react-icons/ci";


const links = [
    {
        name: "home",
        path: "/"
    },
    {
        name: "services",
        path: "/services"
    },
    {
        name: "resume",
        path: "/resume"
    },
    {
        name: "work",
        path: "/work"
    },
    {
        name: "contact",
        path: "/contact"
    }
];

const MobileNav = () => {
    const pathname = usePathname();
    const font = useContextApi((state) => state.font)

    return (
        <Sheet>
            <SheetTrigger className="flex justify-center items-center">
                <CiMenuFries className="text-[32px] text-accent" />
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                {/* logo */}
                <div className="mt-32 mb-40 text-center text-2xl">
                    <Link href="/">
                        <h1 className={`${font} text-4xl font-semibold`}>
                            Aakash Sharma<span className="text-accent">.</span>
                        </h1>
                    </Link>
                </div>

                {/* Add SheetTitle and SheetDescription for accessibility */}
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">A menu to navigate through different sections of the portfolio.</SheetDescription>

                {/* Nav */}
                <nav className="flex flex-col justify-center items-center gap-8">
                    {links.map((link, index) => {
                        return (
                            <Link
                                href={link.path}
                                key={index}
                                className={`${link.path === pathname &&
                                    "text-accent border-b-2 border-accent"}
                                    text-xl capitalize hover:text-accent transition-all`}
                            >
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav