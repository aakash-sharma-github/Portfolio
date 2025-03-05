"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiClock, FiTag, FiArrowLeft } from 'react-icons/fi';
import { blogApi } from '@/lib/api';
import RelatedPosts from '@/components/RelatedPosts';
import ClientOnly from '@/components/ClientOnly';

const BlogPostPage = ({ params }) => {
    const { slug } = params;
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch the specific post and all posts for related posts
                const [fetchedPost, fetchedPosts] = await Promise.all([
                    blogApi.getPostBySlug(slug),
                    blogApi.getPosts()
                ]);

                if (!fetchedPost) {
                    setError('Blog post not found');
                    return;
                }

                console.log('Current post category:', fetchedPost.category);
                console.log('All posts categories:', fetchedPosts.blogs?.map(post => post.category));

                setPost(fetchedPost);
                setAllPosts(fetchedPosts.blogs || []);
            } catch (error) {
                console.error('Error fetching blog post:', error);
                setError('Failed to load blog post. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-primary flex justify-center items-center p-4">
                <div className="bg-red-500/20 border border-red-500 text-white p-6 rounded-md max-w-2xl w-full">
                    <h2 className="text-xl font-bold mb-2">{error || 'Blog post not found'}</h2>
                    <p className="mb-4">The blog post you're looking for doesn't exist or has been removed.</p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-accent hover:underline"
                    >
                        <FiArrowLeft className="mr-2" /> Back to blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <ClientOnly>
            <div className="min-h-screen bg-primary">
                {/* Hero Section */}
                <div className="relative h-[50vh] md:h-[60vh] w-full">
                    <Image
                        src={post.coverImage?.url || '/assets/blog/default-cover.jpg'}
                        alt={post.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                        <div className="container mx-auto">
                            <Link
                                href="/blog"
                                className="inline-flex items-center text-white/80 hover:text-accent mb-4 transition-colors"
                            >
                                <FiArrowLeft className="mr-2" /> Back to blog
                            </Link>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/80">
                                <div className="flex items-center">
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-2">
                                        <Image
                                            src={post.author?.avatar || '/assets/avatar.jpg'}
                                            alt={post.author?.name || 'Author'}
                                            fill
                                            sizes="40px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <span>{post.author?.name || 'Author'}</span>
                                </div>
                                <span className="flex items-center">
                                    <FiCalendar className="mr-1" />
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                <span className="flex items-center">
                                    <FiClock className="mr-1" />
                                    {post.readTime}
                                </span>
                                <span className="flex items-center">
                                    <FiTag className="mr-1" />
                                    {post.category}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto py-12 px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="prose prose-lg prose-invert prose-accent mx-auto">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>

                        {/* Author Bio */}
                        {post.author && (
                            <div className="mt-12 p-6 bg-[#1e1e24] rounded-lg">
                                <div className="flex items-start gap-4">
                                    <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={post.author.avatar || '/assets/avatar.jpg'}
                                            alt={post.author.name}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">About {post.author.name}</h3>
                                        <p className="text-white/70">{post.author.bio}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Related Posts */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center">Related Articles</h2>
                        {console.log('Rendering RelatedPosts with:', {
                            currentSlug: post.slug,
                            category: post.category,
                            allPostsCount: allPosts.length,
                            allPostsCategories: allPosts.map(p => p.category)
                        })}
                        <RelatedPosts
                            currentSlug={post.slug}
                            category={post.category}
                            allPosts={allPosts}
                        />
                    </div>
                </div>
            </div>
        </ClientOnly>
    );
};

export default BlogPostPage; 