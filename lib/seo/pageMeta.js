// lib/seo/pageMeta.js
// ─────────────────────────────────────────────────────────────────────────────
// Centralised SEO metadata for every public page.
// Import and re-export the relevant object from each page's layout/metadata file.
// No changes to existing page.jsx files required — create a metadata.js sibling
// in each route directory and Next.js picks it up automatically.
// ─────────────────────────────────────────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aakashsharma.vercel.app';

// ── / (homepage) ──────────────────────────────────────────────────────────────
export const homeMetadata = {
    title: 'Aakash Sharma | Full-Stack Developer in Dubai, UAE — React, Next.js, Node.js',
    description:
        'Hi, I\'m Aakash Sharma — a full-stack software developer based in Dubai, UAE. ' +
        'I build web apps with React & Next.js, APIs with Node.js, and mobile apps with React Native. ' +
        'Currently open to software engineer and full-stack developer roles in Dubai, Abu Dhabi, and Sharjah.',
    alternates: { canonical: SITE_URL },
    openGraph: {
        title: 'Aakash Sharma | Full-Stack Developer in Dubai, UAE',
        description:
            'Full-stack developer (React · Next.js · Node.js · React Native) in Dubai. ' +
            'Open to full-time software engineer roles in UAE.',
        url: SITE_URL,
        type: 'website',
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
};

// ── /services ─────────────────────────────────────────────────────────────────
export const servicesMetadata = {
    title: 'Services | Web & Mobile Development in Dubai, UAE',
    description:
        'Software development services offered by Aakash Sharma in Dubai, UAE: ' +
        'React & Next.js frontends, Node.js backends, React Native mobile apps, ' +
        'Python scripting, REST API development, database design, and DevOps. ' +
        'Available for project-based and full-time work across UAE.',
    alternates: { canonical: `${SITE_URL}/services` },
    openGraph: {
        title: 'Services | Aakash Sharma — Developer in Dubai',
        description: 'Web, mobile, and API development services in Dubai, UAE.',
        url: `${SITE_URL}/services`,
        type: 'website',
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
};

// ── /resume ───────────────────────────────────────────────────────────────────
export const resumeMetadata = {
    title: 'Resume | Aakash Sharma — Software Developer Dubai, UAE',
    description:
        'Resume of Aakash Sharma — B.Tech Computer Science graduate with 3+ years of ' +
        'full-stack development experience. Skills: React, Next.js, Node.js, React Native, ' +
        'Python, MongoDB, MySQL, Docker. Based in Dubai, UAE. Available for immediate hire.',
    alternates: { canonical: `${SITE_URL}/resume` },
    openGraph: {
        title: 'Resume | Aakash Sharma — Software Developer',
        description:
            'Skills, experience, and education of Aakash Sharma — full-stack developer in Dubai, UAE.',
        url: `${SITE_URL}/resume`,
        type: 'profile',
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
};

// ── /work ─────────────────────────────────────────────────────────────────────
export const workMetadata = {
    title: 'Portfolio | Projects by Aakash Sharma — Dubai Developer',
    description:
        'Browse the project portfolio of Aakash Sharma, a full-stack developer based in Dubai, UAE. ' +
        'Projects include React web apps, Next.js platforms, Node.js APIs, React Native mobile apps, ' +
        'and Python tools. Each project demonstrates production-grade software engineering skills.',
    alternates: { canonical: `${SITE_URL}/work` },
    openGraph: {
        title: 'Portfolio | Aakash Sharma — Dubai Full-Stack Developer',
        description:
            'Production-grade web apps, mobile apps, and APIs built by Aakash Sharma in Dubai, UAE.',
        url: `${SITE_URL}/work`,
        type: 'website',
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
};

// ── /blog ─────────────────────────────────────────────────────────────────────
export const blogMetadata = {
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
};

// ── /contact ──────────────────────────────────────────────────────────────────
export const contactMetadata = {
    title: 'Contact | Hire Aakash Sharma — Software Developer in Dubai',
    description:
        'Get in touch with Aakash Sharma, a full-stack software developer based in Dubai, UAE. ' +
        'Available for software engineer roles, contract projects, and freelance work ' +
        'in Dubai, Abu Dhabi, Sharjah, and remotely. Response within 24 hours.',
    alternates: { canonical: `${SITE_URL}/contact` },
    openGraph: {
        title: 'Hire Aakash Sharma | Full-Stack Developer in Dubai, UAE',
        description:
            'Contact Aakash Sharma for software developer roles or project work in UAE.',
        url: `${SITE_URL}/contact`,
        type: 'website',
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
};