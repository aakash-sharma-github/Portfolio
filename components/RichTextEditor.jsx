'use client';

import { useRef, useEffect } from 'react';
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
            throw new Error('Failed to upload image', error);
        }
    };

    // Function to ensure proper content handling
    const handleEditorChange = (content, editor) => {
        // Make sure we're passing the raw HTML to the parent component
        if (onChange) {
            onChange(content);
        }
    };

    // Set initial content if provided
    useEffect(() => {
        if (editorRef.current && value) {
            editorRef.current.setContent(value);
        }
    }, [value, editorRef.current]);

    return (
        <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            onInit={(evt, editor) => {
                editorRef.current = editor;
                if (value) {
                    // Set the initial value directly after initialization
                    editor.setContent(value);
                }
            }}
            value={value}
            onEditorChange={handleEditorChange}
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

                // Critical HTML handling settings
                entity_encoding: 'raw',
                verify_html: false,
                valid_elements: '*[*]',
                extended_valid_elements: '*[*]',
                force_p_newlines: false,
                forced_root_block: '',
                paste_as_text: false,
                paste_data_images: true,
                convert_urls: false,
                allow_html_in_named_anchor: true,

                // Remove duplicate initialization code
                setup: function (editor) {
                    editor.on('keyup change', () => {
                        handleEditorChange(editor.getContent(), editor);
                    });
                }
            }}
        />
    );
};

export default RichTextEditor;