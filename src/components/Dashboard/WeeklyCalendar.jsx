import React, { useState, useEffect } from 'react';
import './weeklyCalendar.css'

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
    const options = { weekday: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Format month for header
  const formatMonth = (date) => {
    const options = { month: 'short' };
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
  
  // Get priority for a day
  const getPriority = (dayIndex) => {
    return dayIndex === 0 || dayIndex === 3 || dayIndex === 6 ? 'High' : 'Medium';
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
    <div className="boxed-calendar-container">
      <div className="boxed-calendar-header">
        <div className="calendar-title">
          <span className="calendar-icon">📅</span> 
          Weekly Calendar
          <span className="date-range">Mar {weekDates.length > 0 ? weekDates[0].getDate() : ''} - Mar {weekDates.length > 0 ? weekDates[6].getDate() : ''}</span>
        </div>
        <div className="update-info">
          <span className="clock-icon">⏰</span> Updates: {currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>

      <div className="boxed-calendar-grid">
        {/* Day labels row */}
        <div className="day-labels-row">
          <div className="section-label"></div>
          {weekDates.map((date, index) => (
            <div key={index} className={`day-label ${isToday(date) ? 'today-label' : ''}`}>
              <div className="day-number">{date.getDate()}</div>
              <div className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            </div>
          ))}
          <div className="summary-label">
            <div className="summary-text">Weekly Summary</div>
          </div>
        </div>

        {/* Plan row */}
        <div className="content-row">
          <div className="section-label">
            <div className="section-indicator plan-indicator"></div>
            <div className="section-text">Day's Plan</div>
          </div>
          
          {weekDates.map((date, index) => {
            const plan = getTrainingPlan(index);
            const priority = getPriority(index);
            
            return (
              <div key={index} className={`plan-box ${isToday(date) ? 'today-box' : ''} ${priority.toLowerCase()}-priority`}>
                <div className="priority-label">{priority}</div>
                <div className="workout-desc">{plan.description}</div>
                <div className="task-type">{plan.description?.includes('Weights') ? 'Running + Strength' : 'Running'}</div>
                <div className="form-note">Focus on form</div>
              </div>
            );
          })}
          
          <div className="summary-box plan-summary">
            <div className="summary-item">{weeklyPlan?.days?.length || 7} planned</div>
            <div className="summary-item">{weeklyPlan?.days?.filter(day => day?.description?.includes('Weight'))?.length || 0} with weights</div>
            <div className="summary-item">{weeklyPlan?.weeklyGoal?.miles ? `${weeklyPlan.weeklyGoal.miles}mi target` : '25mi target'}</div>
          </div>
        </div>

        {/* Execution row */}
        <div className="content-row">
          <div className="section-label">
            <div className="section-indicator execution-indicator"></div>
            <div className="section-text">Day's Execution</div>
          </div>
          
          {weekDates.map((date, index) => {
            const activity = findActivityForDay(date);
            const plan = getTrainingPlan(index);
            const isPastDay = date < new Date().setHours(0, 0, 0, 0);
            
            return (
              <div key={index} className={`execution-box ${isToday(date) ? 'today-box' : ''}`}>
                <div className="completion-status">
                  {activity ? `${activity.distance}mi, ${activity.duration}min` : 'Not completed'}
                </div>
                <div className="pending-status">
                  {activity ? 'None' : (isPastDay ? 'Missed' : 'None yet')}
                </div>
                <div className="blockers-status">
                  {activity ? 'None' : (isPastDay ? 'N/A' : 'None yet')}
                </div>
                <div className="reflection-notes">
                  {activity ? (activity.notes || 'No notes') : 'N/A'}
                </div>
              </div>
            );
          })}
          
          <div className="summary-box execution-summary">
            <div className="summary-item">{totals.distance}mi ran</div>
            <div className="summary-item">{totals.hours}hr {totals.minutes}m spent</div>
            <div className="summary-item">
              {weekDates.filter(date => !findActivityForDay(date) && date <= new Date()).length} days pending
            </div>
            <div className="progress-container">
              <div className="progress-bar" style={{ 
                width: `${weeklyPlan?.weeklyGoal?.miles ? 
                  Math.min(100, (parseFloat(totals.distance) / parseFloat(weeklyPlan.weeklyGoal.miles)) * 100) : 0}%` 
              }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;