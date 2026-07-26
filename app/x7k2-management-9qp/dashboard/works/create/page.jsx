"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Toaster, toast } from 'sonner';
import { FiUpload, FiX, FiImage, FiPlus } from 'react-icons/fi';
import { workApi, blogApi } from '@/lib/api';

// ─── Reusable toggle ──────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-3 cursor-pointer select-none">
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200
                        ${checked ? 'bg-accent' : 'bg-white/15'}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow
                              transition-transform duration-200
                              ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
        <span className="text-white/80 text-sm">{label}</span>
    </label>
);

// ─── Cover uploader ───────────────────────────────────────────────────────────
const CoverUploader = ({ image, onUpload, onRemove }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef(null);

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError('');

        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
            setError('Please select a JPG, PNG, WEBP, or GIF.'); return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be under 5 MB.'); return;
        }

        setIsUploading(true);
        try {
            const base64 = await new Promise((res, rej) => {
                const r = new FileReader();
                r.onload = () => res(r.result);
                r.onerror = rej;
                r.readAsDataURL(file);
            });

            const result = await blogApi.uploadImage(base64, 'works/covers');
            onUpload({ url: result.url, publicId: result.publicId });
            toast.success('Cover image uploaded');
        } catch (err) {
            const msg = err?.response?.data?.error || err.message || 'Upload failed.';
            setError(msg);
            toast.error('Cover upload failed');
        } finally {
            setIsUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    if (image?.url) {
        return (
            <div className="relative rounded-xl overflow-hidden border border-white/10">
                <Image src={image.url} alt="Cover" width={1200} height={400}
                    className="w-full h-48 object-cover" />
                <button type="button" onClick={onRemove}
                    className="absolute top-3 right-3 bg-red-600 hover:bg-red-700
                               text-white p-1.5 rounded-full transition-colors">
                    <FiX size={16} />
                </button>
                <div className="absolute bottom-3 left-3 bg-green-600/90 text-white
                                text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Uploaded ✓
                </div>
            </div>
        );
    }

    return (
        <div className="border-2 border-dashed border-[#3a3a45] hover:border-accent/50
                        rounded-xl p-8 text-center transition-colors">
            <FiImage className="text-4xl text-white/20 mx-auto mb-3" />
            <p className="text-white/45 text-sm mb-4">Upload a project cover image (max 5 MB)</p>
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
                    <><FiUpload /> Select Image</>
                )}
                <input ref={fileRef} type="file" accept="image/*"
                    onChange={handleFile} disabled={isUploading} className="hidden" />
            </label>
            {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
        </div>
    );
};

