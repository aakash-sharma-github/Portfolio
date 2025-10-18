import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiCalendar, FiTag, FiClock } from 'react-icons/fi';

const BlogPostCard = ({ post, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Link href={`/blog/${post.slug}`} className="block group">
                <div className="bg-[#1e1e24] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(63,136,197,0.3)] h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-accent/20 group-hover:bg-accent/0 transition-all duration-300 z-10"></div>
                        <div className="relative h-full w-full overflow-hidden">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                width={400}
                                height={250}
                                className="object-cover w-full h-full group-hover:scale-105 transition-all duration-500"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                        {/* Meta */}
                        <div className="flex items-center text-sm text-white/60 mb-3 gap-4">
                            <div className="flex items-center gap-1">
                                <FiCalendar className="text-accent" />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FiClock className="text-accent" />
                                <span>{post.readTime}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-all">
                            {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-white/70 mb-4 flex-grow">
                            {post.excerpt}
                        </p>

                        {/* Category */}
                        <div className="flex items-center gap-1 text-sm">
                            <FiTag className="text-accent" />
                            <span className="text-accent">{post.category}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default BlogPostCard; 