import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';


// GET handler to fetch a specific blog by slug
export async function GET(request, { params }) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Get the slug from the URL
        const { slug } = params;

        // Find the blog post
        const blog = await Blog.findOne({ slug });

        // If blog not found
        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch blog', details: error.message },
            { status: 500 }
        );
    }
}

// PUT handler to update a blog
export async function PUT(request, { params }) {
    try {
        // Check authentication (in a real app, use a proper auth middleware)
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to the database
        await connectToDatabase();

        // Get the slug from the URL
        const { slug } = params;

        // Find the blog post
        const existingBlog = await Blog.findOne({ slug });

        // If blog not found
        if (!existingBlog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        // Parse the request body
        const data = await request.json();

        // Handle cover image update if provided
        let coverImageData = existingBlog.coverImage;

        if (data.coverImage && data.coverImage !== existingBlog.coverImage.url) {
            // Upload new image to Cloudinary
            if (data.coverImage.startsWith('data:image') || data.coverImage.startsWith('http')) {
                const uploadResult = await uploadImage(data.coverImage);
                coverImageData = {
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id
                };

                // Delete old image if it's not the default
                if (existingBlog.coverImage.publicId !== 'default') {
                    await deleteImage(existingBlog.coverImage.publicId);
                }
            }
        }

        // Update the blog post
        const updatedBlog = await Blog.findOneAndUpdate(
            { slug },
            {
                ...data,
                coverImage: coverImageData,
                // Don't update the slug as it's used in the URL
                slug: existingBlog.slug
            },
            { new: true, runValidators: true }
        );

        return NextResponse.json(updatedBlog);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update blog', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE handler to delete a blog
export async function DELETE(request, { params }) {
    try {
        // Check authentication (in a real app, use a proper auth middleware)
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to the database
        await connectToDatabase();

        // Get the slug from the URL
        const { slug } = params;

        // Find the blog post
        const blog = await Blog.findOne({ slug });

        // If blog not found
        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        // Delete the cover image from Cloudinary if it's not the default
        if (blog.coverImage.publicId !== 'default') {
            await deleteImage(blog.coverImage.publicId);
        }

        // Delete the blog post
        await Blog.findOneAndDelete({ slug });

        return NextResponse.json(
            { message: 'Blog deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete blog', details: error.message },
            { status: 500 }
        );
    }
} 