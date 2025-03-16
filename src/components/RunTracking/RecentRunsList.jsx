import React, { useState, useEffect } from 'react';

const RecentRunsList = ({ runs = [], onRunSelect }) => {
  // If no runs are provided, we'll use this sample data
  const [runsList, setRunsList] = useState(runs.length > 0 ? runs : [
    {
      id: 1,
      date: '2025-03-10',
      distance: 3.1,
      duration: 25,
      pace: '8:03',
      notes: 'Morning run, felt great!',
      terrain: 'road'
    },
    {
      id: 2,
      date: '2025-03-08',
      distance: 5.0,
      duration: 45,
      pace: '9:00',
      notes: 'Weekend long run, some hills',
      terrain: 'trail'
    },
    {
      id: 3,
      date: '2025-03-07',
      distance: 2.5,
      duration: 20,
      pace: '8:00',
      notes: 'Quick lunchtime run',
      terrain: 'road'
    }
  ]);

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
  const totalDistance = runsList.reduce((sum, run) => sum + parseFloat(run.distance), 0).toFixed(1);
  const totalDuration = runsList.reduce((sum, run) => sum + parseFloat(run.duration), 0);
  
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