import { createCanvas } from 'canvas';
import { NextResponse } from 'next/server';

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

        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#3b82f6');  // Blue
        gradient.addColorStop(1, '#8b5cf6');  // Purple
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add some design elements
        ctx.beginPath();
        ctx.arc(width * 0.8, height * 0.2, 100, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(width * 0.2, height * 0.7, 150, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();

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

        // Return the image
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (error) {
        console.error('Error generating default cover image:', error);

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