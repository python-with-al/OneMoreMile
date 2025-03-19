import React, { useState, useEffect } from 'react';

const TeamProgress = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  
  useEffect(() => {
    // In a real app, this would fetch from your API
    // For now, we'll use mock data
    const mockTeamMembers = [
      { id: 1, name: 'You', miles: 25 },
      { id: 2, name: 'Member2', miles: 28 },
      { id: 3, name: 'Member3', miles: 26 },
      { id: 4, name: 'Member4', miles: 30 },
      { id: 5, name: 'Member5', miles: 22 },
      { id: 6, name: 'Member6', miles: 23 }
    ];
    
    setTeamMembers(mockTeamMembers);
  }, []);
  
  return (
    <div className="team-progress">
      <h3>Your Team <span className="this-week">this week</span></h3>
      
      <div className="team-members-list">
        {teamMembers.map(member => (
          <div key={member.id} className="team-member">
            <div className={`member-name ${member.name === 'You' ? 'current-user' : ''}`}>
              {member.name}:
            </div>
            <div className="member-miles">{member.miles}mi</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamProgress;