'use client';

import { useEffect, useRef } from 'react';

const DefaultCoverImage = ({ text = 'Blog Post', width = 1200, height = 630 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1e1e24');
        gradient.addColorStop(1, '#2d2d35');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add some design elements
        ctx.fillStyle = '#3a3a4580';
        ctx.beginPath();
        ctx.arc(width * 0.8, height * 0.2, width * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3a3a4550';
        ctx.beginPath();
        ctx.arc(width * 0.2, height * 0.8, width * 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Add text
        ctx.fillStyle = '#ffffff';
        ctx.font = `${width * 0.06}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width / 2, height / 2);

        // Add subtle border
        ctx.strokeStyle = '#ffffff10';
        ctx.lineWidth = 10;
        ctx.strokeRect(10, 10, width - 20, height - 20);
    }, [text, width, height]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: '100%', height: 'auto', display: 'block' }}
        />
    );
};

export default DefaultCoverImage; 