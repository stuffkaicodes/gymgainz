import db from '../config/database.js';
import exerciseService from './exercise.service.js';

class WorkoutService {
  
  // Get table name for user
  getUserTableName(userId) {
    return `user_${userId}_workouts`;
  }

  // Record a workout
  async recordWorkout(userId, exercise, weight, sets, reps) {
    const connection = await db.getConnection();
    
    try {
      const tableName = this.getUserTableName(userId);
      const currentDate = new Date().toISOString().split('T')[0];

      await connection.execute(
        `INSERT INTO ${tableName} (date, exercise, weight, number_of_sets, number_of_reps) 
         VALUES (?, ?, ?, ?, ?)`,
        [currentDate, exercise, weight, sets, reps]
      );

      return {
        success: true,
        message: 'Workout recorded successfully'
      };

    } catch (error) {
      console.error('Error recording workout:', error);
      return {
        success: false,
        message: 'Failed to record workout'
      };
    } finally {
      connection.release();
    }
  }

  // Get all workouts for a user
  async getWorkoutHistory(userId, limit = 100) {
    const connection = await db.getConnection();
    
    try {
      const tableName = this.getUserTableName(userId);
      
      // FIX: Ensure limit is a number, not a string
      const limitNum = parseInt(limit, 10);

      const [workouts] = await connection.execute(
        `SELECT * FROM ${tableName} 
         ORDER BY date DESC, created_at DESC 
         LIMIT ?`,
        [limitNum]  // Pass as number
      );

      return {
        success: true,
        workouts
      };

    } catch (error) {
      console.error('Error fetching workout history:', error);
      return {
        success: false,
        message: 'Failed to fetch workout history',
        workouts: []
      };
    } finally {
      connection.release();
    }
  }

  // Get workout history with GIFs
  async getWorkoutHistoryWithGifs(userId, limit = 50) {
    const historyResult = await this.getWorkoutHistory(userId, limit);
    
    if (!historyResult.success) {
      return historyResult;
    }

    // Get unique exercises
    const uniqueExercises = [...new Set(historyResult.workouts.map(w => w.exercise))];

    // Fetch GIFs for each unique exercise
    const exerciseGifs = {};
    await Promise.all(
      uniqueExercises.map(async (exercise) => {
        const gifUrl = await exerciseService.searchExerciseGif(exercise);
        exerciseGifs[exercise] = gifUrl;
      })
    );

    // Add GIF URLs to workouts
    const workoutsWithGifs = historyResult.workouts.map(workout => ({
      ...workout,
      gifUrl: exerciseGifs[workout.exercise]
    }));

    return {
      success: true,
      workouts: workoutsWithGifs
    };
  }

  // Get previous workout for specific exercise
  async getPreviousWorkout(userId, exercise) {
    const connection = await db.getConnection();
    
    try {
      const tableName = this.getUserTableName(userId);

      const [workouts] = await connection.execute(
        `SELECT * FROM ${tableName} 
         WHERE exercise = ? 
         ORDER BY date DESC, created_at DESC 
         LIMIT 1`,
        [exercise]
      );

      if (workouts.length === 0) {
        return {
          success: true,
          workout: null
        };
      }

      return {
        success: true,
        workout: workouts[0]
      };

    } catch (error) {
      console.error('Error fetching previous workout:', error);
      return {
        success: false,
        message: 'Failed to fetch previous workout',
        workout: null
      };
    } finally {
      connection.release();
    }
  }

  // Get workout stats
  async getWorkoutStats(userId, days = 30) {
    const connection = await db.getConnection();
    
    try {
      const tableName = this.getUserTableName(userId);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const [stats] = await connection.execute(
        `SELECT 
          COUNT(DISTINCT date) as workout_days,
          COUNT(*) as total_exercises,
          COUNT(DISTINCT exercise) as unique_exercises,
          SUM(number_of_sets * number_of_reps) as total_reps
         FROM ${tableName}
         WHERE date >= ?`,
        [startDateStr]
      );

      return {
        success: true,
        stats: stats[0]
      };

    } catch (error) {
      console.error('Error fetching workout stats:', error);
      return {
        success: false,
        message: 'Failed to fetch workout stats'
      };
    } finally {
      connection.release();
    }
  }
}

const workoutService = new WorkoutService();

export default workoutService;