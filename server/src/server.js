// src/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(cookieParser());

// Routes
import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);
// Add more routes later as needed

import auth from './middleware/auth.js';

import usersRoutes from './routes/users.js';
app.use('/api/users', usersRoutes);
// app.get('/api/users/getCurrentUser', auth, getCurrentUser);

import activityRoutes from './routes/activities.js';
app.use('/api/activities', activityRoutes);  

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));