// app/api/blogs/[slug]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { verifyAuth } from '@/lib/authMiddleware';
import { generateCoverImageBase64 } from '@/lib/generateCoverImage';
import { getFromCache, setInCache, clearCache, clearCacheByPattern, TTL } from '@/lib/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── GET /api/blogs/:slug ──────────────────────────────────────────────────────
export async function GET(request, { params }) {
    const { slug } = await params;
    const cacheKey = `blogs:post:${slug}`;

    const cached = await getFromCache(cacheKey);
    if (cached) {
        return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT' } });
    }

    try {
        await connectToDatabase();
        const blog = await Blog.findOne({ slug }).lean();
        if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

        await setInCache(cacheKey, blog, TTL.BLOGS_POST);
        return NextResponse.json(blog, { headers: { 'X-Cache': 'MISS' } });
    } catch (error) {
        console.error('[GET /api/blogs/slug]', error);
        return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
    }
}

// ── PUT /api/blogs/:slug ──────────────────────────────────────────────────────
export async function PUT(request, { params }) {
    const auth = verifyAuth(request);
    if (!auth.valid) return auth.response;

    try {
        await connectToDatabase();
        const { slug } = await params;

        const existingBlog = await Blog.findOne({ slug });
        if (!existingBlog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

        const data = await request.json();

        // Cover image — same 3-branch logic as before
        let coverImageData = existingBlog.coverImage;
        const SAFE_IDS = ['default', 'external', 'generated-fallback'];

        if (data.coverImage === null || data.coverImage === undefined) {
            try {
                const base64 = generateCoverImageBase64(
                    data.title || existingBlog.title,
                    data.category || existingBlog.category,
                    data.author?.name || existingBlog.author?.name || 'Aakash Sharma',
                );
                const result = await uploadImage(base64, 'blog/covers/generated');
                const oldId = existingBlog.coverImage?.publicId;
                if (oldId && !SAFE_IDS.includes(oldId)) {
                    try { await deleteImage(oldId); } catch { /* non-fatal */ }
                }
                coverImageData = { url: result.secure_url, publicId: result.public_id, alt: data.title || existingBlog.title };
            } catch (err) {
                console.error('[PUT] cover generation failed:', err.message);
            }
        } else if (data.coverImage && typeof data.coverImage === 'object') {
            const src = data.coverImage.url || '';
            if (src.startsWith('data:image')) {
                try {
                    const result = await uploadImage(src, 'blog/covers');
                    const oldId = existingBlog.coverImage?.publicId;
                    if (oldId && !SAFE_IDS.includes(oldId)) {
                        try { await deleteImage(oldId); } catch { /* non-fatal */ }
                    }
                    coverImageData = { url: result.secure_url, publicId: result.public_id, alt: data.title || existingBlog.title };
                } catch (err) {
                    console.error('[PUT] cover upload failed:', err.message);
                }
            } else if (src.startsWith('http')) {
                coverImageData = {
                    url: src,
                    publicId: data.coverImage.publicId || existingBlog.coverImage?.publicId || 'external',
                    alt: data.coverImage.alt || data.title || existingBlog.title,
                };
            }
        }

        const { slug: _s, _id, createdAt, ...safeData } = data;
        const updatedBlog = await Blog.findOneAndUpdate(
            { slug },
            { ...safeData, coverImage: coverImageData, slug: existingBlog.slug },
            { new: true, runValidators: true }
        );

        // Precise invalidation: this post + all list pages
        await Promise.all([
            clearCache(`blogs:post:${slug}`),
            clearCacheByPattern('blogs:list:'),
        ]);

        return NextResponse.json(updatedBlog);
    } catch (error) {
        console.error('[PUT /api/blogs/slug]', error);
        return NextResponse.json({ error: 'Failed to update blog', details: error.message }, { status: 500 });
    }
}

// ── DELETE /api/blogs/:slug ───────────────────────────────────────────────────
export async function DELETE(request, { params }) {
    const auth = verifyAuth(request);
    if (!auth.valid) return auth.response;

    try {
        await connectToDatabase();
        const { slug } = await params;

        const blog = await Blog.findOne({ slug });
        if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

        const publicId = blog.coverImage?.publicId;
        if (publicId && !['default', 'external', 'generated-fallback'].includes(publicId)) {
            try { await deleteImage(publicId); } catch { /* non-fatal */ }
        }

        await Blog.findOneAndDelete({ slug });
        await clearCacheByPattern('blogs:');

        return NextResponse.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('[DELETE /api/blogs/slug]', error);
        return NextResponse.json({ error: 'Failed to delete blog', details: error.message }, { status: 500 });
    }
}