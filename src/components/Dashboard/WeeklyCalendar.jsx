import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import './dashboard.css';

const WeeklyCalendar = ({ weeklyPlan, recentActivities }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  
  // Function to calculate dates for the current week (Monday to Sunday)
  const calculateWeekDates = (date) => {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // For Monday start: if today is Sunday (0), we need to go back 6 days, otherwise go back (day - 1) days
    const diff = date.getDate() - (day === 0 ? 6 : day - 1);
    
    const weekStart = new Date(date);
    weekStart.setDate(diff);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(weekStart);
      newDate.setDate(weekStart.getDate() + i);
      dates.push(newDate);
    }
    
    return dates;
  };
  
  // Update the date every minute to ensure it stays current
  useEffect(() => {
    setWeekDates(calculateWeekDates(currentDate));
    
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(now);
      setWeekDates(calculateWeekDates(now));
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Find activity for a specific day (from WeeklyPlanner.jsx)
  const findActivityForDay = (date) => {
    if (!recentActivities || recentActivities.length === 0) return null;
    
    const targetDateStr = date.toISOString().split('T')[0];
    
    return recentActivities.find(activity => {
      const activityDate = new Date(activity.date).toISOString().split('T')[0];
      return activityDate === targetDateStr;
    });
  };
  
  // Get training plan for a specific day (from WeeklyPlanner.jsx)
  const getTrainingPlan = (dayIndex) => {
    if (!weeklyPlan || !weeklyPlan.days) return { description: 'No plan' };
    return weeklyPlan.days[dayIndex] || { description: 'Rest day' };
  };

  // Calculate weekly totals
  const calculateWeeklyTotals = () => {
    if (!recentActivities || recentActivities.length === 0) {
      return { distance: 0, duration: 0, hours: 0, minutes: 0 };
    }
    
    const startOfWeek = weekDates[0];
    const endOfWeek = new Date(weekDates[6]);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const weekActivities = recentActivities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= startOfWeek && activityDate <= endOfWeek;
    });
    
    const totalDistance = weekActivities.reduce(
      (sum, activity) => sum + parseFloat(activity.distance || 0), 
      0
    );
    
    const totalDuration = weekActivities.reduce(
      (sum, activity) => sum + parseFloat(activity.duration || 0), 
      0
    );
    
    return {
      distance: totalDistance.toFixed(1),
      hours: Math.floor(totalDuration / 60),
      minutes: Math.round(totalDuration % 60)
    };
  };

  const totals = calculateWeeklyTotals();
  
  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Calendar className="mr-2" /> Current Week Calendar
        </h1>
        <div className="flex items-center text-gray-600">
          <Clock className="mr-2" size={18} />
          <span>Auto-updates: {currentDate.toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="flex overflow-x-auto pb-4 gap-4">
        {weekDates.map((date, index) => {
          const activity = findActivityForDay(date);
          const plan = getTrainingPlan(index);
          
          return (
            <div 
              key={index}
              className={`flex-shrink-0 w-64 border rounded-lg overflow-hidden shadow-sm ${
                isToday(date) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
              }`}
            >
              <div className={`p-3 ${
                isToday(date) ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}>
                <h2 className="font-semibold">{formatDate(date)}</h2>
                {isToday(date) && <span className="text-xs font-medium">TODAY</span>}
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Day's Plan:
                  </h3>
                  <div className="space-y-2 pl-4">
                    <div className="flex text-sm">
                      <span className="font-medium w-24">Priority:</span>
                      <span className="text-gray-600">{index === 0 || index === 3 || index === 6 ? 'High' : 'Medium'}</span>
                    </div>
                    <div className="flex text-sm">
                      <span className="font-medium w-24">Workout:</span>
                      <span className="text-gray-600">{plan.description}</span>
                    </div>
                    <div className="flex text-sm">
                      <span className="font-medium w-24">Tasks:</span>
                      <span className="text-gray-600">{plan.description?.includes('Weights') ? 'Running + Strength' : 'Running'}</span>
                    </div>
                    <div className="flex text-sm">
                      <span className="font-medium w-24">Notes:</span>
                      <span className="text-gray-600">Focus on form</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Day's Execution:
                  </h3>
                  <div className="space-y-2 pl-4">
                    <div className="flex text-sm">
                      <span className="font-medium w-24">Completed:</span>
                      <span className="text-gray-600">
                        {activity ? `${activity.distance}mi, ${activity.duration}min` : 'Not completed'}
                      </span>
                    </div>
                    <div className="flex text-sm">
                      <span className="font-medium w-24">Pending:</span>
                      <span className="text-gray-600">
                        {activity ? 'None' : plan.description}
                      </span>
                    </div>
                    <div className="flex text-sm">
                      <span className="font-medium w-24">Blockers:</span>
                      <span className="text-gray-600">
                        {activity ? 'None' : (index < new Date().getDay() ? 'Missed workout' : 'None yet')}
                      </span>
                    </div>
                    <div className="flex text-sm">
                      <span className="font-medium w-24">Reflection:</span>
                      <span className="text-gray-600">
                        {activity ? (activity.notes || 'No reflection added') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Weekly Summary Column */}
        <div className="flex-shrink-0 w-64 border rounded-lg overflow-hidden shadow-sm border-purple-500 ring-2 ring-purple-200">
          <div className="p-3 bg-purple-500 text-white">
            <h2 className="font-semibold">Weekly Summary</h2>
            <span className="text-xs font-medium">
              {weekDates.length > 0 ? 
                `${weekDates[0].toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - ${weekDates[weekDates.length-1].toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}` : 
                "Current Week"
              }
            </span>
          </div>
          
          <div className="p-4">
            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Plan Summary:
              </h3>
              <div className="space-y-2 pl-4">
                <div className="flex text-sm">
                  <span className="font-medium w-24">Total Tasks:</span>
                  <span className="text-gray-600">
                    {weeklyPlan?.days?.length || 7} planned
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium w-24">Meetings:</span>
                  <span className="text-gray-600">
                    {weeklyPlan?.days?.filter(day => day?.description?.includes('Weight'))?.length || 0} workouts
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium w-24">Focus Areas:</span>
                  <span className="text-gray-600">
                    {weeklyPlan?.weeklyGoal?.miles ? `${weeklyPlan.weeklyGoal.miles}mi target` : 'Endurance'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Execution Summary:
              </h3>
              <div className="space-y-2 pl-4">
                <div className="flex text-sm">
                  <span className="font-medium w-24">Completion:</span>
                  <span className="text-gray-600">
                    {totals.distance}mi ran
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium w-24">Time Spent:</span>
                  <span className="text-gray-600">
                    {totals.hours}hr {totals.minutes}m
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium w-24">Pending:</span>
                  <span className="text-gray-600">
                    {weekDates.filter(date => !findActivityForDay(date) && date <= new Date()).length} days
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="font-medium w-24">Progress:</span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${weeklyPlan?.weeklyGoal?.miles ? 
                          Math.min(100, (parseFloat(totals.distance) / parseFloat(weeklyPlan.weeklyGoal.miles)) * 100) : 50}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Week Highlights:
              </h3>
              <div className="pl-4 text-sm text-gray-600">
                {totals.distance > 0 
                  ? `Great work! You've logged ${totals.distance}mi this week.` 
                  : "Start logging your activities to see highlights!"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;