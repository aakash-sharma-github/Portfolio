import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

// POST handler for image uploads
export async function POST(request) {
    try {
        // Check authentication (in a real app, use a proper auth middleware)
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse the request body
        const data = await request.json();

        // Check if image is provided
        if (!data.image) {
            return NextResponse.json(
                { error: 'Image is required' },
                { status: 400 }
            );
        }

        // Upload image to Cloudinary
        const result = await uploadImage(data.image, data.folder || 'blog');

        // Return the Cloudinary response
        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to upload image', details: error.message },
            { status: 500 }
        );
    }
} 