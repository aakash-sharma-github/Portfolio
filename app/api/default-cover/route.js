// app/api/default-cover/route.js
// Serves a Design-B generated cover image as a PNG stream.
// Used by next/image for previews. The real persisted URL should always
// be a Cloudinary URL — this route is a fallback / preview endpoint.
import { NextResponse } from 'next/server';
import { generateCoverImage } from '@/lib/generateCoverImage';

export const runtime = 'nodejs';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const title = (searchParams.get('title') || 'Blog Post').slice(0, 120);
    const category = (searchParams.get('category') || 'Development').slice(0, 60);
    const author = (searchParams.get('author') || 'Aakash Sharma').slice(0, 60);

    try {
        const buffer = generateCoverImage(title, category, author);

        // Cache key based on inputs — same title+category always gives same image
        const cacheKey = Buffer.from(`${title}:${category}`).toString('base64').replace(/[/+=]/g, '');

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                // Cache for 7 days on CDN, 1 day in browser
                'Cache-Control': 'public, s-maxage=604800, max-age=86400, stale-while-revalidate=3600',
                'ETag': `"${cacheKey}"`,
                'Vary': 'Accept-Encoding',
            },
        });
    } catch (err) {
        console.error('[default-cover] generation failed:', err.message);

        // Minimal fallback — solid accent rectangle
        try {
            const { createCanvas } = await import('canvas');
            const canvas = createCanvas(1200, 630);
            const ctx = canvas.getContext('2d');
            const g = ctx.createLinearGradient(0, 0, 0, 630);
            g.addColorStop(0, '#0d1f3d');
            g.addColorStop(1, '#070e1f');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 1200, 630);
            ctx.font = 'bold 52px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((title || 'Blog Post').slice(0, 40), 600, 315);
            return new NextResponse(canvas.toBuffer('image/png'), {
                status: 200,
                headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
            });
        } catch {
            return new NextResponse(null, { status: 500 });
        }
    }
}