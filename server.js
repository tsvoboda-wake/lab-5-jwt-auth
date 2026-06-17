require('dotenv').config();

const express = require('express');
const app = express();
const { PORT, JWT_SECRET } = process.env;

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Lab 5 JWT Auth is running');
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

// Connect auth routes
app.use('/', authRoutes);


// Connect protected routes
app.use('/', protectedRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});