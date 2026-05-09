// app/api/works/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Work from '@/lib/models/Work';
import { uploadImage } from '@/lib/cloudinary';
import { verifyAuth } from '@/lib/authMiddleware';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── GET /api/works  (public) ──────────────────────────────────────────────────
export async function GET(request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status');
        const featured = searchParams.get('featured');
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
        const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);

        const filter = {};
        if (category && category !== 'All') filter.category = category;
        if (status) filter.status = status;
        if (featured !== null && featured !== undefined && featured !== '') {
            filter.featured = featured === 'true';
        }

        const total = await Work.countDocuments(filter);
        const totalPages = Math.ceil(total / limit) || 1;
        const currentPage = Math.min(page, totalPages);

        const works = await Work.find(filter)
            .sort({ featured: -1, createdAt: -1 })
            .skip((currentPage - 1) * limit)
            .limit(limit)
            .select('title slug description category technologies stack coverImage links featured status createdAt client role')
            .lean();

        return NextResponse.json({
            works,
            pagination: {
                total, page: currentPage, limit,
                pages: totalPages,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1,
            },
        });
    } catch (error) {
        console.error('[GET /api/works]', error);
        return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 });
    }
}

// ── POST /api/works  (protected) ──────────────────────────────────────────────
export async function POST(request) {
    const auth = verifyAuth(request);
    if (!auth.valid) return auth.response;

    try {
        await connectToDatabase();
        const data = await request.json();

        // ✅ content is no longer required — removed from validation
        const missing = ['title', 'slug', 'description'].filter(
            (f) => !data[f]?.toString().trim()
        );
        if (missing.length) {
            return NextResponse.json(
                { error: `Missing required fields: ${missing.join(', ')}` },
                { status: 400 }
            );
        }

        const existing = await Work.findOne({ slug: data.slug }).lean();
        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
        }

        // ── Cover image ──────────────────────────────────────────────────────
        // ✅ Always produce a valid { url, publicId } object so the schema
        //    validation for coverImage.url never fires.
        let coverImageData = {
            url: '/images/portfolio_01.png',
            publicId: 'default',
            alt: data.title || 'Project cover',
        };

        if (data.coverImage) {
            const src = typeof data.coverImage === 'string'
                ? data.coverImage
                : data.coverImage?.url;

            if (src?.startsWith('data:image')) {
                // Base64 from the file picker — upload to Cloudinary
                try {
                    const result = await uploadImage(src, 'works/covers');
                    coverImageData = {
                        url: result.secure_url,
                        publicId: result.public_id,
                        alt: data.title,
                    };
                } catch (err) {
                    console.error('[POST /api/works] cover upload failed:', err.message);
                    // Fall through — keep the default placeholder
                }
            } else if (src?.startsWith('http')) {
                // Already a URL (existing image or external link)
                coverImageData = {
                    url: src,
                    publicId: data.coverImage?.publicId || 'external',
                    alt: data.title,
                };
            }
        }

        // ── Additional images ────────────────────────────────────────────────
        const imagesData = [];
        if (Array.isArray(data.images)) {
            for (const img of data.images) {
                const src = typeof img === 'string' ? img : img?.url;
                if (src?.startsWith('data:image')) {
                    try {
                        const r = await uploadImage(src, 'works/images');
                        imagesData.push({ url: r.secure_url, publicId: r.public_id, caption: img?.caption || '' });
                    } catch { /* skip failed images */ }
                } else if (src?.startsWith('http')) {
                    imagesData.push({ url: src, publicId: img?.publicId || 'external', caption: img?.caption || '' });
                }
            }
        }

        // ── Technologies ─────────────────────────────────────────────────────
        const technologies = (data.technologies || []).map((t) =>
            typeof t === 'string' ? { name: t.trim() } : { name: String(t?.name || t).trim() }
        ).filter((t) => t.name);

        const work = await Work.create({
            title: data.title.trim(),
            slug: data.slug.trim().toLowerCase(),
            description: data.description.trim(),
            content: data.content || '',   // optional — empty string is fine
            category: data.category || 'Web Development',
            technologies,
            status: data.status || 'completed',
            featured: Boolean(data.featured),
            links: {
                live: data.links?.live || '',
                github: data.links?.github || '',
            },
            client: data.client || '',
            role: data.role || '',
            coverImage: coverImageData,
            images: imagesData,
        });

        return NextResponse.json(work, { status: 201 });
    } catch (error) {
        console.error('[POST /api/works]', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { error: error.message, details: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to create work', details: error.message },
            { status: 500 }
        );
    }
}