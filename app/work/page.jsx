"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiExternalLink, FiGithub, FiTag, FiSearch, FiX } from "react-icons/fi";
import { BsGrid3X3Gap, BsList } from "react-icons/bs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import StatusBadge from "@/components/StatusBadge";
import axios from "axios";
import PageHeader from "@/components/PageHeader";

/* ── fallback data ──────────────────────────────────── */
const fallbackProjects = [
    {
        id: "1",
        num: "01",
        category: "Web Development",
        title: "Personal Portfolio",
        description:
            "A personal portfolio website built with Next.js, Tailwind CSS, and Framer Motion.",
        status: "completed",
        stack: [
            { name: "Next.js" },
            { name: "Tailwind CSS" },
            { name: "Framer Motion" },
        ],
        image: "/images/portfolio_01.png",
        live: "",
        github: "",
    },
    {
        id: "2",
        num: "02",
        category: "Web Development",
        title: "Portfolio v2",
        description:
            "Second iteration of the portfolio with improved design and animations.",
        status: "completed",
        stack: [
            { name: "Next.js" },
            { name: "Tailwind CSS" },
            { name: "Framer Motion" },
        ],
        image: "/images/portfolio_02.png",
        live: "https://aakash-sharma-github.netlify.app/",
        github: "https://github.com/aakash-sharma-github/Portfolio_Website.git",
    },
];

/* ── Grid card ──────────────────────────────────────── */
const GridCard = ({ project, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07, duration: 0.38 }}
        className="group bg-[#181820] border border-white/6 rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-350 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5"
    >
        {/* image */}
        <div className="relative h-48 overflow-hidden">
            <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-600 group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181820]/90 via-transparent to-transparent" />
            <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-lg bg-black/50 text-white/70 text-[10px] font-bold">
                    #{project.num}
                </span>
            </div>
            <div className="absolute top-3 right-3">
                <StatusBadge status={project.status || "completed"} size="sm" />
            </div>
            {/* hover overlay with links */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                {project.live && (
                    <Link
                        href={project.live}
                        target="_blank"
                        className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors"
                    >
                        <FiExternalLink className="text-white" size={15} />
                    </Link>
                )}
                {project.github && (
                    <Link
                        href={project.github}
                        target="_blank"
                        className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
                    >
                        <FiGithub className="text-white" size={15} />
                    </Link>
                )}
            </div>
        </div>

        {/* body */}
        <div className="p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-accent/70">
                <FiTag size={11} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                    {project.category}
                </span>
            </div>
            <h3 className="text-white font-bold text-base leading-snug group-hover:text-accent transition-colors duration-250">
                {project.title}
            </h3>
            <p className="text-white/45 text-xs leading-relaxed line-clamp-3">
                {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                {project.stack.slice(0, 4).map((t, i) => (
                    <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-accent/8 text-accent text-[9px] font-semibold border border-accent/15"
                    >
                        {t.name}
                    </span>
                ))}
                {project.stack.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-white/40 text-[9px]">
                        +{project.stack.length - 4}
                    </span>
                )}
            </div>
        </div>
    </motion.div>
);

