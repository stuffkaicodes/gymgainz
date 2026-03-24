import workoutService from '../services/workout.service.js';

export const recordWorkout = async (req, res) => {
  try {
    const { exercise, weight, sets, reps } = req.body;
    const userId = req.user.id;

    const result = await workoutService.recordWorkout(
      userId,
      exercise,
      weight,
      sets,
      reps
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Record workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record workout'
    });
  }
};

export const getWorkoutHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 100;
    const withGifs = req.query.gifs === 'true';

    let result;
    if (withGifs) {
      result = await workoutService.getWorkoutHistoryWithGifs(userId, limit);
    } else {
      result = await workoutService.getWorkoutHistory(userId, limit);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Get workout history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workout history'
    });
  }
};

export const getPreviousWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exercise } = req.params;

    const result = await workoutService.getPreviousWorkout(userId, exercise);

    res.status(200).json(result);
  } catch (error) {
    console.error('Get previous workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch previous workout'
    });
  }
};

export const getWorkoutStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days) || 30;

    const result = await workoutService.getWorkoutStats(userId, days);

    res.status(200).json(result);
  } catch (error) {
    console.error('Get workout stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workout stats'
    });
  }
};
