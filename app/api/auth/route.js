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
        // Check if JWT_SECRET is configured
        if (!JWT_SECRET) {
            console.error('JWT_SECRET not found in environment variables');
            return NextResponse.json(
                { error: 'Server configuration error: JWT_SECRET not set' },
                { status: 500 }
            );
        }

        // Parse the request body
        const { password } = await request.json();

        // Check if password is provided
        if (!password) {
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 }
            );
        }

        // Check if ADMIN_PASSWORD_HASH is configured
        if (!process.env.ADMIN_PASSWORD_HASH) {
            console.error('ADMIN_PASSWORD_HASH not found in environment variables');
            return NextResponse.json(
                { 
                    error: 'Server configuration error: ADMIN_PASSWORD_HASH not set',
                    details: 'Please run: node scripts/generatePassword.js your_password'
                },
                { status: 500 }
            );
        }

        // Decode the base64 encoded hash
        let adminPasswordHash;
        try {
            adminPasswordHash = Buffer.from(process.env.ADMIN_PASSWORD_HASH, 'base64').toString('utf-8');
        } catch (error) {
            console.error('Error decoding ADMIN_PASSWORD_HASH:', error);
            return NextResponse.json(
                { 
                    error: 'Server configuration error: Invalid ADMIN_PASSWORD_HASH format',
                    details: 'Please regenerate the hash: node scripts/generatePassword.js your_password'
                },
                { status: 500 }
            );
        }

        // Validate hash format (bcrypt hashes should be 60 characters)
        if (adminPasswordHash.length !== 60) {
            console.error(`Invalid hash length: ${adminPasswordHash.length}, expected 60`);
            return NextResponse.json(
                { 
                    error: 'Server configuration error: Invalid hash format',
                    details: 'Please regenerate the hash: node scripts/generatePassword.js your_password'
                },
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
        // Check if JWT_SECRET is configured
        if (!JWT_SECRET) {
            console.error('JWT_SECRET not found in environment variables');
            return NextResponse.json(
                { error: 'Server configuration error: JWT_SECRET not set' },
                { status: 500 }
            );
        }

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

        if (!token) {
            console.error('Unauthorized: No token provided');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

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