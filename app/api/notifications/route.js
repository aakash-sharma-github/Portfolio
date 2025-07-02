import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

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

        // Get current date for time-based queries
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Fetch notification statistics
        const [
            unreadCount,
            todayCount,
            last24HoursCount,
            highPriorityUnread,
            recentUnreadMessages
        ] = await Promise.all([
            Contact.countDocuments({ status: 'unread' }),
            Contact.countDocuments({ 
                status: 'unread',
                createdAt: { $gte: startOfDay } 
            }),
            Contact.countDocuments({ 
                status: 'unread',
                createdAt: { $gte: last24Hours } 
            }),
            Contact.find({ status: 'unread' })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name email subject priority createdAt')
        ]);

        const notificationData = {
            badge: {
                count: unreadCount,
                show: unreadCount > 0
            },
            summary: {
                unreadTotal: unreadCount,
                todayUnread: todayCount,
                last24Hours: last24HoursCount,
                highPriority: highPriorityUnread
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

// PUT handler to mark notifications as read (optional)
export async function PUT(request) {
    try {
        // Check authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to the database
        await connectToDatabase();

        // Parse request body
        const { action, messageIds } = await request.json();

        if (action === 'markAsRead' && messageIds && Array.isArray(messageIds)) {
            // Mark specific messages as read
            await Contact.updateMany(
                { _id: { $in: messageIds }, status: 'unread' },
                { status: 'read' }
            );

            return NextResponse.json({ 
                message: 'Messages marked as read',
                updated: messageIds.length 
            });
        } else if (action === 'markAllAsRead') {
            // Mark all unread messages as read
            const result = await Contact.updateMany(
                { status: 'unread' },
                { status: 'read' }
            );

            return NextResponse.json({ 
                message: 'All messages marked as read',
                updated: result.modifiedCount 
            });
        }

        return NextResponse.json(
            { error: 'Invalid action or parameters' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Error updating notifications:', error);
        return NextResponse.json(
            { error: 'Failed to update notifications', details: error.message },
            { status: 500 }
        );
    }
}
