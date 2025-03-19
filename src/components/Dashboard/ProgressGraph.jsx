import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressGraph = ({ weeks = 10 }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  
  useEffect(() => {
    // In a real app, this would be an API call to get historical data
    // For now, we'll generate mock data
    generateMockData(weeks);
  }, [weeks]);
  
  const generateMockData = (numberOfWeeks) => {
    const data = [];
    const currentDate = new Date();
    
    for (let i = numberOfWeeks - 1; i >= 0; i--) {
      // Calculate start date of the week
      const weekStartDate = new Date(currentDate);
      weekStartDate.setDate(currentDate.getDate() - (i * 7));
      
      // Format the week label (e.g., "Week 1")
      const weekNumber = numberOfWeeks - i;
      
      // Generate random data (in a real app, this would be actual user data)
      const miles = Math.round((15 + Math.random() * 15) * 10) / 10;
      
      data.push({
        name: weekNumber,
        miles: miles,
        // We could add more metrics here (time, elevation, etc.)
      });
    }
    
    setWeeklyData(data);
  };
  
  return (
    <div className="progress-graph">
      <h3>Last {weeks} Weeks Graph</h3>
      <div className="graph-container" style={{ width: 350, height: 200, }}>
        <ResponsiveContainer>
          <LineChart
            data={weeklyData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: 'Week', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Miles', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [`${value} miles`, 'Distance']} />
            <Line 
              type="monotone" 
              dataKey="miles" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressGraph;