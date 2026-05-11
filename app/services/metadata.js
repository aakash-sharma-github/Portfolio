// app/services/metadata.js
// Drop this file into app/services/ — Next.js exports metadata from it automatically.
// Zero changes to app/services/page.jsx required.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
    title: 'Services | Web & Mobile Development in Dubai, UAE',
    description:
        'Software development services by Aakash Sharma in Dubai, UAE: ' +
        'React & Next.js frontends, Node.js backends, React Native mobile apps, ' +
        'Python scripting, REST API development, and DevOps. ' +
        'Available for project-based and full-time work across UAE.',
    alternates: { canonical: `${SITE_URL}/services` },
    openGraph: {
        title: 'Services | Aakash Sharma — Developer in Dubai',
        description: 'Web, mobile, and API development services in Dubai, UAE.',
        url: `${SITE_URL}/services`,
        type: 'website',
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Services | Aakash Sharma — Developer in Dubai',
        description: 'Web, mobile, and API development services in Dubai, UAE.',
        images: [`${SITE_URL}/og-image.png`],
    },
};