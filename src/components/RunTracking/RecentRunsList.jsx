import React, { useState, useEffect } from 'react';

const user = JSON.parse(localStorage.getItem('user'));
const fetchRecentRuns = async () => {
  if (!user || !user["activities"] || !user["activities"]["runs"]) return;
  const recentRunIds = user["activities"]["runs"].slice(-5);
  console.log("Recent run IDs:", recentRunIds);
  console.log("GET Body",{ "recentRunIds": recentRunIds })

  try {
    const response = await fetch('http://localhost:5000/api/activities/getActivities', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token')
    }
    });
    const data = await response.json();
    console.log("Run data:", data);
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    }
  };


const RecentRunsList = ({ runs = [], onRunSelect }) => {
  // If no runs are provided, we'll use this sample data
  const [runsList, setRunsList] = useState(runs.length > 0 ? runs : []);

  useEffect(() => {
    if (runs.length === 0) {
      fetchRecentRuns().then(fetchedRuns => setRunsList(fetchedRuns));
    }
  }, [runs]);
  
  // Effect to update runs when props change
  useEffect(() => {
    if (runs.length > 0) {
      setRunsList(runs);
    }
  }, [runs]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate total distance, duration, and average pace
  let totalDistance = 0;
  let totalDuration = 0;

  for (let i = 0; i < runsList.length; i++) {
    totalDistance += parseFloat(runsList[i].distance);
    totalDuration += parseFloat(runsList[i].duration);
  }

  totalDistance = totalDistance.toFixed(1);
  
  // Calculate average pace (min/mile)
  const calculateAveragePace = () => {
    if (totalDistance <= 0) return "0:00";
    
    const totalMinutes = totalDuration / parseFloat(totalDistance);
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRunClick = (run) => {
    if (onRunSelect) {
      onRunSelect(run);
    }
  };

  return (
    <div style={{ 
      maxWidth: '19200px', 
      margin: '0 auto', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '5px' ,
      width: '100%'
    }}>
      <h2 style={{ marginBottom: '15px' }}>Recent Runs</h2>
      
      {/* Summary stats */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '20px', 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '5px' 
      }}>
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>Total Distance</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{totalDistance} miles</p>
        </div>
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>Total Duration</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{totalDuration} mins</p>
        </div>
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>Average Pace</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{calculateAveragePace()} min/mile</p>
        </div>
      </div>
      
      {/* Run list */}
      {runsList.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>No runs logged yet. Add your first run!</p>
      ) : (
        <div>
          {runsList.map((run) => (
            <div 
              key={run.id}
              onClick={() => handleRunClick(run)}
              style={{ 
                padding: '15px', 
                borderBottom: '1px solid #eee', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  backgroundColor: run.terrain === 'trail' ? '#4caf50' : '#2196f3',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px'
                }}>
                  {run.terrain === 'trail' ? 'TR' : 'RD'}
                </div>
                
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {formatDate(run.date)}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    {run.notes && run.notes.length > 50 
                      ? `${run.notes.substring(0, 50)}...` 
                      : run.notes}
                  </p>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {run.distance} miles
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {run.duration} mins ({run.pace} pace)
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentRunsList;