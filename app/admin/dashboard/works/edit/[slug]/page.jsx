'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import { FiTrash2 } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';
import { Toaster, toast } from 'sonner';

const EditProject = ({ params }) => {
  const { slug } = params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [techInput, setTechInput] = useState('');
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
    images: [],
    links: {
      live: '',
      github: ''
    }
  });

  // Fetch the work data
  useEffect(() => {
    const fetchWorkData = async () => {
      try {
        setIsLoading(true);

        // Get the authentication token
        const token = localStorage.getItem('adminToken');
        if (!token) {
          toast.error('Authentication required. Please login again.');
          router.push('/admin');
          return;
        }

        // Fetch the specific work by slug
        const response = await fetch(`/api/works/${slug}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch work with slug "${slug}"`);
        }

        const workData = await response.json();

        // Convert technologies to array of strings if they're objects
        let technologies = [];
        if (Array.isArray(workData?.technologies)) {
          technologies = workData.technologies.map(tech =>
            typeof tech === 'object' ? tech.name : tech
          );
        } else if (Array.isArray(workData?.stack)) {
          technologies = workData.stack.map(tech =>
            typeof tech === 'object' ? tech.name : tech
          );
        }

        // Format links
        const links = {
          live: workData?.links?.live || workData?.live || '',
          github: workData?.links?.github || workData?.github || ''
        };

        // Normalize coverImage structure
        let coverImage = workData?.coverImage;
        if (typeof coverImage === 'string') {
          // If coverImage is just a string URL, convert to object
          coverImage = {
            url: coverImage,
            publicId: 'external'
          };
        } else if (!coverImage || !coverImage.url) {
          // If no coverImage or invalid format, set to null
          coverImage = null;
        }

        // Set the project state
        setProject({
          title: workData?.title || '',
          slug: workData?.slug || '',
          description: workData?.description || '',
          content: workData?.content || '',
          category: workData?.category || 'Web Development',
          technologies,
          status: workData?.status || 'completed',
          featured: Boolean(workData?.featured),
          coverImage,
          images: Array.isArray(workData?.images) ? workData.images : [],
          links
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching work:', err);
        setError(err.message || 'Failed to fetch work data');
        toast.error(err.message || 'Failed to fetch work data');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchWorkData();
    }
  }, [slug, router]);

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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProject({
      ...project,
      [name]: checked
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

      // Format technologies as objects if they are strings
      const formattedTechnologies = project.technologies.map(tech =>
        typeof tech === 'string' ? { name: tech } : tech
      );

      // Ensure coverImage is properly formatted
      let formattedCoverImage = project.coverImage;

      // If coverImage is null or undefined or a plain string URL, normalize it
      if (!formattedCoverImage) {
        formattedCoverImage = {
          url: '/images/portfolio_01.png',
          publicId: 'default'
        };
      } else if (typeof formattedCoverImage === 'string') {
        formattedCoverImage = {
          url: formattedCoverImage,
          publicId: 'external'
        };
      }

      // Prepare the data for submission
      const submissionData = {
        ...project,
        technologies: formattedTechnologies,
        coverImage: formattedCoverImage
      };

      // Get the authentication token
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Authentication required. Please login again.');
        router.push('/admin');
        return;
      }

      const response = await fetch(`/api/works/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update project');
      }

      toast.success('Project updated successfully');
      router.push('/admin/dashboard/works');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Edit Project">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Edit Project">
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => router.push('/admin/dashboard/works')}
            className="mt-4 px-4 py-2 bg-white text-red-500 rounded-md hover:bg-gray-100"
          >
            Back to Projects
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Project">
      <div className="bg-[#1e1e24] rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Project: {project.title}</h2>

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
              disabled  // Disable changing the slug to avoid URL conflicts
            />
            <p className="text-white/50 text-sm mt-1">Slug cannot be changed as it's used in the URL.</p>
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
              onChange={handleCheckboxChange}
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
              {isSubmitting ? 'Updating...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
      <Toaster richColors />
    </AdminLayout>
  );
};

export default EditProject;
