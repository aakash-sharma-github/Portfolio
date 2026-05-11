// app/work/metadata.js
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
    title: 'Portfolio | Projects by Aakash Sharma — Dubai Developer',
    description:
        'Browse the project portfolio of Aakash Sharma, a full-stack developer based in Dubai, UAE. ' +
        'Projects include React web apps, Next.js platforms, Node.js APIs, React Native mobile apps, ' +
        'and Python tools. Each project demonstrates production-grade software engineering.',
    alternates: { canonical: `${SITE_URL}/work` },
    openGraph: {
        title: 'Portfolio | Aakash Sharma — Dubai Full-Stack Developer',
        description: 'Production-grade web apps, mobile apps, and APIs built by Aakash Sharma in Dubai, UAE.',
        url: `${SITE_URL}/work`,
        type: 'website',
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Portfolio | Aakash Sharma — Dubai Developer',
        description: 'React, Next.js, Node.js, and React Native projects by Aakash Sharma.',
        images: [`${SITE_URL}/og-image.png`],
    },
};