import api from './api';

const workoutService = {
  // Record a workout
  recordWorkout: async (exercise, weight, sets, reps) => {
    const response = await api.post('/workouts/record', {
      exercise,
      weight,
      sets,
      reps
    });
    return response.data;
  },

  // Get workout history
  getHistory: async (limit = 100, withGifs = false) => {
    const response = await api.get('/workouts/history', {
      params: { limit, gifs: withGifs }
    });
    return response.data;
  },

  // Get previous workout for specific exercise
  getPreviousWorkout: async (exercise) => {
    const response = await api.get(`/workouts/previous/${exercise}`);
    return response.data;
  },

  // Get workout statistics
  getStats: async (days = 30) => {
    const response = await api.get('/workouts/stats', {
      params: { days }
    });
    return response.data;
  }
};

export default workoutService;
