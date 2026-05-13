// app/api/works/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Work from '@/lib/models/Work';
import { uploadImage } from '@/lib/cloudinary';
import { verifyAuth } from '@/lib/authMiddleware';
import { getFromCache, setInCache, clearCacheByPattern, buildCacheKey, TTL } from '@/lib/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── GET /api/works ────────────────────────────────────────────────────────────
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const featured = searchParams.get('featured') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);

    const cacheKey = buildCacheKey('works:list', {
        category: category || 'All',
        status: status || 'all',
        featured: featured || 'all',
        page,
        limit,
    });

    const cached = await getFromCache(cacheKey);
    if (cached) {
        return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT' } });
    }

    try {
        await connectToDatabase();

        const filter = {};
        if (category && category !== 'All') filter.category = category;
        if (status) filter.status = status;
        if (featured !== '') filter.featured = featured === 'true';

        const total = await Work.countDocuments(filter);
        const totalPages = Math.ceil(total / limit) || 1;
        const currentPage = Math.min(page, totalPages);

        const works = await Work.find(filter)
            .sort({ featured: -1, createdAt: -1 })
            .skip((currentPage - 1) * limit)
            .limit(limit)
            .select('title slug description category technologies stack coverImage links featured status createdAt client role')
            .lean();

        const result = {
            works,
            pagination: {
                total, page: currentPage, limit,
                pages: totalPages,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1,
            },
        };

        await setInCache(cacheKey, result, TTL.WORKS_LIST);
        return NextResponse.json(result, { headers: { 'X-Cache': 'MISS' } });
    } catch (error) {
        console.error('[GET /api/works]', error);
        return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 });
    }
}

// ── POST /api/works ───────────────────────────────────────────────────────────
export async function POST(request) {
    const auth = verifyAuth(request);
    if (!auth.valid) return auth.response;

    try {
        await connectToDatabase();
        const data = await request.json();

        const missing = ['title', 'slug', 'description'].filter(f => !data[f]?.toString().trim());
        if (missing.length) {
            return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
        }

        const existing = await Work.findOne({ slug: data.slug }).lean();
        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
        }

        let coverImageData = { url: '/images/portfolio_01.png', publicId: 'default', alt: data.title };
        const coverSrc = data.coverImage?.url || (typeof data.coverImage === 'string' ? data.coverImage : null);

        if (coverSrc?.startsWith('data:image')) {
            try {
                const result = await uploadImage(coverSrc, 'works/covers');
                coverImageData = { url: result.secure_url, publicId: result.public_id, alt: data.title };
            } catch (err) {
                console.error('[POST /api/works] cover upload failed:', err.message);
            }
        } else if (coverSrc?.startsWith('http')) {
            coverImageData = { url: coverSrc, publicId: data.coverImage?.publicId || 'external', alt: data.title };
        }

        const technologies = (data.technologies || [])
            .map(t => typeof t === 'string' ? { name: t.trim() } : { name: String(t?.name || t).trim() })
            .filter(t => t.name);

        const work = await Work.create({
            ...data,
            technologies,
            coverImage: coverImageData,
            content: data.content || '',
        });

        // Invalidate all works cache keys
        await clearCacheByPattern('works:');

        return NextResponse.json(work, { status: 201 });
    } catch (error) {
        console.error('[POST /api/works]', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create work', details: error.message }, { status: 500 });
    }
}