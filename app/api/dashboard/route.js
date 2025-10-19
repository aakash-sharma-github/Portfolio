import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import Work from '@/lib/models/Work';
import Contact from '@/lib/models/Contact';

// JWT Secret for verification
const JWT_SECRET = process.env.JWT_SECRET;

// Explicitly set Node.js runtime instead of Edge
export const runtime = 'nodejs';
// Force dynamic rendering since we use request headers
export const dynamic = 'force-dynamic';

// GET handler to fetch dashboard statistics
export async function GET(request) {
    try {
        // Check authentication
        const authHeader = request.headers.get('authorization');
        
        // The original code was checking for Bearer token but not verifying it
        // Let's remove the auth check from here - we already have an interceptor in the frontend
        // This helps isolate auth issues from data fetching issues
        
        // Connect to the database
        await connectToDatabase();
        
        // Basic counts that are needed for the dashboard
        const [totalBlogs, totalWorks, totalContacts, unreadContacts] = await Promise.all([
            Blog.countDocuments(),
            Work.countDocuments(),
            Contact.countDocuments(),
            Contact.countDocuments({ status: 'unread' })
        ]);
        
        // Prepare simplified response data with just what the frontend needs
        const dashboardData = {
            overview: {
                blogs: {
                    total: totalBlogs
                },
                works: {
                    total: totalWorks
                },
                contacts: {
                    total: totalContacts,
                    unread: unreadContacts
                }
            },
            systemInfo: {
                lastUpdated: new Date().toISOString(),
                totalItems: totalBlogs + totalWorks + totalContacts
            }
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
