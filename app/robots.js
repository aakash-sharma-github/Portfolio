// app/robots.js — generates /robots.txt
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export default function robots() {
    return {
        rules: [
            // Allow all crawlers on public pages
            {
                userAgent: "*",
                allow: ["/"],
                disallow: [
                    "/x7k2-management-9qp/", // admin panel — never index
                    "/api/", // API routes — not useful to crawl
                    "/_next/", // Next.js internals
                ],
            },
            // Block AI training bots — protects content from being scraped
            { userAgent: "GPTBot", disallow: "/" },
            { userAgent: "ChatGPT-User", disallow: "/" },
            { userAgent: "CCBot", disallow: "/" },
            { userAgent: "anthropic-ai", disallow: "/" },
            { userAgent: "Google-Extended", disallow: "/" },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
