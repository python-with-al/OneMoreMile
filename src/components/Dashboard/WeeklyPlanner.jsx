import React, { useState } from 'react';
import './weeklyCalendar.css'

const WeeklyPlanner = ({ weeklyPlan, recentActivities }) => {
  const [editingCell, setEditingCell] = useState(null);
  const [cellContent, setCellContent] = useState({});
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Find activity for a specific day
  const findActivityForDay = (dayIndex) => {
    if (!recentActivities || recentActivities.length === 0) return null;
    
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Start from Monday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(startOfWeek);
    targetDate.setDate(startOfWeek.getDate() + dayIndex);
    
    const targetDateStr = targetDate.toISOString().split('T')[0];
    
    return recentActivities.find(activity => {
      const activityDate = new Date(activity.date).toISOString().split('T')[0];
      return activityDate === targetDateStr;
    });
  };
  
  // Get training plan for a specific day
  const getTrainingPlan = (dayIndex) => {
    if (!weeklyPlan || !weeklyPlan.days) return { description: 'No plan' };
    return weeklyPlan.days[dayIndex] || { description: 'Rest day' };
  };
  
  const handleCellDoubleClick = (rowIndex, dayIndex) => {
    const cellId = `${rowIndex}-${dayIndex}`;
    let content = '';
    
    if (rowIndex === 0) {
      // Training plan row
      const plan = getTrainingPlan(dayIndex);
      content = plan.description || '';
    } else {
      // Training log row
      const activity = findActivityForDay(dayIndex);
      if (activity) {
        content = `${activity.distance}mi, ${activity.duration}min`;
      }
    }
    
    setCellContent({ ...cellContent, [cellId]: content });
    setEditingCell(cellId);
  };
  
  const handleCellContentChange = (e, cellId) => {
    setCellContent({ ...cellContent, [cellId]: e.target.value });
  };
  
  const handleCellBlur = () => {
    // Here you would save the changes to the backend
    setEditingCell(null);
  };
  
  // Calculate weekly totals
  const calculateWeeklyTotals = () => {
    if (!recentActivities || recentActivities.length === 0) {
      return { distance: 0, duration: 0 };
    }
    
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Start from Monday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
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
    <div className="weekly-planner">
      <table className="planner-table">
        <thead>
          <tr>
            <th>Training Plan</th>
            {daysOfWeek.map((day, index) => (
              <th key={day}>{day}</th>
            ))}
            <th className="totals-column">Totals</th>
          </tr>
        </thead>
        <tbody>
          <tr className="training-plan-row">
            <td>Training Plan</td>
            {daysOfWeek.map((day, dayIndex) => {
              const cellId = `0-${dayIndex}`;
              const plan = getTrainingPlan(dayIndex);
              return (
                <td 
                  key={`plan-${dayIndex}`}
                  onDoubleClick={() => handleCellDoubleClick(0, dayIndex)}
                >
                  {editingCell === cellId ? (
                    <input
                      type="text"
                      value={cellContent[cellId] || ''}
                      onChange={(e) => handleCellContentChange(e, cellId)}
                      onBlur={handleCellBlur}
                      autoFocus
                    />
                  ) : (
                    plan.description || 'Rest day'
                  )}
                </td>
              );
            })}
            <td>Weekly Plan</td>
          </tr>
          <tr className="training-log-row">
            <td>Training Log</td>
            {daysOfWeek.map((day, dayIndex) => {
              const cellId = `1-${dayIndex}`;
              const activity = findActivityForDay(dayIndex);
              return (
                <td 
                  key={`log-${dayIndex}`}
                  onDoubleClick={() => handleCellDoubleClick(1, dayIndex)}
                  className={activity ? 'has-activity' : ''}
                >
                  {editingCell === cellId ? (
                    <input
                      type="text"
                      value={cellContent[cellId] || ''}
                      onChange={(e) => handleCellContentChange(e, cellId)}
                      onBlur={handleCellBlur}
                      autoFocus
                    />
                  ) : (
                    activity ? (
                      <div>
                        <div>{activity.distance}mi</div>
                        <div>{activity.duration}min</div>
                      </div>
                    ) : (
                      'N/A'
                    )
                  )}
                </td>
              );
            })}
            <td className="totals-cell">
              <div>Totals</div>
              <div>{totals.distance}mi</div>
              <div>{totals.hours}hr {totals.minutes}m</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyPlanner;