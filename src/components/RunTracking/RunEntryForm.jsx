// src/components/RunTracking/RunEntryForm.jsx
import React, { useState } from 'react';

const RunEntryForm = ({ onRunAdded }) => {
  const [formData, setFormData] = useState({
    type: 'runs',
    typeWorkout: 'Normal Run',
    source: 'manual',
    date: new Date().toISOString().split('T')[0],
    distance: '',
    duration: '',
    avgPace: '',
    timeOfDay: '',
    terrain: '',
    difficulty: '',
    weather: '',
    shoe: '',
    notes: '',
    calories: '',
    avgHR: '',
    maxHR: '',
    avgCadence: '',
    maxCadence: '',
    totalAscent: '',
    totalDescent: '',
    avgStrideLength: '',
    avgVerticalRatio: '',
    avgVerticalOscillation: '',
    avgGCT: '',
    avgGCTBalance: '',
    trainingStressScore: '',
    steps: '',
    decompression: '',
    minElevation: '',
    maxElevation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const postActivity = async (data) => {
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
      return await response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const calculatePace = (distance, duration) => {
    if (!distance || !duration) return "0:00";

    const paceInMinutes = duration / distance;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes - minutes) * 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      formData['avgPace'] = calculatePace(formData.distance, formData.duration);
      formData['source'] = 'manual';
      console.log("Form data before submission:", formData);
      const response = postActivity(formData);
      console.log("response:", response);
    } catch (error) {
      console.error('There was a problem storing new run:', error);
    }
    
    if (onRunAdded) {
      onRunAdded(formData);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2 style={{ marginBottom: '20px' }}>Log Your Run</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Activity Type:
          </label>
          <select
            name="type"
            value={formData.type} 
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="runs">Run</option>
            <option value="bikes">Bike</option>
            <option value="swims">Swim</option>
            <option value="hikes">Hike</option>
            <option value="walks">Walk</option>
            <option value="weights">Weights</option>
            <option value="others">Other</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Date:
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Distance (miles):
          </label>
          <input
            type="text"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            placeholder="e.g., 3.1"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Duration (minutes):
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 30"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Notes:
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="How was your run?"
            rows="3"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        
        <div>
          <button
            type="submit"
            style={{ 
              backgroundColor: '#4299e1', 
              color: 'white', 
              padding: '10px 15px', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save Run
          </button>
        </div>
      </form>
    </div>
  );
};

export default RunEntryForm;