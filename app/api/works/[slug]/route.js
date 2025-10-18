import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Work from '@/lib/models/Work';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';


// GET handler to fetch a specific work by slug
export async function GET(request, { params }) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Get the slug from the URL
        const { slug } = params;

        // Find the work
        const work = await Work.findOne({ slug });

        // If work not found
        if (!work) {
            return NextResponse.json(
                { error: 'Work not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(work);
    } catch (error) {
        console.error('Error fetching work:', error);
        return NextResponse.json(
            { error: 'Failed to fetch work', details: error.message },
            { status: 500 }
        );
    }
}

// PUT handler to update a work
export async function PUT(request, { params }) {
    try {
        // Check authentication
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

        // Find the work
        const existingWork = await Work.findOne({ slug });

        // If work not found
        if (!existingWork) {
            return NextResponse.json(
                { error: 'Work not found' },
                { status: 404 }
            );
        }

        // Parse the request body
        const data = await request.json();

        // Handle cover image update if provided
        let coverImageData = existingWork.coverImage;

        if (data.coverImage) {
            // Check if the coverImage is a string (data URL) or object
            if (typeof data.coverImage === 'string') {
                // Handle data URL string
                if (data.coverImage.startsWith('data:image')) {
                    try {
                        const uploadResult = await uploadImage(data.coverImage);
                        coverImageData = {
                            url: uploadResult.secure_url,
                            publicId: uploadResult.public_id
                        };

                        // Delete old cover image if it's not the default
                        if (existingWork.coverImage.publicId !== 'default') {
                            await deleteImage(existingWork.coverImage.publicId);
                        }
                    } catch (error) {
                        console.error('Cover image upload failed:', error);
                        // Continue with existing image
                    }
                } else {
                    // If it's a regular URL string, use it directly
                    coverImageData = {
                        url: data.coverImage,
                        publicId: 'external'
                    };
                }
            } else if (typeof data.coverImage === 'object' && data.coverImage !== null) {
                // Handle object (already formatted with url and publicId)
                if (data.coverImage.url) {
                    coverImageData = data.coverImage;
                }
            }
        }

        // Handle additional images update if provided
        let imagesData = Array.isArray(existingWork.images) ? existingWork.images : [];

        if (data.images && Array.isArray(data.images)) {
            imagesData = [];
            for (const imageData of data.images) {
                
                if (typeof imageData === 'string') {
                    if (imageData.startsWith('data:image')) {
                        // It's a base64 image, upload it
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
                    } else {
                        // It's a URL string
                        imagesData.push({
                            url: imageData,
                            publicId: 'external',
                            caption: ''
                        });
                    }
                } else if (typeof imageData === 'object' && imageData !== null && imageData.url) {
                    // It's already an object with url property
                    imagesData.push(imageData);
                }
            }

            // Delete old additional images that are not in the new list (only if existingWork.images exists and is an array)
            if (Array.isArray(existingWork.images)) {
                for (const oldImage of existingWork.images) {
                    const stillExists = imagesData.some(img => img.publicId === oldImage.publicId);
                    if (!stillExists && oldImage.publicId !== 'default') {
                        try {
                            await deleteImage(oldImage.publicId);
                        } catch (error) {
                            console.error('Failed to delete old image:', error);
                        }
                    }
                }
            }
        }

        // Update the work
        const updatedWork = await Work.findOneAndUpdate(
            { slug },
            {
                ...data,
                coverImage: coverImageData,
                images: imagesData,
                // Don't update the slug as it's used in the URL
                slug: existingWork.slug
            },
            { new: true, runValidators: true }
        );

        return NextResponse.json(updatedWork);
    } catch (error) {
        console.error('Error updating work:', error);
        return NextResponse.json(
            { error: 'Failed to update work', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE handler to delete a work
export async function DELETE(request, { params }) {
    try {
        // Check authentication
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

        // Find the work
        const work = await Work.findOne({ slug });

        // If work not found
        if (!work) {
            return NextResponse.json(
                { error: 'Work not found' },
                { status: 404 }
            );
        }

        // Delete the cover image from Cloudinary if it's not the default
        if (work.coverImage.publicId !== 'default') {
            try {
                await deleteImage(work.coverImage.publicId);
            } catch (error) {
                console.error('Failed to delete cover image from Cloudinary:', error);
            }
        }

        // Delete additional images from Cloudinary (only if images array exists)
        if (Array.isArray(work.images)) {
            for (const image of work.images) {
                if (image.publicId !== 'default') {
                    try {
                        await deleteImage(image.publicId);
                    } catch (error) {
                        console.error('Failed to delete additional image from Cloudinary:', error);
                    }
                }
            }
        }

        // Delete the work
        await Work.findOneAndDelete({ slug });

        return NextResponse.json(
            { message: 'Work deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting work:', error);
        return NextResponse.json(
            { error: 'Failed to delete work', details: error.message },
            { status: 500 }
        );
    }
}
