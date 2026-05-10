'use client';
import { useRef, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { blogApi } from '@/lib/api';

// ── Markdown → HTML converter ─────────────────────────────────────────────────
// TinyMCE is an HTML editor. If content was saved as markdown (plain text),
// loading it directly shows raw markdown syntax (##, **, ` etc.) literally.
// This converts common markdown patterns to HTML before the editor loads.
function markdownToHtml(content) {
    if (!content) return '';

    // If it already contains HTML tags → it came from TinyMCE, pass through unchanged
    if (/<[a-z][\s\S]*>/i.test(content)) return content;

    let html = content
        // Fenced code blocks (must come before inline code)
        .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
            `<pre><code class="language-${lang}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)
        // Headings
        .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
        .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
        .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Bold + italic combined
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.+?)__/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        // Strikethrough
        .replace(/~~(.+?)~~/g, '<del>$1</del>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Horizontal rule
        .replace(/^---$/gm, '<hr />')
        // Blockquotes
        .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
        // Images (before links)
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Unordered lists
    html = html.replace(/((?:^[ \t]*[-*+] .+\n?)+)/gm, (block) => {
        const items = block.trim().split('\n').map((line) =>
            `<li>${line.replace(/^[ \t]*[-*+] /, '').trim()}</li>`
        ).join('');
        return `<ul>${items}</ul>`;
    });

    // Ordered lists
    html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (block) => {
        const items = block.trim().split('\n').map((line) =>
            `<li>${line.replace(/^\d+\. /, '').trim()}</li>`
        ).join('');
        return `<ol>${items}</ol>`;
    });

    // Paragraphs — wrap bare lines not already inside a block tag
    html = html
        .split(/\n{2,}/)
        .map((para) => {
            const trimmed = para.trim();
            if (!trimmed) return '';
            // Already a block element — don't wrap
            if (/^<(h[1-6]|ul|ol|pre|blockquote|hr|li|div)/i.test(trimmed)) return trimmed;
            return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
        })
        .filter(Boolean)
        .join('\n');

    return html;
}

// ── RichTextEditor ────────────────────────────────────────────────────────────
const RichTextEditor = ({ value, onChange, height = 560 }) => {
    const editorRef = useRef(null);
    // ✅ Convert markdown → HTML once at mount time.
    // We store the processed initial content in state so it's stable and
    // doesn't change on every render (which would cause TinyMCE to re-init).
    const [initialHtml] = useState(() => markdownToHtml(value || ''));

    // ✅ REMOVED the useEffect that called editor.setContent(value) on every
    // value change. That was the root cause of two bugs:
    //   1. It reset the cursor position to the top on every keystroke because
    //      onChange → parent state update → value prop change → setContent called again.
    //   2. It loaded raw markdown into the editor on edit page load, showing
    //      ## headings and ** bold markers literally instead of rendered HTML.
    //
    // TinyMCE is uncontrolled after init. We feed it `initialHtml` once,
    // then communicate changes upward via onEditorChange only.

    const handleImageUpload = async (blobInfo) => {
        try {
            const base64 = `data:${blobInfo.blob().type};base64,${blobInfo.base64()}`;
            const result = await blogApi.uploadImage(base64, 'blog/content');
            return result.url;
        } catch (err) {
            throw new Error(`Image upload failed: ${err.message}`);
        }
    };

    return (
        <div className="rounded-xl overflow-hidden border border-[#3a3a45]">
            <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE}
                onInit={(_, editor) => {
                    editorRef.current = editor;
                }}
                // ✅ initialValue is set ONCE — TinyMCE's own controlled prop.
                // We use the pre-converted HTML so markdown is rendered correctly.
                initialValue={initialHtml}
                onEditorChange={(content) => {
                    if (onChange) onChange(content);
                }}
                init={{
                    height,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                        'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                        'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount',
                        'codesample',
                    ],
                    toolbar:
                        'undo redo | blocks | bold italic underline strikethrough | ' +
                        'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
                        'bullist numlist | outdent indent | link image codesample | ' +
                        'blockquote hr | code fullscreen | removeformat | help',
                    content_style: `
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            font-size: 16px;
                            line-height: 1.7;
                            color: #e2e8f0;
                            background: #1e1e28;
                            padding: 1rem 1.5rem;
                        }
                        a { color: #3F88C5; }
                        code {
                            background: rgba(255,255,255,0.08);
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-family: monospace;
                            color: #3F88C5;
                        }
                        pre {
                            background: #0d0d14;
                            border: 1px solid rgba(255,255,255,0.1);
                            border-radius: 8px;
                            padding: 1rem;
                            overflow-x: auto;
                        }
                        blockquote {
                            border-left: 4px solid #3F88C5;
                            background: rgba(63,136,197,0.08);
                            padding: 0.5rem 1rem;
                            margin: 1rem 0;
                            border-radius: 0 6px 6px 0;
                        }
                        img { max-width: 100%; border-radius: 8px; }
                        h1,h2,h3,h4,h5,h6 { color: #fff; font-weight: 700; }
                    `,
                    skin: 'oxide-dark',
                    content_css: 'dark',
                    images_upload_handler: handleImageUpload,
                    automatic_uploads: true,
                    file_picker_types: 'image',
                    promotion: false,
                    branding: false,
                    entity_encoding: 'raw',
                    verify_html: false,
                    valid_elements: '*[*]',
                    extended_valid_elements: '*[*]',
                    paste_as_text: false,
                    paste_data_images: true,
                    convert_urls: false,
                    codesample_languages: [
                        { text: 'JavaScript', value: 'javascript' },
                        { text: 'TypeScript', value: 'typescript' },
                        { text: 'JSX/React', value: 'jsx' },
                        { text: 'HTML', value: 'markup' },
                        { text: 'CSS', value: 'css' },
                        { text: 'Python', value: 'python' },
                        { text: 'Bash', value: 'bash' },
                        { text: 'JSON', value: 'json' },
                        { text: 'SQL', value: 'sql' },
                    ],
                }}
            />
        </div>
    );
};

export default RichTextEditor;