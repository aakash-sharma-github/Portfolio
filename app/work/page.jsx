'use client'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { BsArrowUpRight, BsGithub, BsEye, BsCode, BsGrid3X3Gap, BsList } from 'react-icons/bs'
import { FiExternalLink, FiGithub, FiCalendar, FiTag, FiLayers } from 'react-icons/fi'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import Link from 'next/link'
import Image from 'next/image'
import StatusBadge from '@/components/StatusBadge';
import { workApi } from '@/lib/api';
import axios from 'axios';

// Define fallback projects for when API fails
const fallbackProjects = [
    {
        num: '01',
        category: 'Web Development',
        title: 'Personal Portfolio',
        description:
            'A personal portfolio website that showcases my skills and projects. Built using Next.js, Tailwind CSS, and Framer Motion.',
        content: '',
        status: 'completed',
        stack: [
            { name: 'HTML 5' },
            { name: 'Tailwind CSS' },
            { name: 'Next.js' },
            { name: 'Framer Motion' }
        ],
        image: '/images/portfolio_01.png',
        live: '',
        github: ''
    },
    {
        num: '02',
        category: 'Web Development',
        title: 'Personal Portfolio',
        description:
            'A personal portfolio website that showcases my skills and projects. Built using Next.js, Tailwind CSS, and Framer Motion.',
        content: '',
        status: 'completed',
        stack: [
            { name: 'HTML 5' },
            { name: 'Tailwind CSS' },
            { name: 'Next.js' },
            { name: 'Framer Motion' }
        ],
        image: '/images/portfolio_02.png',
        live: 'https://aakash-sharma-github.netlify.app/',
        github: 'https://github.com/aakash-sharma-github/Portfolio_Website.git'
    }
];

