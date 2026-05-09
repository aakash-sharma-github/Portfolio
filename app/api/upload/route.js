// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { verifyAuth } from '@/lib/authMiddleware';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
    // ✅ Use verifyAuth (full JWT verification) instead of just checking header presence
    const auth = verifyAuth(request);
    if (!auth.valid) return auth.response;

    let data;
    try {
        data = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!data.image) {
        return NextResponse.json({ error: 'image field is required' }, { status: 400 });
    }

    // Server-side size guard: base64 string of a 5 MB image is ~6.8 MB of text
    if (typeof data.image === 'string' && data.image.length > 7 * 1024 * 1024) {
        return NextResponse.json(
            { error: 'Image exceeds the 5 MB size limit' },
            { status: 413 }
        );
    }

    try {
        // ✅ lib/cloudinary.js now throws on error (fixed previously).
        //    The result is always a real Cloudinary object here.
        const result = await uploadImage(data.image, data.folder || 'blog');

        return NextResponse.json({
            url: result.secure_url,   // real https://res.cloudinary.com/... URL
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
        });
    } catch (error) {
        console.error('[POST /api/upload]', error.message);
        return NextResponse.json(
            { error: 'Image upload failed', details: error.message },
            { status: 500 }
        );
    }
}