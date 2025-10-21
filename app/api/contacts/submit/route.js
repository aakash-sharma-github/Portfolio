import { transporter } from '@/lib/nodeMailer'
import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Contact from '@/lib/models/Contact'

// Explicitly set Node.js runtime
export const runtime = 'nodejs';

export async function POST(req) {
    try {
        const body = await req.json()
        const { fullname, email, subject, message } = body

        // Debug logging
        console.log('Contact form data received:', { fullname, email, subject, message });
        
        // Connect to database and save the message
        await connectToDatabase();
        
        // Get client IP and user agent for logging
        const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';
        
        // Save contact message to database
        const contactMessage = await Contact.create({
            name: fullname,
            email,
            subject,
            message,
            ipAddress: clientIp,
            userAgent,
            source: 'website'
        });

        const myemail = process.env.SMTP_EMAIL

        const emailOption = {
            from: email,
            to: myemail
        }

        const emailFields = {
            fullname: 'NAME',
            email: 'EMAIL',
            subject: 'SUBJECT',
            message: 'MESSAGE'
        }

        const emailContent = field => {
            const emailData = Object.entries(field).reduce((acc, [key, value]) => {
                return (acc += `${emailFields[key]}: ${value}\n`)
            })

            const htmlData = Object.entries(field).reduce((acc, [key, value]) => {
                return (acc += `<p><span class="info-label">${emailFields[key]}:&nbsp;</span><span class="info-value">${value}</span></p>`)
            }, '')

            return {
                text: emailData,
                html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 5px;
        }
        .email-header {
            text-align: center;
            background-color: #3F88C5;
            color: #ffffff;
            padding: 10px;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
        .email-body {
            padding: 20px;
        }
        .email-footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #aaaaaa;
        }
        .info-label {
            font-weight: bold;
        }
        .info-value {
            font-weight: normal;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>New Message from ${fullname}</h1>
        </div>
        <div class="email-body">
            ${htmlData}
        </div>
        <div class="email-footer">
            <p>Made with &#10084; by <a href="https://github.com/aakash-sharma-github">Aakash Sharma</a></p>
        </div>
    </div>
</body>
</html>
`
            }
        }

        // Check if SMTP is configured
        if (!process.env.SMTP_EMAIL || !process.env.SMTP_EMAIL_PASSWORD) {
            console.error('SMTP credentials not configured');
            return NextResponse.json(
                { message: 'Email service not configured. Please contact administrator.' },
                { status: 500 }
            )
        }

        // Process form data
        await transporter.sendMail({
            ...emailOption,
            ...emailContent(body),
            subject: subject,
        })

        // Respond with a success message
        return NextResponse.json(
            { message: 'Message sent successfully!' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error processing message:', error)
        return NextResponse.json(
            { message: `Failed to send message: ${error.message}` },
            { status: 500 }
        )
    }
}
