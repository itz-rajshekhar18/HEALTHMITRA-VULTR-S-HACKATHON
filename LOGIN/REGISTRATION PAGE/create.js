const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const createModule = require('./create');o
const app = express();
const port = 3000;
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);
app.use(bodyParser.json());
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }
        const transporter = nodemailer.createTransport({
        });

        const mailOptions = {
            from: 'your-email@example.com',
            to: user.email,
            subject: 'Welcome back!',
            text: 'You have successfully logged in.'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: 'An error occurred' });
    }
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});