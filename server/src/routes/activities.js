import express from 'express';
import Activity from '../models/Activity.js';
import User from '../models/User.js';

// Get all activities
export const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Post a new activity
export const updateUserActivities = async (userId, activity) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const activityType = activity.type.toLowerCase();
        if (Object.prototype.hasOwnProperty.call(user.activities, activityType)) {
            user.activities[activityType].push(activity._id);
            await user.save();
        } else {
            user.activities["others"].push(activity._id);
            await user.save();
        }
    } catch (err) {
        throw new Error(err.message);
    }
};

export const postActivity = async (req, res) => {
    const activity = new Activity({
        type: req.body.type,
        distance: req.body.distance,
        date: req.body.date,
        duration: req.body.duration,
        avgPace: req.body.avgPace,
        notes: req.body.notes,
        calories: req.body.calories,
        avgHR: req.body.avgHR,
        maxHR: req.body.maxHR,
        avgCadence: req.body.avgCadence,
        maxCadence: req.body.maxCadence,
        totalAscent: req.body.totalAscent,
        totalDescent: req.body.totalDescent,
        avgStrideLength: req.body.avgStrideLength,
        avgVerticalRatio: req.body.avgVerticalRatio,
        avgVerticalOscillation: req.body.avgVerticalOscillation,
        avgGCT: req.body.avgGCT,
        avgGCTBalance: req.body.avgGCTBalance,
        trainingStressScore: req.body.trainingStressScore,
        steps: req.body.steps,
        decompression: req.body.decompression,
        minElevation: req.body.minElevation,
        maxElevation: req.body.maxElevation
    });

    try {
        await activity.save();
        res.status(201).json(activity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Create a router
const router = express.Router();

// Define routes
router.get('/getActivities', getActivities);
router.post(
    '/postActivity',
    postActivity);
router.put('/updateUserActivities', updateUserActivities);

export default router;