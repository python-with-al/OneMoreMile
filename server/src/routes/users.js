// src/routes/users.js
import express from 'express';
import User from '../models/User.js';

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    // Find user by id but don't return password
    console.log("User ID:", req.user.id);
    const user = await User.findOne(req.user.email).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, preferences } = req.body;
    
    // Find and update the user
    let user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (preferences) user.preferences = {...user.preferences, ...preferences};
    
    await user.save();
    
    // Don't return the password
    user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a router
const router = express.Router();

// Define routes
router.get('/getCurrentUser', getCurrentUser);
router.put('/updateProfile', updateProfile);

export default router;