/* ── List card ──────────────────────────────────────── */
const ListCard = ({ project, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.055, duration: 0.35 }}
        className="group flex gap-5 bg-[#181820] border border-white/6 rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300"
    >
        <div className="relative w-36 md:w-52 flex-shrink-0">
            <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="208px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#181820]/60" />
        </div>
        <div className="flex-1 py-5 pr-5 flex flex-col justify-between min-w-0">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-accent/70 text-[10px] font-bold uppercase tracking-widest">
                        <FiTag size={10} />
                        {project.category}
                    </span>
                    <StatusBadge status={project.status || "completed"} size="xs" />
                </div>
                <h3 className="text-white font-bold text-base md:text-lg leading-snug group-hover:text-accent transition-colors duration-250">
                    {project.title}
                </h3>
                <p className="text-white/45 text-xs leading-relaxed line-clamp-2">
                    {project.description}
                </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <div className="flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 3).map((t, i) => (
                        <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-accent/8 text-accent text-[9px] font-semibold border border-accent/15"
                        >
                            {t.name}
                        </span>
                    ))}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    {project.live && (
                        <Link
                            href={project.live}
                            target="_blank"
                            className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors"
                        >
                            <FiExternalLink
                                className="text-accent hover:text-white"
                                size={12}
                            />
                        </Link>
                    )}
                    {project.github && (
                        <Link
                            href={project.github}
                            target="_blank"
                            className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/15 transition-colors"
                        >
                            <FiGithub className="text-white/60" size={12} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
);

/* ── Skeleton ───────────────────────────────────────── */
const GridSkeleton = () => (
    <div className="animate-pulse bg-[#181820] border border-white/5 rounded-2xl overflow-hidden">
        <div className="h-48 bg-white/4" />
        <div className="p-5 space-y-3">
            <div className="h-2 bg-white/4 rounded w-16" />
            <div className="h-4 bg-white/4 rounded w-3/4" />
            <div className="h-3 bg-white/4 rounded w-full" />
        </div>
    </div>
);

/* ── Main ───────────────────────────────────────────── */
const Work = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("grid");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get("/api/works?limit=20");
                if (data?.works?.length > 0) {
                    setProjects(
                        data.works.map((w, i) => ({
                            id: w._id || i,
                            num: String(i + 1).padStart(2, "0"),
                            category: w.category || "Web Development",
                            title: w.title,
                            description: w.description,
                            status: w.status || "completed",
                            stack: w.technologies || w.stack || [],
                            image: w.coverImage?.url || "/images/portfolio_01.png",
                            live: w.links?.live || w.live || "",
                            github: w.links?.github || w.github || "",
                        })),
                    );
                } else {
                    setProjects(fallbackProjects);
                }
                setError(null);
            } catch (e) {
                setError("Could not load projects from server — showing samples.");
                setProjects(fallbackProjects);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const categories = ["All", ...new Set(projects.map((p) => p.category))];

    const filtered = projects.filter((p) => {
        const matchCat =
            selectedCategory === "All" || p.category === selectedCategory;
        const matchSearch =
            !searchTerm ||
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchSearch;
    });

    // view modes for toggle buttons
    const viewModes = [
        { mode: "grid", Icon: BsGrid3X3Gap },
        { mode: "list", Icon: BsList },
    ];

    // responsive: switch to grid view on small screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setViewMode("list");
            }
        };

        handleResize(); // run on load
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
            className="min-h-screen bg-primary pb-20"
        >
            <div className="container mx-auto px-4">
                {/* HEADER */}
                <PageHeader
                    badge="Portfolio"
                    header="My"
                    subheader="Projects"
                    desc="A curated collection of apps, sites, and experiments I've shipped."
                />

                {/* FILTER BAR */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.38 }}
                    className="hidden md:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-9"
                >
                    {/* left: category pills + search */}
                    <div className="flex flex-wrap items-center gap-2" />

                    {/* right: view toggle + count */}
                    <div className="flex justify-end items-center gap-3">
                        <span className="text-white/25 text-xs">
                            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
                        </span>
                        <div className="flex items-center gap-1 p-1 bg-[#181820] rounded-xl">
                            {viewModes.map(({ mode, Icon }) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === mode
                                        ? "bg-accent text-white"
                                        : "text-white/35 hover:text-white"
                                        }`}
                                >
                                    <Icon size={14} />
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* error banner */}
                {error && (
                    <div className="mb-6 px-4 py-2.5 rounded-xl bg-yellow-500/8 border border-yellow-500/15 text-yellow-300/70 text-xs text-center">
                        {error}
                    </div>
                )}

                {/* CONTENT */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <GridSkeleton key={i} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-4xl mb-4 opacity-15">🔍</div>
                        <h3 className="text-white/45 text-base font-medium">
                            No projects found
                        </h3>
                        <p className="text-white/25 text-sm mt-1">
                            Try a different category or search term.
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${viewMode}-${selectedCategory}-${searchTerm}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.28 }}
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    : "flex flex-col gap-4"
                            }
                        >
                            {filtered.map((project, i) =>
                                viewMode === "grid" ? (
                                    <GridCard key={project.id} project={project} index={i} />
                                ) : (
                                    <ListCard key={project.id} project={project} index={i} />
                                ),
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </motion.section>
    );
};

export default Work;
