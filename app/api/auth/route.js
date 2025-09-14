import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { comparePassword } from '../../../controllers/adminController';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';

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

        // Check if password is correct using hashed comparison
        const adminPasswordHash = Buffer.from(process.env.ADMIN_PASSWORD_HASH, 'base64').toString('utf-8');

        if (!adminPasswordHash) {
            console.error('ADMIN_PASSWORD_HASH not found in environment variables');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Validate hash format (bcrypt hashes should be 60 characters)
        if (adminPasswordHash.length !== 60) {
            console.error(`Invalid hash length: ${adminPasswordHash.length}, expected 60`);
            return NextResponse.json(
                { error: 'Server configuration error - invalid hash format' },
                { status: 500 }
            );
        }

        const isPasswordValid = await comparePassword(password, adminPasswordHash);

        if (!isPasswordValid) {
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