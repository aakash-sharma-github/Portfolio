import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
    swSrc: 'app/sw.js',
    swDest: 'public/sw.js',
    disable: process.env.NODE_ENV === 'development',
    reloadOnOnline: false,
    exclude: [/\/api\//, /\/x7k2-management-9qp\//],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true,
    poweredByHeader: false,
    reactStrictMode: true,

    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
            { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/**' },
            { protocol: 'https', hostname: 'aakashsharma.vercel.app', pathname: '/**' },
            { protocol: 'https', hostname: 'www.aakashsharma.com.np', pathname: '/**' },
            { protocol: 'https', hostname: 'aakashsharma.com.np', pathname: '/**' },
            { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000,
    },

    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['react-icons', 'framer-motion', '@radix-ui/react-tooltip'],
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
                // Service worker must never be cached — browser needs to
                // detect updates immediately on every page load
                source: '/sw.js',
                headers: [
                    { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
                    { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
                ],
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
                    vendor: { test: /[\\/]node_modules[\\/]/, name: 'vendors', chunks: 'all', priority: 10 },
                    common: { name: 'common', minChunks: 2, chunks: 'all', priority: 5 },
                },
            };
        }
        return config;
    },
};

export default withSerwist(nextConfig);
