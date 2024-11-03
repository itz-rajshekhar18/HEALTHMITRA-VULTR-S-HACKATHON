const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();
const port = 3000;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/healthmitra', { useNewUrlParser: true, useUnifiedTopology: true });

// Define user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    aadhar: { type: String, required: true },
    aadharFile: { type: String },
    differentlyAbled: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());
app.use(multer({ dest: 'uploads/' }).single('aadharFile'));

// Registration route
app.post('/register', async (req, res) => {
    const { name, email, mobile, aadhar, differentlyAbled } = req.body;
    const aadharFile = req.file;

    try {
        const user = new User({
            name,
            email,
            mobile,
            aadhar,
            aadharFile: aadharFile.filename,
            differentlyAbled
        });

        await user.save();

        return res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});