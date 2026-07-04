import { brevo } from '../config/nodemailer.config.js';

export const sendMail = async (emailAddress, otp) => {
    try {
        const result = await brevo.transactionalEmails.sendTransacEmail({
            subject: "Your DrawBoard Verification Code",
            htmlContent: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #4f46e5; font-size: 22px; margin: 0;">DrawBoard</h1>
                    </div>
                    <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                        Use the code below to verify your account. This code is valid for <b>5 minutes</b>.
                    </p>
                    <div style="text-align: center; margin: 28px 0;">
                        <span style="display: inline-block; font-size: 32px; letter-spacing: 8px; font-weight: 700; color: #111827; background-color: #f3f4f6; padding: 14px 28px; border-radius: 8px;">
                            ${otp}
                        </span>
                    </div>
                    <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
                        If you didn't request this code, you can safely ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                        &copy; ${new Date().getFullYear()} DrawBoard. All rights reserved.
                    </p>
                </div>
            `,
            sender: { name: "DrawBoard", email: process.env.ADMIN_EMAIL },
            to: [{ email: emailAddress }],
        });

        console.log("Email sent. Message ID:", result.messageId);
        return result;
    } catch (err) {
        console.error("Error while sending mail:", err);
        throw err;
    }
};