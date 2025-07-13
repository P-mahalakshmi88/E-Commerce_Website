
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login Route for User & Admin
router.post('/login', async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    // Admin Login (Hardcoded)
    if (isAdmin) {
      const adminEmail = 'admin@gmail.com';
      const adminPassword = 'admin123';

      if (email === adminEmail && password === adminPassword) {
        const token = jwt.sign(
          { email, isAdmin: true },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
        return res.status(200).json({ message: 'Admin login successful', token, isAdmin: true });
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    }

    // User Login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ message: 'User login successful', token, isAdmin: false });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
