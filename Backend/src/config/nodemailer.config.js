import nodemailer from 'nodemailer'
import * as brevo from '@getbrevo/brevo';
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

import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

export { apiInstance, brevo };