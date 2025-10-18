import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';


// GET handler to fetch all contact messages (admin only)
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

        // Get query parameters
        const url = new URL(request.url);
        const status = url.searchParams.get('status');
        const search = url.searchParams.get('search') || '';
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
        const page = Math.max(parseInt(url.searchParams.get('page') || '1'), 1);

        // Build query
        const filter = {};
        if (status) {
            filter.status = status;
        }

        // Add search by name, email, or subject
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const total = await Contact.countDocuments(filter);

        // Calculate pagination
        const totalPages = Math.ceil(total / limit);
        const currentPage = Math.min(page, totalPages);
        const skip = (currentPage - 1) * limit;

        // Fetch contacts with pagination
        const contacts = await Contact.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select({
                name: 1,
                email: 1,
                subject: 1,
                message: 1,
                status: 1,
                createdAt: 1
            });

        const response = {
            contacts,
            pagination: {
                total,
                page: currentPage,
                limit,
                pages: totalPages,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1
            },
            stats: {
                unread: await Contact.countDocuments({ status: 'unread' }),
                read: await Contact.countDocuments({ status: 'read' }),
                total: await Contact.countDocuments()
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contacts', details: error.message },
            { status: 500 }
        );
    }
}

// POST handler to create a contact message (typically used internally)
export async function POST(request) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Parse the request body
        const data = await request.json();

        // Validate required fields
        if (!data.name || !data.email || !data.subject || !data.message) {
            return NextResponse.json(
                { error: 'Missing required fields: name, email, subject, message' },
                { status: 400 }
            );
        }

        // Create the contact message
        const contact = await Contact.create(data);

        return NextResponse.json(contact, { status: 201 });
    } catch (error) {
        console.error('Error creating contact:', error);
        return NextResponse.json(
            { error: 'Failed to create contact', details: error.message },
            { status: 500 }
        );
    }
}
