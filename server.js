const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
  db.run(query, [username, email, hashedPassword], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ message: 'User registered', user_id: this.lastID });
  });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ?`;

  db.get(query, [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  });
});

// Protected route
app.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const query = `SELECT username, email, created_at FROM users WHERE id = ?`;

    db.get(query, [decoded.id], (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'User not found' });
      res.json({ profile: user });
    });
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
});

app.listen(3000, () => {
  console.log('FeelFlow backend running on http://localhost:3000');
});