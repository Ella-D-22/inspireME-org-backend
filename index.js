const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON data
app.use(express.json());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../Front end')));

// Handle requests to the root URL (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front end/index.html'));
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'muringoviolet@gmail.com', // Your Gmail address
        pass: 'pmtd ppej erri grmf',    // Your App Password
    },
});


// Endpoint to handle contact form submission
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const mailOptions = {
        from: `"${name}" <${email}>`,  // Use visitor's email as sender
        to: 'muringoviolet@gmail.com', // Your email address
        subject: `New Contact Form Submission from ${name}`,
        text: `Message from: ${name}\n\nEmail: ${email}\n\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error.message);
            return res.status(500).json({ message: 'Error sending email, please try again later.' });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: 'Your message has been sent successfully!' });
        }
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
