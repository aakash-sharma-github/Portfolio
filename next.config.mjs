/** @type {import('next').NextConfig} */
const nextConfig = {
    // Performance optimizations
    compress: true,
    poweredByHeader: false,
    reactStrictMode: true,
    swcMinify: true,

    // Image optimizations
    images: {
        domains: ['res.cloudinary.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
        ],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000, // 1 year
    },

    // Experimental features for performance
    experimental: {
        optimizeCss: true,
        optimizePackageImports: [
            'react-icons',
            'framer-motion',
            '@radix-ui/react-tooltip',
        ],
    },

    // Webpack optimizations
    webpack: (config, { dev }) => {
        if (!dev) {
            config.optimization.splitChunks = {
                ...config.optimization.splitChunks,
                cacheGroups: {
                    ...config.optimization.splitChunks.cacheGroups,
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: 10,
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 5,
                    },
                },
            };
        }

        return config;
    },

    async headers() {
        return [
            // FIX: Add security headers to all routes
            {
                source: '/(.*)',
                headers: [
                    // Prevent MIME type sniffing
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    // Prevent clickjacking
                    { key: 'X-Frame-Options', value: 'DENY' },
                    // Enable browser XSS protection
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    // Control referrer information
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    // Restrict browser features
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    // HSTS — force HTTPS (only enable if you have SSL)
                    // Uncomment after ensuring HTTPS is set up:
                    // { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
                    // Content Security Policy
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for Next.js dev; tighten in prod
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: blob: https://res.cloudinary.com https://avatars.githubusercontent.com",
                            "connect-src 'self' https://api.github.com https://res.cloudinary.com",
                            "frame-ancestors 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                        ].join('; '),
                    },
                ],
            },
            // Static asset caching
            {
                source: '/assets/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/_next/static/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            // FIX: Do NOT cache API responses
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
                ],
            },
        ];
    },
};

export default nextConfig;