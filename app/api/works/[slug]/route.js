// app/api/works/[slug]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Work from '@/lib/models/Work';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { verifyAuth } from '@/lib/authMiddleware';
import { getFromCache, setInCache, clearCache, clearCacheByPattern, TTL } from '@/lib/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SAFE_IDS = ['default', 'external'];

// ── GET /api/works/:slug ──────────────────────────────────────────────────────
export async function GET(request, { params }) {
    const { slug } = await params;
    const cacheKey = `works:post:${slug}`;

    const cached = await getFromCache(cacheKey);
    if (cached) {
        return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT' } });
    }

    try {
        await connectToDatabase();
        const work = await Work.findOne({ slug }).lean();
        if (!work) return NextResponse.json({ error: 'Work not found' }, { status: 404 });

        await setInCache(cacheKey, work, TTL.WORKS_POST);
        return NextResponse.json(work, { headers: { 'X-Cache': 'MISS' } });
    } catch (error) {
        console.error('[GET /api/works/slug]', error);
        return NextResponse.json({ error: 'Failed to fetch work' }, { status: 500 });
    }
}

// ── PUT /api/works/:slug ──────────────────────────────────────────────────────
export async function PUT(request, { params }) {
    const auth = verifyAuth(request);
    if (!auth.valid) return auth.response;

    try {
        await connectToDatabase();
        const { slug } = await params;

        const existingWork = await Work.findOne({ slug });
        if (!existingWork) return NextResponse.json({ error: 'Work not found' }, { status: 404 });

        const data = await request.json();

        // Cover image
        let coverImageData = existingWork.coverImage;

        if (data.coverImage) {
            const src = data.coverImage?.url || (typeof data.coverImage === 'string' ? data.coverImage : null);
            if (src?.startsWith('data:image')) {
                try {
                    const result = await uploadImage(src, 'works/covers');
                    const oldId = existingWork.coverImage?.publicId;
                    if (oldId && !SAFE_IDS.includes(oldId)) {
                        try { await deleteImage(oldId); } catch { /* non-fatal */ }
                    }
                    coverImageData = { url: result.secure_url, publicId: result.public_id, alt: data.title || existingWork.title };
                } catch (err) {
                    console.error('[PUT /api/works/slug] cover upload failed:', err.message);
                }
            } else if (src?.startsWith('http')) {
                coverImageData = {
                    url: src,
                    publicId: data.coverImage?.publicId || existingWork.coverImage?.publicId || 'external',
                    alt: data.title || existingWork.title,
                };
            }
        }

        // Additional images
        let imagesData = Array.isArray(existingWork.images) ? existingWork.images : [];
        if (Array.isArray(data.images)) {
            imagesData = [];
            for (const img of data.images) {
                const src = typeof img === 'string' ? img : img?.url;
                if (src?.startsWith('data:image')) {
                    try {
                        const result = await uploadImage(src, 'works/images');
                        imagesData.push({ url: result.secure_url, publicId: result.public_id, caption: img?.caption || '' });
                    } catch { /* skip failed */ }
                } else if (src?.startsWith('http')) {
                    imagesData.push({ url: src, publicId: img?.publicId || 'external', caption: img?.caption || '' });
                }
            }
            // Clean up removed images from Cloudinary
            for (const old of (existingWork.images || [])) {
                const still = imagesData.some(i => i.publicId === old.publicId);
                if (!still && old.publicId && !SAFE_IDS.includes(old.publicId)) {
                    try { await deleteImage(old.publicId); } catch { /* non-fatal */ }
                }
            }
        }

        // Technologies normalisation
        const technologies = (data.technologies || existingWork.technologies || [])
            .map(t => typeof t === 'string' ? { name: t.trim() } : { name: String(t?.name || t).trim() })
            .filter(t => t.name);

        const { slug: _s, _id, createdAt, ...safeData } = data;
        const updatedWork = await Work.findOneAndUpdate(
            { slug },
            { ...safeData, technologies, coverImage: coverImageData, images: imagesData, slug: existingWork.slug },
            { new: true, runValidators: true }
        );

        // Precise invalidation: this post + all list pages
        await Promise.all([
            clearCache(`works:post:${slug}`),
            clearCacheByPattern('works:list:'),
        ]);

        return NextResponse.json(updatedWork);
    } catch (error) {
        console.error('[PUT /api/works/slug]', error);
        return NextResponse.json({ error: 'Failed to update work', details: error.message }, { status: 500 });
    }
}

// ── DELETE /api/works/:slug ───────────────────────────────────────────────────
export async function DELETE(request, { params }) {
    const auth = verifyAuth(request);
    if (!auth.valid) return auth.response;

    try {
        await connectToDatabase();
        const { slug } = await params;

        const work = await Work.findOne({ slug });
        if (!work) return NextResponse.json({ error: 'Work not found' }, { status: 404 });

        // Cloudinary cleanup
        const coverId = work.coverImage?.publicId;
        if (coverId && !SAFE_IDS.includes(coverId)) {
            try { await deleteImage(coverId); } catch { /* non-fatal */ }
        }
        for (const img of (work.images || [])) {
            if (img.publicId && !SAFE_IDS.includes(img.publicId)) {
                try { await deleteImage(img.publicId); } catch { /* non-fatal */ }
            }
        }

        await Work.findOneAndDelete({ slug });

        // Wipe all works-related cache
        await clearCacheByPattern('works:');

        return NextResponse.json({ message: 'Work deleted successfully' });
    } catch (error) {
        console.error('[DELETE /api/works/slug]', error);
        return NextResponse.json({ error: 'Failed to delete work', details: error.message }, { status: 500 });
    }
}