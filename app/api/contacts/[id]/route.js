import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';


// GET handler to fetch a specific contact message by ID
export async function GET(request, { params }) {
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

        // Get the ID from the URL
        const { id } = params;

        // Find the contact message
        const contact = await Contact.findById(id);

        // If contact not found
        if (!contact) {
            return NextResponse.json(
                { error: 'Contact message not found' },
                { status: 404 }
            );
        }

        // Mark as read if it was unread
        if (contact.status === 'unread') {
            contact.status = 'read';
            await contact.save();
        }

        return NextResponse.json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contact', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE handler to delete a contact message
export async function DELETE(request, { params }) {
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

        // Get the ID from the URL
        const { id } = params;

        // Find and delete the contact message
        const contact = await Contact.findByIdAndDelete(id);

        // If contact not found
        if (!contact) {
            return NextResponse.json(
                { error: 'Contact message not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Contact message deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json(
            { error: 'Failed to delete contact', details: error.message },
            { status: 500 }
        );
    }
}
