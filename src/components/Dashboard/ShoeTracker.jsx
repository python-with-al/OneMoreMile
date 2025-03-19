import React, { useState, useEffect } from 'react';

const ShoeTracker = () => {
  const [shoes, setShoes] = useState([]);
  
  useEffect(() => {
    // In a real app, this would fetch from your API
    // For now, we'll use mock data
    const mockShoes = [
      { id: 1, name: 'Brooks Ghost', miles: 100, maxMiles: 400 },
      { id: 2, name: 'Nike Pegasus', miles: 35, maxMiles: 500 }
    ];
    
    setShoes(mockShoes);
  }, []);
  
  // Calculate shoe health percentage
  const calculateShoeHealth = (miles, maxMiles) => {
    return Math.max(0, 100 - (miles / maxMiles * 100));
  };
  
  return (
    <div className="shoe-tracker">
      <h3>Active Shoes</h3>
      <div className="total-miles">Total Miles</div>
      
      {shoes.map(shoe => {
        const healthPercentage = calculateShoeHealth(shoe.miles, shoe.maxMiles);
        let healthColor = 'green';
        
        if (healthPercentage < 30) {
          healthColor = 'red';
        } else if (healthPercentage < 70) {
          healthColor = 'orange';
        }
        
        return (
          <div key={shoe.id} className="shoe-item">
            <div className="shoe-name">{`Shoe ${shoe.id}: ${shoe.miles}mi`}</div>
            <div className="shoe-health-bar">
              <div 
                className="shoe-health-fill"
                style={{ 
                  width: `${healthPercentage}%`,
                  backgroundColor: healthColor
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShoeTracker;