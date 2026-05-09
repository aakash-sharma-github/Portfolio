'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSave, FiX, FiUpload, FiImage, FiZap } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { blogApi } from '@/lib/api';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { blogCategories } from '@/lib/essentials';

// Lazy-load TinyMCE to avoid SSR issues
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] bg-[#2a2a35] border border-[#3a3a45] rounded-xl
                        flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent
                            rounded-full animate-spin" />
        </div>
    ),
});

// ─── Cover image section ──────────────────────────────────────────────────────
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

const CoverImageSection = ({ useGenerated, onToggle, uploadedImage, onImageUpload, title, category }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef(null);

    const generatedPreviewUrl = title
        ? `/api/default-cover?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category || 'Development')}`
        : null;

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadError('');

        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
            setUploadError('Please select a JPG, PNG, WEBP, or GIF.'); return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image must be under 5 MB.'); return;
        }

        setIsUploading(true);
        try {
            const base64 = await new Promise((res, rej) => {
                const reader = new FileReader();
                reader.onload = () => res(reader.result);
                reader.onerror = rej;
                reader.readAsDataURL(file);
            });

            const result = await blogApi.uploadImage(base64, 'blog/covers');
            onImageUpload({ url: result.url, publicId: result.publicId });
            toast.success('Cover image uploaded to Cloudinary');
        } catch (err) {
            const msg = err?.response?.data?.error || err.message || 'Upload failed.';
            setUploadError(msg);
            toast.error('Image upload failed');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {/* Toggle */}
            <div className="bg-[#2a2a35] border border-[#3a3a45] rounded-xl p-4">
                <Toggle
                    checked={useGenerated}
                    onChange={onToggle}
                    label="Auto-generate cover image"
                    sublabel="Generated from title + category and uploaded to Cloudinary automatically."
                />
            </div>

            {/* Generated preview */}
            {useGenerated && (
                <div className="rounded-xl overflow-hidden border border-accent/30 bg-[#2a2a35]">
                    {generatedPreviewUrl ? (
                        <div className="relative">
                            <Image
                                src={generatedPreviewUrl}
                                alt="Generated cover preview"
                                className="w-full h-48 object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5
                                            bg-accent/90 text-white text-[10px] font-bold
                                            px-2.5 py-1 rounded-full uppercase tracking-wider">
                                <FiZap className="text-[10px]" /> Auto-generated
                            </div>
                        </div>
                    ) : (
                        <div className="h-32 flex items-center justify-center text-white/30 text-sm">
                            Enter a title to preview
                        </div>
                    )}
                    <p className="px-4 py-3 text-white/40 text-xs">
                        Final image is generated and uploaded to Cloudinary when you save.
                    </p>
                </div>
            )}

            {/* Upload */}
            {!useGenerated && (
                <div>
                    {uploadedImage?.url ? (
                        <div className="relative rounded-xl overflow-hidden border border-white/10">
                            <Image src={uploadedImage.url} alt="Cover" width={1200} height={400}
                                className="w-full h-48 object-cover" />
                            <button type="button" onClick={() => onImageUpload(null)}
                                className="absolute top-3 right-3 bg-red-600 hover:bg-red-700
                                           text-white p-1.5 rounded-full transition-colors">
                                <FiX size={16} />
                            </button>
                            <div className="absolute bottom-3 left-3 bg-green-600/90 text-white
                                            text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                                Cloudinary ✓
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-[#3a3a45] hover:border-accent/50
                                        rounded-xl p-8 text-center transition-colors">
                            <FiImage className="text-4xl text-white/20 mx-auto mb-3" />
                            <p className="text-white/45 text-sm mb-4">Upload a cover image (max 5 MB)</p>
                            <label className="cursor-pointer inline-flex items-center gap-2 bg-accent
                                              hover:bg-accent/80 text-white text-sm font-semibold
                                              px-5 py-2.5 rounded-xl transition-colors">
                                {isUploading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                                         rounded-full animate-spin" />
                                        Uploading…
                                    </>
                                ) : (
                                    <><FiUpload /> Select Image</>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*"
                                    onChange={handleFileChange} disabled={isUploading}
                                    className="hidden" />
                            </label>
                            {uploadError && <p className="text-red-400 text-xs mt-3">{uploadError}</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Main form ────────────────────────────────────────────────────────────────
const BlogPostForm = ({ post, onSubmit, isEditing = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: blogCategories[0] || '',
        readTime: '5 min read',
        published: true,
        tags: [],
        author: {
            name: 'Aakash Sharma',
            avatar: '/assets/avatar.jpg',
            bio: 'Full-stack developer passionate about modern web technologies.',
        },
    });

    const [useGeneratedCover, setUseGeneratedCover] = useState(true);
    const [uploadedCover, setUploadedCover] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tagInput, setTagInput] = useState('');

    // ── Populate form when editing ────────────────────────────────────────────
    useEffect(() => {
        if (!post) return;

        // ✅ Removed: NextResponse.json() inside useEffect — wrong in a client component.
        // ✅ Fixed: form data is only set here, NOT reset on failed validation.
        const hasCover = post.coverImage?.url &&
            !post.coverImage.url.includes('/api/default-cover');

        setFormData({
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            category: post.category || blogCategories[0] || '',
            readTime: post.readTime || '5 min read',
            published: post.published !== false,
            tags: post.tags || [],
            author: post.author || {
                name: 'Aakash Sharma',
                avatar: '/assets/avatar.jpg',
                bio: 'Full-stack developer passionate about modern web technologies.',
            },
        });

        if (hasCover) {
            setUseGeneratedCover(false);
            setUploadedCover({ url: post.coverImage.url, publicId: post.coverImage.publicId || 'existing' });
        } else {
            setUseGeneratedCover(true);
        }
    }, [post]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title' && !isEditing) {
            setFormData(p => ({
                ...p,
                title: value,
                slug: value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'),
            }));
        } else {
            setFormData(p => ({ ...p, [name]: value }));
        }
        if (errors[name]) setErrors(e => ({ ...e, [name]: undefined }));
    };

    const handleContentChange = (content) => {
        setFormData(p => ({ ...p, content }));
        if (errors.content) setErrors(e => ({ ...e, content: undefined }));
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.trim().toLowerCase().replace(/,/g, '');
            if (tag && !formData.tags.includes(tag)) {
                setFormData(p => ({ ...p, tags: [...p.tags, tag] }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tag) => setFormData(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }));

    const validate = () => {
        const errs = {};
        if (!formData.title.trim()) errs.title = 'Title is required';
        if (!formData.slug.trim()) errs.slug = 'Slug is required';
        if (!formData.excerpt.trim()) errs.excerpt = 'Excerpt is required';
        if (!formData.content.trim()) errs.content = 'Content is required';
        if (!useGeneratedCover && !uploadedCover?.url) {
            errs.coverImage = 'Please upload a cover image or enable auto-generate';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Fixed: if validation fails, return early — do NOT reset the form.
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                coverImage: useGeneratedCover ? null : uploadedCover,
            };
            await onSubmit(payload);
            // Only reset if creating a new post (not editing)
            if (!isEditing) {
                setFormData({
                    title: '', slug: '', excerpt: '', content: '',
                    category: blogCategories[0] || '', readTime: '5 min read',
                    published: true, tags: [],
                    author: { name: 'Aakash Sharma', avatar: '/assets/avatar.jpg', bio: '' },
                });
                setUploadedCover(null);
                setUseGeneratedCover(true);
            }
        } catch {
            // Errors are handled by the parent (edit/create page) and displayed via toast
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputCls = (field) =>
        `w-full bg-[#2a2a35] text-white border ${errors[field] ? 'border-red-500' : 'border-[#3a3a45]'}
         rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm
         placeholder:text-white/25 transition-colors`;

    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-white/80 text-sm font-medium mb-1.5">
                    Title <span className="text-red-400">*</span>
                </label>
                <input type="text" id="title" name="title" value={formData.title}
                    onChange={handleChange} className={inputCls('title')}
                    placeholder="My awesome blog post" />
                {errors.title && <p className="mt-1 text-red-400 text-xs">{errors.title}</p>}
            </div>

            {/* Slug */}
            <div>
                <label htmlFor="slug" className="block text-white/80 text-sm font-medium mb-1.5">
                    Slug <span className="text-red-400">*</span>
                </label>
                <input type="text" id="slug" name="slug" value={formData.slug}
                    onChange={handleChange} disabled={isEditing}
                    className={`${inputCls('slug')} font-mono ${isEditing ? 'opacity-50 cursor-not-allowed' : ''} text-accent`}
                    placeholder="my-awesome-blog-post" />
                {errors.slug
                    ? <p className="mt-1 text-red-400 text-xs">{errors.slug}</p>
                    : <p className="mt-1 text-white/30 text-xs">
                        {isEditing ? 'Slug cannot be changed — it\'s in the URL.' : 'Auto-generated from title.'}
                    </p>
                }
            </div>

            {/* Category */}
            <div>
                <label htmlFor="category" className="block text-white/80 text-sm font-medium mb-1.5">
                    Category <span className="text-red-400">*</span>
                </label>
                <select id="category" name="category" value={formData.category}
                    onChange={handleChange} className={inputCls('category')}>
                    {blogCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Excerpt */}
            <div>
                <label htmlFor="excerpt" className="block text-white/80 text-sm font-medium mb-1.5">
                    Excerpt <span className="text-red-400">*</span>
                    <span className="text-white/30 font-normal ml-2">({formData.excerpt.length}/300)</span>
                </label>
                <textarea id="excerpt" name="excerpt" value={formData.excerpt}
                    onChange={handleChange} rows={3} maxLength={300}
                    className={inputCls('excerpt')}
                    placeholder="A short summary shown on the blog listing page…" />
                {errors.excerpt && <p className="mt-1 text-red-400 text-xs">{errors.excerpt}</p>}
            </div>

            {/* ✅ TinyMCE rich text editor — replaces plain textarea */}
            <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">
                    Content <span className="text-red-400">*</span>
                </label>
                <RichTextEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    height={560}
                />
                {errors.content && <p className="mt-1.5 text-red-400 text-xs">{errors.content}</p>}
            </div>

            {/* Tags */}
            <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-accent/15 text-accent
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
                    className={inputCls(null).replace('border-undefined', 'border-[#3a3a45]')}
                    placeholder="Type a tag and press Enter or comma to add" />
            </div>

            {/* Read time */}
            <div>
                <label htmlFor="readTime" className="block text-white/80 text-sm font-medium mb-1.5">
                    Read Time
                </label>
                <input type="text" id="readTime" name="readTime" value={formData.readTime}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-xl p-3
                               focus:outline-none focus:ring-2 focus:ring-accent text-sm
                               placeholder:text-white/25 transition-colors"
                    placeholder="5 min read" />
            </div>

            {/* Cover image with toggle */}
            <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                    Cover Image <span className="text-red-400">*</span>
                </label>
                <CoverImageSection
                    useGenerated={useGeneratedCover}
                    onToggle={setUseGeneratedCover}
                    uploadedImage={uploadedCover}
                    onImageUpload={setUploadedCover}
                    title={formData.title}
                    category={formData.category}
                />
                {errors.coverImage && (
                    <p className="mt-1.5 text-red-400 text-xs">{errors.coverImage}</p>
                )}
            </div>

            {/* Publish toggle */}
            <div className="bg-[#2a2a35] border border-[#3a3a45] rounded-xl p-4">
                <Toggle
                    checked={formData.published}
                    onChange={(v) => setFormData(p => ({ ...p, published: v }))}
                    label="Publish immediately"
                    sublabel="Uncheck to save as draft"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 pt-2">
                <Link href="/admin/dashboard/blogs"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2a2a35] hover:bg-[#3a3a45]
                               text-white text-sm rounded-xl transition-colors border border-white/8">
                    <FiX size={15} /> Cancel
                </Link>
                <button type="submit" disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/80
                               disabled:bg-accent/40 disabled:cursor-not-allowed text-white
                               font-semibold text-sm rounded-xl transition-all duration-200">
                    {isSubmitting ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                             rounded-full animate-spin" />
                            {isEditing ? 'Updating…' : 'Creating…'}
                        </>
                    ) : (
                        <>
                            <FiSave size={15} />
                            {isEditing ? 'Update Post' : 'Create Post'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default BlogPostForm;