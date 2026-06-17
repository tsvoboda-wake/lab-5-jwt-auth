/**
 * Look for the token in the Authorization header.
 * Confirm that the token starts with Bearer.
 * Verify the token using JWT_SECRET.
 * Allow the request to continue if the token is valid.
 * Return a 401 Unauthorized error if the token is missing or invalid.
 * The token should be sent in this format:
 * Authorization: Bearer your_token_here
 */
const jwt = require('jsonwebtoken');
let JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Testing decoded token', decoded);
    // req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;