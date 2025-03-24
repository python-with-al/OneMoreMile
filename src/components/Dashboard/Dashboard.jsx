import React, { useState, useEffect } from 'react';
import WeeklyPlanner from './WeeklyPlanner';
import WeeklyCalendar from './WeeklyCalendar';
import ActivityForm from './ActivityForm.jsx';
import ProgressGraph from './ProgressGraph.jsx';
import ShoeTracker from './ShoeTracker';
import TerrainBreakdown from './TerrainBreakdown';
import TeamProgress from './TeamProgress';
import './dashboard.css';
import { fetchUserData, fetchWeeklyPlan, fetchRecentRuns, logActivity } from '../../services/api.js';
import DashboardHeader from './DashboardHeader';
import LogoutButton from '../Authentication/Logout.jsx';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [weeklyTotal, setWeeklyTotal] = useState({ miles: 0, time: '0hr 0m' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, these would be API calls
        // For now, we'll use mock data or local storage
        const user = JSON.parse(localStorage.getItem('user')) || {};
        setUserData(user);
        
        // Fetch weekly plan
        const plan = await fetchWeeklyPlan();
        setWeeklyPlan(plan);
        
        // Fetch recent activities
        const activities = await fetchRecentRuns(14);
        setRecentActivities(activities);
        
        // Calculate weekly totals
        calculateWeeklyTotals(activities);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  const calculateWeeklyTotals = (activities) => {
    // Filter activities for current week
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weekActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= startOfWeek;
    });
    
    // Calculate totals
    const totalMiles = weekActivities.reduce(
      (sum, activity) => sum + parseFloat(activity.distance || 0), 
      0
    );
    
    const totalMinutes = weekActivities.reduce(
      (sum, activity) => sum + parseFloat(activity.duration || 0), 
      0
    );
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    
    setWeeklyTotal({
      miles: totalMiles.toFixed(1),
      time: `${hours}hr ${minutes}m`
    });
  };
  
  const handleActivityLogged = (newActivity) => {
    // logActivity(newActivity);
    setRecentActivities([newActivity, ...recentActivities]);
    calculateWeeklyTotals([newActivity, ...recentActivities]);
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

const today = new Date();
const dayNumber = today.getDate();
const dayWeek = today.toLocaleString('default', { weekday: 'short' });
const dayMonth = today.toLocaleString('default', { month: 'short' });
const year = today.getFullYear();

const headerActions = (
    <>
        {Object.keys(userData.premium).length > 0 && (
            <button className="btn-primary" onClick={() => window.location.href = '/team'}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="src/assets/icons/team.svg" alt="team icon" style={{ height: '25px' }} />
                    <span style={{ fontSize: '10px' }}>Team</span>
                </div>
            </button>
        )}
        {Object.keys(userData.premium).length > 0 && (
            <button className="btn-primary" onClick={() => window.location.href = '/analytics'}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="src/assets/icons/analytics.svg" alt="analytics icon" style={{ height: '25px' }} />
                    <span style={{ fontSize: '10px' }}>Analytics</span>
                </div>
            </button>
        )}
        <button className="btn-primary" onClick={() => window.location.href = '/log'}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="src/assets/icons/log.svg" alt="log icon" style={{ height: '25px' }} />
                <span style={{ fontSize: '10px' }}>Run Log</span>
            </div>
        </button>
        <button className="btn-primary" onClick={() => window.location.href = '/profile'}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="src/assets/icons/user.svg" alt="profile icon" style={{ height: '25px' }} />
                <span style={{ fontSize: '10px' }}>Profile</span>
            </div>
        </button>
        <LogoutButton />
        
        
    </>
);

const dateIcon = (
    <>
        <div className="calendar-day">
            <div className="day-info">{dayWeek}</div>
            <div className="day-info">{dayMonth} {dayNumber}</div>
            <div className="year">{year}</div>
        </div>
    </>
)

return (
    <div>
        <DashboardHeader 
        title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {dateIcon}
                <span style={{ marginLeft: '10px' }}>{`${userData.name}'s Training Summary`}</span>
            </div>
        } 
        rightContent={headerActions}  />
        
        {/* <div className="dashboard-header" >
            <div className="today-info" style={{justifyContent: 'center'}}>
                <div>
                    <div className="calendar-day">
                        <div className="day-number">{dayNumber}</div>
                        <div className="day-info">{dayInfo}</div>
                        <div className="year">{year}</div>
                    </div>
                    <button className='logout-button' onClick={() => window.location.href = '/'}>
                        <div>
                            <img src="src/assets/icons/logout.svg" alt="logout icon" style={{ height: '25px'}} />
                        <</div>/div>
                        <div>Logout</div>
                    </button>
                </</div>div>
            </div>
            <div style={{justifyContent: 'space-between'}}>
                <div className="background-image" style={{ position: 'relative' }}>
                    <img src="src/assets/OneMoreMile logo cropped.svg" alt="background" style={{ height: '56px', opacity: 0.1 }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <h2>OneMoreMile Dashboard</h2>
                        <h1>Become a Better Runner</h1>
                    </div>
                </div>
            </div>
            <div className="navigation-buttons">
                <button onClick={() => window.location.href = '/profile'} style={{margin: '10px 5px'}}>
                    <div>
                        <img src="src/assets/icons/user.svg" alt="profile icon" style={{ height: '40px'}} />
                    </div>
                    <div>Profile</div>
                </button>
                <button onClick={() => window.location.href = '/activities'} style={{margin: '10px 5px'}}>
                    <div>
                        <img src="src/assets/icons/log.svg" alt="log icon" style={{ height: '40px'}} />
                    </div>
                    <div>Run Log</div>
                </button>
                <button onClick={() => window.location.href = '/team'} style={{margin: '10px 5px'}}>
                    <div>
                        <img src="src/assets/icons/team.svg" alt="team icon" style={{ height: '40px'}} />
                    </div>
                    <div>Team</div>
                </button>
                <button onClick={() => window.location.href = '/analytics'} style={{margin: '10px 5px'}}>
                    <div>
                        <img src="src/assets/icons/analytics.svg" alt="analytics icon" style={{ height: '40px'}} />
                    </div>
                    <div>Analytics</div>
                </button>
                
            </div>
        </div> */}
        
        <div className="dashboard-main">
            <div className="left-column">
                <ActivityForm onActivityLogged={handleActivityLogged} />
            </div>
            
            <div className="center-column">
                <div>
                    {/* <h2 className="weekly-planner-header">WEEKLY PLANNER</h2> */}
                    <WeeklyPlanner weeklyPlan={weeklyPlan} recentActivities={recentActivities} />
                    {/* <WeeklyCalendar weeklyPlan={weeklyPlan} recentActivities={recentActivities} /> */}
                </div>
                
                <div className="dashboard-footer" style={{ padding: '20px 0', justifyContent: 'flex' }}>
                    <div className="footer-section" style={{ width: '100%', padding: '20px 0' }}>
                        <ProgressGraph weeks={10} />
                    </div>
                    
                    <div className="footer-section" style={{ width: '80%', padding: '20px' }}>
                        <ShoeTracker />
                    </div>
                    
                    <div className="footer-section" style={{ width: '80%', padding: '20px' }}>
                        <TerrainBreakdown />
                    </div>
                    
                    <div className="footer-section">
                        <TeamProgress />
                    </div>
                </div>
            </div>
        </div>
        
        
    </div>
);
};

export default Dashboard;