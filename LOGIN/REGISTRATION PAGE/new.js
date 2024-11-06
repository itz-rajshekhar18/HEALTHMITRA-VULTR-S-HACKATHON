const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/healthmitra', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

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

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Multer destination folder:", uploadDir);
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        console.log("Multer generated filename:", Date.now() + ext);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registration route
app.post('/register', upload.single('aadharFile'), async (req, res) => {
    // Log received form data
    console.log("Form data received:", req.body);
    console.log("File data received:", req.file);

    const { name, email, mobile, aadhar, differentlyAbled } = req.body;
    const aadharFile = req.file;

    try {
        // Check if the file is available
        if (!aadharFile) {
            console.log("No Aadhar file received");
            return res.json({ success: false, message: 'Aadhar file is required' });
        }

        // Create the user in the database
        const user = new User({
            name,
            email,
            mobile,
            aadhar,
            aadharFile: aadharFile.filename,
            differentlyAbled
        });

        // Save the user in MongoDB
        const savedUser = await user.save();
        console.log("User saved:", savedUser); // Log saved user object

        return res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.json({ success: false, message: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
