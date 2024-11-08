const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Set up file storage with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3305',
    password: 'newpassword',
    database: 'healthmitra'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// API endpoint to handle form submission
const fs = require('fs');

// Ensure the uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.post('/register', upload.single('aadharFile'), (req, res) => {
    const { name, email, mobile, aadhar, differentlyAbled } = req.body;
    const aadharFile = req.file ? req.file.path : null; // Path to uploaded file

    const query = 'INSERT INTO patients (name, email, mobile, aadhar, aadharFile, differentlyAbled) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, email, mobile, aadhar, aadharFile, differentlyAbled ? 1 : 0], (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).json({ success: false, message: 'Database error' });
        } else {
            res.json({ success: true, message: 'Registration successful' });
        }
    });
});
;

// Serve static files (HTML, CSS, JS) from 'public' folder
app.use(express.static('public'));

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
