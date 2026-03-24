import api from './api';

const exerciseService = {
  // Generate routine (Push/Pull/Legs)
  generateRoutine: async (routineType) => {
    const response = await api.get(`/exercises/routine/${routineType}`);
    return response.data;
  },

  // Refresh specific exercise in routine
  refreshExercise: async (routineType, index, currentExercises) => {
    const response = await api.post(`/exercises/routine/${routineType}/refresh/${index}`, {
      currentExercises
    });
    return response.data;
  },

  // Get all exercises for a muscle group
  getAllExercises: async (muscleGroup) => {
    const response = await api.get(`/exercises/exercises/${muscleGroup}`);
    return response.data;
  },

  // Search for exercise GIF
  searchGif: async (exerciseName) => {
    const response = await api.get(`/exercises/gif/${exerciseName}`);
    return response.data;
  }
};

export default exerciseService;
