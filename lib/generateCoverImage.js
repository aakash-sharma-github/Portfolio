// lib/generateCoverImage.js
// Design B — Gradient Mesh
// Generates a 1200×630 blog cover image from a post title + category.
// Returns a base64 data URI (image/png) that can be passed directly to
// cloudinary.uploader.upload() or streamed as an HTTP response.

import { createCanvas } from 'canvas';

const W = 1200;
const H = 630;

// ── Per-category colour palettes ──────────────────────────────────────────────
// Each entry is [gradientTop, gradientBottom, blobAccent]
const CATEGORY_PALETTES = {
    'AI': ['#0f2044', '#06101f', '#1a4a8a'],
    'Machine Learning': ['#1a0a3d', '#0d0620', '#4a1fa8'],
    'Cloud Computing': ['#062440', '#040f1a', '#0a5fa5'],
    'Development': ['#0d1f3d', '#070e1f', '#1a4a8a'],
    'Software Engineering': ['#062a2a', '#030f10', '#0a7a6a'],
    'System Design': ['#2a1500', '#120800', '#a05010'],
    'Languages & Frameworks': ['#0a2a14', '#040f08', '#1a7a3a'],
    'Tools & Platforms': ['#1a1000', '#0d0800', '#8a5000'],
    'Productivity': ['#2a0a1a', '#140308', '#9a1a5a'],
    'Tech Reviews': ['#001a2a', '#000d14', '#007aaa'],
    'Data Structures & Algorithms': ['#1a0a2a', '#0d0314', '#6a1a9a'],
    'default': ['#0d1f3d', '#070e1f', '#1a4a8a'],
};

// ── Deterministic hash from a string ─────────────────────────────────────────
function hashStr(str) {
    return str.split('').reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7);
}

// ── Draw a radial "blob" glow ─────────────────────────────────────────────────
function drawBlob(ctx, x, y, radius, color, alpha) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`);
    g.addColorStop(1, `${color}00`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
}

// ── Wrap text to multiple lines ───────────────────────────────────────────────
function wrapText(ctx, text, x, maxW, lineH) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxW && line) {
            lines.push(line);
            line = word;
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    return lines; // caller positions them
}

// ── Main export ───────────────────────────────────────────────────────────────
/**
 * Generate a Design-B cover image buffer.
 *
 * @param {string} title    - Blog post title
 * @param {string} category - Blog category (used for colour palette + label)
 * @param {string} author   - Author name shown in the bottom-left corner
 * @returns {Buffer}        - Raw PNG buffer (ready for Cloudinary upload)
 */
export function generateCoverImage(
    title = 'Blog Post',
    category = 'Development',
    author = 'Aakash Sharma'
) {
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext('2d');

    const palette = CATEGORY_PALETTES[category] || CATEGORY_PALETTES['default'];
    const [topCol, botCol, blobCol] = palette;
    const seed = hashStr(title + category);

    // ── 1. Deep gradient background ─────────────────────────────────────────
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, topCol);
    bg.addColorStop(0.65, botCol);
    bg.addColorStop(1, '#000000');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── 2. Diagonal colour sweep (subtle) ────────────────────────────────────
    const sweep = ctx.createLinearGradient(0, 0, W, H);
    sweep.addColorStop(0, `${blobCol}33`);
    sweep.addColorStop(0.5, `${blobCol}11`);
    sweep.addColorStop(1, '#00000000');
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, W, H);

    // ── 3. Blob glows — positions seeded from title ───────────────────────────
    const blobs = [
        { xf: 0.72, yf: 0.22, rf: 0.32, a: 0.28 },
        { xf: 0.88, yf: 0.65, rf: 0.22, a: 0.20 },
        { xf: 0.60, yf: 0.78, rf: 0.18, a: 0.16 },
    ];
    blobs.forEach((b, i) => {
        const px = W * (b.xf + ((seed * (i + 1) * 0.031) % 0.12) - 0.06);
        const py = H * (b.yf + ((seed * (i + 2) * 0.019) % 0.10) - 0.05);
        drawBlob(ctx, px, py, Math.min(W, H) * b.rf, blobCol, b.a);
    });

    // Extra accent blob top-right
    drawBlob(ctx, W * 0.92, H * 0.08, 140, '#3F88C5', 0.22);

    // ── 4. Bottom scrim — ensures text contrast ───────────────────────────────
    const scrim = ctx.createLinearGradient(0, H * 0.38, 0, H);
    scrim.addColorStop(0, 'rgba(0,0,0,0)');
    scrim.addColorStop(0.55, 'rgba(0,0,0,0.55)');
    scrim.addColorStop(1, 'rgba(0,0,0,0.82)');
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, W, H);

    // ── 5. Category pill ──────────────────────────────────────────────────────
    const catLabel = category.toUpperCase();
    ctx.font = '600 16px "DejaVu Sans", Arial, sans-serif';
    const catW = ctx.measureText(catLabel).width + 36;
    const catH = 36;
    const catX = 72, catY = 64;

    // Pill background
    ctx.fillStyle = 'rgba(63,136,197,0.25)';
    roundRect(ctx, catX, catY, catW, catH, 18);
    ctx.fill();
    // Pill border
    ctx.strokeStyle = 'rgba(63,136,197,0.65)';
    ctx.lineWidth = 1;
    roundRect(ctx, catX, catY, catW, catH, 18);
    ctx.stroke();
    // Pill text
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(catLabel, catX + 18, catY + catH / 2);

    // ── 6. Main title ─────────────────────────────────────────────────────────
    // Choose font size based on title length
    const fontSize = title.length > 55 ? 54 : title.length > 38 ? 62 : 70;
    ctx.font = `bold ${fontSize}px "DejaVu Sans", Arial, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    const lines = wrapText(ctx, title, 72, W - 160, fontSize * 1.22);
    const lineH = fontSize * 1.22;
    const totalTextH = lines.length * lineH;

    // Position: vertically centred in the lower 55% of canvas
    const textAreaTop = H * 0.42;
    const textAreaBottom = H - 100;
    const textAreaH = textAreaBottom - textAreaTop;
    let textStartY = textAreaTop + (textAreaH - totalTextH) / 2 + fontSize;

    // Clamp so it never overflows the bottom
    textStartY = Math.min(textStartY, textAreaBottom - (lines.length - 1) * lineH - 8);

    lines.forEach((line, i) => {
        ctx.fillText(line, 72, textStartY + i * lineH);
    });

    // ── 7. Bottom meta bar ────────────────────────────────────────────────────
    const barY = H - 52;

    // Separator line
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(72, barY);
    ctx.lineTo(W - 72, barY);
    ctx.stroke();

    // Author — left
    ctx.font = '500 17px "DejaVu Sans", Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.60)';
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillText(author, 72, H - 22);

    // Domain — right
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.fillText('aakashsharma.com.np', W - 72, H - 22);

    // ── 8. Accent dot on category pill ───────────────────────────────────────
    ctx.beginPath();
    ctx.arc(catX + 10, catY + catH / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#3F88C5';
    ctx.fill();

    return canvas.toBuffer('image/png');
}

/**
 * Same as generateCoverImage but returns a base64 data URI.
 * Pass this directly to cloudinary.uploader.upload().
 */
export function generateCoverImageBase64(title, category, author) {
    const buf = generateCoverImage(title, category, author);
    return `data:image/png;base64,${buf.toString('base64')}`;
}

// ── Utility: rounded rect path ────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}