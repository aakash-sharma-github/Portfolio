import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import blogCategories from '@/lib/blogCategories';

// GET handler to fetch all unique categories
export async function GET() {
    try {
        // Connect to the database
        await connectToDatabase();

        // Get all unique categories from the database
        const dbCategories = await Blog.distinct('category');
        
        // Combine predefined categories with any additional unique categories from the database
        // Use a Set to eliminate duplicates
        const allCategories = [...new Set([...blogCategories, ...dbCategories])];
        
        // Return the combined unique categories
        return NextResponse.json(allCategories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}