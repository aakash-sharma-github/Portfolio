// app/resume/metadata.js
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aakashsharma.vercel.app';

export const metadata = {
    title: 'Resume | Aakash Sharma — Software Developer Dubai, UAE',
    description:
        'Resume of Aakash Sharma — B.Tech Computer Science graduate with 3+ years of ' +
        'full-stack development experience. Skills: React, Next.js, Node.js, React Native, ' +
        'Python, MongoDB, MySQL, Docker. Based in Dubai, UAE. Available for immediate hire.',
    alternates: { canonical: `${SITE_URL}/resume` },
    openGraph: {
        title: 'Resume | Aakash Sharma — Software Developer in Dubai',
        description: 'Skills, experience, and education of Aakash Sharma — full-stack developer in Dubai, UAE.',
        url: `${SITE_URL}/resume`,
        type: 'profile',
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Resume | Aakash Sharma — Software Developer in Dubai',
        description: 'B.Tech CS graduate, 3+ years full-stack experience. React, Node.js, Python. Dubai, UAE.',
        images: [`${SITE_URL}/og-image.png`],
    },
};