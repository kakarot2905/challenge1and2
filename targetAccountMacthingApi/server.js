const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// In-memory storage (replace with a database in production)
const users = [
    {
        username: 'user1',
        // Password: pass123
        password: '$2a$10$JOfOwh0WRz7w9LhAL2RjAePl.2C8foBFhRCNJfEujqbZt2sGuLSOq'
    }
];

const companies = [
    { id: 1, name: 'TechCorp', matchScore: 86, status: 'Target' },
    { id: 2, name: 'InnovateSoft', matchScore: 75, status: 'Not Target' },
    { id: 3, name: 'DataCo', matchScore: 92, status: 'Target' }
];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || '3*&678T87T*6*&%^&%&*^%', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET || '3*&678T87T*6*&%^&%&*^%', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
});

// Get accounts endpoint
app.get('/accounts', authenticateToken, (req, res) => {
    res.json(companies);
});

// Update account status endpoint
app.post('/accounts/:id/status', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const company = companies.find(c => c.id === parseInt(id));
    if (!company) {
        return res.status(404).json({ message: 'Company not found' });
    }

    if (status !== 'Target' && status !== 'Not Target') {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    company.status = status;
    res.json({ message: 'Status updated successfully', company });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 