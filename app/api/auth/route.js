// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
// import { comparePassword } from '../../../controllers/adminController';

// // Explicitly set Node.js runtime
// export const runtime = 'nodejs';
// // Force dynamic rendering since we use request headers
// export const dynamic = 'force-dynamic';

// const JWT_SECRET = process.env.JWT_SECRET;

// // Simple in-memory rate limiting (resets on server restart)
// // For production, use Redis or a proper rate limiting library
// const loginAttempts = new Map();
// const MAX_ATTEMPTS = 5;
// const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// function checkRateLimit(ip) {
//     const now = Date.now();
//     const record = loginAttempts.get(ip);

//     if (!record) {
//         loginAttempts.set(ip, { count: 1, firstAttempt: now });
//         return true;
//     }

//     // Reset window if expired
//     if (now - record.firstAttempt > WINDOW_MS) {
//         loginAttempts.set(ip, { count: 1, firstAttempt: now });
//         return true;
//     }

//     if (record.count >= MAX_ATTEMPTS) {
//         return false;
//     }

//     record.count += 1;
//     return true;
// }

// function recordSuccess(ip) {
//     // Clear rate limit on successful login
//     loginAttempts.delete(ip);
// }

// // Security headers helper
// function secureHeaders() {
//     return {
//         'X-Content-Type-Options': 'nosniff',
//         'X-Frame-Options': 'DENY',
//         'Cache-Control': 'no-store',
//     };
// }

// // POST handler for login
// export async function POST(request) {
//     try {
//         if (!JWT_SECRET) {
//             console.error('JWT_SECRET not found in environment variables');
//             return NextResponse.json(
//                 { error: 'Server configuration error' },
//                 { status: 500, headers: secureHeaders() }
//             );
//         }

//         // Rate limiting by IP
//         const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
//             || request.headers.get('x-real-ip')
//             || 'unknown';

//         if (!checkRateLimit(clientIp)) {
//             return NextResponse.json(
//                 { error: 'Too many login attempts. Please try again later.' },
//                 { status: 429, headers: { ...secureHeaders(), 'Retry-After': '900' } }
//             );
//         }

//         // Parse the request body
//         let body;
//         try {
//             body = await request.json();
//         } catch {
//             return NextResponse.json(
//                 { error: 'Invalid request body' },
//                 { status: 400, headers: secureHeaders() }
//             );
//         }

//         const { password } = body;

//         if (!password || typeof password !== 'string') {
//             return NextResponse.json(
//                 { error: 'Password is required' },
//                 { status: 400, headers: secureHeaders() }
//             );
//         }

//         // Limit password length to prevent DoS via bcrypt
//         if (password.length > 128) {
//             return NextResponse.json(
//                 { error: 'Invalid credentials' },
//                 { status: 401, headers: secureHeaders() }
//             );
//         }

//         if (!process.env.ADMIN_PASSWORD_HASH) {
//             console.error('ADMIN_PASSWORD_HASH not found in environment variables');
//             return NextResponse.json(
//                 { error: 'Server configuration error' },
//                 { status: 500, headers: secureHeaders() }
//             );
//         }

//         // Decode the base64 encoded hash
//         let adminPasswordHash;
//         try {
//             adminPasswordHash = Buffer.from(process.env.ADMIN_PASSWORD_HASH, 'base64').toString('utf-8');
//         } catch {
//             console.error('Error decoding ADMIN_PASSWORD_HASH');
//             return NextResponse.json(
//                 { error: 'Server configuration error' },
//                 { status: 500, headers: secureHeaders() }
//             );
//         }

//         // Validate hash format (bcrypt hashes should be 60 characters)
//         if (adminPasswordHash.length !== 60) {
//             console.error(`Invalid hash length: ${adminPasswordHash.length}, expected 60`);
//             return NextResponse.json(
//                 { error: 'Server configuration error' },
//                 { status: 500, headers: secureHeaders() }
//             );
//         }

//         const isPasswordValid = await comparePassword(password, adminPasswordHash);

//         if (!isPasswordValid) {
//             // FIX: use a generic message to not reveal whether account exists
//             return NextResponse.json(
//                 { error: 'Invalid credentials' },
//                 { status: 401, headers: secureHeaders() }
//             );
//         }

//         recordSuccess(clientIp);

//         // Generate JWT token — FIX: add jti (JWT ID) to allow future revocation
//         const token = jwt.sign(
//             {
//                 role: 'admin',
//                 jti: crypto.randomUUID(),
//             },
//             JWT_SECRET,
//             { expiresIn: '2h' }
//         );

//         return NextResponse.json({ token }, { headers: secureHeaders() });
//     } catch (error) {
//         console.error('Error during authentication:', error);
//         return NextResponse.json(
//             { error: 'Authentication failed' },
//             { status: 500, headers: secureHeaders() }
//         );
//     }
// }

// // GET handler to verify token
// export async function GET(request) {
//     try {
//         if (!JWT_SECRET) {
//             console.error('JWT_SECRET not found in environment variables');
//             return NextResponse.json(
//                 { error: 'Server configuration error' },
//                 { status: 500, headers: secureHeaders() }
//             );
//         }

//         const authHeader = request.headers.get('authorization');

//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return NextResponse.json(
//                 { error: 'Unauthorized' },
//                 { status: 401, headers: secureHeaders() }
//             );
//         }

//         const token = authHeader.split(' ')[1];

//         if (!token) {
//             return NextResponse.json(
//                 { error: 'Unauthorized' },
//                 { status: 401, headers: secureHeaders() }
//             );
//         }

//         try {
//             const decoded = jwt.verify(token, JWT_SECRET);
//             // FIX: only return safe, non-sensitive fields
//             return NextResponse.json(
//                 { valid: true, user: { role: decoded.role } },
//                 { headers: secureHeaders() }
//             );
//         } catch (error) {
//             console.error('Invalid token:', error.message);
//             return NextResponse.json(
//                 { error: 'Invalid token' },
//                 { status: 401, headers: secureHeaders() }
//             );
//         }
//     } catch (error) {
//         console.error('Error verifying token:', error);
//         return NextResponse.json(
//             { error: 'Token verification failed' },
//             { status: 500, headers: secureHeaders() }
//         );
//     }
// }

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { comparePassword } from '../../../controllers/adminController';

const JWT_SECRET = process.env.JWT_SECRET;
console.log(`JWT secrets: ${JWT_SECRET}`)

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