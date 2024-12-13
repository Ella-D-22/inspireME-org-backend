// Load required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Initialize the Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(bodyParser.json()); // Parses incoming JSON data

// API Endpoint to handle form submissions
app.post('/submit-form', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate incoming data
    if (!name || !email || !message) {
        return res.status(400).send({ error: 'All fields are required.' });
    }

    try {
        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // From .env
                pass: process.env.EMAIL_PASS, // From .env
            },
        });

        // Email options
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER, // Send to your email
            subject: 'New Contact Form Submission',
            text: `You have a new message from your website:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Send success response
        res.status(200).send({ message: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ error: 'Failed to send your message. Please try again later.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
