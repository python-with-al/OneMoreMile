import React, { useState, useEffect } from 'react';

const TerrainBreakdown = () => {
  const [terrainData, setTerrainData] = useState({
    road: 0,
    dirt: 0,
    grass: 0
  });
  
  const [totalTime, setTotalTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    // In a real app, this would fetch from your API
    // For now, we'll use mock data
    const mockTerrainData = {
      road: 4.5,
      dirt: 1.5,
      grass: 0.5
    };
    
    const mockTimeData = {
      hours: 4,
      minutes: 30,
      seconds: 27
    };
    
    setTerrainData(mockTerrainData);
    setTotalTime(mockTimeData);
  }, []);
  
  return (
    <div className="terrain-breakdown">
      <h3>Terrain Breakdown</h3>
      
      <div className="total-time">
        Total Time
        <div className="time-display">
          {totalTime.hours}:{totalTime.minutes.toString().padStart(2, '0')}:{totalTime.seconds.toString().padStart(2, '0')}
        </div>
      </div>
      
      <div className="terrain-stats">
        <div className="terrain-item">
          <div className="terrain-label">Road:</div>
          <div className="terrain-value">{terrainData.road.toFixed(2)}:{('0' + Math.floor(terrainData.road * 60 % 60)).slice(-2)}:{('0' + Math.floor(terrainData.road * 3600 % 60)).slice(-2)}</div>
        </div>
        <div className="terrain-item">
          <div className="terrain-label">Dirt:</div>
          <div className="terrain-value">{terrainData.dirt.toFixed(2)}:{('0' + Math.floor(terrainData.dirt * 60 % 60)).slice(-2)}:{('0' + Math.floor(terrainData.dirt * 3600 % 60)).slice(-2)}</div>
        </div>
        <div className="terrain-item">
          <div className="terrain-label">Grass:</div>
          <div className="terrain-value">{terrainData.grass.toFixed(2)}:{('0' + Math.floor(terrainData.grass * 60 % 60)).slice(-2)}:{('0' + Math.floor(terrainData.grass * 3600 % 60)).slice(-2)}</div>
        </div>
      </div>
    </div>
  );
};

export default TerrainBreakdown;