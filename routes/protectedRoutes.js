/**
* GET /api/protected/profile
* This route should only work if the request includes a valid token.
* If the token is valid, return a response that includes a success message and the user information from the
* token.
*/
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/api/protected/profile', authMiddleware, (req, res) => {
  try {
  res.status(200).json({ message: 'Profile information retrieved successfully', user: req.user });
  } catch (error) {
    console.error('Error retrieving profile information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;