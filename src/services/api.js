// tools using APIs
const user = JSON.parse(localStorage.getItem('user'));
export const fetchRecentRuns = async (numRuns) => {
    if (!user || !user["activities"] || !user["activities"]["runs"]) return;
    console.log("runs:", user["activities"]["runs"])
    if (numRuns > user["activities"]["runs"].length) numRuns = user["activities"]["runs"].length;
    console.log("Fetching last ", numRuns)
    const recentRunIds = user["activities"]["runs"].slice(-1 * numRuns);
    
    console.log("Recent run IDs:", recentRunIds);
    console.log("GET Body",{ "recentRunIds": recentRunIds })
  
    try {
      const response = await fetch('http://localhost:5000/api/activities/getActivities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(recentRunIds)
      });
      const data = await response.json();
      console.log("Run data:", data);
      return data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      }
    };
// Update user activity log
export const updateUserActivities = async (data) => {
    try {
        console.log("updateUserActivities req:", data)
        console.log("data JSON:", JSON.stringify(data));
        const response = await fetch('http://localhost:5000/api/activities/updateUserActivities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      return response;
    } catch (error) {
      console.error('Error updating user activities:', error);
      throw error;
    }
  };

export const logActivity = async (data) => {
    try {
        console.log("Posting activity data:", data);
        const response = await fetch('http://localhost:5000/api/activities/postActivity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
        });

        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let responseData;
        try {
            responseData = await response.json();
            console.log("(Activity) Response _id:", responseData._id);
            console.log("Updating user ID:", user.id);
            const updatedUser = await updateUserActivities({"userId": user.id, "newActivity": responseData});
            // getCurrentUser
            const userData = await updatedUser.json();
            console.log("updatedUser:", JSON.stringify(userData));
            delete userData.password;
            userData.id = userData._id;
            delete userData._id;
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('There was a problem updating user activities:', error);
        }
        return responseData;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
    };
  
  
















// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with auth headers
const authAxios = () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
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



// Helper function to calculate pace from distance and duration
export const calculatePace = (distance, duration) => {
  if (!distance || !duration) return "0:00";
  
  const paceInMinutes = duration / distance;
  const minutes = Math.floor(paceInMinutes);
  const seconds = Math.round((paceInMinutes - minutes) * 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default {
  fetchRecentRuns,
  fetchUserData,
  fetchWeeklyPlan,
  fetchRecentActivities,
  logActivity,
  updateUserActivities,
  calculatePace
};