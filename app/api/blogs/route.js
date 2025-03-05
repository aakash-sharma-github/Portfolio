import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { uploadImage } from '@/lib/cloudinary';

// GET handler to fetch all blogs
export async function GET(request) {
    console.log('API Route GET /api/blogs - Request received');
    try {
        console.log('GET /api/blogs - Connecting to database...');
        // Connect to the database
        await connectToDatabase();
        console.log('GET /api/blogs - Connected successfully');

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const limit = Math.min(parseInt(searchParams.get('limit') || '6'), 12); // Cap at 12 items per page
        const page = Math.max(parseInt(searchParams.get('page') || '1'), 1); // Ensure page is at least 1
        const skip = (page - 1) * limit;

        console.log('GET /api/blogs - Request params:', { category, search, page, limit, skip });
        console.log('GET /api/blogs - Request URL:', request.url);

        // Build query
        const query = {};
        if (category && category !== 'All') {
            query.category = category;
        }

        // Add search by title or content
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        console.log('GET /api/blogs - Query:', JSON.stringify(query));

        // Get total count for pagination
        const total = await Blog.countDocuments(query);
        console.log(`GET /api/blogs - Total matching documents: ${total}`);

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);
        const currentPage = Math.min(page, totalPages); // Ensure page doesn't exceed total pages
        const currentSkip = (currentPage - 1) * limit;

        // Fetch blogs with pagination
        console.log('GET /api/blogs - Executing query...');
        const blogs = await Blog.find(query)
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

        console.log(`GET /api/blogs - Found ${blogs.length} blogs`);

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

        console.log('GET /api/blogs - Sending response with pagination:', response.pagination);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching blogs:', error);
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
                    console.error('Error uploading image to Cloudinary:', error);
                    // Use default cover image if upload fails
                    coverImageData = {
                        url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/default-cover?title=${encodeURIComponent(data.title)}`,
                        publicId: 'default'
                    };
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
                bio: 'Full-stack developer with a passion for modern web technologies'
            }
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