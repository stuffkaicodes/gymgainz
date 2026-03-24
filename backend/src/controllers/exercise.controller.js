import exerciseService from '../services/exercise.service.js';

export const generateRoutine = async (req, res) => {
  try {
    const { name } = req.params;
    
    const validRoutines = ['Push', 'Pull', 'Legs'];
    if (!validRoutines.includes(name)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid routine type. Must be Push, Pull, or Legs'
      });
    }

    const routine = await exerciseService.generateRoutine(name);

    res.status(200).json({
      success: true,
      routine,
      routineType: name
    });
  } catch (error) {
    console.error('Generate routine error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate routine'
    });
  }
};

export const refreshExercise = async (req, res) => {
  try {
    const { name, index } = req.params;
    const { currentExercises } = req.body;

    const validRoutines = ['Push', 'Pull', 'Legs'];
    if (!validRoutines.includes(name)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid routine type'
      });
    }

    const idx = parseInt(index);
    if (isNaN(idx) || idx < 0 || idx >= currentExercises.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid index'
      });
    }

    const currentExercise = currentExercises[idx];
    const muscleGroup = currentExercise.muscleGroup;

    // Get new random exercise for the same muscle group
    const newExerciseName = await exerciseService.getRandomExercise(muscleGroup);
    
    if (!newExerciseName) {
      return res.status(404).json({
        success: false,
        message: 'No alternative exercises found'
      });
    }

    const newExercise = await exerciseService.getExerciseWithGif(newExerciseName);

    res.status(200).json({
      success: true,
      exercise: {
        muscleGroup,
        ...newExercise
      },
      index: idx
    });
  } catch (error) {
    console.error('Refresh exercise error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh exercise'
    });
  }
};

export const getAllExercisesForMuscleGroup = async (req, res) => {
  try {
    const { muscleGroup } = req.params;

    const exercises = await exerciseService.getAllExercises(muscleGroup);

    res.status(200).json({
      success: true,
      exercises,
      muscleGroup
    });
  } catch (error) {
    console.error('Get all exercises error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exercises'
    });
  }
};

export const searchExerciseGif = async (req, res) => {
  try {
    const { exerciseName } = req.params;

    const gifUrl = await exerciseService.searchExerciseGif(exerciseName);

    res.status(200).json({
      success: true,
      exerciseName,
      gifUrl
    });
  } catch (error) {
    console.error('Search GIF error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search for GIF'
    });
  }
};