// Project card component for better organization
const ProjectCard = ({ project, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.02] to-white/[0.08] backdrop-blur-sm border border-white/10 hover:border-accent/30 transition-all duration-500"
        >
            {/* Project Image */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                    <StatusBadge status={project.status || 'completed'} size="sm" />
                </div>
                
                {/* Project Number */}
                <div className="absolute top-4 left-4">
                    <span className="text-2xl font-bold text-white/80 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg">
                        {project.num}
                    </span>
                </div>
                
                {/* Action Buttons - Show on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex gap-3">
                        {project.live && (
                            <Link href={project.live} target="_blank">
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger className="w-12 h-12 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center hover:bg-accent transition-colors">
                                            <FiExternalLink className="text-white text-lg" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>View Live Demo</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Link>
                        )}
                        {project.github && (
                            <Link href={project.github} target="_blank">
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                                            <FiGithub className="text-white text-lg" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>View Source Code</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Project Content */}
            <div className="p-6 space-y-4">
                {/* Category */}
                <div className="flex items-center gap-2 text-accent/80">
                    <FiTag className="text-sm" />
                    <span className="text-sm font-medium uppercase tracking-wider">{project.category}</span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300">
                    {project.title}
                </h3>
                
                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                </p>
                
                {/* Additional Content */}
                {project.content && (
                    <p className="text-white/60 text-xs leading-relaxed line-clamp-2 border-t border-white/10 pt-3">
                        {project.content}
                    </p>
                )}
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {project.stack.slice(0, 4).map((tech, techIndex) => (
                        <span
                            key={techIndex}
                            className="px-2 py-1 text-xs font-medium bg-accent/10 text-accent border border-accent/20 rounded-md hover:bg-accent/20 transition-colors"
                        >
                            {tech.name}
                        </span>
                    ))}
                    {project.stack.length > 4 && (
                        <span className="px-2 py-1 text-xs font-medium bg-white/5 text-white/60 border border-white/10 rounded-md">
                            +{project.stack.length - 4} more
                        </span>
                    )}
                </div>
                
                {/* Links at Bottom */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="flex gap-2">
                        {project.live && (
                            <Link
                                href={project.live}
                                target="_blank"
                                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                            >
                                <BsEye className="text-sm" />
                                <span>Demo</span>
                            </Link>
                        )}
                        {project.github && (
                            <Link
                                href={project.github}
                                target="_blank"
                                className="flex items-center gap-1 text-xs text-white/60 hover:text-white/80 transition-colors"
                            >
                                <BsCode className="text-sm" />
                                <span>Code</span>
                            </Link>
                        )}
                    </div>
                    <span className="text-xs text-white/40">#{project.num}</span>
                </div>
            </div>
        </motion.div>
    );
};

// List view component for projects
const ProjectListItem = ({ project, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white/[0.02] to-white/[0.08] backdrop-blur-sm border border-white/10 hover:border-accent/30 transition-all duration-500"
        >
            <div className="flex flex-col md:flex-row">
                {/* Project Image */}
                <div className="relative md:w-80 h-48 md:h-auto overflow-hidden">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 320px"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/40" />
                    
                    {/* Project Number */}
                    <div className="absolute top-4 left-4">
                        <span className="text-xl font-bold text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg">
                            {project.num}
                        </span>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                        <StatusBadge status={project.status || 'completed'} size="sm" />
                    </div>
                </div>
                
                {/* Project Content */}
                <div className="flex-1 p-6 md:p-8">
                    <div className="h-full flex flex-col justify-between">
                        <div className="space-y-4">
                            {/* Category */}
                            <div className="flex items-center gap-2 text-accent/80">
                                <FiTag className="text-sm" />
                                <span className="text-sm font-medium uppercase tracking-wider">{project.category}</span>
                            </div>
                            
                            {/* Title */}
                            <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-accent transition-colors duration-300">
                                {project.title}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-white/70 leading-relaxed">
                                {project.description}
                            </p>
                            
                            {/* Additional Content */}
                            {project.content && (
                                <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                                    {project.content}
                                </p>
                            )}
                        </div>
                        
                        <div className="mt-6 space-y-4">
                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-2">
                                {project.stack.slice(0, 6).map((tech, techIndex) => (
                                    <span
                                        key={techIndex}
                                        className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent border border-accent/20 rounded-full hover:bg-accent/20 transition-colors"
                                    >
                                        {tech.name}
                                    </span>
                                ))}
                                {project.stack.length > 6 && (
                                    <span className="px-3 py-1 text-xs font-medium bg-white/5 text-white/60 border border-white/10 rounded-full">
                                        +{project.stack.length - 6} more
                                    </span>
                                )}
                            </div>
                            
                            {/* Action Links */}
                            <div className="flex items-center gap-4">
                                {project.live && (
                                    <Link
                                        href={project.live}
                                        target="_blank"
                                        className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-all duration-300 hover:scale-105"
                                    >
                                        <FiExternalLink className="text-sm" />
                                        <span className="font-medium">Live Demo</span>
                                    </Link>
                                )}
                                {project.github && (
                                    <Link
                                        href={project.github}
                                        target="_blank"
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-all duration-300 hover:scale-105"
                                    >
                                        <FiGithub className="text-sm" />
                                        <span className="font-medium">Source Code</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Work = () => {
    const [projects, setProjects] = useState(fallbackProjects);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Fetch projects from the API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                console.log('Fetching featured projects...');
                
                const response = await axios.get('/api/works?limit=10');
                const data = response.data;
                
                if (data && data.works && data.works.length > 0) {
                    const formattedProjects = data.works.map((work, index) => {
                        let techStack = [];
                        if (work.technologies && work.technologies.length > 0) {
                            techStack = work.technologies;
                        } else if (work.stack && work.stack.length > 0) {
                            techStack = work.stack;
                        } else {
                            techStack = [{ name: 'HTML 5' }, { name: 'Tailwind CSS' }, { name: 'Next.js' }];
                        }
                        
                        const liveLink = work.links?.live || work.live || '';
                        const githubLink = work.links?.github || work.github || '';
                        
                        return {
                            id: work._id || index,
                            num: String(index + 1).padStart(2, '0'),
                            category: work.category || 'Web Development',
                            title: work.title,
                            description: work.description,
                            content: work.content || '',
                            status: work.status || 'completed',
                            stack: techStack,
                            image: work.coverImage?.url || '/images/portfolio_01.png',
                            live: liveLink,
                            github: githubLink
                        };
                    });
                    setProjects(formattedProjects);
                } else {
                    console.log('No projects found, using fallback data');
                    setProjects(fallbackProjects);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to fetch projects. Using fallback data.');
                setProjects(fallbackProjects);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Get unique categories
    const categories = ['All', ...new Set(projects.map(project => project.category))];
    
    // Filter projects by category
    const filteredProjects = selectedCategory === 'All' 
        ? projects 
        : projects.filter(project => project.category === selectedCategory);

    if (isLoading) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
                    <p className="text-white/60">Loading amazing projects...</p>
                </div>
            </section>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: {
                    delay: 0.3,
                    duration: 0.6,
                    ease: "easeOut"
                }
            }}
            className="min-h-screen py-20"
        >
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        My <span className="text-accent">Projects</span>
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                        Explore my portfolio of web applications, featuring modern technologies and creative solutions.
                    </p>
                </motion.div>

                {/* Filters and View Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12"
                >
                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    selectedCategory === category
                                        ? 'bg-accent text-white shadow-lg shadow-accent/25'
                                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${
                                viewMode === 'grid'
                                    ? 'bg-accent text-white'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <BsGrid3X3Gap className="text-lg" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${
                                viewMode === 'list'
                                    ? 'bg-accent text-white'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <BsList className="text-lg" />
                        </button>
                    </div>
                </motion.div>

                {/* Projects Grid/List */}
                <AnimatePresence mode="wait">
                    {filteredProjects.length > 0 ? (
                        <motion.div
                            key={`${viewMode}-${selectedCategory}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className={viewMode === 'grid' 
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                                : "space-y-6"
                            }
                        >
                            {filteredProjects.map((project, index) => (
                                viewMode === 'grid' ? (
                                    <ProjectCard key={project.id || index} project={project} index={index} />
                                ) : (
                                    <ProjectListItem key={project.id || index} project={project} index={index} />
                                )
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
                            <p className="text-white/60">No projects match the selected category.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 p-4 rounded-lg mt-8 text-center"
                    >
                        <p>{error}</p>
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
};

export default Work;
