import express from 'express';
import { body, param, query } from 'express-validator';
import {
  recordWorkout,
  getWorkoutHistory,
  getPreviousWorkout,
  getWorkoutStats
} from '../controllers/workout.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// All workout routes require authentication
router.use(authenticate);

// Record a workout
router.post('/record',
  [
    body('exercise').trim().notEmpty().withMessage('Exercise name is required'),
    body('weight').isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('sets').isInt({ min: 1 }).withMessage('Sets must be at least 1'),
    body('reps').isInt({ min: 1 }).withMessage('Reps must be at least 1'),
    validate
  ],
  recordWorkout
);

// Get workout history
router.get('/history',
  [
    query('limit').optional().isInt({ min: 1, max: 500 }).withMessage('Limit must be between 1 and 500'),
    query('gifs').optional().isBoolean().withMessage('Gifs must be true or false'),
    validate
  ],
  getWorkoutHistory
);

// Get previous workout for specific exercise
router.get('/previous/:exercise',
  [
    param('exercise').trim().notEmpty().withMessage('Exercise name is required'),
    validate
  ],
  getPreviousWorkout
);

// Get workout statistics
router.get('/stats',
  [
    query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365'),
    validate
  ],
  getWorkoutStats
);

export default router;
