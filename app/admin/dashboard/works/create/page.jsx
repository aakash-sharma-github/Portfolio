"use client";

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Toaster, toast } from 'sonner';

const CreateProject = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [project, setProject] = useState({
        title: '',
        slug: '',
        description: '',
        content: '',
        category: 'Web Development',
        technologies: [],
        status: 'completed',
        featured: false,
        coverImage: null,
        images: [],  // For additional project images
        links: {
            live: '',
            github: ''
        }
    });

    const [techInput, setTechInput] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested link fields
        if (name.startsWith('links.')) {
            const linkType = name.split('.')[1]; // Either 'live' or 'github'
            setProject({
                ...project,
                links: {
                    ...project.links,
                    [linkType]: value
                }
            });
        } else {
            // Handle regular fields
            setProject({ ...project, [name]: value });

            // Auto-generate slug from title
            if (name === 'title') {
                setProject({
                    ...project,
                    title: value,
                    slug: value.toLowerCase()
                        .replace(/[^\w\s]/gi, '')
                        .replace(/\s+/g, '-')
                });
            }
        }
    };

    const handleTechKeyDown = (e) => {
        if (e.key === 'Enter' && techInput.trim()) {
            e.preventDefault();
            if (!project.technologies.includes(techInput.trim())) {
                setProject({
                    ...project,
                    technologies: [...project.technologies, techInput.trim()]
                });
            }
            setTechInput('');
        }
    };

    const removeTech = (tech) => {
        setProject({
            ...project,
            technologies: project.technologies.filter(t => t !== tech)
        });
    };

    const handleCoverImageUpload = (imageData) => {
        setProject({
            ...project,
            coverImage: imageData
        });
    };

    const handleAdditionalImageUpload = (imageData) => {
        if (!imageData) return;

        setProject({
            ...project,
            images: [...project.images, imageData]
        });
    };

    const handleRemoveAdditionalImage = (index) => {
        setProject({
            ...project,
            images: project.images.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate required fields
            if (!project.title || !project.slug || !project.description || !project.content) {
                toast.error('Please fill in all required fields');
                setIsSubmitting(false);
                return;
            }

            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/works', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(project),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create project');
            }

            toast.success('Project created successfully');
            router.push('/admin/dashboard/works');
        } catch (error) {
            toast.error(error.message || 'Failed to create project');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout title="Create Project">
            <div className="bg-[#1e1e24] rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-white mb-2">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={project.title}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Project Title"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-white mb-2">Slug *</label>
                        <input
                            type="text"
                            name="slug"
                            value={project.slug}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="project-slug"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-white mb-2">Description *</label>
                        <textarea
                            name="description"
                            value={project.description}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Short description of the project"
                            rows="3"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-white mb-2">Content *</label>
                        <textarea
                            name="content"
                            value={project.content}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Full project content/details (Markdown supported)"
                            rows="10"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-white mb-2">Category *</label>
                        <select
                            name="category"
                            value={project.category}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        >
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile App">Mobile App</option>
                            <option value="Desktop App">Desktop App</option>
                            <option value="API Development">API Development</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="Full Stack Development">Full Stack Development</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Technologies */}
                    <div>
                        <label className="block text-white mb-2">Technologies</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {project.technologies.map((tech, index) => (
                                <span
                                    key={index}
                                    className="bg-accent/20 text-accent px-3 py-1 rounded-full flex items-center"
                                >
                                    {tech}
                                    <button
                                        type="button"
                                        className="ml-2 text-accent hover:text-white"
                                        onClick={() => removeTech(tech)}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={handleTechKeyDown}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Add technologies (press Enter to add)"
                        />
                    </div>

                    {/* Live Link */}
                    <div>
                        <label className="block text-white mb-2">Live Project URL</label>
                        <input
                            type="url"
                            name="links.live"
                            value={project.links.live}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="https://project-live-link.com"
                        />
                    </div>

                    {/* GitHub Link */}
                    <div>
                        <label className="block text-white mb-2">GitHub Repository URL</label>
                        <input
                            type="url"
                            name="links.github"
                            value={project.links.github}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="https://github.com/username/repo"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-white mb-2">Status</label>
                        <select
                            name="status"
                            value={project.status}
                            onChange={handleChange}
                            className="w-full bg-[#2a2a35] text-white border border-[#3a3a45] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    {/* Featured */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            checked={project.featured}
                            onChange={(e) => setProject({ ...project, featured: e.target.checked })}
                            className="w-5 h-5 text-accent bg-[#2a2a35] border-[#3a3a45] rounded focus:ring-accent focus:ring-2"
                        />
                        <label htmlFor="featured" className="text-white ml-2">Feature this project</label>
                    </div>

                    {/* Cover Image */}
                    <ImageUploader
                        onImageUpload={handleCoverImageUpload}
                        currentImage={project.coverImage}
                        label="Cover Image *"
                        folder="projects"
                    />

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full ${isSubmitting ? 'bg-accent/50' : 'bg-accent hover:bg-accent/80'} text-white py-3 rounded-lg font-semibold transition-all`}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
            <Toaster richColors />
        </AdminLayout>
    );
};

export default CreateProject;
