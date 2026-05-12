/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true,
    poweredByHeader: false,
    reactStrictMode: true,
    // swcMinify removed — it is on by default in Next.js 13+ and the option is deprecated

    images: {
        remotePatterns: [
            // Cloudinary — production images
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            // ✅ Fix bug 3: allow localhost so next/image can render the default-cover
            // fallback during development without throwing "hostname not configured".
            // This pattern is only reachable in local dev (localhost is never public).
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'aakashsharma.vercel.app',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.aakashsharma.com.np',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'aakashsharma.com.np',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000,
    },

    // Experimental features are opt-in and may change or be removed in future releases. Use with caution.
    experimental: {
        optimizeCss: true,
        optimizePackageImports: [
            'react-icons',
            'framer-motion',
            '@radix-ui/react-tooltip',
        ],
    },

    async headers() {
        return [
            {
                source: '/assets/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/_next/static/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/api/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                ],
            },
        ];
    },

    webpack(config, { dev }) {
        if (!dev) {
            config.optimization.splitChunks = {
                ...config.optimization.splitChunks,
                cacheGroups: {
                    ...config.optimization.splitChunks?.cacheGroups,
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
};

export default nextConfig;