import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { verifyAuth } from '@/lib/authMiddleware';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';
// Force dynamic rendering since we use request headers
export const dynamic = 'force-dynamic';


// Helper: verify JWT from request
// function verifyAuth(request) {
//     if (!JWT_SECRET) return null;
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

//     const token = authHeader.split(' ')[1];
//     if (!token) return null;

//     try {
//         return jwt.verify(token, JWT_SECRET);
//     } catch {
//         return null;
//     }
// }

// GET handler to fetch a specific blog by slug (public)
export async function GET(request, { params }) {
    try {
        await connectToDatabase();

        const { slug } = params;

        // FIX: validate slug to prevent injection
        if (!slug || typeof slug !== 'string' || slug.length > 200) {
            return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
        }

        const blog = await Blog.findOne({ slug: slug.toLowerCase() });

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blog', details: error.message },
            { status: 500 }
        );
    }
}

// PUT handler to update a blog (admin only)
export async function PUT(request, { params }) {
    try {
        // FIX: actually verify the JWT token
        const decoded = verifyAuth(request);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const { slug } = params;

        if (!slug || typeof slug !== 'string' || slug.length > 200) {
            return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
        }

        const existingBlog = await Blog.findOne({ slug: slug.toLowerCase() });

        if (!existingBlog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        let data;
        try {
            data = await request.json();
        } catch {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        let coverImageData = existingBlog.coverImage;

        if (data.coverImage && data.coverImage !== existingBlog.coverImage?.url) {
            if (data.coverImage.startsWith('data:image') || data.coverImage.startsWith('http')) {
                try {
                    const uploadResult = await uploadImage(data.coverImage);
                    coverImageData = {
                        url: uploadResult.secure_url,
                        publicId: uploadResult.public_id,
                    };

                    if (existingBlog.coverImage?.publicId && existingBlog.coverImage.publicId !== 'default') {
                        await deleteImage(existingBlog.coverImage.publicId).catch(err =>
                            console.error('Failed to delete old image:', err.message)
                        );
                    }
                } catch (uploadError) {
                    console.error('Image upload failed during update:', uploadError.message);
                    // Keep existing cover image if upload fails
                }
            }
        }

        const updatedBlog = await Blog.findOneAndUpdate(
            { slug: slug.toLowerCase() },
            {
                ...data,
                coverImage: coverImageData,
                slug: existingBlog.slug, // never change slug
            },
            { new: true, runValidators: true }
        );

        return NextResponse.json(updatedBlog);
    } catch (error) {
        console.error('Error updating blog:', error);
        return NextResponse.json(
            { error: 'Failed to update blog', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE handler to delete a blog (admin only)
export async function DELETE(request, { params }) {
    try {
        // FIX: actually verify the JWT token
        const decoded = verifyAuth(request);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const { slug } = params;

        if (!slug || typeof slug !== 'string' || slug.length > 200) {
            return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
        }

        const blog = await Blog.findOne({ slug: slug.toLowerCase() });

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        if (blog.coverImage?.publicId && blog.coverImage.publicId !== 'default') {
            await deleteImage(blog.coverImage.publicId).catch(err =>
                console.error('Failed to delete cover image:', err.message)
            );
        }

        await Blog.findOneAndDelete({ slug: slug.toLowerCase() });

        return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json(
            { error: 'Failed to delete blog', details: error.message },
            { status: 500 }
        );
    }
}