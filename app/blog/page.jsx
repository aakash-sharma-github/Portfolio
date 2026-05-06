"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiCalendar,
    FiClock,
    FiTag,
    FiSearch,
    FiChevronLeft,
    FiChevronRight,
    FiChevronDown,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { blogApi } from "@/lib/api";
import { blogCategories } from "@/lib/essentials";
import PageHeader from "@/components/PageHeader";

const ALL_CATEGORIES = ["All", ...blogCategories];

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
    }),
};

// ─── Skeletons ────────────────────────────────────────────────────────────────
function SkeletonFeatured() {
    return (
        <div
            className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden
                        border border-white/8 animate-pulse mb-10"
        >
            <div className="bg-white/5 min-h-[240px]" />
            <div className="p-7 md:p-10 space-y-4 bg-white/[.02]">
                <div className="h-5 w-28 rounded-full bg-white/8" />
                <div className="h-8 w-3/4 rounded-lg bg-white/8" />
                <div className="space-y-2">
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className="h-3 rounded bg-white/6"
                            style={{ width: `${90 - n * 8}%` }}
                        />
                    ))}
                </div>
                <div className="h-10 w-36 rounded-xl bg-white/8" />
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="rounded-2xl border border-white/7 overflow-hidden animate-pulse">
            <div className="h-44 bg-white/5" />
            <div className="p-5 space-y-3">
                <div className="h-3 w-20 rounded-full bg-white/7" />
                <div className="h-5 w-4/5 rounded bg-white/7" />
                <div className="h-3 rounded bg-white/5" />
                <div className="h-3 w-3/4 rounded bg-white/5" />
                <div className="flex justify-between pt-2 border-t border-white/6">
                    <div className="h-3 w-28 rounded bg-white/6" />
                    <div className="h-3 w-16 rounded bg-white/6" />
                </div>
            </div>
        </div>
    );
}

