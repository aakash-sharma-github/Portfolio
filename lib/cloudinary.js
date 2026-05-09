// lib/cloudinary.js
// ✅ Fix bug 3: the original file returned `NextResponse.json(...)` from uploadImage
// and deleteImage — but this is a lib utility, not a route handler. Returning a
// NextResponse from a lib function means the caller gets a Response object instead
// of the Cloudinary result, so `result.secure_url` is undefined and the image URL
// stored in MongoDB becomes undefined or the localhost fallback.
// Fix: throw real errors so route handlers can catch and respond appropriately.

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary is configured once at module load.
// All three env vars must be set in Vercel → Project → Environment Variables.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image (URL or base64 data URI) to Cloudinary.
 * @param {string} imageSource - https URL or data:image/... base64 string
 * @param {string} folder      - Cloudinary folder name (default: 'blog')
 * @returns {Promise<{ secure_url: string, public_id: string, width: number, height: number }>}
 * @throws {Error} if Cloudinary credentials are missing or upload fails
 */
export async function uploadImage(imageSource, folder = 'blog') {
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
        throw new Error(
            'Cloudinary credentials are not configured. ' +
            'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
        );
    }

    if (!imageSource) throw new Error('imageSource is required');

    const result = await cloudinary.uploader.upload(imageSource, {
        folder,
        resource_type: 'auto',
        transformation: [
            { width: 1200, height: 630, crop: 'fill', gravity: 'auto' },
            { quality: 'auto:good', fetch_format: 'auto' },
        ],
    });

    return result; // { secure_url, public_id, width, height, format, ... }
}

/**
 * Delete an image from Cloudinary by its public_id.
 * Silently succeeds if the image doesn't exist.
 * @param {string} publicId
 */
export async function deleteImage(publicId) {
    if (!publicId || publicId === 'default' || publicId === 'external') return;
    // Throws on network/auth errors; callers should catch if needed.
    await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;