'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { blogApi } from '@/lib/api';

const ImageUpload = ({ value, onChange, className = '', postTitle = 'Blog Post' }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    // Track image load errors
    const [imageError, setImageError] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                try {
                    // Upload to Cloudinary via our API
                    const result = await blogApi.uploadImage(reader.result);
                    onChange(result.url);
                    setImageError(false); // Reset error state on successful upload
                } catch (error) {
                    setError('Failed to upload image. Please try again.');
                } finally {
                    setIsUploading(false);
                }
            };
        } catch (error) {
            console.error('Error reading file:', error);
            setError('Failed to read file. Please try again.');
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        onChange('');
        setImageError(false);
    };

    const handleUseDefaultCover = () => {
        // Add timestamp to prevent browser caching issues
        const timestamp = Date.now();
        const defaultCoverUrl = `/api/default-cover?title=${encodeURIComponent(postTitle)}&t=${timestamp}`;
        onChange(defaultCoverUrl);
        setImageError(false);
    };

    // Safely validate the image URL
    const isValidImageUrl = (url) => {
        return url && typeof url === 'string' && url.trim() !== '';
    };

    return (
        <div className={`${className}`}>
            {isValidImageUrl(value) && !imageError ? (
                <div className="relative">
                    <div className="relative w-full h-48 rounded-md overflow-hidden">
                        <Image
                            src={value}
                            alt="Cover image"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                            unoptimized={!value.startsWith('/')}
                            onError={() => {
                                setImageError(true);
                            }}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                        <FiX size={16} />
                    </button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-[#3a3a45] rounded-md p-4 text-center">
                    {imageError && (
                        <div className="mb-4 bg-amber-500/20 border border-amber-500 text-white p-2 rounded-md">
                            Failed to load image. Please upload a new one.
                        </div>
                    )}
                    <label className="cursor-pointer block">
                        <div className="flex flex-col items-center justify-center py-4">
                            <FiUpload className="text-accent text-3xl mb-2" />
                            <p className="text-white/70 mb-1">Click to upload image</p>
                            <p className="text-white/50 text-sm">PNG, JPG, WEBP (max 5MB)</p>
                            {isUploading && (
                                <div className="mt-2">
                                    <svg className="animate-spin h-5 w-5 text-accent mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isUploading}
                        />
                    </label>

                    <div className="mt-3 border-t border-[#3a3a45] pt-3">
                        <button
                            type="button"
                            onClick={handleUseDefaultCover}
                            className="flex items-center justify-center mx-auto px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-md transition-colors"
                            disabled={isUploading}
                        >
                            <FiImage className="mr-2" />
                            Use Default Cover
                        </button>
                    </div>
                </div>
            )}
            {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default ImageUpload; 