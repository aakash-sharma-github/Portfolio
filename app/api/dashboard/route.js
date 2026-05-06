import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import Work from '@/lib/models/Work';
import Contact from '@/lib/models/Contact';

const JWT_SECRET = process.env.JWT_SECRET;

// Explicitly set Node.js runtime instead of Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function verifyAuth(request) {
    if (!JWT_SECRET) return null;
    const authHeader = request.headers.get('authorization');

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

// GET handler to fetch dashboard statistics (admin only)
export async function GET(request) {
    try {
        // FIX: dashboard was completely missing auth verification — anyone could access DB stats
        const decoded = verifyAuth(request);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const [totalBlogs, totalWorks, totalContacts, unreadContacts] = await Promise.all([
            Blog.countDocuments(),
            Work.countDocuments(),
            Contact.countDocuments(),
            Contact.countDocuments({ status: 'unread' }),
        ]);

        const dashboardData = {
            overview: {
                blogs: {
                    total: totalBlogs,
                },
                works: {
                    total: totalWorks,
                },
                contacts: {
                    total: totalContacts,
                    unread: unreadContacts,
                },
            },
            systemInfo: {
                lastUpdated: new Date().toISOString(),
                totalItems: totalBlogs + totalWorks + totalContacts,
            },
        };

        return NextResponse.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data', details: error.message },
            { status: 500 }
        );
    }
}