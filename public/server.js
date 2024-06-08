const express = require('express');
const connectDB = require('../config/db');
const dotenv = require('dotenv');
const helmet = require('helmet');
const path = require('path');
const User = require('../models/User'); // Ensure you have the User model defined in models/User.js

dotenv.config();

const app = express();

// Use Helmet to set security-related headers
app.use(helmet());

// Configure specific CSP settings
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https://dummyimage.com'],
        },
    })
);

// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve index.html from the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Define a route for the welcome message
app.get('/api', (req, res) => {
    res.send('Welcome to the CreatorForce API');
});

// Register User
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, password });

        await user.save();
        res.send('User registered');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login User
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        res.json({ username: user.username, points: user.points });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Assign Points
app.post('/assign-points', async (req, res) => {
    const { username, points } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        user.points += points;
        await user.save();

        res.json({ msg: 'Points assigned' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Fetch User Data
app.get('/user/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
