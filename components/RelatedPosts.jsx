import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar } from 'react-icons/fi';

const RelatedPosts = ({ currentSlug, category, allPosts = [] }) => {
    // Add logging to help debug issues
    console.log('RelatedPosts props:', {
        currentSlug,
        category,
        allPostsCount: allPosts.length,
        uniqueCategories: [...new Set(allPosts.map(post => post.category))]
    });

    // Validate inputs
    if (!Array.isArray(allPosts)) {
        console.error('RelatedPosts: allPosts is not an array:', allPosts);
        return null;
    }

    if (!currentSlug || !category) {
        console.error('RelatedPosts: Missing required props:', { currentSlug, category });
        return null;
    }

    // First try to find posts in the same category
    let relatedPosts = allPosts
        .filter(post => post.category === category && post.slug !== currentSlug);

    // If no posts in the same category, show posts from any category
    if (relatedPosts.length === 0) {
        console.log('No posts found in the same category. Showing posts from other categories.');
        relatedPosts = allPosts
            .filter(post => post.slug !== currentSlug)
            .sort(() => Math.random() - 0.5); // Randomly sort posts
    }

    // Take up to 3 posts
    relatedPosts = relatedPosts.slice(0, 3);

    console.log('RelatedPosts: Found', relatedPosts.length, 'posts to display');

    if (relatedPosts.length === 0) {
        console.log('RelatedPosts: No posts available to display');
        return null;
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