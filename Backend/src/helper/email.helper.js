import { transporter } from "../config/nodemailer.config.js";

export const sendMail = async(emailAddress ,otp) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: emailAddress,
            subject: "Hello for the App",
            html: `<b>your OTP for the APP is</b> ${otp} `,
        });
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}