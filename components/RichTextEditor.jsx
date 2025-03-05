'use client';

import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { blogApi } from '@/lib/api';

const RichTextEditor = ({ value, onChange, height = 500 }) => {
    const editorRef = useRef(null);

    // Handle image upload
    const handleImageUpload = async (blobInfo) => {
        try {
            // Convert blob to base64
            const base64 = `data:${blobInfo.blob().type};base64,${blobInfo.base64()}`;

            // Upload to Cloudinary via our API
            const result = await blogApi.uploadImage(base64);

            // Return the URL to TinyMCE
            return result.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Image upload failed');
        }
    };

    return (
        <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            onInit={(evt, editor) => (editorRef.current = editor)}
            value={value}
            onEditorChange={onChange}
            init={{
                height,
                menubar: true,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help | image | code',
                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 16px; }',
                skin: 'oxide-dark',
                content_css: 'dark',
                images_upload_handler: handleImageUpload,
                automatic_uploads: true,
                file_picker_types: 'image',
                promotion: false,
                branding: false,
            }}
        />
    );
};

export default RichTextEditor; 