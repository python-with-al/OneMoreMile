// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with auth headers
const authAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  });
};

// Fetch user data
export const fetchUserData = async () => {
  try {
    const response = await authAxios().get('/users/getCurrentUser');
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Fetch weekly training plan
export const fetchWeeklyPlan = async () => {
  try {
    // This would be a real API endpoint in production
    // For now, return mock data
    return {
      days: [
        { day: 'Monday', description: 'Easy Run 4mi' },
        { day: 'Tuesday', description: 'Fartlek 2/3/4/3/2 +Weights' },
        { day: 'Wednesday', description: 'Easy Run 4mi' },
        { day: 'Thursday', description: '10x Hill Sprints' },
        { day: 'Friday', description: 'Easy Run 5mi' },
        { day: 'Saturday', description: 'Off' },
        { day: 'Sunday', description: 'Long Run 8mi' }
      ],
      weeklyGoal: {
        miles: 25,
        time: '4hr 25m'
      }
    };
  } catch (error) {
    console.error('Error fetching weekly plan:', error);
    throw error;
  }
};

// Fetch recent activities
export const fetchRecentActivities = async () => {
  try {
    const response = await authAxios().get('/activities/getActivities');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching activities:', error);
    // For demo, return mock data if API fails
    return [
      {
        id: 1,
        type: 'Running',
        date: '2025-03-04',
        distance: '4',
        duration: '32',
        pace: '8:00',
        notes: 'Easy run, felt good',
        terrain: 'road'
      },
      {
        id: 2,
        type: 'Running',
        date: '2025-03-02',
        distance: '8',
        duration: '68',
        pace: '8:30',
        notes: 'Long run, windy day',
        terrain: 'trail'
      },
      {
        id: 3,
        type: 'Running',
        date: '2025-03-05',
        distance: '3',
        duration: '24',
        pace: '8:00',
        notes: 'Recovery run',
        terrain: 'road'
      }
    ];
  }
};

// Log new activity
export const logActivity = async (activityData) => {
  try {
    const response = await authAxios().post('/activities/postActivity', activityData);
    return response.data;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

// Update user activity log
export const updateUserActivities = async (userId, activityId) => {
  try {
    const response = await authAxios().put('/activities/updateUserActivities', {
      userId,
      activityId
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user activities:', error);
    throw error;
  }
};

// Helper function to calculate pace from distance and duration
export const calculatePace = (distance, duration) => {
  if (!distance || !duration) return "0:00";
  
  const paceInMinutes = duration / distance;
  const minutes = Math.floor(paceInMinutes);
  const seconds = Math.round((paceInMinutes - minutes) * 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default {
  fetchUserData,
  fetchWeeklyPlan,
  fetchRecentActivities,
  logActivity,
  updateUserActivities,
  calculatePace
};