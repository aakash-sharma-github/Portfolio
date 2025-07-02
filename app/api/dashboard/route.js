import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import Work from '@/lib/models/Work';
import Contact from '@/lib/models/Contact';

// GET handler to fetch dashboard statistics
export async function GET(request) {
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

        // Get current date for time-based queries
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Fetch all statistics in parallel
        const [
            // Blog statistics
            totalBlogs,
            publishedBlogs,
            blogsThisMonth,
            blogsThisWeek,
            blogsByCategory,
            
            // Work statistics
            totalWorks,
            completedWorks,
            featuredWorks,
            worksThisMonth,
            worksThisWeek,
            worksByCategory,
            
            // Contact statistics
            totalContacts,
            unreadContacts,
            readContacts,
            repliedContacts,
            archivedContacts,
            contactsThisMonth,
            contactsThisWeek,
            contactsToday,
            contactsByStatus,
            contactsByPriority,
            
            // Recent items
            recentBlogs,
            recentContacts,
            recentWorks
        ] = await Promise.all([
            // Blog queries
            Blog.countDocuments(),
            Blog.countDocuments({ published: true }),
            Blog.countDocuments({ createdAt: { $gte: startOfMonth } }),
            Blog.countDocuments({ createdAt: { $gte: startOfWeek } }),
            Blog.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            
            // Work queries
            Work.countDocuments(),
            Work.countDocuments({ status: 'completed' }),
            Work.countDocuments({ featured: true }),
            Work.countDocuments({ createdAt: { $gte: startOfMonth } }),
            Work.countDocuments({ createdAt: { $gte: startOfWeek } }),
            Work.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            
            // Contact queries
            Contact.countDocuments(),
            Contact.countDocuments({ status: 'unread' }),
            Contact.countDocuments({ status: 'read' }),
            Contact.countDocuments({ status: 'replied' }),
            Contact.countDocuments({ status: 'archived' }),
            Contact.countDocuments({ createdAt: { $gte: startOfMonth } }),
            Contact.countDocuments({ createdAt: { $gte: startOfWeek } }),
            Contact.countDocuments({ createdAt: { $gte: startOfDay } }),
            Contact.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            Contact.aggregate([
                { $group: { _id: '$priority', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            
            // Recent items
            Blog.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title slug createdAt author category'),
            Contact.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name email subject status priority createdAt'),
            Work.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title slug category status featured createdAt')
        ]);

        // Calculate growth percentages
        const blogGrowth = blogsThisMonth > 0 ? ((blogsThisWeek / blogsThisMonth) * 100).toFixed(1) : 0;
        const workGrowth = worksThisMonth > 0 ? ((worksThisWeek / worksThisMonth) * 100).toFixed(1) : 0;
        const contactGrowth = contactsThisMonth > 0 ? ((contactsThisWeek / contactsThisMonth) * 100).toFixed(1) : 0;

        // Prepare response data
        const dashboardData = {
            overview: {
                blogs: {
                    total: totalBlogs,
                    published: publishedBlogs,
                    drafts: totalBlogs - publishedBlogs,
                    thisMonth: blogsThisMonth,
                    thisWeek: blogsThisWeek,
                    growth: blogGrowth + '%'
                },
                works: {
                    total: totalWorks,
                    completed: completedWorks,
                    featured: featuredWorks,
                    inProgress: totalWorks - completedWorks,
                    thisMonth: worksThisMonth,
                    thisWeek: worksThisWeek,
                    growth: workGrowth + '%'
                },
                contacts: {
                    total: totalContacts,
                    unread: unreadContacts,
                    read: readContacts,
                    replied: repliedContacts,
                    archived: archivedContacts,
                    thisMonth: contactsThisMonth,
                    thisWeek: contactsThisWeek,
                    today: contactsToday,
                    growth: contactGrowth + '%'
                }
            },
            notifications: {
                unreadContacts: unreadContacts,
                hasNewMessages: unreadContacts > 0,
                todayMessages: contactsToday
            },
            analytics: {
                blogsByCategory: blogsByCategory.map(item => ({
                    category: item._id,
                    count: item.count
                })),
                worksByCategory: worksByCategory.map(item => ({
                    category: item._id,
                    count: item.count
                })),
                contactsByStatus: contactsByStatus.map(item => ({
                    status: item._id,
                    count: item.count
                })),
                contactsByPriority: contactsByPriority.map(item => ({
                    priority: item._id,
                    count: item.count
                }))
            },
            recent: {
                blogs: recentBlogs,
                contacts: recentContacts,
                works: recentWorks
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
