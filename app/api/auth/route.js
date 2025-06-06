import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// POST handler for login
export async function POST(request) {
    try {
        // Parse the request body
        const { password } = await request.json();

        // Check if password is provided
        if (!password) {
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 }
            );
        }

        // Check if password is correct
        const correctPassword = process.env.ADMIN_PASSWORD;

        if (password !== correctPassword) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { role: 'admin' },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Return token
        return NextResponse.json({ token });
    } catch (error) {
        console.error('Error during authentication:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

// GET handler to verify token
export async function GET(request) {
    try {
        // Get token from authorization header
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('Unauthorized: No valid Authorization header');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return NextResponse.json({ valid: true, user: decoded });
        } catch (error) {
            console.error('Invalid token:', error.message);
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return NextResponse.json(
            { error: 'Token verification failed' },
            { status: 500 }
        );
    }
} 