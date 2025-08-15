const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ error: 'Username already exists' });

    const user = new User({ username, password });
    await user.save();

    req.session.userId = user._id;
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'jwtsecret', { expiresIn: '1h' });
    res.json({ message: 'Signup successful', token });
  } catch (err) {
    console.error('Signup error', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: Object.values(err.errors).map(e => e.message) });
    }
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'jwtsecret', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  if (!req.session) return res.json({ message: 'Logged out' });
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
