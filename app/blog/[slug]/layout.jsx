// app/blog/[slug]/layout.jsx
// Server component — generates per-post metadata and JSON-LD.
// The actual page.jsx stays as "use client" for interactivity.
// Next.js merges metadata from both layout and page automatically.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const API_URL = process.env.NEXT_PUBLIC_SITE_URL;

async function fetchPost(slug) {
    try {
        const res = await fetch(`${API_URL}/api/blogs/${slug}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await fetchPost(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
            description: 'The blog post you are looking for does not exist.',
            robots: { index: false },
        };
    }

    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt || '';
    const imageUrl = post.coverImage?.url || `${SITE_URL}/og-image.png`;
    const canonical = `${SITE_URL}/blog/${slug}`;
    const tags = post.tags || [];
    const category = post.category || '';

    return {
        title,
        description,
        keywords: [
            ...tags,
            category,
            'Aakash Sharma',
            'Dubai developer',
            'software engineering',
            'web development',
        ].filter(Boolean),
        authors: [{ name: post.author?.name || 'Aakash Sharma', url: SITE_URL }],
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            type: 'article',
            publishedTime: post.createdAt,
            modifiedTime: post.updatedAt || post.createdAt,
            authors: [post.author?.name || 'Aakash Sharma'],
            tags: [...tags, category].filter(Boolean),
            section: category,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
            creator: '@aakashsharma',
        },
        robots: {
            index: Boolean(post.published !== false),
            follow: true,
            googleBot: {
                index: Boolean(post.published !== false),
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

// BlogPosting JSON-LD structured data
// Google uses this for rich snippets in search — shows article title,
// author, date, and image directly in search results.
async function BlogPostingSchema({ slug }) {
    const post = await fetchPost(slug);
    if (!post) return null;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${SITE_URL}/blog/${slug}#article`,
        headline: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt || '',
        image: {
            '@type': 'ImageObject',
            url: post.coverImage?.url || `${SITE_URL}/og-image.png`,
            width: 1200,
            height: 630,
        },
        author: {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: post.author?.name || 'Aakash Sharma',
            url: SITE_URL,
        },
        publisher: {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: 'Aakash Sharma',
            url: SITE_URL,
            image: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/assets/avatar.png`,
            },
        },
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/blog/${slug}`,
        },
        url: `${SITE_URL}/blog/${slug}`,
        keywords: [...(post.tags || []), post.category].filter(Boolean).join(', '),
        articleSection: post.category || 'Technology',
        inLanguage: 'en',
        // timeRequired in ISO 8601 duration — "5 min read" → PT5M
        timeRequired: post.readTime
            ? `PT${parseInt(post.readTime) || 5}M`
            : 'PT5M',
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
                { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
            ],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Layout wraps the page — injects structured data into <head> area
export default async function BlogPostLayout({ children, params }) {
    const { slug } = await params;
    return (
        <>
            <BlogPostingSchema slug={slug} />
            {children}
        </>
    );
}