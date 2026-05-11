// app/sitemap.js — generates /sitemap.xml
// Priority strategy for UAE job search SEO:
//   / and /resume get highest priority — most relevant to recruiters
//   /work and /services get high priority — show capabilities
//   /blog and /contact get medium priority — supporting content
//   Individual blog posts get 0.6 — good for long-tail keyword traffic

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const API_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const revalidate = 3600; // regenerate hourly

const staticPages = [
    // Resume and homepage are most important for recruiter discovery
    { url: '/', priority: 1.0, changeFrequency: 'monthly' },
    { url: '/resume', priority: 0.95, changeFrequency: 'monthly' },
    { url: '/work', priority: 0.90, changeFrequency: 'weekly' },
    { url: '/services', priority: 0.85, changeFrequency: 'monthly' },
    { url: '/blog', priority: 0.80, changeFrequency: 'daily' },
    { url: '/contact', priority: 0.75, changeFrequency: 'monthly' },
];

export default async function sitemap() {
    const now = new Date();

    const staticEntries = staticPages.map(({ url, priority, changeFrequency }) => ({
        url: `${SITE_URL}${url}`,
        lastModified: now,
        changeFrequency,
        priority,
    }));

    // Blog posts — individual articles drive long-tail traffic
    // e.g. "Next.js tutorial Dubai developer" → blog post → portfolio discovery
    let blogEntries = [];
    try {
        const res = await fetch(`${API_URL}/api/blogs?limit=500&published=true`, {
            next: { revalidate: 3600 },
        });
        if (res.ok) {
            const data = await res.json();
            blogEntries = (data.blogs || []).map((post) => ({
                url: `${SITE_URL}/blog/${post.slug}`,
                lastModified: new Date(post.updatedAt || post.createdAt || now),
                changeFrequency: 'weekly',
                priority: 0.65,
            }));
        }
    } catch (err) {
        console.error('[sitemap] blogs fetch failed:', err.message);
    }

    // Work/project pages — showing up for "React developer Dubai portfolio" searches
    let workEntries = [];
    try {
        const res = await fetch(`${API_URL}/api/works?limit=100`, {
            next: { revalidate: 3600 },
        });
        if (res.ok) {
            const data = await res.json();
            workEntries = (data.works || []).map((work) => ({
                url: `${SITE_URL}/work#${work.slug}`,
                lastModified: new Date(work.updatedAt || work.createdAt || now),
                changeFrequency: 'monthly',
                priority: 0.55,
            }));
        }
    } catch (err) {
        console.error('[sitemap] works fetch failed:', err.message);
    }

    return [...staticEntries, ...blogEntries, ...workEntries];
}