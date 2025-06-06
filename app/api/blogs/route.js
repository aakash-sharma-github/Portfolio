import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { uploadImage } from '@/lib/cloudinary';

// GET handler to fetch all blogs
export async function GET(request) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Get query parameters
        const url = new URL(request.url);
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('search') || '';
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '6'), 12); // Cap at 12 items per page
        const page = Math.max(parseInt(url.searchParams.get('page') || '1'), 1); // Ensure page is at least 1

        // Build query
        const filter = {};
        if (category && category !== 'All') {
            filter.category = category;
        }

        // Add search by title or content
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const total = await Blog.countDocuments(filter);

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);
        const currentPage = Math.min(page, totalPages); // Ensure page doesn't exceed total pages
        const currentSkip = (currentPage - 1) * limit;

        // Fetch blogs with pagination
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
                createdAt: 1
            }); // Select only needed fields

        const response = {
            blogs,
            pagination: {
                total,
                page: currentPage,
                limit,
                pages: totalPages,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1
            }
        };
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch blogs', details: error.message },
            { status: 500 }
        );
    }
}

// POST handler to create a new blog
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

        // Connect to the database
        await connectToDatabase();

        // Parse the request body
        const data = await request.json();

        // Validate required fields
        if (!data.title || !data.slug || !data.content || !data.category) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const existingBlog = await Blog.findOne({ slug: data.slug });
        if (existingBlog) {
            return NextResponse.json(
                { error: 'Slug already exists' },
                { status: 400 }
            );
        }

        let coverImageData;

        // Handle cover image
        if (data.coverImage) {
            // If it's a base64 string or URL, upload to Cloudinary
            if (data.coverImage.startsWith('data:image') || data.coverImage.startsWith('http')) {
                try {
                    const uploadResult = await uploadImage(data.coverImage);
                    coverImageData = {
                        url: uploadResult.secure_url,
                        publicId: uploadResult.public_id
                    };
                } catch (error) {
                    // Use default cover image if upload fails
                    coverImageData = {
                        url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/default-cover?title=${encodeURIComponent(data.title)}`,
                        publicId: 'default'
                    };

                    return NextResponse.json(
                        { error: 'Failed to upload image', details: error.message },
                        { status: 500 }
                    );
                }
            } else {
                // If it's already a URL, use it directly
                coverImageData = {
                    url: data.coverImage,
                    publicId: 'default'
                };
            }
        } else {
            // No cover image provided, use default cover generator
            coverImageData = {
                url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/default-cover?title=${encodeURIComponent(data.title)}`,
                publicId: 'default'
            };
        }

        // Create the blog post
        const blog = await Blog.create({
            ...data,
            coverImage: coverImageData,
            author: data.author || {
                name: 'Aakash Sharma',
                avatar: '/assets/avatar.jpg',
                bio: 'Full-stack developer with a passion for modern new technologies'
            }
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create blog', details: error.message },
            { status: 500 }
        );
    }
}