// ─── Main create page ─────────────────────────────────────────────────────────
const CreateProject = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [techInput, setTechInput] = useState('');
    const [coverImage, setCoverImage] = useState(null);

    const [project, setProject] = useState({
        title: '',
        slug: '',
        description: '',
        category: 'Web Development',
        technologies: [],
        status: 'completed',
        featured: false,
        links: { live: '', github: '' },
        client: '',
        role: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('links.')) {
            const key = name.split('.')[1];
            setProject((p) => ({ ...p, links: { ...p.links, [key]: value } }));
        } else if (name === 'title') {
            setProject((p) => ({
                ...p, title: value,
                slug: value.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').replace(/-+/g, '-'),
            }));
        } else {
            setProject((p) => ({ ...p, [name]: value }));
        }
    };

    const addTech = () => {
        const t = techInput.trim();
        if (t && !project.technologies.some(x => (typeof x === 'string' ? x : x.name) === t)) {
            setProject((p) => ({ ...p, technologies: [...p.technologies, t] }));
        }
        setTechInput('');
    };

    const removeTech = (idx) =>
        setProject((p) => ({ ...p, technologies: p.technologies.filter((_, i) => i !== idx) }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!project.title || !project.slug || !project.description) {
            toast.error('Title, slug, and description are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            await workApi.createWork({
                ...project,
                // If no cover was uploaded, send null — the API will use the
                // default placeholder /images/portfolio_01.png
                coverImage: coverImage || null,
                content: '',   // not required, send empty string
            });
            toast.success('Project created!');
            router.push('/x7k2-management-9qp/dashboard/works');
        } catch (err) {
            const msg = err?.response?.data?.error || err.message || 'Failed to create project.';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputCls = `w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-xl p-3
                      focus:outline-none focus:ring-2 focus:ring-accent text-sm
                      placeholder:text-white/25 transition-colors`;

    return (
        <AdminLayout title="Create Project">

            <div className="max-w-3xl mx-auto">
                <div className="bg-[#1e1e24] border border-white/6 rounded-2xl p-6 md:p-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-8">Create New Project</h2>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Title */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">
                                Title <span className="text-red-400">*</span>
                            </label>
                            <input type="text" name="title" value={project.title}
                                onChange={handleChange} className={inputCls}
                                placeholder="My Awesome Project" required />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">
                                Slug <span className="text-red-400">*</span>
                            </label>
                            <input type="text" name="slug" value={project.slug}
                                onChange={handleChange}
                                className={`${inputCls} font-mono text-accent`}
                                placeholder="my-awesome-project" required />
                            <p className="text-white/30 text-xs mt-1">Auto-generated from title.</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">
                                Description <span className="text-red-400">*</span>
                                <span className="text-white/30 font-normal ml-2">({project.description.length}/500)</span>
                            </label>
                            <textarea name="description" value={project.description}
                                onChange={handleChange} className={inputCls} rows={4}
                                maxLength={500}
                                placeholder="A short description of the project…" required />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">Category</label>
                            <select name="category" value={project.category}
                                onChange={handleChange} className={inputCls}>
                                {['Web Development', 'Mobile App', 'Desktop App', 'API Development',
                                    'E-commerce', 'Full Stack Development', 'Other'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                            </select>
                        </div>

                        {/* Technologies */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">Technologies</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {project.technologies.map((t, i) => {
                                    const name = typeof t === 'string' ? t : t.name;
                                    return (
                                        <span key={i} className="inline-flex items-center gap-1
                                            bg-accent/15 text-accent border border-accent/25
                                            text-xs px-2.5 py-1 rounded-full">
                                            {name}
                                            <button type="button" onClick={() => removeTech(i)}
                                                className="text-accent/60 hover:text-accent">
                                                <FiX size={11} />
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2">
                                <input type="text" value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                                    className={`${inputCls} flex-1`}
                                    placeholder="React, Node.js, MongoDB… (Enter to add)" />
                                <button type="button" onClick={addTech}
                                    className="px-4 bg-accent/20 hover:bg-accent/30 text-accent
                                               border border-accent/25 rounded-xl transition-colors
                                               flex items-center gap-1.5 text-sm font-medium">
                                    <FiPlus /> Add
                                </button>
                            </div>
                        </div>

                        {/* Live + GitHub */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-1.5">Live URL</label>
                                <input type="url" name="links.live" value={project.links.live}
                                    onChange={handleChange} className={inputCls}
                                    placeholder="https://myproject.com" />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-1.5">GitHub URL</label>
                                <input type="url" name="links.github" value={project.links.github}
                                    onChange={handleChange} className={inputCls}
                                    placeholder="https://github.com/user/repo" />
                            </div>
                        </div>

                        {/* Client + Role */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-1.5">Client</label>
                                <input type="text" name="client" value={project.client}
                                    onChange={handleChange} className={inputCls}
                                    placeholder="Client name (optional)" />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-1.5">Your Role</label>
                                <input type="text" name="role" value={project.role}
                                    onChange={handleChange} className={inputCls}
                                    placeholder="Full-Stack Developer (optional)" />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1.5">Status</label>
                            <select name="status" value={project.status}
                                onChange={handleChange} className={inputCls}>
                                <option value="completed">Completed</option>
                                <option value="in-progress">In Progress</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        {/* Cover image */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-3">
                                Cover Image
                                <span className="text-white/30 font-normal ml-2">
                                    (optional — uses a default placeholder if left blank)
                                </span>
                            </label>
                            <CoverUploader
                                image={coverImage}
                                onUpload={setCoverImage}
                                onRemove={() => setCoverImage(null)}
                            />
                        </div>

                        {/* Featured */}
                        <div className="bg-[#2a2a35] border border-[#3a3a45] rounded-xl p-4">
                            <Toggle
                                checked={project.featured}
                                onChange={(v) => setProject((p) => ({ ...p, featured: v }))}
                                label="Feature this project on the homepage"
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
                            ) : 'Create Project'}
                        </button>
                    </form>
                </div>
            </div>
            <Toaster richColors position="bottom-right" />
        </AdminLayout>
    );
};

export default CreateProject;