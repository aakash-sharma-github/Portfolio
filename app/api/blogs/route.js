import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { uploadImage } from '@/lib/cloudinary';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';
// Force dynamic rendering since we use request headers
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET;

// Helper: verify JWT from request and return decoded payload or null
function verifyAuth(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

// Helper: strip dangerous HTML/script content from user text inputs
// (basic protection; for production, use the 'dompurify' or 'sanitize-html' package)
function sanitizeString(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
}

// GET handler to fetch all blogs (public)
export async function GET(request) {
    try {
        await connectToDatabase();

        const url = new URL(request.url);
        const category = url.searchParams.get('category');
        const search = sanitizeString(url.searchParams.get('search') || '');
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '6', 10), 12);
        const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);

        const filter = {};
        if (category && category !== 'All') {
            filter.category = category;
        }

        if (search) {
            // FIX: escape regex special chars to prevent ReDoS
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.$or = [
                { title: { $regex: escapedSearch, $options: 'i' } },
                { excerpt: { $regex: escapedSearch, $options: 'i' } },
            ];
        }

        const total = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(total / limit) || 1;
        const currentPage = Math.min(page, totalPages);
        const currentSkip = (currentPage - 1) * limit;

        const blogs = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .skip(currentSkip)
            .limit(limit)
            .select({
                title: 1,
                slug: 1,
                excerpt: 1,
                category: 1,
                coverImage: 1,
                author: 1,
                readTime: 1,
                createdAt: 1,
            });

        return NextResponse.json({
            blogs,
            pagination: {
                total,
                page: currentPage,
                limit,
                pages: totalPages,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1,
            },
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blogs', details: error.message },
            { status: 500 }
        );
    }
}

// POST handler to create a new blog (admin only)
export async function POST(request) {
    try {
        // FIX: actually verify the JWT, not just check header format
        if (!JWT_SECRET) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const decoded = verifyAuth(request);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        let data;
        try {
            data = await request.json();
        } catch {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        // Validate required fields
        if (!data.title || !data.slug || !data.content || !data.category) {
            return NextResponse.json(
                { error: 'Missing required fields: title, slug, content, category' },
                { status: 400 }
            );
        }

        // Sanitize slug to prevent path traversal / injection
        const safeSlug = String(data.slug).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 200);

        const existingBlog = await Blog.findOne({ slug: safeSlug });
        if (existingBlog) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }

        let coverImageData;

        if (data.coverImage) {
            if (data.coverImage.startsWith('data:image') || data.coverImage.startsWith('http')) {
                try {
                    const uploadResult = await uploadImage(data.coverImage);
                    coverImageData = {
                        url: uploadResult.secure_url,
                        publicId: uploadResult.public_id,
                    };
                } catch (uploadError) {
                    console.error('Image upload failed, using default:', uploadError.message);
                    // FIX: previously returned early with error, preventing blog creation.
                    // Now fall through to default cover image instead.
                    coverImageData = {
                        url: `${process.env.NEXT_PUBLIC_API_URL || ''}/api/default-cover?title=${encodeURIComponent(data.title)}`,
                        publicId: 'default',
                    };
                }
            } else {
                coverImageData = {
                    url: data.coverImage,
                    publicId: 'default',
                };
            }
        } else {
            coverImageData = {
                url: `${process.env.NEXT_PUBLIC_API_URL || ''}/api/default-cover?title=${encodeURIComponent(data.title)}`,
                publicId: 'default',
            };
        }

        const blog = await Blog.create({
            title: sanitizeString(data.title),
            slug: safeSlug,
            excerpt: sanitizeString(data.excerpt),
            content: data.content, // rich text — sanitize on render, not storage
            category: sanitizeString(data.category),
            readTime: sanitizeString(data.readTime) || '5 min read',
            coverImage: coverImageData,
            author: data.author || {
                name: 'Aakash Sharma',
                avatar: '/assets/avatar.jpg',
                bio: 'Full-stack developer with a passion for modern new technologies',
            },
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error) {
        console.error('Error creating blog:', error);
        return NextResponse.json(
            { error: 'Failed to create blog', details: error.message },
            { status: 500 }
        );
    }
}