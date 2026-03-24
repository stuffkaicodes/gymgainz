import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import workoutService from '../services/workoutService';
import './WorkoutHistory.css';

const WorkoutHistory = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [historyResponse, statsResponse] = await Promise.all([
        workoutService.getHistory(50, true),
        workoutService.getStats(30)
      ]);

      if (historyResponse.success) {
        setWorkouts(historyResponse.workouts);
      }

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }
    } catch (err) {
      console.error('Error loading workout history:', err);
      setError('Failed to load workout history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading workout history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <button className="btn-back" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <h1>Workout History</h1>
      </div>

      {stats && (
        <div className="stats-section">
          <h2>Last 30 Days</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.workout_days || 0}</div>
              <div className="stat-label">Workout Days</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.total_exercises || 0}</div>
              <div className="stat-label">Total Exercises</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.unique_exercises || 0}</div>
              <div className="stat-label">Unique Exercises</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.total_reps || 0}</div>
              <div className="stat-label">Total Reps</div>
            </div>
          </div>
        </div>
      )}

      <div className="workouts-section">
        <h2>Recent Workouts</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {workouts.length === 0 ? (
          <div className="empty-state">
            <p>No workout history yet. Start your first workout!</p>
            <button className="btn-primary" onClick={() => navigate('/home')}>
              Start Workout
            </button>
          </div>
        ) : (
          <div className="workouts-list">
            {workouts.map((workout) => (
              <div key={workout.id} className="workout-item">
                <div className="workout-info">
                  {workout.gifUrl && (
                    <div className="workout-gif">
                      <img src={workout.gifUrl} alt={workout.exercise} />
                    </div>
                  )}
                  <div className="workout-details">
                    <h3>{workout.exercise}</h3>
                    <p className="workout-date">{formatDate(workout.date)}</p>
                    <div className="workout-stats">
                      <span>{workout.weight} lbs</span>
                      <span>•</span>
                      <span>{workout.number_of_sets} sets</span>
                      <span>•</span>
                      <span>{workout.number_of_reps} reps</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistory;
