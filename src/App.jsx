import React, { useState } from 'react';
import RunEntryForm from './components/RunTracking/RunEntryForm';
import RecentRunsList from './components/RunTracking/RecentRunsList';

function App() {
  const [runs, setRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleRunAdded = (newRun) => {
    // In a real app, you'd send this to your backend
    // For now, we'll just add it to our state with a fake ID
    const runWithId = {
      ...newRun,
      id: Date.now(), // Simple way to generate unique IDs for demo
      pace: calculatePace(newRun.distance, newRun.duration)
    };
    
    setRuns([runWithId, ...runs]);
    setShowForm(false);
  };

  const calculatePace = (distance, duration) => {
    if (!distance || !duration) return "0:00";
    
    const paceInMinutes = duration / distance;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes - minutes) * 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRunSelect = (run) => {
    setSelectedRun(run);
    // You could show details or edit form here
    console.log("Selected run:", run);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px'
      }}>
        <h1 style={{ margin: 0 }}>Running Tracker App</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ 
            backgroundColor: '#4299e1', 
            color: 'white', 
            padding: '10px 15px', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancel' : 'Log New Run'}
        </button>
      </header>

      {showForm ? (
        <RunEntryForm onRunAdded={handleRunAdded} />
      ) : (
        <RecentRunsList runs={runs} onRunSelect={handleRunSelect} />
      )}
      
      {selectedRun && !showForm && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ marginBottom: '10px' }}>Run Details</h2>
          <p><strong>Date:</strong> {selectedRun.date}</p>
          <p><strong>Distance:</strong> {selectedRun.distance} miles</p>
          <p><strong>Duration:</strong> {selectedRun.duration} minutes</p>
          <p><strong>Pace:</strong> {selectedRun.pace} min/mile</p>
          {selectedRun.notes && <p><strong>Notes:</strong> {selectedRun.notes}</p>}
          
          <div style={{ marginTop: '15px', textAlign: 'right' }}>
            <button 
              onClick={() => setSelectedRun(null)}
              style={{ 
                backgroundColor: '#718096', 
                color: 'white', 
                padding: '8px 12px', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Close
            </button>
            {/* You could add edit/delete buttons here */}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;