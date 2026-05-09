// app/api/blogs/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { uploadImage } from '@/lib/cloudinary';
import { verifyAuth } from '@/lib/authMiddleware';
import { generateCoverImageBase64 } from '@/lib/generateCoverImage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── GET /api/blogs  (public) ──────────────────────────────────────────────────
export async function GET(request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || '';
        const search = searchParams.get('search') || '';
        const rawPage = parseInt(searchParams.get('page') || '1', 10);
        const rawLimit = parseInt(searchParams.get('limit') || '8', 10);

        const limit = Math.min(Math.max(rawLimit, 1), 100);
        const page = Math.max(rawPage, 1);

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

        return NextResponse.json({
            blogs,
            pagination: {
                total, page: currentPage, limit, pages: totalPages,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1,
            },
        });
    } catch (error) {
        console.error('[GET /api/blogs]', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

// ── POST /api/blogs  (protected) ─────────────────────────────────────────────
export async function POST(request) {
    const auth = verifyAuth(request);
    if (!auth.valid) return auth.response;

    try {
        await connectToDatabase();
        const data = await request.json();

        // Validate required fields
        const missing = ['title', 'slug', 'content', 'category', 'excerpt'].filter(
            (f) => !data[f]?.toString().trim()
        );
        if (missing.length) {
            return NextResponse.json(
                { error: `Missing required fields: ${missing.join(', ')}` },
                { status: 400 }
            );
        }

        // Slug uniqueness
        const duplicate = await Blog.findOne({ slug: data.slug }).lean();
        if (duplicate) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
        }

        // ── Cover image ───────────────────────────────────────────────────────
        let coverImageData;

        if (data.coverImage && (
            data.coverImage.startsWith('data:image') ||
            data.coverImage.startsWith('https://') ||
            data.coverImage.startsWith('http://')
        )) {
            // Admin provided their own image — upload to Cloudinary
            try {
                const result = await uploadImage(data.coverImage, 'blog/covers');
                coverImageData = {
                    url: result.secure_url,
                    publicId: result.public_id,
                    alt: data.title,
                };
            } catch (err) {
                console.error('[POST /api/blogs] cover upload failed:', err.message);
                return NextResponse.json(
                    { error: `Cover image upload failed: ${err.message}` },
                    { status: 500 }
                );
            }
        } else {
            // ✅ No cover provided — auto-generate Design B, upload to Cloudinary,
            //    and store the real https://res.cloudinary.com/... URL in MongoDB.
            //    This completely eliminates the localhost URL problem because
            //    next/image only ever sees a Cloudinary URL.
            try {
                const authorName = data.author?.name || 'Aakash Sharma';
                const base64 = generateCoverImageBase64(data.title, data.category, authorName);
                const result = await uploadImage(base64, 'blog/covers/generated');
                coverImageData = {
                    url: result.secure_url,   // real CDN URL e.g. https://res.cloudinary.com/...
                    publicId: result.public_id,
                    alt: data.title,
                };
                console.log(`[POST /api/blogs] generated cover uploaded → ${result.secure_url}`);
            } catch (genErr) {
                // Generation or upload failed — use the /api/default-cover preview URL
                // but with the real site domain (never localhost).
                console.error('[POST /api/blogs] auto-generate failed, using preview URL:', genErr.message);
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
                name: 'Aakash Sharma',
                avatar: '/assets/avatar.jpg',
                bio: 'Full-stack developer passionate about modern web technologies.',
            },
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error) {
        console.error('[POST /api/blogs]', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}