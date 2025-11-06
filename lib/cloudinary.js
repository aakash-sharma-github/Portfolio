import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary
 * @param {string} imageUrl - The URL or base64 string of the image to upload
 * @param {string} folder - The folder to upload the image to
 * @returns {Promise<Object>} - The Cloudinary upload response
 */
export async function uploadImage(imageUrl, folder = 'blog') {
    try {
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: folder,
            resource_type: 'auto',
            transformation: [
                { width: 1200, height: 630, crop: 'fill' },
                { quality: 'auto' }
            ]
        });
        return result;
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to upload image', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * Deletes an image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - The Cloudinary delete response
 */
export async function deleteImage(publicId) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete image', details: error.message },
            { status: 500 }
        );
    }
}

export default cloudinary; 