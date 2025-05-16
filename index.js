require('dotenv').config();
const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const SENDER = process.env.SENDER;
// console.log("[DEBUG] API_KEY:", API_KEY);
// console.log("[DEBUG] SECRET_KEY:", SECRET_KEY);


// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Mailjet transporter
const transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    port: 587,
    auth: {
        user: API_KEY,
        pass: SECRET_KEY
    }
});

// Email handler
app.post('/', (req, res) => {
    const { email, report } = req.body;

    console.log("[DEBUG] Report received!");
    console.log("[DEBUG] Email:", email);
    console.log("[DEBUG] Report:\n" + report);

    // Read and populate the HTML template
    let htmlTemplate = fs.readFileSync('emailComponent.html', 'utf-8');
    htmlTemplate = htmlTemplate.replace('{{report}}', report);

    const mailOptions = {
        from: 'trianglepuzzle@proton.me',
        to: email,
        subject: 'Your Puzzle Report',
        text: report,
        html: htmlTemplate
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("[ERROR] Failed to send email:", error);
            return res.status(500).send("[EXCEPTION] Failed to send email");
        }
        console.log("[DEBUG SUCCESS] Email sent:", info.response);
        res.send("[DEBUG END SUCCESS] Email sent successfully!");
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`[DEBUG] Server running on http://localhost:${PORT}`);
});

