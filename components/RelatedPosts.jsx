import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar } from 'react-icons/fi';
import { NextResponse } from 'next/server';
import next from 'next';

const RelatedPosts = ({ currentSlug, category, allPosts = [] }) => {

    // Validate inputs
    if (!Array.isArray(allPosts)) {
        throw new Error('RelatedPosts: allPosts must be an array');
    }

    if (!currentSlug || !category) {
        throw new Error('RelatedPosts: currentSlug and category are required');
    }

    // First try to find posts in the same category
    let relatedPosts = allPosts
        .filter(post => post.category === category && post.slug !== currentSlug);

    // If no posts in the same category, show posts from any category
    if (relatedPosts.length === 0) {
        relatedPosts = allPosts
            .filter(post => post.slug !== currentSlug)
            .sort(() => Math.random() - 0.5); // Randomly sort posts
    }

    // Take up to 3 posts
    relatedPosts = relatedPosts.slice(0, 3);

    if (relatedPosts.length === 0) {
        throw new Error('RelatedPosts: No related posts found');
    }

    return (
        <div className="mt-16">
            <h3 className="h3 mb-8">
                {relatedPosts[0].category === category
                    ? 'Related Articles'
                    : 'More Articles You Might Like'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post, index) => (
                    <motion.div
                        key={post.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Link href={`/blog/${post.slug}`} className="block group">
                            <div className="bg-[#1e1e24] rounded-lg overflow-hidden h-full flex flex-col">
                                {/* Image */}
                                <div className="relative h-40 overflow-hidden">
                                    <Image
                                        src={post.coverImage?.url || '/assets/blog/default-cover.jpg'}
                                        alt={post.title}
                                        width={400}
                                        height={200}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-all duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="mb-2">
                                        <span className="text-xs text-accent">
                                            {post.category}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-medium mb-2 group-hover:text-accent transition-all">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center text-sm text-white/60 mt-auto">
                                        <FiCalendar className="text-accent mr-1" />
                                        <span>
                                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
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