// app/contact/metadata.js
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aakashsharma.vercel.app';

export const metadata = {
    title: 'Contact | Hire Aakash Sharma — Software Developer in Dubai',
    description:
        'Get in touch with Aakash Sharma, a full-stack software developer based in Dubai, UAE. ' +
        'Available for software engineer roles, contract projects, and freelance work ' +
        'in Dubai, Abu Dhabi, Sharjah, and remotely. Response within 24 hours.',
    alternates: { canonical: `${SITE_URL}/contact` },
    openGraph: {
        title: 'Hire Aakash Sharma | Full-Stack Developer in Dubai, UAE',
        description: 'Contact Aakash Sharma for software developer roles or project work in UAE.',
        url: `${SITE_URL}/contact`,
        type: 'website',
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Hire Aakash Sharma | Full-Stack Developer in Dubai',
        description: 'Available for full-time and freelance software developer roles in UAE.',
        images: [`${SITE_URL}/og-image.png`],
    },
};