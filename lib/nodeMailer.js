import nodemailer from 'nodemailer'

const email = process.env.SMTP_EMAIL
const password = process.env.SMTP_EMAIL_PASSWORD

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: password,
    },
})

