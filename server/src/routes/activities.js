import express from 'express';
import Activity from '../models/Activity.js';
import User from '../models/User.js';

// Get all activities
export const getActivities = async (req, res) => {
    try {
        const activities = [];
        for (const item of req.body) {
            const activity = await Activity.findById(item);
            if (activity) {
                activities.push(activity);
            }
        }
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Post a new activity
export const updateUserActivities = async (req, res) => {
    try {
        console.log("body:", req.body);
        const user = await User.findById(req.body.userId);
        if (!user) {
            res.status(404).json({ message: "User Not Found" });
        }
        
        console.log("user:", user)
        const activityType = req.body.newActivity.type.toLowerCase();
        console.log("activityType:", activityType)
        try  {
            console.log("Trying to push activity id:", req.body.newActivity._id);
            
            user.activities.get('runs').push(req.body.newActivity._id);
            user.markModified('activities'); // Important!
            console.log("attempting to save user");
            await user.save();
            res.status(201).json(user);
        } catch {
            user.activities.get('others').push(req.body.newActivity._id);
            user.markModified('activities'); // Important!
            await user.save();
            
            res.status(201).json(user);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const postActivity = async (req, res) => {
    const activity = new Activity({
        type: req.body.type,
        typeWorkout: req.body.typeWorkout,
        distance: req.body.distance,
        date: req.body.date,
        duration: req.body.duration,
        avgPace: req.body.avgPace,
        timeOfDay: req.body.timeOfDay,
        terrain: req.body.terrain,
        difficulty: req.body.difficulty,
        weather: req.body.weather,
        shoe: req.body.shoe,
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
router.post('/getActivities', getActivities);
router.post(
    '/postActivity',
    postActivity);
router.post('/updateUserActivities', updateUserActivities);

export default router;