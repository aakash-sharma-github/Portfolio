import { createCanvas } from 'canvas';
import { NextResponse } from 'next/server';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';


export async function GET(request) {
    try {
        // Get title from query params or use default
        const { searchParams } = new URL(request.url);
        const title = searchParams.get('title') || 'Blog Post';
        const truncatedTitle = title.length > 30 ? title.substring(0, 30) + '...' : title;

        // Create canvas with dimensions
        const width = 1200;
        const height = 630;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Generate unique colors based on title for visual differentiation
        const titleCharSum = title.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const hue1 = (titleCharSum * 13) % 360; // Primary hue
        const hue2 = (hue1 + 60) % 360; // Secondary hue (60 degrees apart)
        
        // Create gradient background with unique colors
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, `hsl(${hue1}, 70%, 55%)`);
        gradient.addColorStop(1, `hsl(${hue2}, 70%, 45%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add unique design elements based on title
        const elementCount = (titleCharSum % 3) + 2; // 2-4 elements
        const elementOpacity = 0.1;
        
        for (let i = 0; i < elementCount; i++) {
            const angle = (titleCharSum * (i + 1) * 47) % 360;
            const x = width * (0.3 + 0.4 * Math.cos(angle * Math.PI / 180));
            const y = height * (0.3 + 0.4 * Math.sin(angle * Math.PI / 180));
            const radius = 50 + (titleCharSum * (i + 1) % 100);
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${elementOpacity})`;
            ctx.fill();
        }

        // Add text
        ctx.font = 'bold 60px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(truncatedTitle, width / 2, height / 2);

        // Add subtle border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, width - 40, height - 40);

        // Convert canvas to buffer
        const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });

        // Generate cache key based on title for unique caching
        const titleHash = Buffer.from(title).toString('base64').replace(/[/+=]/g, '');
        
        // Return the image with title-specific caching
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': `public, max-age=3600`, // Reduce to 1 hour
                'ETag': `"${titleHash}"`, // Add ETag for proper cache validation
                'Vary': 'Accept-Encoding', // Vary header for proper caching
            },
        });
    } catch (error) {
        // Create a simple fallback colored rectangle
        const width = 1200;
        const height = 630;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(0, 0, width, height);

        const buffer = canvas.toBuffer('image/jpeg');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=86400',
            },
        });
    }
} 