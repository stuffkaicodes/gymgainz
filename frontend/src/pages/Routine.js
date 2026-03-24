import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import exerciseService from '../services/exerciseService';
import workoutService from '../services/workoutService';
import ExerciseCard from '../components/ExerciseCard';
import './Routine.css';

const Routine = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRoutine();
  }, [name]);

  const loadRoutine = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await exerciseService.generateRoutine(name);
      if (response.success) {
        setExercises(response.routine);
      } else {
        setError('Failed to load routine');
      }
    } catch (err) {
      console.error('Error loading routine:', err);
      setError('Failed to load routine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshExercise = async (index) => {
    try {
      const response = await exerciseService.refreshExercise(name, index, exercises);
      
      if (response.success) {
        const newExercises = [...exercises];
        newExercises[index] = response.exercise;
        setExercises(newExercises);
      }
    } catch (err) {
      console.error('Error refreshing exercise:', err);
    }
  };

  const handleRecordWorkout = async (exerciseName, weight, sets, reps) => {
    try {
      const response = await workoutService.recordWorkout(exerciseName, weight, sets, reps);
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error('Error recording workout:', err);
      return { success: false, message: 'Failed to record workout' };
    }
  };

  const handleGetPrevious = async (exerciseName) => {
    try {
      const response = await workoutService.getPreviousWorkout(exerciseName);
      
      if (response.success && response.workout) {
        return response.workout;
      }
      return null;
    } catch (err) {
      console.error('Error getting previous workout:', err);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="routine-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your {name} workout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="routine-container">
        <div className="error-state">
          <p>{error}</p>
          <button className="btn-primary" onClick={loadRoutine}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="routine-container">
      <div className="routine-header">
        <button className="btn-back" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <h1>{name} Day</h1>
        <button className="btn-secondary" onClick={loadRoutine}>
          🔄 New Routine
        </button>
      </div>

      <div className="exercises-list">
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={index}
            exercise={exercise}
            index={index}
            onRefresh={() => handleRefreshExercise(index)}
            onRecord={handleRecordWorkout}
            onGetPrevious={handleGetPrevious}
          />
        ))}
      </div>

      {exercises.length === 0 && (
        <div className="empty-state">
          <p>No exercises found for this routine.</p>
        </div>
      )}
    </div>
  );
};

export default Routine;
