const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('EMAIL_USER or EMAIL_PASS not set in .env. Skipping email send.');
        console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
        return false; // Indicating email was not actually sent via SMTP
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Test the connection
        console.log('Testing email connection...');
        await transporter.verify();
        console.log('--- EMAIL SYSTEM READY ---');

        const mailOptions = {
            from: `"Productr Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Login Verification Code',
            text: `Your Verification Code is: ${otp}`,
            html: `<h1 style="color: #102693;">Code: ${otp}</h1><p>Valid for 10 minutes.</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Success! OTP ${otp} sent to ${email}`);
        return true;
    } catch (error) {
        console.error('!!! EMAIL ERROR:', error.message);
        console.log(`!!! LOOK HERE: The code is ${otp}`);
        return false;
    }
};

module.exports = { sendOTP };
