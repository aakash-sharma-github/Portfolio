"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiClock, FiSearch, FiX, FiArrowRight, FiTrendingUp } from "react-icons/fi";
import { blogApi } from "@/lib/api";
import ClientOnly from "@/components/ClientOnly";
import Pagination from "@/components/Pagination";
import blogCategories from "@/lib/blogCategories";

const fmt = (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

/* ─── Hero card ─────────────────────────────────────── */
const HeroCard = ({ post }) => (
    <Link href={`/blog/${post.slug}`} className="group block mb-8">
        <div className="relative overflow-hidden rounded-2xl h-[320px] md:h-[400px]">
            <Image
                src={post.coverImage?.url || "/assets/avatar.jpg"}
                alt={post.title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/55 to-transparent" />
            <div className="absolute top-5 left-5">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/90 text-white text-[10px] font-bold uppercase tracking-widest">
                    <FiTrendingUp size={10} /> Featured
                </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/70 border border-white/10 mb-3 inline-block">
                    {post.category}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight line-clamp-2 group-hover:text-accent transition-colors duration-300">
                    {post.title}
                </h2>
                <p className="text-white/50 text-sm line-clamp-2 mb-4 max-w-2xl">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative h-6 w-6 rounded-full overflow-hidden border border-accent/40">
                            <Image src={post.author?.avatar || "/assets/avatar.jpg"} alt={post.author?.name || ""} fill className="object-cover" />
                        </div>
                        <span className="text-white/60 text-xs">{post.author?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/35 text-[10px]">
                        <span className="flex items-center gap-1"><FiClock size={9} />{post.readTime}</span>
                        <span className="flex items-center gap-1"><FiCalendar size={9} />{fmt(post.createdAt)}</span>
                    </div>
                </div>
            </div>
            <div className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-accent group-hover:border-accent">
                <FiArrowRight className="text-white opacity-40 group-hover:opacity-100 transition-opacity" size={14} />
            </div>
        </div>
    </Link>
);

/* ─── List card ─────────────────────────────────────── */
const PostCard = ({ post, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.055, duration: 0.35 }}
    >
        <Link href={`/blog/${post.slug}`} className="group flex gap-4 p-4 rounded-xl border border-white/5 bg-[#181820] hover:border-accent/25 hover:bg-[#1c1c25] transition-all duration-300">
            <div className="relative w-[88px] h-[68px] flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                    src={post.coverImage?.url || "/assets/avatar.jpg"}
                    alt={post.title}
                    fill
                    sizes="88px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-accent text-[9px] font-bold uppercase tracking-widest">{post.category}</span>
                <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 mt-0.5 group-hover:text-accent transition-colors duration-200">
                    {post.title}
                </h3>
                <div className="flex items-center gap-3 text-white/30 text-[9px] mt-2">
                    <span className="flex items-center gap-1"><FiClock size={8} />{post.readTime}</span>
                    <span className="flex items-center gap-1"><FiCalendar size={8} />{fmt(post.createdAt)}</span>
                </div>
            </div>
        </Link>
    </motion.div>
);

/* ─── Skeleton ──────────────────────────────────────── */
const Skeleton = () => (
    <div className="animate-pulse flex gap-4 p-4 rounded-xl border border-white/5 bg-[#181820]">
        <div className="w-[88px] h-[68px] rounded-lg bg-white/5 flex-shrink-0" />
        <div className="flex-1 space-y-2 py-1">
            <div className="h-2 bg-white/5 rounded w-14" />
            <div className="h-3 bg-white/5 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
        </div>
    </div>
);

/* ─── Main ──────────────────────────────────────────── */
const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [pagination, setPagination] = useState({ page: 1, limit: 7, total: 0, pages: 0 });
    const searchRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(t);
    }, [searchTerm]);

    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                const res = await blogApi.getPosts({
                    category: selectedCategory,
                    search: debouncedSearch,
                    page: pagination.page,
                    limit: pagination.limit,
                });
                setPosts(res.blogs || []);
                setPagination((p) => ({ ...p, total: res.pagination?.total || 0, pages: res.pagination?.pages || 0 }));
                setError(null);
            } catch (e) {
                setPosts([]);
                setError("Failed to load posts. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [selectedCategory, debouncedSearch, pagination.page, pagination.limit]);

    useEffect(() => {
        setCategories(["All", ...blogCategories.filter((c) => c !== "All")]);
    }, []);

    const handleCategory = (cat) => {
        setSelectedCategory(cat);
        setPagination((p) => ({ ...p, page: 1 }));
    };
    const handlePageChange = (n) => {
        if (n >= 1 && n <= pagination.pages) {
            setPagination((p) => ({ ...p, page: n }));
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const [featured, ...rest] = posts;

    return (
        <ClientOnly>
            <div className="min-h-screen bg-primary">

                {/* PAGE HEADER */}
                <div className="relative py-4 overflow-hidden">
                    {/* <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-12 bg-gradient-to-b from-transparent to-accent/40" /> */}
                    <div className="container mx-auto px-4 text-center">
                        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                            <span className="inline-block px-4 py-1 rounded-full border border-accent/30 text-accent text-[10px] uppercase tracking-[0.22em] mb-4">
                                Writing & Thoughts
                            </span>
                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">The Blog</h1>
                            <p className="text-white/40 text-sm max-w-sm mx-auto">
                                Deep-dives into web development, design, and building software.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* TWO-COLUMN */}
                <div className="container mx-auto px-4 pb-20">
                    <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">

                        {/* ═══ SIDEBAR ═══ */}
                        <motion.aside
                            initial={{ opacity: 0, x: -18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.42, delay: 0.1 }}
                            className="lg:w-60 xl:w-64 flex-shrink-0"
                        >
                            <div className="lg:sticky lg:top-8 space-y-7">

                                {/* Search */}
                                <div>
                                    <p className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-semibold mb-3 flex items-center gap-2">
                                        <span className="h-px flex-1 bg-white/8" />Search<span className="h-px flex-1 bg-white/8" />
                                    </p>
                                    <div className="relative">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={13} />
                                        <input
                                            ref={searchRef}
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => { setSearchTerm(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
                                            placeholder="Search articles…"
                                            className="w-full pl-9 pr-8 py-2.5 bg-[#181820] border border-white/8 rounded-xl text-white text-sm placeholder:text-white/22 focus:outline-none focus:border-accent/45 transition-colors"
                                        />
                                        {searchTerm && (
                                            <button onClick={() => { setSearchTerm(""); searchRef.current?.focus(); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                                                <FiX size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Categories */}
                                <div>
                                    <p className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-semibold mb-3 flex items-center gap-2">
                                        <span className="h-px flex-1 bg-white/8" />Categories<span className="h-px flex-1 bg-white/8" />
                                    </p>
                                    <div className="flex flex-col gap-1">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => handleCategory(cat)}
                                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200 border ${selectedCategory === cat
                                                    ? "bg-accent/12 text-accent border-accent/25"
                                                    : "text-white/45 hover:text-white hover:bg-white/4 border-transparent"
                                                    }`}
                                            >
                                                <span>{cat}</span>
                                                {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Stats panel */}
                                {!isLoading && !error && (
                                    <div className="p-4 rounded-xl bg-[#181820] border border-white/6">
                                        <p className="text-white/25 text-[9px] uppercase tracking-[0.18em] mb-3">Overview</p>
                                        <div className="space-y-2.5">
                                            <div className="flex justify-between">
                                                <span className="text-white/40 text-xs">Total</span>
                                                <span className="text-white text-xs font-semibold">{pagination.total} articles</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/40 text-xs">Topics</span>
                                                <span className="text-white text-xs font-semibold">{categories.length - 1}</span>
                                            </div>
                                            {selectedCategory !== "All" && (
                                                <div className="pt-2 border-t border-white/6">
                                                    <span className="text-accent text-xs font-medium">↳ {selectedCategory}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.aside>

                        {/* ═══ MAIN ═══ */}
                        <div className="flex-1 min-w-0">

                            {isLoading && (
                                <div>
                                    <div className="h-[320px] md:h-[400px] animate-pulse bg-[#181820] rounded-2xl mb-8" />
                                    <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}</div>
                                </div>
                            )}

                            {!isLoading && error && (
                                <div className="text-center py-24">
                                    <p className="text-red-400/65 text-sm mb-4">{error}</p>
                                    <button onClick={() => setPagination((p) => ({ ...p }))} className="px-5 py-2 rounded-lg border border-accent/35 text-accent text-sm hover:bg-accent/10 transition-colors">
                                        Try again
                                    </button>
                                </div>
                            )}

                            {!isLoading && !error && posts.length === 0 && (
                                <div className="text-center py-24">
                                    <div className="text-4xl mb-4 opacity-15">✍</div>
                                    <h3 className="text-white/45 text-base font-medium">Nothing found</h3>
                                    <p className="text-white/25 text-sm mt-1">
                                        {debouncedSearch ? `No results for "${debouncedSearch}"` : `No posts in ${selectedCategory}`}
                                    </p>
                                </div>
                            )}

                            {!isLoading && !error && posts.length > 0 && (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${selectedCategory}-${debouncedSearch}-${pagination.page}`}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {featured && <HeroCard post={featured} />}

                                        {rest.length > 0 && (
                                            <>
                                                <p className="text-white/22 text-[9px] uppercase tracking-[0.18em] mb-4">More articles</p>
                                                <div className="space-y-3">
                                                    {rest.map((post, i) => <PostCard key={post.slug} post={post} index={i} />)}
                                                </div>
                                            </>
                                        )}

                                        {pagination.pages > 1 && (
                                            <div className="mt-12">
                                                <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </ClientOnly>
    );
};

export default BlogPage;