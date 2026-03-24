import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const routines = [
    {
      name: 'Push',
      description: 'Shoulders, Chest',
      emoji: '🔥',
      color: '#ff6b6b'
    },
    {
      name: 'Pull',
      description: 'Upper Arms, Back, Forearms',
      emoji: '💪',
      color: '#4ecdc4'
    },
    {
      name: 'Legs',
      description: 'Calves, Hips, Thighs',
      emoji: '🦵',
      color: '#45b7d1'
    }
  ];

  const handleRoutineSelect = (routineName) => {
    navigate(`/routine/${routineName}`);
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name || 'Athlete'}! 👋</h1>
          <p>Choose your workout for today</p>
        </div>

        <div className="routines-grid">
          {routines.map((routine) => (
            <div
              key={routine.name}
              className="routine-card"
              style={{ borderColor: routine.color }}
              onClick={() => handleRoutineSelect(routine.name)}
            >
              <div className="routine-emoji">{routine.emoji}</div>
              <h2>{routine.name}</h2>
              <p>{routine.description}</p>
              <button 
                className="btn-routine"
                style={{ backgroundColor: routine.color }}
              >
                Start Workout
              </button>
            </div>
          ))}
        </div>

        <div className="history-section">
          <button className="btn-secondary" onClick={handleViewHistory}>
            📊 View Workout History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
