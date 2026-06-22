import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.PASS,
    },
});