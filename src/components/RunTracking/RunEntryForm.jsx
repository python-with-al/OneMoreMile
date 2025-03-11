// src/components/RunTracking/RunEntryForm.jsx
import React, { useState } from 'react';

const RunEntryForm = ({ onRunAdded }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    distance: '',
    duration: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Run data submitted:", formData);
    
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