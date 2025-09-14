import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Work from '@/lib/models/Work';
import { uploadImage } from '@/lib/cloudinary';

// GET handler to fetch all works
export async function GET(request) {
    try {
        console.log('Starting works API route GET request...');
        
        // Connect to the database
        try {
            await connectToDatabase();
            console.log('✓ Database connected successfully in works API route');
        } catch (dbError) {
            console.error('❌ Database connection failed:', dbError);
            return NextResponse.json(
                { error: 'Database connection failed', details: dbError.message },
                { status: 500 }
            );
        }

        // Get query parameters
        const url = new URL(request.url);
        const category = url.searchParams.get('category');
        const status = url.searchParams.get('status');
        const featured = url.searchParams.get('featured');
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
        const page = Math.max(parseInt(url.searchParams.get('page') || '1'), 1);


        // Build query
        const filter = {};
        if (category && category !== 'All') {
            filter.category = category;
        }
        if (status) {
            filter.status = status;
        }
        if (featured !== null && featured !== undefined) {
            filter.featured = featured === 'true';
        }


        // Get total count for pagination
        let total;
        try {
            total = await Work.countDocuments(filter);
        } catch (countError) {
            console.error('❌ Error counting documents:', countError);
            return NextResponse.json(
                { error: 'Error counting works', details: countError.message },
                { status: 500 }
            );
        }

        // Calculate pagination
        const totalPages = Math.ceil(total / limit);
        const currentPage = Math.min(page, totalPages || 1); // Avoid divide by zero
        const skip = (currentPage - 1) * limit;

        // Fetch works with pagination
        let works;
        try {
            works = await Work.find(filter)
                .sort({ featured: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select({
                    title: 1,
                    slug: 1,
                    description: 1,
                    category: 1,
                    technologies: 1,
                    stack: 1,
                    coverImage: 1,
                    links: 1,
                    live: 1,
                    github: 1,
                    featured: 1,
                    status: 1,
                    createdAt: 1,
                    client: 1,
                    role: 1
                });
        } catch (findError) {
            console.error('❌ Error fetching works:', findError);
            return NextResponse.json(
                { error: 'Error fetching works', details: findError.message },
                { status: 500 }
            );
        }

        const response = {
            works,
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
        console.error('Error fetching works:', error);
        return NextResponse.json(
            { error: 'Failed to fetch works', details: error.message },
            { status: 500 }
        );
    }
}

// POST handler to create a new work
export async function POST(request) {
    try {
        // Check authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Unauthorized: Missing or invalid Authorization header');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        
        // Get token
        const token = authHeader.split(' ')[1];

        // Connect to the database
        await connectToDatabase();

        // Parse the request body
        const data = await request.json();

        // Validate required fields
        if (!data.title || !data.slug || !data.description || !data.content || !data.technologies) {
            return NextResponse.json(
                { error: 'Missing required fields: title, slug, description, content, technologies' },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const existingWork = await Work.findOne({ slug: data.slug });
        if (existingWork) {
            return NextResponse.json(
                { error: 'Slug already exists' },
                { status: 400 }
            );
        }

        let coverImageData = {
            url: '/images/portfolio_01.png',
            publicId: 'default'
        };

        // Handle cover image upload
        if (data.coverImage) {
            // If it's a string (base64 data)
            if (typeof data.coverImage === 'string' && data.coverImage.startsWith('data:image')) {
                try {
                    const uploadResult = await uploadImage(data.coverImage);
                    coverImageData = {
                        url: uploadResult.secure_url,
                        publicId: uploadResult.public_id
                    };
                } catch (error) {
                    console.error('Cover image upload failed:', error);
                    // Continue with default image
                }
            } else if (data.coverImage && data.coverImage.url) {
                // If it's already an object with url and publicId
                coverImageData = {
                    url: data.coverImage.url,
                    publicId: data.coverImage.publicId || 'default'
                };
            }
        }

        // Handle additional images upload
        let imagesData = [];
        if (data.images && Array.isArray(data.images)) {
            for (const imageData of data.images) {
                if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
                    try {
                        const uploadResult = await uploadImage(imageData);
                        imagesData.push({
                            url: uploadResult.secure_url,
                            publicId: uploadResult.public_id,
                            caption: ''
                        });
                    } catch (error) {
                        console.error('Additional image upload failed:', error);
                        // Continue with next image
                    }
                } else if (imageData && imageData.url) {
                    // If it's already an object with url and publicId
                    imagesData.push({
                        url: imageData.url,
                        publicId: imageData.publicId || 'default',
                        caption: imageData.caption || ''
                    });
                }
            }
        }

        // Format technologies - convert strings to objects with name property
        const formattedTechnologies = data.technologies.map(tech => {
            if (typeof tech === 'string') {
                return { name: tech };
            } else if (tech && tech.name) {
                return tech;
            } else {
                return { name: String(tech) };
            }
        });

        // Create the work
        const work = await Work.create({
            ...data,
            technologies: formattedTechnologies,
            coverImage: coverImageData,
            images: imagesData
        });
        return NextResponse.json(work, { status: 201 });
    } catch (error) {
        console.error('Error creating work:', error);
        return NextResponse.json(
            { error: 'Failed to create work', details: error.message },
            { status: 500 }
        );
    }
}
