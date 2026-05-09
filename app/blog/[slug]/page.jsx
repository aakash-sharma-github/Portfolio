'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiClock, FiTag, FiArrowLeft } from 'react-icons/fi';
import { blogApi } from '@/lib/api';
import RelatedPosts from '@/components/RelatedPosts';

// ✅ Removed: import { NextResponse } from 'next/server' — wrong in a client component

// ── Detect & convert markdown to basic HTML ───────────────────────────────────
// When content was saved as plain markdown (not via TinyMCE), it arrives as raw
// markdown text and dangerouslySetInnerHTML shows it literally.
// This lightweight converter handles the most common markdown patterns.
function markdownToHtml(content) {
    if (!content) return '';

    // If it already contains HTML tags, return as-is (TinyMCE HTML)
    if (/<[a-z][\s\S]*>/i.test(content)) return content;

    return content
        // Headings
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Bold + italic
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Code blocks
        .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // Links
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // Images
        .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />')
        // Blockquotes
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        // Unordered lists
        .replace(/^\s*[-*+] (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        // Ordered lists
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        // Horizontal rule
        .replace(/^---$/gm, '<hr />')
        // Paragraphs: blank lines between text
        .replace(/\n\n+/g, '</p><p>')
        .replace(/^(?!<[a-z])(.+)$/gm, (m) => m.trim() ? m : '')
        // Wrap in paragraph tags
        .replace(/^([^<].*)$/gm, (line) => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            if (trimmed.startsWith('<')) return trimmed;
            return `<p>${trimmed}</p>`;
        });
}

// ── Blog post page ────────────────────────────────────────────────────────────
const BlogPostPage = ({ params }) => {
    const { slug } = params;
    const [post, setPost] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;

        let cancelled = false;
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [fetchedPost, fetchedPosts] = await Promise.all([
                    blogApi.getPostBySlug(slug),
                    blogApi.getPosts({ limit: 20 }),
                ]);

                if (cancelled) return;

                if (!fetchedPost) { setError('Blog post not found'); return; }

                setPost(fetchedPost);
                setAllPosts(fetchedPosts?.blogs || []);
                setError(null);
            } catch {
                if (!cancelled) setError('Failed to load blog post. Please try again later.');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [slug]);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary flex justify-center items-center">
                <div className="w-12 h-12 border-2 border-accent border-t-transparent
                                rounded-full animate-spin" />
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (error || !post) {
        return (
            <div className="min-h-screen bg-primary flex justify-center items-center p-4">
                <div className="bg-red-500/10 border border-red-500/40 text-white p-6
                                rounded-2xl max-w-xl w-full">
                    <h2 className="text-xl font-bold mb-2 text-red-400">
                        {error || 'Blog post not found'}
                    </h2>
                    <p className="text-white/60 mb-4">
                        The post you're looking for doesn't exist or has been removed.
                    </p>
                    <Link href="/blog"
                        className="inline-flex items-center gap-2 text-accent hover:underline">
                        <FiArrowLeft /> Back to blog
                    </Link>
                </div>
            </div>
        );
    }

    // ✅ Bug 1 fix: process content through markdown-to-HTML converter if it's
    // raw markdown. If it's already HTML (from TinyMCE), it passes through unchanged.
    const renderedContent = markdownToHtml(post.content || '');

    // ── Bug 2 fix: author bio — only render the Author section if post.author
    // exists AND has a name. The original code crashed when author was null/undefined.
    const hasAuthor = post.author?.name;

    return (
        <div className="min-h-screen bg-primary">
            {/* ── Hero ── */}
            <div className="relative h-[50vh] md:h-[60vh] w-full">
                <Image
                    src={post.coverImage?.url || '/assets/blog/default-cover.jpg'}
                    alt={post.coverImage?.alt || post.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="container mx-auto">
                        <Link href="/blog"
                            className="inline-flex items-center gap-2 text-white/70
                                       hover:text-accent mb-4 transition-colors text-sm">
                            <FiArrowLeft /> Back to blog
                        </Link>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white
                                       mb-4 max-w-4xl leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                            {/* Author */}
                            {hasAuthor && (
                                <div className="flex items-center gap-2">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden
                                                    ring-2 ring-accent/30">
                                        <Image
                                            src={post.author.avatar || '/assets/avatar.jpg'}
                                            alt={post.author.name}
                                            fill sizes="32px" className="object-cover"
                                        />
                                    </div>
                                    <span>{post.author.name}</span>
                                </div>
                            )}
                            {/* Date */}
                            {post.createdAt && (
                                <span className="flex items-center gap-1.5">
                                    <FiCalendar className="text-xs" />
                                    <time dateTime={post.createdAt}>
                                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                        })}
                                    </time>
                                </span>
                            )}
                            {post.readTime && (
                                <span className="flex items-center gap-1.5">
                                    <FiClock className="text-xs" />{post.readTime}
                                </span>
                            )}
                            {post.category && (
                                <span className="flex items-center gap-1.5">
                                    <FiTag className="text-xs" />{post.category}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-3xl mx-auto">

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map((tag) => (
                                <span key={tag}
                                    className="text-xs px-3 py-1 rounded-full bg-accent/10
                                               text-accent border border-accent/25 font-medium">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* ✅ Prose content
                        - prose class from @tailwindcss/typography renders headings, lists,
                          code blocks, blockquotes with correct spacing and styling
                        - prose-invert inverts colours for dark backgrounds
                        - Custom overrides ensure accent colour links and code blocks
                          match the site theme
                    */}
                    <div
                        className="
                            prose prose-lg prose-invert max-w-none
                            prose-headings:font-bold prose-headings:text-white
                            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                            prose-p:text-white/75 prose-p:leading-relaxed
                            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-white prose-em:text-white/80
                            prose-code:text-accent prose-code:bg-white/8
                            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                            prose-code:font-mono prose-code:text-sm prose-code:before:content-none
                            prose-code:after:content-none
                            prose-pre:bg-[#0d0d14] prose-pre:border prose-pre:border-white/10
                            prose-pre:rounded-xl prose-pre:overflow-x-auto
                            prose-blockquote:border-l-accent prose-blockquote:text-white/60
                            prose-blockquote:bg-accent/5 prose-blockquote:rounded-r-lg
                            prose-blockquote:py-0.5 prose-blockquote:not-italic
                            prose-ul:text-white/75 prose-ol:text-white/75
                            prose-li:marker:text-accent
                            prose-img:rounded-xl prose-img:border prose-img:border-white/10
                            prose-hr:border-white/10
                        "
                        dangerouslySetInnerHTML={{ __html: renderedContent }}
                    />

                    {/* ✅ Bug 2 fix: author bio — guarded against null/undefined author */}
                    {hasAuthor && (
                        <div className="mt-12 p-6 bg-[#1e1e24] border border-white/8
                                        rounded-2xl backdrop-blur-sm">
                            <div className="flex items-start gap-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden
                                                flex-shrink-0 ring-2 ring-accent/30">
                                    <Image
                                        src={post.author.avatar || '/assets/avatar.jpg'}
                                        alt={post.author.name}
                                        fill sizes="64px" className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">
                                        About {post.author.name}
                                    </h3>
                                    {post.author.bio && (
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            {post.author.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Related posts */}
                    <RelatedPosts
                        currentSlug={post.slug}
                        category={post.category}
                        allPosts={allPosts}
                    />
                </div>
            </div>
        </div>
    );
};

export default BlogPostPage;