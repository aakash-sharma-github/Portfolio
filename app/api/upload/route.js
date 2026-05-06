import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { uploadImage } from '@/lib/cloudinary';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET;

// Allowed image MIME types for base64 uploads
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Max base64 size (~5MB decoded)
const MAX_BASE64_SIZE = 7 * 1024 * 1024; // 7MB base64 ≈ 5MB binary

function verifyAuth(request) {
    if (!JWT_SECRET) return null;
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

// POST handler for image uploads (admin only)
export async function POST(request) {
    try {
        // FIX: actually verify JWT instead of just checking header format
        const decoded = verifyAuth(request);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let data;
        try {
            data = await request.json();
        } catch {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        if (!data.image) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        // FIX: validate image type and size for base64 uploads
        if (typeof data.image === 'string' && data.image.startsWith('data:')) {
            const mimeMatch = data.image.match(/^data:([^;]+);base64,/);
            if (!mimeMatch) {
                return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
            }

            const mimeType = mimeMatch[1];
            if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
                return NextResponse.json(
                    { error: `Unsupported image type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}` },
                    { status: 400 }
                );
            }

            if (data.image.length > MAX_BASE64_SIZE) {
                return NextResponse.json({ error: 'Image too large (max 5MB)' }, { status: 400 });
            }
        }

        // FIX: restrict upload folder to prevent path traversal
        const safeFolder = typeof data.folder === 'string'
            ? data.folder.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50) || 'blog'
            : 'blog';

        const result = await uploadImage(data.image, safeFolder);

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload image', details: error.message },
            { status: 500 }
        );
    }
}