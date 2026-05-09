"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Toaster, toast } from 'sonner';
import { FiUpload, FiX, FiImage, FiZap, FiRefreshCw } from 'react-icons/fi';
import { blogApi } from '@/lib/api';
import blogCategories from '@/lib/blogCategories';

// ─── Small toggle component ───────────────────────────────────────────────────
const Toggle = ({ checked, onChange, label, sublabel }) => (
    <label className="flex items-center justify-between cursor-pointer gap-4">
        <div>
            <span className="text-white font-medium text-sm">{label}</span>
            {sublabel && <p className="text-white/40 text-xs mt-0.5">{sublabel}</p>}
        </div>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200
                        ${checked ? 'bg-accent' : 'bg-white/15'}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow
                              transition-transform duration-200
                              ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </label>
);

// ─── Cover image section ──────────────────────────────────────────────────────
const CoverImageSection = ({ useGenerated, onToggle, uploadedImage, onImageUpload, title, category }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    // ✅ Use a number counter, not boolean — so the cache-buster is always a
    //    valid integer (&t=0, &t=1 …) and never the string "false"/"true"
    const [previewCounter, setPreviewCounter] = useState(0);
    const fileInputRef = useRef(null);

    const generatedPreviewUrl = title
        ? `/api/default-cover?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category || 'Development')}`
        : null;

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError('');

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Please select a JPG, PNG, GIF, or WEBP image.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image must be under 5 MB.');
            return;
        }

        setIsUploading(true);
        try {
            // Read as base64
            const base64 = await new Promise((res, rej) => {
                const reader = new FileReader();
                reader.onload = () => res(reader.result);
                reader.onerror = rej;
                reader.readAsDataURL(file);
            });

            // Upload via /api/upload (uses the fixed uploadImage that throws on error)
            const result = await blogApi.uploadImage(base64, 'blog/covers');

            onImageUpload({ url: result.url, publicId: result.publicId });
            toast.success('Cover image uploaded');
        } catch (err) {
            setUploadError(err?.response?.data?.error || err.message || 'Upload failed. Try again.');
            toast.error('Image upload failed');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {/* Toggle row */}
            <div className="bg-[#2a2a35] border border-[#3a3a45] rounded-xl p-4">
                <Toggle
                    checked={useGenerated}
                    onChange={onToggle}
                    label="Auto-generate cover image"
                    sublabel="Uses your title + category to create a unique Design-B cover. Uploaded to Cloudinary automatically."
                />
            </div>

            {/* Generated preview */}
            {useGenerated && (
                <div className="rounded-xl overflow-hidden border border-accent/30 bg-[#2a2a35]">
                    {generatedPreviewUrl ? (
                        <div className="relative">
                            {/*
                              ✅ Use a plain <img> tag here, NOT next/image <Image>.
                              Reasons:
                              1. next/image requires width + height props (or fill + a sized parent)
                                 for any image that isn't fill-mode — our /api/default-cover endpoint
                                 returns a dynamic image so we don't know the display size ahead of time.
                              2. This is a LOCAL API route (/api/default-cover), not an external URL,
                                 so next/image's CDN optimisation adds no benefit.
                              3. Using a plain <img> avoids the "Cannot update a component while
                                 rendering a different component" warning from next/image's internal
                                 state updates during the onError callback.
                            */}
                            <Image
                                src={`${generatedPreviewUrl}&t=${previewCounter}`}
                                alt="Generated cover preview"
                                className="w-full h-52 object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5
                                            bg-accent/90 text-white text-[10px] font-bold
                                            px-2.5 py-1 rounded-full uppercase tracking-wider">
                                <FiZap className="text-[10px]" />
                                Auto-generated
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewCounter(c => c + 1)}
                                className="absolute top-3 right-3 bg-black/60 text-white/80
                                           hover:text-white p-2 rounded-lg text-xs flex items-center
                                           gap-1 transition-colors backdrop-blur-sm"
                                title="Refresh preview"
                            >
                                <FiRefreshCw className="text-sm" />
                            </button>
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-white/30 text-sm">
                            Enter a title to preview the generated cover
                        </div>
                    )}
                    <div className="px-4 py-3">
                        <p className="text-white/50 text-xs">
                            This image will be generated and uploaded to Cloudinary when you publish.
                            The final result may differ slightly from this preview.
                        </p>
                    </div>
                </div>
            )}

            {/* Upload area */}
            {!useGenerated && (
                <div>
                    {uploadedImage?.url ? (
                        <div className="relative rounded-xl overflow-hidden border border-white/10">
                            <Image
                                src={uploadedImage.url}
                                alt="Cover image"
                                width={1200}
                                height={400}
                                className="w-full h-52 object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => onImageUpload(null)}
                                className="absolute top-3 right-3 bg-red-600 hover:bg-red-700
                                           text-white p-1.5 rounded-full transition-colors"
                                title="Remove image"
                            >
                                <FiX size={16} />
                            </button>
                            <div className="absolute bottom-3 left-3 bg-green-600/90 text-white
                                            text-[10px] font-bold px-2.5 py-1 rounded-full
                                            uppercase tracking-wider backdrop-blur-sm">
                                Uploaded to Cloudinary ✓
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-[#3a3a45] hover:border-accent/50
                                        rounded-xl p-8 text-center transition-colors">
                            <FiImage className="text-4xl text-white/20 mx-auto mb-3" />
                            <p className="text-white/50 text-sm mb-4">
                                Upload a custom cover image (JPG, PNG, WEBP — max 5 MB)
                            </p>
                            <label className="cursor-pointer inline-flex items-center gap-2
                                              bg-accent hover:bg-accent/80 text-white text-sm
                                              font-semibold px-5 py-2.5 rounded-xl transition-colors">
                                {isUploading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                                         rounded-full animate-spin" />
                                        Uploading…
                                    </>
                                ) : (
                                    <>
                                        <FiUpload />
                                        Select Image
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                    className="hidden"
                                />
                            </label>
                            {uploadError && (
                                <p className="text-red-400 text-xs mt-3">{uploadError}</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const CreateBlogPost = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [useGeneratedCover, setUseGeneratedCover] = useState(true);
    const [uploadedCover, setUploadedCover] = useState(null);

    const [post, setPost] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        published: true,
        readTime: '5 min read',
        tags: [],
        author: {
            name: 'Aakash Sharma',
            avatar: '/assets/avatar.jpg',
            bio: 'Full-stack developer passionate about modern web technologies.',
        },
    });

    const [tagInput, setTagInput] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title') {
            setPost((p) => ({
                ...p,
                title: value,
                slug: value.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').replace(/-+/g, '-'),
            }));
        } else {
            setPost((p) => ({ ...p, [name]: value }));
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.trim().toLowerCase().replace(/,/g, '');
            if (tag && !post.tags.includes(tag)) {
                setPost((p) => ({ ...p, tags: [...p.tags, tag] }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tag) =>
        setPost((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!post.title || !post.slug || !post.excerpt || !post.content || !post.category) {
            toast.error('Please fill in all required fields.');
            return;
        }
        if (!useGeneratedCover && !uploadedCover?.url) {
            toast.error('Please upload a cover image or switch to the auto-generated option.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...post,
                // If using generated cover, send null so the API generates & uploads it.
                // If using uploaded cover, send the Cloudinary object.
                coverImage: useGeneratedCover ? null : uploadedCover,
            };

            await blogApi.createPost(payload);
            toast.success('Blog post created successfully!');
            router.push('/admin/dashboard/blogs');
        } catch (err) {
            const msg = err?.response?.data?.error || err.message || 'Failed to create post.';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputCls = `w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-xl p-3
                      focus:outline-none focus:ring-2 focus:ring-accent text-sm
                      placeholder:text-white/25 transition-colors`;

    return (
        <AdminLayout title="Create Blog Post">
            <Toaster richColors position="top-right" />

            <div className="max-w-3xl mx-auto">
                <div className="bg-[#1e1e24] border border-white/6 rounded-2xl p-6 md:p-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-8">Create New Blog Post</h2>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Title */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">
                                Title <span className="text-red-400">*</span>
                            </label>
                            <input type="text" name="title" value={post.title} onChange={handleChange}
                                className={inputCls} placeholder="My awesome blog post" required />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">
                                Slug <span className="text-red-400">*</span>
                            </label>
                            <input type="text" name="slug" value={post.slug} onChange={handleChange}
                                className={`${inputCls} font-mono text-accent`}
                                placeholder="my-awesome-blog-post" required />
                            <p className="text-white/30 text-xs mt-1">Auto-generated from title. Edit if needed.</p>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">
                                Category <span className="text-red-400">*</span>
                            </label>
                            <select name="category" value={post.category} onChange={handleChange}
                                className={inputCls} required>
                                <option value="">Select a category</option>
                                {blogCategories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">
                                Excerpt <span className="text-red-400">*</span>
                                <span className="text-white/30 font-normal ml-2">({post.excerpt.length}/300)</span>
                            </label>
                            <textarea name="excerpt" value={post.excerpt} onChange={handleChange}
                                className={inputCls} rows={3} maxLength={300}
                                placeholder="A short summary shown on the blog listing page…" required />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">
                                Content <span className="text-red-400">*</span>
                            </label>
                            <textarea name="content" value={post.content} onChange={handleChange}
                                className={inputCls} rows={16}
                                placeholder="Full blog post content (Markdown supported)…" required />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">Tags</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {post.tags.map((tag) => (
                                    <span key={tag}
                                        className="inline-flex items-center gap-1 bg-accent/15 text-accent
                                                   border border-accent/25 text-xs px-2.5 py-1 rounded-full">
                                        #{tag}
                                        <button type="button" onClick={() => removeTag(tag)}
                                            className="text-accent/60 hover:text-accent ml-0.5">
                                            <FiX size={11} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input type="text" value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                className={inputCls}
                                placeholder="Type a tag and press Enter or comma to add" />
                        </div>

                        {/* Read time */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">Read Time</label>
                            <input type="text" name="readTime" value={post.readTime} onChange={handleChange}
                                className={inputCls} placeholder="5 min read" />
                        </div>

                        {/* Cover image — toggle + upload/preview */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-3">
                                Cover Image <span className="text-red-400">*</span>
                            </label>
                            <CoverImageSection
                                useGenerated={useGeneratedCover}
                                onToggle={setUseGeneratedCover}
                                uploadedImage={uploadedCover}
                                onImageUpload={setUploadedCover}
                                title={post.title}
                                category={post.category}
                            />
                        </div>

                        {/* Publish toggle */}
                        <div className="bg-[#2a2a35] border border-[#3a3a45] rounded-xl p-4">
                            <Toggle
                                checked={post.published}
                                onChange={(v) => setPost((p) => ({ ...p, published: v }))}
                                label="Publish immediately"
                                sublabel="Uncheck to save as draft"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2
                                       bg-accent hover:bg-accent/80 disabled:bg-accent/40
                                       disabled:cursor-not-allowed text-white font-bold
                                       py-3.5 rounded-xl transition-all duration-200"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                                     rounded-full animate-spin" />
                                    Creating…
                                </>
                            ) : (
                                'Create Blog Post'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateBlogPost;