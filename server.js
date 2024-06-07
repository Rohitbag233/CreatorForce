const express = require('express');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
