// app/blog/metadata.js
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
    title: 'Blog | Tech Articles by Aakash Sharma — Dubai Developer',
    description:
        'Technical articles and tutorials by Aakash Sharma, a software developer in Dubai, UAE. ' +
        'Topics include React, Next.js, Node.js, system design, cloud computing, AI, ' +
        'and software engineering best practices.',
    alternates: { canonical: `${SITE_URL}/blog` },
    openGraph: {
        title: 'Blog | Aakash Sharma — Software Developer in Dubai',
        description: 'Tech articles on React, Next.js, Node.js, and software engineering by Aakash Sharma.',
        url: `${SITE_URL}/blog`,
        type: 'website',
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog | Aakash Sharma — Software Developer in Dubai',
        description: 'Tech articles on React, Next.js, Node.js, and engineering by Aakash Sharma.',
        images: [`${SITE_URL}/og-image.png`],
    },
};