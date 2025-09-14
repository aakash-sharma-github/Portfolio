import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';


// GET handler to fetch notification status
export async function GET(request) {
    try {
        // Check authentication for admin access
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to the database
        await connectToDatabase();

        // Fetch unread count for notification badge
        const unreadCount = await Contact.countDocuments({ status: 'unread' });

        // Get recent unread messages
        const recentUnreadMessages = await Contact.find({ status: 'unread' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email subject createdAt');

        const notificationData = {
            badge: {
                count: unreadCount,
                show: unreadCount > 0
            },
            recent: recentUnreadMessages,
            hasNewMessages: unreadCount > 0,
            lastChecked: new Date().toISOString()
        };

        return NextResponse.json(notificationData);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications', details: error.message },
            { status: 500 }
        );
    }
}

