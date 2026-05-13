// app/api/blogs/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { uploadImage } from '@/lib/cloudinary';
import { verifyAuth } from '@/lib/authMiddleware';
import { generateCoverImageBase64 } from '@/lib/generateCoverImage';
import {
    getFromCache, setInCache, clearCacheByPattern,
    buildCacheKey, TTL,
} from '@/lib/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── GET /api/blogs ────────────────────────────────────────────────────────────
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    const rawLimit = parseInt(searchParams.get('limit') || '8', 10);

    const limit = Math.min(Math.max(rawLimit, 1), 100);
    const page = Math.max(rawPage, 1);

    // Search results are never cached — they're user-specific and highly variable
    const shouldCache = !search;
    const cacheKey = shouldCache
        ? buildCacheKey('blogs:list', { category: category || 'All', page, limit })
        : null;

    // ── Cache hit ─────────────────────────────────────────────────────────────
    if (cacheKey) {
        const cached = await getFromCache(cacheKey);
        if (cached) {
            return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT' } });
        }
    }

    // ── DB query ──────────────────────────────────────────────────────────────
    try {
        await connectToDatabase();

        const filter = {};
        if (category && category !== 'All') filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
            ];
        }

        const [total, blogs] = await Promise.all([
            Blog.countDocuments(filter),
            Blog.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('title slug excerpt category coverImage author readTime published tags createdAt')
                .lean(),
        ]);

        const totalPages = Math.ceil(total / limit) || 1;
        const currentPage = Math.min(page, totalPages);

        const result = {
            blogs,
            pagination: {
                total, page: currentPage, limit, pages: totalPages,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1,
            },
        };

        // ── Cache write ───────────────────────────────────────────────────────
        if (cacheKey) {
            await setInCache(cacheKey, result, TTL.BLOGS_LIST);
        }

        return NextResponse.json(result, { headers: { 'X-Cache': 'MISS' } });
    } catch (error) {
        console.error('[GET /api/blogs]', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

// ── POST /api/blogs ───────────────────────────────────────────────────────────
export async function POST(request) {
    const auth = verifyAuth(request);
    if (!auth.valid) return auth.response;

    try {
        await connectToDatabase();
        const data = await request.json();

        const missing = ['title', 'slug', 'content', 'category', 'excerpt'].filter(
            (f) => !data[f]?.toString().trim()
        );
        if (missing.length) {
            return NextResponse.json(
                { error: `Missing required fields: ${missing.join(', ')}` },
                { status: 400 }
            );
        }

        const duplicate = await Blog.findOne({ slug: data.slug }).lean();
        if (duplicate) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
        }

        // Cover image handling
        let coverImageData;
        const coverSrc = data.coverImage?.url || (typeof data.coverImage === 'string' ? data.coverImage : null);

        if (coverSrc?.startsWith('data:image') || coverSrc?.startsWith('https://')) {
            try {
                const result = await uploadImage(coverSrc, 'blog/covers');
                coverImageData = { url: result.secure_url, publicId: result.public_id, alt: data.title };
            } catch (err) {
                return NextResponse.json({ error: `Cover upload failed: ${err.message}` }, { status: 500 });
            }
        } else {
            try {
                const base64 = generateCoverImageBase64(
                    data.title, data.category, data.author?.name || 'Aakash Sharma'
                );
                const result = await uploadImage(base64, 'blog/covers/generated');
                coverImageData = { url: result.secure_url, publicId: result.public_id, alt: data.title };
            } catch {
                const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aakashsharma.com.np';
                coverImageData = {
                    url: `${base}/api/default-cover?title=${encodeURIComponent(data.title)}&category=${encodeURIComponent(data.category)}`,
                    publicId: 'generated-fallback',
                    alt: data.title,
                };
            }
        }

        const blog = await Blog.create({
            ...data,
            coverImage: coverImageData,
            author: data.author || {
                name: 'Aakash Sharma', avatar: '/assets/avatar.jpg',
                bio: 'Full-stack developer passionate about modern web technologies.',
            },
        });

        // Invalidate all blog list cache keys — new post changes every page
        await clearCacheByPattern('blogs:');

        return NextResponse.json(blog, { status: 201 });
    } catch (error) {
        console.error('[POST /api/blogs]', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}