// ─── Featured card ────────────────────────────────────────────────────────────
function FeaturedCard({ post }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="group grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden
                       border border-white/8 hover:border-accent/40 bg-white/[.025]
                       transition-colors duration-300 mb-10"
        >
            <div className="relative min-h-[220px] md:min-h-[280px] overflow-hidden bg-[#111318]">
                <Image
                    src={post.coverImage?.url || "/assets/blog/default-cover.jpg"}
                    alt={post.coverImage?.alt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                <div
                    className="absolute top-4 left-4 flex items-center gap-1.5 bg-accent
                                text-white text-[10px] font-bold px-3 py-1.5 rounded-full
                                uppercase tracking-widest"
                >
                    <HiSparkles className="text-xs" />
                    Featured
                </div>
            </div>

            <div className="flex flex-col justify-between p-6 md:p-9">
                <div>
                    <span
                        className="inline-flex items-center gap-1.5 bg-accent/10 border
                                     border-accent/25 text-accent text-[10px] font-semibold
                                     px-3 py-1.5 rounded-full uppercase tracking-widest mb-4"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {post.category}
                    </span>
                    <h2
                        className="text-xl md:text-2xl font-bold text-white leading-snug mb-3
                                   group-hover:text-accent/90 transition-colors duration-200"
                    >
                        {post.title}
                    </h2>
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-3 mb-5">
                        {post.excerpt}
                    </p>
                </div>
                <div>
                    <div className="flex items-center gap-4 text-xs text-white/35 mb-4">
                        <span className="flex items-center gap-1.5">
                            <FiCalendar aria-hidden />
                            <time dateTime={post.createdAt}>
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </time>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <FiClock aria-hidden />
                            {post.readTime}
                        </span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                        <button
                            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover
                                           text-white font-semibold text-sm px-5 py-2.5 rounded-xl
                                           transition-all duration-200 group/btn"
                        >
                            Read Article
                            <FiChevronRight
                                className="transition-transform duration-200
                                                        group-hover/btn:translate-x-0.5"
                            />
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Blog card ────────────────────────────────────────────────────────────────
function BlogCard({ post, index }) {
    return (
        <motion.div variants={fadeUp} custom={index}>
            <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-full rounded-2xl overflow-hidden
                           border border-white/7 hover:border-accent/35 bg-white/[.02]
                           hover:bg-white/[.04] transition-all duration-300 hover:-translate-y-1"
            >
                <div className="relative h-44 overflow-hidden bg-[#111318] flex-shrink-0">
                    <Image
                        src={post.coverImage?.url || "/assets/blog/default-cover.jpg"}
                        alt={post.coverImage?.alt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div
                        className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm
                                    border border-white/10 text-white/70 text-[10px]
                                    px-2.5 py-1 rounded-full"
                    >
                        {post.readTime}
                    </div>
                </div>

                <div className="flex flex-col flex-1 p-5">
                    <span
                        className="inline-flex items-center gap-1.5 text-accent text-[10px]
                                     font-semibold uppercase tracking-widest mb-2"
                    >
                        <FiTag className="text-[9px]" aria-hidden />
                        {post.category}
                    </span>
                    <h3
                        className="text-[.92rem] font-bold text-white leading-snug mb-2
                                   line-clamp-2 group-hover:text-accent/90 transition-colors duration-150"
                    >
                        {post.title}
                    </h3>
                    <p className="text-white/42 text-[.78rem] leading-relaxed line-clamp-2 flex-1 mb-4">
                        {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/6">
                        <div className="flex items-center gap-2">
                            <div
                                className="relative w-6 h-6 rounded-full overflow-hidden
                                            ring-1 ring-accent/30 flex-shrink-0"
                            >
                                <Image
                                    src={post.author?.avatar || "/assets/avatar.jpg"}
                                    alt={post.author?.name || "Author"}
                                    fill
                                    sizes="24px"
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-white/50 text-[.7rem]">
                                {post.author?.name || "Aakash Sharma"}
                            </span>
                        </div>
                        <span className="flex items-center gap-1 text-white/30 text-[.68rem]">
                            <FiCalendar className="text-[.6rem]" aria-hidden />
                            <time dateTime={post.createdAt}>
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })}
                            </time>
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = (() => {
        if (totalPages <= 5)
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        const arr = [1];
        if (currentPage > 3) arr.push("...");
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        )
            arr.push(i);
        if (currentPage < totalPages - 2) arr.push("...");
        arr.push(totalPages);
        return arr;
    })();

    const base =
        "w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200";
    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${base} border border-white/8 text-white/40 hover:border-accent/40
                            hover:text-accent disabled:opacity-25 disabled:cursor-not-allowed`}
                aria-label="Previous page"
            >
                <FiChevronLeft />
            </button>
            {pages.map((p, i) =>
                p === "..." ? (
                    <span
                        key={`e${i}`}
                        className="w-9 h-9 flex items-center justify-center text-white/25 text-sm"
                    >
                        ···
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`${base} ${p === currentPage
                            ? "bg-accent border-accent text-white"
                            : "bg-white/4 border border-white/8 text-white/50 hover:border-accent/40 hover:text-accent"
                            }`}
                        aria-current={p === currentPage ? "page" : undefined}
                    >
                        {p}
                    </button>
                ),
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${base} border border-white/8 text-white/40 hover:border-accent/40
                            hover:text-accent disabled:opacity-25 disabled:cursor-not-allowed`}
                aria-label="Next page"
            >
                <FiChevronRight />
            </button>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 7,
        total: 0,
        pages: 0,
    });

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 450);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // ── Single consolidated fetch ─────────────────────────────────────────────
    // Previously there were TWO useEffects calling the same API — this caused
    // every state change to fire two simultaneous requests. Fixed to one.
    const fetchPosts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await blogApi.getPosts({
                category: selectedCategory,
                search: debouncedSearch,
                page: pagination.page,
                limit: pagination.limit,
            });
            setPosts(res.blogs || []);
            setPagination((p) => ({
                ...p,
                total: res.pagination?.total || 0,
                pages: res.pagination?.pages || 0,
            }));
        } catch {
            setPosts([]);
            setError("Failed to load posts. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedCategory, debouncedSearch, pagination.page, pagination.limit]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleCategory = (cat) => {
        setSelectedCategory(cat);
        setDropdownOpen(false);
        setPagination((p) => ({ ...p, page: 1 }));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPagination((p) => ({ ...p, page: 1 }));
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.pages) {
            setPagination((p) => ({ ...p, page }));
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const featured =
        selectedCategory === "All" && !debouncedSearch && pagination.page === 1
            ? posts[0]
            : null;
    const regularPosts = featured ? posts.slice(1) : posts;

    return (
        <div className="min-h-screen bg-primary">
            <div className="container mx-auto px-4 py-4 xl:py-4">
                {/* ── Hero ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-4"
                >
                    {/* HEADER */}
                    <PageHeader
                        badge="Blog &amp; Articles"
                        header="Thoughts &amp;"
                        subheader="Insights"
                        desc="Deep dives into web development, system design, and the tools I use to build great software."
                    />
                    {pagination.total > 0 && (
                        <div className="flex justify-center gap-8 mt-6">
                            {[
                                { num: pagination.total, label: "Articles" },
                                { num: blogCategories.length, label: "Categories" },
                            ].map(({ num, label }) => (
                                <div key={label} className="text-center">
                                    <div className="text-xl font-bold text-accent">{num}</div>
                                    <div className="text-[.65rem] text-white/35 uppercase tracking-widest">
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* ── Search + Category row ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8
                               max-w-2xl mx-auto"
                >
                    {/* Search */}
                    <div className="relative flex-1">
                        <FiSearch
                            className="absolute left-3.5 top-1/2 -translate-y-1/2
                                             text-white/10 text-sm pointer-events-none"
                        />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search articles…"
                            className="w-full pl-10 pr-4 py-3 bg-transparent border border-white/10
                            rounded-xl text-sm text-white placeholder:text-white/50
                            focus:outline-none focus:border-accent/50 hover:border-accent/40
                            transition-all duration-200 font-primary"
                        />
                    </div>

                    {/* Category dropdown — shown on ALL screen sizes */}
                    <div className="relative hidden sm:block">
                        <button
                            onClick={() => setDropdownOpen((o) => !o)}
                            className="flex items-center justify-between gap-2 min-w-[160px] w-full
                                       sm:w-auto px-4 py-3 bg-transparent border border-white/10
                                       rounded-xl text-sm font-medium transition-all duration-200
                                       hover:border-accent/40 focus:outline-none
                                       focus:border-accent/50"
                            aria-haspopup="listbox"
                            aria-expanded={dropdownOpen}
                        >
                            <span
                                className={
                                    selectedCategory === "All" ? "text-white/50" : "text-accent"
                                }
                            >
                                {selectedCategory}
                            </span>
                            <FiChevronDown
                                className={`text-white/40 flex-shrink-0 transition-transform duration-200
                                            ${dropdownOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <>
                                    {/* Click-away backdrop */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setDropdownOpen(false)}
                                    />
                                    <motion.ul
                                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        role="listbox"
                                        className="absolute right-0 top-[calc(100%+6px)] z-20 w-56
                                                   bg-[#1e1e28] border border-white/10 rounded-xl
                                                   shadow-2xl overflow-hidden py-1 max-h-72 overflow-y-auto"
                                    >
                                        {ALL_CATEGORIES.map((cat) => (
                                            <li key={cat}>
                                                <button
                                                    role="option"
                                                    aria-selected={selectedCategory === cat}
                                                    onClick={() => handleCategory(cat)}
                                                    className={`w-full text-left px-4 py-2.5 text-sm
                                                                transition-colors duration-150
                                                                ${selectedCategory ===
                                                            cat
                                                            ? "text-accent bg-accent/10"
                                                            : "text-white/60 hover:text-white hover:bg-white/5"
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            </li>
                                        ))}
                                    </motion.ul>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* ── Featured ── */}
                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="skel-f"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <SkeletonFeatured />
                        </motion.div>
                    )}
                    {!isLoading && featured && (
                        <motion.div
                            key="featured"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div
                                className="flex items-center gap-3 text-[.68rem] text-accent uppercase
                                            tracking-widest mb-4 font-semibold"
                            >
                                <HiSparkles />
                                <span>Featured Post</span>
                                <div className="flex-1 h-px bg-accent/20" />
                            </div>
                            <FeaturedCard post={featured} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Grid ── */}
                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="skel-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                        >
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </motion.div>
                    )}

                    {!isLoading && error && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center py-20 text-center"
                        >
                            <div
                                className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20
                                            flex items-center justify-center text-xl mb-4"
                            >
                                ⚠️
                            </div>
                            <p className="text-white/50 text-sm">{error}</p>
                            <button
                                onClick={fetchPosts}
                                className="mt-4 text-accent text-sm underline underline-offset-4"
                            >
                                Try again
                            </button>
                        </motion.div>
                    )}

                    {!isLoading && !error && regularPosts.length === 0 && !featured && (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center py-20 text-center"
                        >
                            <div
                                className="w-12 h-12 rounded-2xl bg-white/4 border border-white/8
                                            flex items-center justify-center text-2xl mb-4"
                            >
                                📭
                            </div>
                            <h3 className="text-white/55 text-base font-semibold mb-1">
                                No articles found
                            </h3>
                            <p className="text-white/30 text-sm">
                                {debouncedSearch
                                    ? `No results for "${debouncedSearch}"`
                                    : `No posts in "${selectedCategory}" yet`}
                            </p>
                            {(debouncedSearch || selectedCategory !== "All") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        handleCategory("All");
                                    }}
                                    className="mt-4 text-accent text-sm underline underline-offset-4"
                                >
                                    Clear filters
                                </button>
                            )}
                        </motion.div>
                    )}

                    {!isLoading && !error && regularPosts.length > 0 && (
                        <motion.div
                            key="grid"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.06 } },
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                        >
                            {regularPosts.map((post, i) => (
                                <BlogCard key={post.slug} post={post} index={i} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Pagination ── */}
                {!isLoading && pagination.pages > 1 && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}
