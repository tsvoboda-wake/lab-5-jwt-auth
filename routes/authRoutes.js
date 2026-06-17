const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

let users = []; // In-memory user storage

/**
 * Accept a user’s name, email, and password.
 * Check whether the email is already registered.
 * Hash the password before storing it.
 * Store the user in an in-memory users array.
 * Return a JWT token.
 */
router.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'Email is already registered' });
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = { id: users.length + 1, name, email, password: hashedPassword };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({ message: 'User registered successfully', user: {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email
  }, token: `Bearer ${token}` });
});

/**
 * Accept a user’s email and password.
 * Check whether the user exists.
 * Compare the entered password with the stored hashed password.
 * Return a JWT token if login is successful.
 * Return an error message if login fails.
 */
router.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    // NOTE: intentionally using ambiguous error message 
    // to avoid giving hints about which part of the credentials is incorrect
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', user: {
      id: user.id,
      name: user.name,
      email: user.email
    }, token: `Bearer ${token}` });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' }); 
  }
});

module.exports = router;