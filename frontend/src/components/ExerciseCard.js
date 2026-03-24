import React, { useState, useEffect } from 'react';
import './ExerciseCard.css';

const ExerciseCard = ({ exercise, index, onRefresh, onRecord, onGetPrevious }) => {
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [previousWorkout, setPreviousWorkout] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPreviousWorkout();
  }, [exercise.name]);

  const loadPreviousWorkout = async () => {
    const previous = await onGetPrevious(exercise.name);
    if (previous) {
      setPreviousWorkout(previous);
      // Auto-fill with previous values
      setWeight(previous.weight.toString());
      setSets(previous.number_of_sets.toString());
      setReps(previous.number_of_reps.toString());
    }
  };

  const handleRecord = async () => {
    if (!weight || !sets || !reps) {
      setMessage('Please fill in all fields');
      return;
    }

    setRecording(true);
    setMessage('');

    const result = await onRecord(
      exercise.name,
      parseFloat(weight),
      parseInt(sets),
      parseInt(reps)
    );

    if (result.success) {
      setRecorded(true);
      setMessage('✅ Workout recorded!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('❌ ' + (result.message || 'Failed to record'));
    }

    setRecording(false);
  };

  const handleUsePrevious = () => {
    if (previousWorkout) {
      setWeight(previousWorkout.weight.toString());
      setSets(previousWorkout.number_of_sets.toString());
      setReps(previousWorkout.number_of_reps.toString());
    }
  };

  return (
    <div className="exercise-card">
      <div className="exercise-header">
        <div>
          <h3>{exercise.name}</h3>
          <p className="muscle-group">{exercise.muscleGroup}</p>
        </div>
        <button className="btn-icon" onClick={onRefresh} title="Get different exercise">
          🔄
        </button>
      </div>

      {exercise.gifUrl ? (
        <div className="exercise-gif">
          <img src={exercise.gifUrl} alt={exercise.name} />
        </div>
      ) : (
        <div className="exercise-gif-placeholder">
          <p>GIF not available</p>
        </div>
      )}

      {previousWorkout && (
        <div className="previous-workout">
          <p className="previous-label">Previous:</p>
          <p className="previous-stats">
            {previousWorkout.weight} lbs • {previousWorkout.number_of_sets} sets • {previousWorkout.number_of_reps} reps
          </p>
          <button className="btn-link" onClick={handleUsePrevious}>
            Use these values
          </button>
        </div>
      )}

      <div className="recording-section">
        <div className="input-row">
          <div className="input-group">
            <label>Weight (lbs)</label>
            <input
              type="number"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              disabled={recording}
            />
          </div>
          <div className="input-group">
            <label>Sets</label>
            <input
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              disabled={recording}
            />
          </div>
          <div className="input-group">
            <label>Reps</label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              disabled={recording}
            />
          </div>
        </div>

        <button
          className={`btn-record ${recorded ? 'recorded' : ''}`}
          onClick={handleRecord}
          disabled={recording}
        >
          {recording ? 'Recording...' : recorded ? '✅ Recorded' : 'Record Workout'}
        </button>

        {message && <p className="record-message">{message}</p>}
      </div>
    </div>
  );
};

export default ExerciseCard;
