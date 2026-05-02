const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./database');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Test Route


const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();