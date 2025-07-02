"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiClock, FiTag, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { blogApi } from '@/lib/api';
import ClientOnly from '@/components/ClientOnly';
import Pagination from '@/components/Pagination';
import blogCategories from '@/lib/blogCategories';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6,
        total: 0,
        pages: 0
    });

    // Debounce search term
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    // Fetch posts and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Use blogCategories directly instead of fetching
                const uniqueCategories = blogCategories.filter(cat => cat !== 'All');
                setCategories(['All', ...uniqueCategories]);

                // Fetch posts with filters and pagination
                const response = await blogApi.getPosts({
                    category: selectedCategory,
                    search: debouncedSearchTerm,
                    page: pagination.page,
                    limit: pagination.limit
                });

                setPosts(response.blogs || []);  // Ensure it's always an array
                setPagination({
                    ...pagination,
                    total: response.pagination?.total || 0,
                    pages: response.pagination?.pages || 0
                });
                setError(null); // Clear any previous errors
            } catch (error) {
                setPosts([]);  // Empty the posts array on error
                setError(`No posts found for ${selectedCategory} category. Please try again later.`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedCategory, debouncedSearchTerm, pagination.page, pagination.limit]);

    // Handle category change
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPagination({ ...pagination, page: 1 }); // Reset to first page on category change
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination({ ...pagination, page: newPage });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPagination({ ...pagination, page: 1 }); // Reset to first page on search
    };

    return (
        <ClientOnly>
            <div className="min-h-screen bg-primary">
                <div className="container mx-auto py-16 px-4">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blogs</h1>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto">
                            Thoughts, stories and ideas about web development, design, and technology
                        </p>
                    </div>

                    {/* Search bar */}
                    <div className="max-w-md mx-auto mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search by title..."
                                className="w-full px-4 py-2 pl-10 bg-[#2a2a35] border border-[#3a3a45] rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-white"
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                        </div>
                    </div>

                    {/* Category Filter (hidden on mobile) */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12 hidden md:flex">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                    ? 'bg-accent text-primary'
                                    : 'bg-[#2a2a35] text-white hover:bg-[#3a3a45]'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="container mx-auto px-4 py-12">
                        {/* Loading state */}
                        {isLoading && <div className="flex justify-center items-center py-12">
                            <div className="loader"></div>
                        </div>}

                        {/* Error state */}
                        {!isLoading && error && (
                            <div className="text-center py-12 text-red-500">
                                {error}
                            </div>
                        )}

                        {/* Empty state - No blogs found */}
                        {!isLoading && !error && posts.length === 0 && (
                            <div className="text-center py-16">
                                <h3 className="text-xl font-medium text-gray-700">
                                    No blogs found{selectedCategory !== 'All' ? ` for "${selectedCategory}" category` : ''}.
                                </h3>
                                {debouncedSearchTerm && (
                                    <p className="mt-2 text-gray-500">
                                        Try adjusting your search or filter criteria.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Posts grid when data is available */}
                        {!isLoading && !error && posts.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {posts.map((post) => (
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            key={post.slug}
                                            className="bg-[#1e1e24] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px]"
                                        >
                                            <div className="relative h-48 w-full">
                                                <Image
                                                    src={post.coverImage?.url || '/assets/blog/default-cover.jpg'}
                                                    alt={post.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <span className="flex items-center text-accent text-sm">
                                                        <FiTag className="mr-1" />
                                                        {post.category}
                                                    </span>
                                                    <span className="flex items-center text-white/60 text-sm">
                                                        <FiClock className="mr-1" />
                                                        {post.readTime}
                                                    </span>
                                                </div>
                                                <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                                                <p className="text-white/70 mb-4 line-clamp-2">{post.excerpt}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                                                            <Image
                                                                src={post.author?.avatar || '/assets/avatar.jpg'}
                                                                alt={post.author?.name || 'Author'}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-white/80 text-sm">{post.author?.name || 'Author'}</span>
                                                    </div>
                                                    <span className="text-white/60 text-sm flex items-center">
                                                        <FiCalendar className="mr-1" />
                                                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                {/* Pagination component */}
                                {pagination.pages > 1 && (
                                    <Pagination
                                        currentPage={pagination.page}
                                        totalPages={pagination.pages}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </ClientOnly>
    );
};

export default BlogPage;