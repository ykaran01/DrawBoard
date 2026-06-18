import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.PASS,
    },
});