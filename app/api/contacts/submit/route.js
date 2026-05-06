import { transporter } from '@/lib/nodeMailer';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

// Explicitly set Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Simple in-memory rate limiting for contact submissions
const submitAttempts = new Map();
const MAX_SUBMISSIONS = 3;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkSubmitRateLimit(ip) {
    const now = Date.now();
    const record = submitAttempts.get(ip);

    if (!record) {
        submitAttempts.set(ip, { count: 1, firstAttempt: now });
        return true;
    }

    if (now - record.firstAttempt > WINDOW_MS) {
        submitAttempts.set(ip, { count: 1, firstAttempt: now });
        return true;
    }

    if (record.count >= MAX_SUBMISSIONS) {
        return false;
    }

    record.count += 1;
    return true;
}

// Simple HTML escape to prevent XSS in email content
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Basic email format validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
    try {
        // Rate limiting
        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || req.headers.get('x-real-ip')
            || 'unknown';

        if (!checkSubmitRateLimit(clientIp)) {
            return NextResponse.json(
                { message: 'Too many submissions. Please wait before trying again.' },
                { status: 429, headers: { 'Retry-After': '600' } }
            );
        }

        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
        }

        const { fullname, email, subject, message } = body;

        // FIX: Validate all required fields
        if (!fullname || !email || !subject || !message) {
            return NextResponse.json(
                { message: 'All fields are required: fullname, email, subject, message' },
                { status: 400 }
            );
        }

        // FIX: Validate types and lengths
        if (typeof fullname !== 'string' || fullname.trim().length < 2 || fullname.trim().length > 100) {
            return NextResponse.json({ message: 'Name must be between 2 and 100 characters' }, { status: 400 });
        }

        if (typeof email !== 'string' || !isValidEmail(email) || email.length > 254) {
            return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
        }

        if (typeof subject !== 'string' || subject.trim().length < 3 || subject.trim().length > 200) {
            return NextResponse.json({ message: 'Subject must be between 3 and 200 characters' }, { status: 400 });
        }

        if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
            return NextResponse.json({ message: 'Message must be between 10 and 2000 characters' }, { status: 400 });
        }

        // Sanitize for storage
        const safeName = fullname.trim();
        const safeEmail = email.trim().toLowerCase();
        const safeSubject = subject.trim();
        const safeMessage = message.trim();

        await connectToDatabase();

        const userAgent = req.headers.get('user-agent') || 'unknown';

        await Contact.create({
            name: safeName,
            email: safeEmail,
            subject: safeSubject,
            message: safeMessage,
            ipAddress: clientIp,
            userAgent,
            source: 'website',
        });

        const myEmail = process.env.SMTP_EMAIL;

        if (!myEmail || !process.env.SMTP_EMAIL_PASSWORD) {
            console.error('SMTP credentials not configured');
            // FIX: still return 200 — the message was saved to DB, even if email fails
            return NextResponse.json(
                { message: 'Message received! Email notification could not be sent but your message is saved.' },
                { status: 200 }
            );
        }

        // FIX: escape HTML in all user-supplied content before embedding in HTML email
        const safeHtmlName = escapeHtml(safeName);
        const safeHtmlEmail = escapeHtml(safeEmail);
        const safeHtmlSubject = escapeHtml(safeSubject);
        const safeHtmlMessage = escapeHtml(safeMessage).replace(/\n/g, '<br>');

        const htmlBody = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #dddddd; border-radius: 5px; }
        .email-header { text-align: center; background-color: #3F88C5; color: #ffffff; padding: 10px; border-top-left-radius: 5px; border-top-right-radius: 5px; }
        .email-body { padding: 20px; }
        .email-footer { text-align: center; padding: 10px; font-size: 12px; color: #aaaaaa; }
        .info-label { font-weight: bold; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>New Message from ${safeHtmlName}</h1>
        </div>
        <div class="email-body">
            <p><span class="info-label">NAME:</span> ${safeHtmlName}</p>
            <p><span class="info-label">EMAIL:</span> ${safeHtmlEmail}</p>
            <p><span class="info-label">SUBJECT:</span> ${safeHtmlSubject}</p>
            <p><span class="info-label">MESSAGE:</span><br>${safeHtmlMessage}</p>
        </div>
        <div class="email-footer">
            <p>Portfolio Contact Form</p>
        </div>
    </div>
</body>
</html>`;

        const textBody = `NAME: ${safeName}\nEMAIL: ${safeEmail}\nSUBJECT: ${safeSubject}\nMESSAGE:\n${safeMessage}`;

        try {
            await transporter.sendMail({
                from: `"Portfolio Contact" <${myEmail}>`, // FIX: use authenticated address as sender, put user email in Reply-To
                replyTo: safeEmail,
                to: myEmail,
                subject: `[Portfolio] ${safeSubject}`,
                text: textBody,
                html: htmlBody,
            });
        } catch (emailError) {
            console.error('Failed to send email notification:', emailError.message);
            // Message already saved to DB — still return success
            return NextResponse.json(
                { message: 'Message received! (Email notification failed but your message is saved.)' },
                { status: 200 }
            );
        }

        return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error processing message:', error);
        return NextResponse.json(
            { message: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}