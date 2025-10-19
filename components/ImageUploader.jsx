"use client";

import { useState, useEffect } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import Image from 'next/image';

const ImageUploader = ({
  onImageUpload,
  currentImage = null,
  label = "Cover Image",
  folder = "blog",
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage?.url || null);
  const [error, setError] = useState('');

  // Update preview when currentImage changes (important for editing)
  useEffect(() => {
    setPreview(currentImage?.url || null);
  }, [currentImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setError('');
    setIsUploading(true);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('File must be an image (JPG, PNG, GIF, or WEBP)');
      setIsUploading(false);
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      setIsUploading(false);
      return;
    }

    try {
      // Create a local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Convert to base64 for upload
      const base64 = await convertToBase64(file);

      // Upload to Cloudinary via API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          image: base64,
          folder: folder
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();

      // Update preview with the actual uploaded image URL
      setPreview(data.url);

      // Call the callback with image data
      onImageUpload({
        url: data.url,
        publicId: data.publicId
      });

      setIsUploading(false);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload(null);
  };

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-white mb-2">{label}</label>

      {preview ? (
        <div className="relative">
          <Image
            src={preview}
            alt="Preview"
            width={400}
            height={192}
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
            type="button"
          >
            <FiX size={18} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#3a3a45] rounded-lg p-4 text-center">
          <div className="mb-3 flex justify-center">
            <FiImage className="text-4xl text-[#3a3a45]" />
          </div>
          <p className="text-white/70 mb-3">Drag & drop an image here, or click to select one</p>
          <label className="cursor-pointer">
            <span className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded inline-flex items-center gap-2 transition-colors">
              <FiUpload /> Select Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
          {isUploading && (
            <div className="mt-2">
              <div className="w-8 h-8 border-t-2 border-accent rounded-full animate-spin mx-auto"></div>
              <p className="text-white/70 mt-1">Uploading...</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default ImageUploader;
