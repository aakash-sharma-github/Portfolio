'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    FiCalendar, FiClock, FiArrowLeft, FiShare2, FiBookmark,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { blogApi } from '@/lib/api';
import RelatedPosts from '@/components/RelatedPosts';
import { Toaster, toast } from "sonner";

// ── Markdown → HTML ──────────────────────────────────────────────────────────
function markdownToHtml(content) {
    if (!content) return '';
    if (/<[a-z][\s\S]*>/i.test(content)) return content;

    let html = content
        .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
            `<pre><code class="language-${lang || 'text'}" data-lang="${lang || 'text'}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
            }</code></pre>`)
        .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
        .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
        .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.+?)__/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        .replace(/~~(.+?)~~/g, '<del>$1</del>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^---$/gm, '<hr />')
        .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Lists
    html = html.replace(/((?:^[ \t]*[-*+] .+\n?)+)/gm, block => {
        const items = block.trim().split('\n')
            .map(l => `<li>${l.replace(/^[ \t]*[-*+] /, '').trim()}</li>`).join('');
        return `<ul>${items}</ul>`;
    });
    html = html.replace(/((?:^\d+\. .+\n?)+)/gm, block => {
        const items = block.trim().split('\n')
            .map(l => `<li>${l.replace(/^\d+\. /, '').trim()}</li>`).join('');
        return `<ol>${items}</ol>`;
    });

    // Tables
    html = html.replace(/(\|.+\|\n)((?:\|[-:]+)+\|\n)((?:\|.+\|\n?)+)/g, (_, header, _sep, body) => {
        const cols = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
        const rows = body.trim().split('\n').map(row => {
            const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `<table><thead><tr>${cols}</tr></thead><tbody>${rows}</tbody></table>`;
    });

    // Paragraphs
    html = html.split(/\n{2,}/).map(para => {
        const t = para.trim();
        if (!t) return '';
        if (/^<(h[1-6]|ul|ol|pre|blockquote|hr|table|div)/i.test(t)) return t;
        return `<p>${t.replace(/\n/g, '<br />')}</p>`;
    }).filter(Boolean).join('\n');

    return html;
}

// ── Syntax highlighter ────────────────────────────────────────────────────────
// Token-based, no external deps. VSCode Dark+ colour theme.
const KEYWORDS = {
    python: /\b(def|class|return|import|from|if|elif|else|for|while|in|not|and|or|True|False|None|with|as|try|except|raise|self|lambda|yield|pass|break|continue|async|await|print)\b/g,
    javascript: /\b(const|let|var|function|return|import|export|from|if|else|for|while|class|new|this|async|await|try|catch|throw|typeof|instanceof|null|undefined|true|false|switch|case|default|break|continue|of|in|extends|super)\b/g,
    typescript: /\b(const|let|var|function|return|import|export|from|if|else|for|while|class|new|this|async|await|try|catch|throw|typeof|instanceof|null|undefined|true|false|interface|type|extends|implements|as|readonly|public|private|protected|enum|abstract|declare|namespace|keyof|infer|never|unknown|any)\b/g,
    rust: /\b(fn|let|mut|pub|use|mod|struct|enum|impl|trait|for|while|if|else|match|return|true|false|Some|None|Ok|Err|self|Self|where|async|await|move|ref|in|loop|break|continue|type|const|static|unsafe|extern|crate|super)\b/g,
    css: /(@media|@container|@layer|@keyframes|@import|@supports)|\b(display|flex|grid|position|margin|padding|border|background|color|font|width|height|overflow|transform|transition|animation|opacity|cursor|content|var|calc|none|block|inline|auto)\b/g,
    bash: /\b(echo|cd|ls|mkdir|rm|cp|mv|git|npm|yarn|node|python|pip|docker|kubectl|curl|export|if|then|fi|for|do|done|while|grep|sed|awk|cat|chmod|sudo)\b/g,
    yaml: /^(\s*[\w-]+):/gm,
    go: /\b(func|package|import|var|const|type|struct|interface|map|chan|go|defer|return|if|else|for|range|switch|case|default|break|continue|true|false|nil|make|new|append|len|cap)\b/g,
    sql: /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|INSERT|INTO|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|DROP|ALTER|ADD|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|AND|OR|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|LIMIT|OFFSET)\b/gi,
};

function syntaxHighlight(code, lang) {
    // Escape HTML
    let h = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Strings (before keywords so string contents aren't keyword-highlighted)
    h = h.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
        '<span class="syn-str">$1$2$1</span>');
    // Comments
    h = h.replace(/(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)/g,
        '<span class="syn-cmt">$1</span>');
    // Numbers
    h = h.replace(/\b(\d+\.?\d*(?:e[+-]?\d+)?(?:px|rem|em|vh|vw|%)?)\b/g,
        '<span class="syn-num">$1</span>');
    // Keywords
    const kw = KEYWORDS[lang] || KEYWORDS.javascript;
    if (kw) h = h.replace(kw, '<span class="syn-kw">$&</span>');
    // Function names
    h = h.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="syn-fn">$1</span>');

    return h;
}

// ── Code block renderer ───────────────────────────────────────────────────────
// Wraps every <pre><code> with a styled container + language badge + copy btn
function processCodeBlocks(html) {
    let blockIdx = 0;
    return html.replace(
        /<pre><code(?:\s+class="language-([^"]*)")?(?:\s+data-lang="([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g,
        (_, cls, dat, raw) => {
            const lang = (cls || dat || 'text').toLowerCase();
            const decoded = raw
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"');
            const highlighted = syntaxHighlight(decoded, lang);
            const id = `cb-${++blockIdx}`;
            // Inline onclick avoids React hydration issues with dynamic content
            return `<div class="code-block" id="${id}" data-raw="${encodeURIComponent(decoded)}">
<div class="cb-header">
  <span class="cb-lang">${lang}</span>
  <button class="cb-copy" onclick="
    var el=document.getElementById('${id}');
    var raw=decodeURIComponent(el.getAttribute('data-raw')||'');
    var btn=el.querySelector('.cb-copy');
    navigator.clipboard.writeText(raw).then(function(){
      btn.textContent='✓ Copied';
      btn.style.color='#4ade80';
      setTimeout(function(){btn.textContent='Copy';btn.style.color='';},2000);
    });
  ">Copy</button>
</div>
<pre class="cb-pre"><code class="cb-code">${highlighted}</code></pre>
</div>`;
        }
    );
}

// ── TOC helpers ───────────────────────────────────────────────────────────────
function buildToc(html) {
    const headings = [];
    const re = /<h([2-3])[^>]*>([\s\S]*?)<\/h[2-3]>/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
        const text = m[2].replace(/<[^>]+>/g, '').trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        headings.push({ level: parseInt(m[1]), text, id });
    }
    return headings;
}

function addHeadingIds(html) {
    return html.replace(
        /<h([2-3])([^>]*)>([\s\S]*?)<\/h[2-3]>/gi,
        (_, lv, attrs, inner) => {
            const text = inner.replace(/<[^>]+>/g, '').trim();
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return `<h${lv}${attrs} id="${id}">${inner}</h${lv}>`;
        }
    );
}

// ── Reading progress bar ──────────────────────────────────────────────────────
function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const total = el.scrollHeight - el.clientHeight;
            setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none">
            <div
                className="h-full bg-gradient-to-r from-accent via-blue-400 to-accent
                           transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogPostPage({ params }) {
    const { slug } = params;
    const [post, setPost] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tocOpen, setTocOpen] = useState(false);
    const [activeId, setActiveId] = useState('');
    const contentRef = useRef(null);

    // Fetch post
    useEffect(() => {
        if (!slug) return;
        let cancelled = false;
        (async () => {
            try {
                setIsLoading(true);
                const [p, list] = await Promise.all([
                    blogApi.getPostBySlug(slug),
                    blogApi.getPosts({ limit: 20 }),
                ]);
                if (cancelled) return;
                if (!p) { setError('Post not found'); return; }
                setPost(p);
                setAllPosts(list?.blogs || []);
            } catch { if (!cancelled) setError('Failed to load post.'); }
            finally { if (!cancelled) setIsLoading(false); }
        })();
        return () => { cancelled = true; };
    }, [slug]);

    // Active TOC heading on scroll
    useEffect(() => {
        if (!post) return;
        const onScroll = () => {
            const headings = contentRef.current?.querySelectorAll('h2, h3');
            if (!headings?.length) return;
            let current = '';
            headings.forEach(h => {
                if (h.getBoundingClientRect().top < 120) current = h.id;
            });
            setActiveId(current);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [post]);

    // Share handler with Web Share API + clipboard fallback
    const handleShare = async () => {
        const shareData = {
            title: post.title,
            text: post.excerpt || post.title,
            url: window.location.href,
        };

        try {
            // Mobile/native share support
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            // Fallback for desktop
            await navigator.clipboard.writeText(window.location.href);

            // Optional toast
            toast.success("Link copied to clipboard");
        } catch (error) {
            console.error("Share failed:", error);
            toast.error("Unable to share");
        }
    };

    // ── Loading ──────────────────────────────────────────────────────────────
    if (isLoading) return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-accent border-t-transparent
                                rounded-full animate-spin" />
                <p className="text-white/40 text-sm">Loading article…</p>
            </div>
        </div>
    );

    // ── Error ────────────────────────────────────────────────────────────────
    if (error || !post) return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8
                            max-w-md w-full text-center">
                <div className="text-4xl mb-4">📭</div>
                <h2 className="text-xl font-bold text-red-400 mb-2">Post not found</h2>
                <p className="text-white/50 text-sm mb-6">
                    {error || 'This article may have been removed.'}
                </p>
                <Link href="/blog"
                    className="inline-flex items-center gap-2 text-accent hover:underline text-sm">
                    <FiArrowLeft size={14} /> Back to blog
                </Link>
            </div>
        </div>
    );

    // ── Process content ──────────────────────────────────────────────────────
    const rawHtml = markdownToHtml(post.content || '');
    const withIds = addHeadingIds(rawHtml);
    const finalHtml = processCodeBlocks(withIds);
    const toc = buildToc(withIds);
    const hasAuthor = Boolean(post.author?.name);

    return (
        <>
            {/* ── Scoped styles ── */}
            <style>{`
                /* ── Code block ── */
                .code-block {
                    position:relative; margin:1.75rem 0;
                    border-radius:14px; overflow:hidden;
                    border:1px solid rgba(63,136,197,.22);
                    background:#0b0b12;
                    box-shadow:0 4px 28px rgba(0,0,0,.5);
                }
                .cb-header {
                    display:flex; align-items:center; justify-content:space-between;
                    padding:9px 16px;
                    background:rgba(63,136,197,.07);
                    border-bottom:1px solid rgba(63,136,197,.14);
                }
                .cb-lang {
                    font-family:'JetBrains Mono',monospace;
                    font-size:11px; font-weight:700;
                    letter-spacing:.08em; text-transform:uppercase;
                    color:#3F88C5;
                }
                .cb-copy {
                    font-family:'JetBrains Mono',monospace;
                    font-size:10px; font-weight:600;
                    letter-spacing:.05em;
                    color:rgba(255,255,255,.35);
                    background:transparent; border:none;
                    cursor:pointer; padding:4px 10px; border-radius:6px;
                    transition:color .15s, background .15s;
                }
                .cb-copy:hover { color:#3F88C5; background:rgba(63,136,197,.12); }
                .cb-pre {
                    margin:0; padding:16px 20px;
                    overflow-x:auto; background:transparent;
                    scrollbar-width:thin;
                    scrollbar-color:rgba(63,136,197,.25) transparent;
                }
                .cb-pre::-webkit-scrollbar { height:5px; }
                .cb-pre::-webkit-scrollbar-track { background:transparent; }
                .cb-pre::-webkit-scrollbar-thumb { background:rgba(63,136,197,.3); border-radius:4px; }
                .cb-code {
                    font-family:'JetBrains Mono','Fira Code','Consolas',monospace;
                    font-size:13.5px; line-height:1.82;
                    color:#cdd6f4; white-space:pre; display:block;
                }
                /* ── Syntax tokens — Catppuccin Mocha palette ── */
                .syn-kw  { color:#cba6f7; font-weight:600; }   /* mauve — keywords */
                .syn-str { color:#a6e3a1; }                    /* green — strings */
                .syn-cmt { color:#585b70; font-style:italic; } /* overlay — comments */
                .syn-num { color:#fab387; }                    /* peach — numbers */
                .syn-fn  { color:#89b4fa; }                    /* blue — functions */

                /* ── Blog prose ── */
                .blog-prose h1,.blog-prose h2,.blog-prose h3,
                .blog-prose h4,.blog-prose h5,.blog-prose h6 {
                    font-weight:700; color:#fff; line-height:1.25;
                    margin-top:2.4rem; margin-bottom:.8rem;
                    scroll-margin-top:80px;
                }
                .blog-prose h1 { font-size:2.1rem; }
                .blog-prose h2 {
                    font-size:1.55rem;
                    padding-bottom:.55rem;
                    border-bottom:1px solid rgba(63,136,197,.18);
                }
                .blog-prose h3 { font-size:1.2rem; color:rgba(255,255,255,.92); }
                .blog-prose h4 { font-size:1.05rem; color:rgba(255,255,255,.85); }
                .blog-prose p {
                    color:rgba(255,255,255,.72); line-height:1.9;
                    margin-bottom:1.25rem; font-size:1.04rem;
                }
                .blog-prose a { color:#3F88C5; text-decoration:underline; text-underline-offset:3px; }
                .blog-prose a:hover { color:#60a5fa; }
                .blog-prose strong { color:#fff; font-weight:700; }
                .blog-prose em     { color:rgba(255,255,255,.82); }
                .blog-prose del    { color:rgba(255,255,255,.38); }
                .blog-prose ul,.blog-prose ol {
                    padding-left:1.65rem; margin-bottom:1.25rem;
                    color:rgba(255,255,255,.72);
                }
                .blog-prose li { margin-bottom:.45rem; line-height:1.78; }
                .blog-prose ul li::marker { color:#3F88C5; }
                .blog-prose ol li::marker { color:#3F88C5; font-weight:700; }
                .blog-prose blockquote {
                    border-left:3px solid #3F88C5;
                    background:rgba(63,136,197,.06);
                    margin:1.5rem 0; padding:.9rem 1.3rem;
                    border-radius:0 12px 12px 0;
                    color:rgba(255,255,255,.65); font-style:italic;
                }
                .blog-prose blockquote p { margin:0; color:inherit; }
                .blog-prose hr { border:none; border-top:1px solid rgba(255,255,255,.1); margin:2.2rem 0; }
                /* Inline code — NOT inside code blocks */
                .blog-prose :not(pre) > code {
                    font-family:'JetBrains Mono',monospace;
                    font-size:.84em; color:#cba6f7;
                    background:rgba(203,166,247,.1);
                    padding:2px 7px; border-radius:5px;
                    border:1px solid rgba(203,166,247,.2);
                }
                .blog-prose img {
                    border-radius:12px; max-width:100%;
                    border:1px solid rgba(255,255,255,.08);
                    margin:1.75rem 0;
                }
                .blog-prose table {
                    width:100%; border-collapse:collapse;
                    margin:1.75rem 0; font-size:.9rem;
                    border:1px solid rgba(255,255,255,.1);
                    border-radius:10px; overflow:hidden;
                }
                .blog-prose th {
                    background:rgba(63,136,197,.14); color:#3F88C5;
                    font-weight:700; padding:.65rem 1rem;
                    text-align:left; border-bottom:1px solid rgba(63,136,197,.22);
                }
                .blog-prose td {
                    padding:.6rem 1rem;
                    border-bottom:1px solid rgba(255,255,255,.05);
                    color:rgba(255,255,255,.7);
                }
                .blog-prose tr:last-child td { border-bottom:none; }
                .blog-prose tr:hover td { background:rgba(255,255,255,.02); }
            `}</style>

            <ReadingProgress />

            <div className="min-h-screen bg-primary">
                {/* ── Hero ── */}
                <div className="relative w-full h-[52vh] md:h-[62vh] overflow-hidden">
                    <Image
                        src={post.coverImage?.url || '/assets/blog/default-cover.jpg'}
                        alt={post.coverImage?.alt || post.title}
                        fill priority sizes="100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-black/25" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent" />

                    {/* Back link */}
                    <div className="absolute top-6 left-0 right-0">
                        <div className="container mx-auto px-4">
                            <Link href="/blog"
                                className="inline-flex items-center gap-2 text-white/70
                                           hover:text-accent text-sm transition-colors
                                           backdrop-blur-sm bg-black/20 px-4 py-2
                                           rounded-xl border border-white/10">
                                <FiArrowLeft size={14} /> Back to blog
                            </Link>
                        </div>
                    </div>

                    {/* Title area */}
                    <div className="absolute bottom-0 left-0 right-0 pb-8 md:pb-12">
                        <div className="container mx-auto px-4 max-w-4xl">
                            <span className="inline-flex items-center gap-1.5 bg-accent/20
                                             border border-accent/35 text-accent text-[10px]
                                             font-bold px-3 py-1.5 rounded-full uppercase
                                             tracking-widest mb-4">
                                <HiSparkles className="text-[10px]" />
                                {post.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-[2.8rem] font-bold
                                           text-white leading-[1.18] mb-5 max-w-3xl">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2
                                            text-white/55 text-xs">
                                {hasAuthor && (
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-7 h-7 rounded-full
                                                        overflow-hidden ring-2 ring-accent/30">
                                            <Image
                                                src={post.author.avatar || '/assets/avatar.jpg'}
                                                alt={post.author.name}
                                                fill sizes="28px" className="object-cover"
                                            />
                                        </div>
                                        <span className="font-medium text-white/80">
                                            {post.author.name}
                                        </span>
                                    </div>
                                )}
                                {post.createdAt && (
                                    <span className="flex items-center gap-1.5">
                                        <FiCalendar size={12} />
                                        <time dateTime={post.createdAt}>
                                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'long', day: 'numeric',
                                            })}
                                        </time>
                                    </span>
                                )}
                                {post.readTime && (
                                    <span className="flex items-center gap-1.5">
                                        <FiClock size={12} />{post.readTime}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Article layout ── */}
                <div className="container mx-auto px-4 py-10 xl:py-14">
                    <div className="flex gap-12 max-w-6xl mx-auto">

                        {/* Desktop TOC sidebar */}
                        {toc.length > 1 && (
                            <aside className="hidden xl:block w-[210px] flex-shrink-0">
                                <div className="sticky top-24">
                                    <p className="text-[10px] font-bold text-white/28 uppercase
                                                   tracking-widest mb-5">
                                        Contents
                                    </p>
                                    <nav className="space-y-px">
                                        {toc.map(({ level, text, id }) => (
                                            <a key={id} href={`#${id}`}
                                                className={`
                                                    block py-1.5 text-[.74rem] leading-snug
                                                    border-l-2 transition-all duration-150 truncate
                                                    ${level === 3
                                                        ? 'pl-6 text-[.68rem]'
                                                        : 'pl-3'
                                                    }
                                                    ${activeId === id
                                                        ? 'text-accent border-accent font-semibold'
                                                        : 'text-white/32 border-transparent hover:text-white/65 hover:border-white/20'
                                                    }
                                                `}>
                                                {text}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </aside>
                        )}

                        {/* Main content */}
                        <article className="flex-1 min-w-0 max-w-3xl">
                            {/* Tags */}
                            {post.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {post.tags.map(tag => (
                                        <span key={tag}
                                            className="text-xs px-3 py-1 rounded-full bg-accent/10
                                                       text-accent border border-accent/25 font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Mobile TOC */}
                            {toc.length > 1 && (
                                <div className="xl:hidden mb-8 bg-[#1e1e24] border border-white/8
                                                rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => setTocOpen(o => !o)}
                                        className="w-full flex items-center justify-between p-4
                                                   text-sm font-semibold text-white"
                                    >
                                        <span className="flex items-center gap-2">
                                            <FiBookmark size={14} className="text-accent" />
                                            Table of Contents
                                        </span>
                                        <span className={`text-white/40 text-base transition-transform
                                                          duration-200 ${tocOpen ? 'rotate-180' : ''}`}>
                                            ▾
                                        </span>
                                    </button>
                                    <AnimatePresence>
                                        {tocOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden border-t border-white/6"
                                            >
                                                <nav className="p-4 space-y-2">
                                                    {toc.map(({ level, text, id }) => (
                                                        <a key={id} href={`#${id}`}
                                                            onClick={() => setTocOpen(false)}
                                                            className={`
                                                                block text-white/60 hover:text-accent
                                                                transition-colors
                                                                ${level === 3 ? 'pl-4 text-xs' : 'text-sm'}
                                                            `}>
                                                            {text}
                                                        </a>
                                                    ))}
                                                </nav>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Rendered content */}
                            <div
                                ref={contentRef}
                                className="blog-prose"
                                dangerouslySetInnerHTML={{ __html: finalHtml }}
                            />

                            {/* Footer row — tags + share */}
                            <div className="mt-12 pt-8 border-t border-white/8
                                            flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {post.tags?.slice(0, 5).map(tag => (
                                        <span key={tag}
                                            className="text-xs px-3 py-1 rounded-full bg-white/4
                                                       text-white/45 border border-white/8">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 text-sm text-white/45
                                               hover:text-accent transition-colors"
                                >
                                    <FiShare2 size={14} /> Share
                                </button>
                            </div>

                            {/* Author bio */}
                            {hasAuthor && (
                                <div className="mt-10 p-6 bg-[#1a1a22] border border-white/8
                                                rounded-2xl flex items-start gap-5">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden
                                                    ring-2 ring-accent/30 flex-shrink-0">
                                        <Image
                                            src={post.author.avatar || '/assets/avatar.jpg'}
                                            alt={post.author.name}
                                            fill sizes="64px" className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-accent uppercase
                                                       tracking-widest mb-1">
                                            Written by
                                        </p>
                                        <h3 className="text-lg font-bold text-white mb-1.5">
                                            {post.author.name}
                                        </h3>
                                        {post.author.bio && (
                                            <p className="text-white/55 text-sm leading-relaxed">
                                                {post.author.bio}
                                            </p>
                                        )}
                                        <Link href="/contact"
                                            className="inline-flex items-center gap-1 mt-3
                                                       text-xs text-accent hover:underline
                                                       underline-offset-2">
                                            Get in touch →
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Related posts */}
                            <RelatedPosts
                                currentSlug={post.slug}
                                category={post.category}
                                allPosts={allPosts}
                            />
                        </article>
                    </div>
                </div>
            </div>
            <Toaster richColors />
        </>
    );
}