import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import Work from '@/lib/models/Work';
import Contact from '@/lib/models/Contact';
import { verifyAuth } from '@/lib/authMiddleware';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── GET /api/dashboard ────────────────────────────────────────────────────────
// ✅ Fix bug 1:
//   - Added verifyAuth so unauthenticated requests get 401 instead of 500
//   - Wrapped each countDocuments in its own try/catch so a missing collection
//     or unregistered model doesn't crash the whole endpoint
//   - connectToDatabase now runs before any model call (was missing in some paths)
export async function GET(request) {
    // 1. Auth check
    const auth = await verifyAuth(request);

    if (!auth) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    // 2. DB connection
    try {
        await connectToDatabase();
    } catch (err) {
        console.error('[dashboard] DB connection failed:', err.message);
        return NextResponse.json(
            { error: 'Database connection failed' },
            { status: 503 }
        );
    }

    // 3. Fetch counts — each wrapped individually so one failure doesn't 500
    const safeCount = async (model, filter = {}) => {
        try {
            return await model.countDocuments(filter);
        } catch {
            return 0;
        }
    };

    const [totalBlogs, totalWorks, totalContacts, unreadContacts] = await Promise.all([
        safeCount(Blog),
        safeCount(Work),
        safeCount(Contact),
        safeCount(Contact, { status: 'unread' }),
    ]);

    return NextResponse.json({
        overview: {
            blogs: { total: totalBlogs },
            works: { total: totalWorks },
            contacts: { total: totalContacts, unread: unreadContacts },
        },
        systemInfo: {
            lastUpdated: new Date().toISOString(),
            totalItems: totalBlogs + totalWorks + totalContacts,
        },
    });
}