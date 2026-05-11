// components/SeoStructuredData.jsx
// Drop this into any page to inject page-specific JSON-LD structured data.
// Does not render any visible HTML — purely for search engine consumption.
// Usage: <SeoStructuredData type="resume" /> or <SeoStructuredData type="services" />

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

const schemas = {
    // ── Resume / About page schema ────────────────────────────────────────────
    // Google's "Seek Job" feature and LinkedIn look for this.
    resume: [
        {
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: 'Aakash Sharma',
            jobTitle: 'Full-Stack Software Developer',
            url: SITE_URL,
            image: `${SITE_URL}/assets/avatar.png`,
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Dubai',
                addressCountry: 'AE',
            },
            hasCredential: [
                {
                    '@type': 'EducationalOccupationalCredential',
                    name: 'Bachelor of Technology — Computer Science and Engineering',
                    credentialCategory: 'degree',
                    recognizedBy: {
                        '@type': 'EducationalOrganization',
                        name: 'Parul University, Gujarat, India',
                    },
                    dateCreated: '2024',
                },
            ],
            hasOccupation: {
                '@type': 'Occupation',
                name: 'Full-Stack Software Developer',
                occupationLocation: [
                    { '@type': 'City', name: 'Dubai', containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' } },
                    { '@type': 'City', name: 'Abu Dhabi' },
                    { '@type': 'City', name: 'Sharjah' },
                ],
                estimatedSalary: {
                    '@type': 'MonetaryAmountDistribution',
                    name: 'Software Developer Salary UAE',
                    currency: 'AED',
                    duration: 'P1Y',
                    percentile10: 60000,
                    median: 120000,
                    percentile90: 200000,
                },
                skills: 'React, Next.js, Node.js, React Native, Python, MongoDB, MySQL, Docker, REST API, GraphQL, TypeScript, JavaScript',
                qualifications: 'Bachelor of Technology in Computer Science',
                responsibilities: 'Full-stack web development, mobile app development, API design, database architecture, DevOps',
                experienceRequirements: '3+ years',
            },
        },
        // BreadcrumbList for resume page
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Resume', item: `${SITE_URL}/resume` },
            ],
        },
    ],

    // ── Services page schema ──────────────────────────────────────────────────
    services: [
        {
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            '@id': `${SITE_URL}/#services`,
            name: 'Aakash Sharma — Software Development Services',
            url: `${SITE_URL}/services`,
            description:
                'Full-stack web development, mobile app development, REST API design, ' +
                'and custom software solutions by Aakash Sharma in Dubai, UAE.',
            provider: { '@id': `${SITE_URL}/#person` },
            areaServed: [
                { '@type': 'City', name: 'Dubai' },
                { '@type': 'City', name: 'Abu Dhabi' },
                { '@type': 'City', name: 'Sharjah' },
                { '@type': 'Country', name: 'United Arab Emirates' },
                { '@type': 'Country', name: 'Worldwide (Remote)' },
            ],
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Software Development Services',
                itemListElement: [
                    {
                        '@type': 'Offer',
                        itemOffered: {
                            '@type': 'Service',
                            name: 'Frontend Development',
                            description: 'React.js, Next.js, TypeScript, Tailwind CSS — responsive, accessible web applications.',
                        },
                    },
                    {
                        '@type': 'Offer',
                        itemOffered: {
                            '@type': 'Service',
                            name: 'Backend Development',
                            description: 'Node.js, Express.js, REST APIs, GraphQL, microservices architecture.',
                        },
                    },
                    {
                        '@type': 'Offer',
                        itemOffered: {
                            '@type': 'Service',
                            name: 'Mobile App Development',
                            description: 'React Native cross-platform apps for iOS and Android.',
                        },
                    },
                    {
                        '@type': 'Offer',
                        itemOffered: {
                            '@type': 'Service',
                            name: 'Full-Stack Development',
                            description: 'End-to-end web application development from database to UI.',
                        },
                    },
                    {
                        '@type': 'Offer',
                        itemOffered: {
                            '@type': 'Service',
                            name: 'Python Development',
                            description: 'Python scripting, automation, Django, and data processing.',
                        },
                    },
                ],
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
            ],
        },
    ],

    // ── Work / Portfolio page schema ──────────────────────────────────────────
    work: [
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${SITE_URL}/#portfolio`,
            name: 'Software Development Portfolio — Aakash Sharma',
            description: 'Collection of web and mobile applications built by Aakash Sharma.',
            url: `${SITE_URL}/work`,
            numberOfItems: 8,
            itemListOrder: 'https://schema.org/ItemListOrderDescending',
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${SITE_URL}/work` },
            ],
        },
    ],

    // ── Blog page schema ──────────────────────────────────────────────────────
    blog: [
        {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': `${SITE_URL}/#blog`,
            name: 'Tech Articles by Aakash Sharma',
            description:
                'Software engineering articles and tutorials on React, Next.js, Node.js, ' +
                'system design, and cloud computing by Aakash Sharma.',
            url: `${SITE_URL}/blog`,
            author: { '@id': `${SITE_URL}/#person` },
            inLanguage: 'en',
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
            ],
        },
    ],

    // ── Contact page schema ───────────────────────────────────────────────────
    contact: [
        {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            '@id': `${SITE_URL}/#contact`,
            name: 'Contact Aakash Sharma — Software Developer in Dubai',
            description:
                'Contact Aakash Sharma for software developer roles, freelance projects, ' +
                'or contract work in UAE.',
            url: `${SITE_URL}/contact`,
            mainEntity: { '@id': `${SITE_URL}/#person` },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE_URL}/contact` },
            ],
        },
    ],
};

// ── Component ─────────────────────────────────────────────────────────────────
const SeoStructuredData = ({ type }) => {
    const pageSchemas = schemas[type];
    if (!pageSchemas) return null;

    return (
        <>
            {pageSchemas.map((schema, i) => (
                <script
                    key={`${type}-schema-${i}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </>
    );
};

export default SeoStructuredData;