export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { comparePassword } from '../../../controllers/adminController';

const JWT_SECRET = process.env.JWT_SECRET;

// Rate limiting
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip) {
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (!record) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now });
        return true;
    }

    if (now - record.firstAttempt > WINDOW_MS) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now });
        return true;
    }

    if (record.count >= MAX_ATTEMPTS) return false;

    record.count++;
    return true;
}

function recordSuccess(ip) {
    loginAttempts.delete(ip);
}

function secureHeaders() {
    return {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Cache-Control': 'no-store',
    };
}

// ===================== POST LOGIN =====================
export async function POST(request) {
    try {
        if (!JWT_SECRET) {
            console.error('Missing JWT_SECRET');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500, headers: secureHeaders() }
            );
        }

        const clientIp =
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown';

        if (!checkRateLimit(clientIp)) {
            return NextResponse.json(
                { error: 'Too many attempts' },
                { status: 429, headers: { ...secureHeaders(), 'Retry-After': '900' } }
            );
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: 'Invalid JSON' },
                { status: 400, headers: secureHeaders() }
            );
        }

        const { password } = body;

        if (!password || typeof password !== 'string') {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 400, headers: secureHeaders() }
            );
        }

        if (password.length > 128) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401, headers: secureHeaders() }
            );
        }

        const encodedHash = process.env.ADMIN_PASSWORD_HASH;
        if (!encodedHash) {
            console.error('Missing ADMIN_PASSWORD_HASH');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500, headers: secureHeaders() }
            );
        }

        const adminPasswordHash = Buffer.from(encodedHash, 'base64').toString('utf-8');

        if (adminPasswordHash.length !== 60) {
            console.error('Invalid bcrypt hash');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500, headers: secureHeaders() }
            );
        }

        const isValid = await comparePassword(password, adminPasswordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401, headers: secureHeaders() }
            );
        }

        recordSuccess(clientIp);

        const token = jwt.sign(
            {
                role: 'admin',
                jti: crypto.randomUUID(),
            },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        return NextResponse.json(
            { token },
            { status: 200, headers: secureHeaders() }
        );

    } catch (err) {
        console.error('Auth error:', err);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500, headers: secureHeaders() }
        );
    }
}

// ===================== VERIFY TOKEN =====================
export async function GET(request) {
    try {
        if (!JWT_SECRET) {
            return NextResponse.json(
                { error: 'Server error' },
                { status: 500, headers: secureHeaders() }
            );
        }

        const authHeader = request.headers.get('authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401, headers: secureHeaders() }
            );
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET);

        return NextResponse.json(
            { valid: true, user: { role: decoded.role } },
            { headers: secureHeaders() }
        );

    } catch (err) {
        return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401, headers: secureHeaders() }
        );
    }
}