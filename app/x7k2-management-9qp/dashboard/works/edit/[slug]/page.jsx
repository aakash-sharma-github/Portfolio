'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import { Toaster, toast } from 'sonner';
import { FiUpload, FiX, FiImage, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { workApi, blogApi } from '@/lib/api';

// ─── Toggle ───────────────────────────────────────────────────────────────────
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

      // ✅ Uses blogApi.uploadImage which goes through the axios instance
      //    with the Authorization header — same fix as the blog create page
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
                               text-white p-1.5 rounded-full transition-colors"
          title="Remove image">
          <FiX size={16} />
        </button>
        <div className="absolute bottom-3 left-3 bg-green-600/90 text-white
                                text-[10px] font-bold px-2.5 py-1 rounded-full
                                uppercase tracking-wider backdrop-blur-sm">
          Cloudinary ✓
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-[#3a3a45] hover:border-accent/50
                        rounded-xl p-8 text-center transition-colors">
      <FiImage className="text-4xl text-white/20 mx-auto mb-3" />
      <p className="text-white/45 text-sm mb-4">Upload a project cover (max 5 MB)</p>
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
        <input ref={fileRef} type="file" accept="image/*"
          onChange={handleFile} disabled={isUploading} className="hidden" />
      </label>
      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
    </div>
  );
};

// ─── Edit page ────────────────────────────────────────────────────────────────
const EditProject = ({ params }) => {
  const { slug } = params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);
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

  // ── Load existing work ────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await workApi.getWorkBySlug(slug);

        // Normalise technologies — can be array of strings or objects
        const technologies = (
          Array.isArray(data.technologies) ? data.technologies :
            Array.isArray(data.stack) ? data.stack : []
        ).map(t => (typeof t === 'object' ? t.name : t)).filter(Boolean);

        const links = {
          live: data.links?.live || data.live || '',
          github: data.links?.github || data.github || '',
        };

        // Normalise coverImage
        let ci = null;
        if (typeof data.coverImage === 'string' && data.coverImage.startsWith('http')) {
          ci = { url: data.coverImage, publicId: 'external' };
        } else if (data.coverImage?.url) {
          ci = { url: data.coverImage.url, publicId: data.coverImage.publicId || 'external' };
        }

        setProject({
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          category: data.category || 'Web Development',
          technologies,
          status: data.status || 'completed',
          featured: Boolean(data.featured),
          links,
          client: data.client || '',
          role: data.role || '',
        });
        setCoverImage(ci);
        setLoadError(null);
      } catch (err) {
        const msg = err?.response?.data?.error || err.message || 'Failed to load project.';
        setLoadError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [slug]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('links.')) {
      const key = name.split('.')[1];
      setProject(p => ({ ...p, links: { ...p.links, [key]: value } }));
    } else {
      setProject(p => ({ ...p, [name]: value }));
    }
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !project.technologies.includes(t)) {
      setProject(p => ({ ...p, technologies: [...p.technologies, t] }));
    }
    setTechInput('');
  };

  const removeTech = (idx) =>
    setProject(p => ({ ...p, technologies: p.technologies.filter((_, i) => i !== idx) }));

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!project.title || !project.description) {
      toast.error('Title and description are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Normalise technologies to { name } objects for the API
      const technologies = project.technologies.map(t =>
        typeof t === 'string' ? { name: t } : t
      );

      // Ensure coverImage always has { url, publicId }
      const finalCover = coverImage?.url
        ? { url: coverImage.url, publicId: coverImage.publicId || 'external' }
        : { url: '/images/portfolio_01.png', publicId: 'default' };

      await workApi.updateWork(slug, {
        ...project,
        technologies,
        coverImage: finalCover,
        content: '',   // not required by the new API
      });

      toast.success('Project updated successfully!');
      router.push('/x7k2-management-9qp/dashboard/works');
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Failed to update project.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading / error states ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <AdminLayout title="Edit Project">
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent
                                    rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (loadError) {
    return (
      <AdminLayout title="Edit Project">
        <div className="bg-red-500/10 border border-red-500/40 text-white
                                p-6 rounded-2xl max-w-lg mx-auto">
          <p className="font-bold text-red-400 mb-1">Failed to load project</p>
          <p className="text-white/60 text-sm mb-4">{loadError}</p>
          <button onClick={() => router.push('/x7k2-management-9qp/dashboard/works')}
            className="flex items-center gap-2 text-sm text-white/60
                                   hover:text-white transition-colors">
            <FiArrowLeft /> Back to Projects
          </button>
        </div>
      </AdminLayout>
    );
  }

  const inputCls = `w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-xl p-3
                      focus:outline-none focus:ring-2 focus:ring-accent text-sm
                      placeholder:text-white/25 transition-colors`;

  return (
    <AdminLayout title="Edit Project">

      <div className="max-w-3xl mx-auto">
        <div className="bg-[#1e1e24] border border-white/6 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <button type="button" onClick={() => router.push('/x7k2-management-9qp/dashboard/works')}
              className="text-white/40 hover:text-white transition-colors">
              <FiArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white">
              Edit: <span className="text-accent">{project.title}</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Title */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1.5">
                Title <span className="text-red-400">*</span>
              </label>
              <input type="text" name="title" value={project.title}
                onChange={handleChange} className={inputCls}
                placeholder="Project Title" required />
            </div>

            {/* Slug — read-only */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1.5">
                Slug
              </label>
              <input type="text" value={project.slug} readOnly
                className={`${inputCls} opacity-50 cursor-not-allowed font-mono text-accent`} />
              <p className="text-white/25 text-xs mt-1">
                Slug cannot be changed — it's used in the URL.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1.5">
                Description <span className="text-red-400">*</span>
                <span className="text-white/30 font-normal ml-2">
                  ({project.description.length}/500)
                </span>
              </label>
              <textarea name="description" value={project.description}
                onChange={handleChange} className={inputCls} rows={4}
                maxLength={500}
                placeholder="Short description of the project…" required />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1.5">
                Category
              </label>
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
              <label className="block text-white/80 text-sm font-medium mb-1.5">
                Technologies
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.technologies.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1
                                        bg-accent/15 text-accent border border-accent/25
                                        text-xs px-2.5 py-1 rounded-full">
                    {t}
                    <button type="button" onClick={() => removeTech(i)}
                      className="text-accent/60 hover:text-accent">
                      <FiX size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                  className={`${inputCls} flex-1`}
                  placeholder="React, Node.js… (Enter to add)" />
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
                <label className="block text-white/80 text-sm font-medium mb-1.5">
                  Live URL
                </label>
                <input type="url" name="links.live" value={project.links.live}
                  onChange={handleChange} className={inputCls}
                  placeholder="https://myproject.com" />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">
                  GitHub URL
                </label>
                <input type="url" name="links.github" value={project.links.github}
                  onChange={handleChange} className={inputCls}
                  placeholder="https://github.com/user/repo" />
              </div>
            </div>

            {/* Client + Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">
                  Client
                </label>
                <input type="text" name="client" value={project.client}
                  onChange={handleChange} className={inputCls}
                  placeholder="Client name (optional)" />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">
                  Your Role
                </label>
                <input type="text" name="role" value={project.role}
                  onChange={handleChange} className={inputCls}
                  placeholder="Full-Stack Developer (optional)" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1.5">
                Status
              </label>
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
                onChange={(v) => setProject(p => ({ ...p, featured: v }))}
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
                  Updating…
                </>
              ) : 'Update Project'}
            </button>
          </form>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </AdminLayout>
  );
};

export default EditProject;