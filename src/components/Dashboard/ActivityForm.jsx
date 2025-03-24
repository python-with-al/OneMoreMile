import React, { useState } from 'react';
import { logActivity } from '../../services/api.js';

const ActivityForm = ({ onActivityLogged }) => {
  const [formData, setFormData] = useState({
    type: 'runs',
    typeWorkout: 'normal',
    source: 'manual',
    date: new Date().toISOString().split('T')[0],
    distance: '',
    duration: '',
    timeOfDay: 'Mid',
    terrain: 'Road',
    difficulty: '5',
    weather: '',
    shoe: '',
    notes: '',
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
  
  const shoesOptions = [
    { id: 1, name: 'Brooks Ghost', miles: 100 },
    { id: 2, name: 'Nike Pegasus', miles: 35 },
    // Add more shoes as needed
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const calculatePace = (distance, duration) => {
    if (!distance || !duration) return "0:00";
    
    const paceInMinutes = duration / distance;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes - minutes) * 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.distance || !formData.duration) {
      alert('Please enter both distance and duration');
      return;
    }
    
    // Calculate pace
    const pace = calculatePace(formData.distance, formData.duration);
    
    try {

        formData['avgPace'] = pace;
        console.log("Form data before submission:", formData);
        const response = await logActivity(formData);
        console.log("response:", response);

      if (onActivityLogged) {
        onActivityLogged(response);
      }
      
      // Clear form (except date and type)
      setFormData({
        ...formData,
        distance: '',
        duration: '',
        difficulty: '5',
        weather: '',
        notes: ''
      });
      
      console.log('Activity logged:', response);
    } catch (error) {
      console.error('Error logging activity:', error);
      alert('Failed to log activity. Please try again.');
    }
  };
  
  return (
    <div className="activity-form">
      <h2>Log an Activity</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="type">Activity Type:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-control"
            >
              <option value="runs">Running</option>
              <option value="walks">Walking</option>
              <option value="bikes">Cycling</option>
              <option value="swims">Swimming</option>
              <option value="hikes">Hiking</option>
              <option value="walks">Walking</option>
              <option value="weights">Weights</option>
              <option value="others">Other</option>
            </select>
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="type">Workout Type:</label>
            <select
              id="typeWorkout"
              name="typeWorkout"
              value={formData.typeWorkout}
              onChange={handleChange}
              className="form-control"
            >
              <option value="normal">Normal</option>
              <option value="easy">Easy</option>
              <option value="long">Long</option>
              <option value="mediumLong">Medium-Long</option>
              <option value="fartlek">Fartlek</option>
              <option value="contHills">Continuous Hills</option>
              <option value="hillIntervals">Hill Intervals</option>
              <option value="tempo">Tempo</option>
              <option value="speed">Speed</option>
              <option value="vo2Intervals">VO2 Max Intervals</option>
              <option value="thresholdIntervals">Threshold Intervals</option>
              <option value="progressiveTempo">Progressive Tempo</option>
              <option value="other">Other</option>
            </select>
          </div>
        
          <div className="form-group col-md-6">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="timeOfDay">Time of Day:</label>
            <select
              id="timeOfDay"
              name="timeOfDay"
              value={formData.timeOfDay}
              onChange={handleChange}
              className="form-control"
            >
              <option value="afternoon">Afternoon</option>
              <option value="earlyMorning">Early Morning</option>
              <option value="morning">Morning</option>
              <option value="lunch">Lunch</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>
          
          <div className="form-group col-md-6">
            <label htmlFor="distance">Distance (miles):</label>
            <input
              type="number"
              id="distance"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="form-control"
              placeholder="Distance in miles"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="duration">Duration (minutes):</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="form-control"
              placeholder="Duration in minutes"
            />
          </div>
          
          <div className="form-group col-md-6">
            <label htmlFor="shoe">Shoe:</label>
            <select
              id="shoe"
              name="shoe"
              value={formData.shoe}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select Shoe</option>
              {shoesOptions.map(shoe => (
                <option key={shoe.id} value={shoe.id}>
                  {shoe.name} ({shoe.miles} mi)
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="terrain">Terrain:</label>
            <select
              id="terrain"
              name="terrain"
              value={formData.terrain}
              onChange={handleChange}
              className="form-control"
            >
              <option value="road">Road</option>
              <option value="trail">Trail</option>
              <option value="track">Track</option>
              <option value="grass">Grass</option>
              <option value="treadmill">Treadmill</option>
              <option value="trainer">Trainer</option>
              <option value="pool">Pool</option>
              <option value="openWater">Open Water</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group col-md-6">
            <label htmlFor="difficulty">Difficulty [1-10]:</label>
            <input
              type="range"
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              min="1"
              max="10"
              className="form-control"
            />
            <div className="difficulty-value">{formData.difficulty}</div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="weather">Weather:</label>
            <select
              id="weather"
              name="weather"
              value={formData.weather}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select Weather</option>
              <option value="sunny">Sunny</option>
              <option value="cloudy">Cloudy</option>
              <option value="rain">Rain</option>
              <option value="wind">Wind</option>
              <option value="snow">Snow</option>
              <option value="indoors">Indoors</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group col-md-6">
            <label htmlFor="notes">Notes:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="How was your activity?"
            ></textarea>
          </div>
        </div>
        <div className="form-row">
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;