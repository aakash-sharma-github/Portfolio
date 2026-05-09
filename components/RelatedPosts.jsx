'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiTag } from 'react-icons/fi';

// ✅ Removed: import { NextResponse } from 'next/server' — wrong in a client component
// ✅ Removed: import next from 'next' — unused and wrong here
// ✅ Removed: throw Error() calls — components must never throw, they should return null

const RelatedPosts = ({ currentSlug, category, allPosts = [] }) => {
    // Guard: invalid inputs → render nothing instead of crashing
    if (!currentSlug || !category || !Array.isArray(allPosts)) return null;

    // Same-category posts first
    let related = allPosts.filter(
        (p) => p.category === category && p.slug !== currentSlug
    );

    // Fall back to any other posts if no same-category matches
    if (related.length === 0) {
        related = allPosts
            .filter((p) => p.slug !== currentSlug)
            .sort(() => Math.random() - 0.5);
    }

    related = related.slice(0, 3);

    // No posts at all → render nothing silently
    if (related.length === 0) return null;

    const isSameCategory = related[0]?.category === category;

    return (
        <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8">
                {isSameCategory ? 'Related Articles' : 'More Articles You Might Like'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((post, index) => (
                    <motion.div
                        key={post._id || post.slug || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Link
                            href={`/blog/${post.slug}`}
                            className="block group h-full"
                        >
                            <div className="bg-[#1e1e24] border border-white/6 hover:border-accent/30
                                            rounded-xl overflow-hidden h-full flex flex-col
                                            transition-all duration-200 hover:-translate-y-1">
                                {/* Cover image */}
                                <div className="relative h-40 overflow-hidden flex-shrink-0">
                                    <Image
                                        src={post.coverImage?.url || '/assets/blog/default-cover.jpg'}
                                        alt={post.coverImage?.alt || post.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>

                                {/* Body */}
                                <div className="p-4 flex flex-col flex-1">
                                    <span className="flex items-center gap-1 text-accent text-[10px]
                                                     font-semibold uppercase tracking-widest mb-2">
                                        <FiTag className="text-[9px]" />
                                        {post.category}
                                    </span>
                                    <h4 className="text-sm font-bold text-white leading-snug mb-3
                                                   group-hover:text-accent transition-colors duration-150
                                                   line-clamp-2 flex-1">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-white/40 text-xs mt-auto">
                                        <FiCalendar className="text-[10px]" />
                                        <time dateTime={post.createdAt}>
                                            {post.createdAt
                                                ? new Date(post.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                })
                                                : ''}
                                        </time>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RelatedPosts;