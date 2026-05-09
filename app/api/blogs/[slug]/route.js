import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { verifyAuth } from '@/lib/authMiddleware';
import { generateCoverImageBase64 } from '@/lib/generateCoverImage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── GET /api/blogs/[slug]  (public) ───────────────────────────────────────────
export async function GET(request, { params }) {
    try {
        await connectToDatabase();
        const { slug } = await params;
        const blog = await Blog.findOne({ slug }).lean();
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        return NextResponse.json(blog);
    } catch (error) {
        console.error('[GET /api/blogs/slug]', error);
        return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
    }
}

// ── PUT /api/blogs/[slug]  (protected) ────────────────────────────────────────
export async function PUT(request, { params }) {
    const auth = verifyAuth(request);
    if (!auth.valid) return auth.response;

    try {
        await connectToDatabase();
        const { slug } = await params;

        const existingBlog = await Blog.findOne({ slug });
        if (!existingBlog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        const data = await request.json();

        // ── Determine the new cover image ─────────────────────────────────────
        //
        // The frontend sends coverImage in one of three shapes:
        //   A) null           → auto-generate a new Design-B cover
        //   B) { url, publicId } with url starting with "data:image…" → new file upload
        //   C) { url, publicId } with url starting with "https://"    → existing Cloudinary URL, keep as-is
        //
        // Bug 1 fix: the original code called data.coverImage.startsWith() directly,
        // which throws "startsWith is not a function" when coverImage is an object.
        //
        // Bug 2 fix: when coverImage is null (auto-generate), the original code kept
        // existingBlog.coverImage unchanged, so the old cover was never replaced.

        let coverImageData = existingBlog.coverImage; // default: keep existing

        if (data.coverImage === null || data.coverImage === undefined) {
            // ── A) Auto-generate a new Design-B cover ────────────────────────
            try {
                const authorName = data.author?.name || existingBlog.author?.name || 'Aakash Sharma';
                const title = data.title || existingBlog.title;
                const category = data.category || existingBlog.category;
                const base64 = generateCoverImageBase64(title, category, authorName);
                const result = await uploadImage(base64, 'blog/covers/generated');

                // Delete the old generated cover from Cloudinary if it exists
                const oldPublicId = existingBlog.coverImage?.publicId;
                if (oldPublicId && oldPublicId !== 'default' && oldPublicId !== 'external') {
                    try { await deleteImage(oldPublicId); } catch { /* non-fatal */ }
                }

                coverImageData = {
                    url: result.secure_url,
                    publicId: result.public_id,
                    alt: title,
                };
                console.log(`[PUT /api/blogs/${slug}] generated cover → ${result.secure_url}`);
            } catch (genErr) {
                // Generation failed — keep the existing cover rather than breaking the update
                console.error(`[PUT /api/blogs/${slug}] cover generation failed:`, genErr.message);
            }

        } else if (data.coverImage && typeof data.coverImage === 'object') {
            const incomingUrl = data.coverImage.url || '';

            if (incomingUrl.startsWith('data:image')) {
                // ── B) New base64 file upload ─────────────────────────────────
                try {
                    const result = await uploadImage(incomingUrl, 'blog/covers');

                    const oldPublicId = existingBlog.coverImage?.publicId;
                    if (oldPublicId && oldPublicId !== 'default' && oldPublicId !== 'external') {
                        try { await deleteImage(oldPublicId); } catch { /* non-fatal */ }
                    }

                    coverImageData = {
                        url: result.secure_url,
                        publicId: result.public_id,
                        alt: data.title || existingBlog.title,
                    };
                } catch (uploadErr) {
                    console.error(`[PUT /api/blogs/${slug}] cover upload failed:`, uploadErr.message);
                    // Keep existing cover on upload failure
                }

            } else if (incomingUrl.startsWith('https://') || incomingUrl.startsWith('http://')) {
                // ── C) Already a Cloudinary/external URL — keep as-is ─────────
                coverImageData = {
                    url: incomingUrl,
                    publicId: data.coverImage.publicId || existingBlog.coverImage?.publicId || 'external',
                    alt: data.coverImage.alt || data.title || existingBlog.title,
                };
            }
            // If url is empty/invalid, fall through and keep existingBlog.coverImage
        }

        // ── Persist the update ────────────────────────────────────────────────
        // Exclude fields the client must not overwrite
        const { slug: _slug, _id, createdAt, ...safeData } = data;

        const updatedBlog = await Blog.findOneAndUpdate(
            { slug },
            {
                ...safeData,
                coverImage: coverImageData,
                slug: existingBlog.slug,   // slug is immutable
            },
            { new: true, runValidators: true }
        );

        return NextResponse.json(updatedBlog);
    } catch (error) {
        console.error('[PUT /api/blogs/slug]', error);
        return NextResponse.json(
            { error: 'Failed to update blog', details: error.message },
            { status: 500 }
        );
    }
}

// ── DELETE /api/blogs/[slug]  (protected) ─────────────────────────────────────
export async function DELETE(request, { params }) {
    const auth = verifyAuth(request);
    if (!auth.valid) return auth.response;

    try {
        await connectToDatabase();
        const { slug } = await params;

        const blog = await Blog.findOne({ slug });
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // Clean up Cloudinary asset
        const publicId = blog.coverImage?.publicId;
        if (publicId && publicId !== 'default' && publicId !== 'external') {
            try { await deleteImage(publicId); } catch { /* non-fatal */ }
        }

        await Blog.findOneAndDelete({ slug });
        return NextResponse.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('[DELETE /api/blogs/slug]', error);
        return NextResponse.json(
            { error: 'Failed to delete blog', details: error.message },
            { status: 500 }
        );
    }
}