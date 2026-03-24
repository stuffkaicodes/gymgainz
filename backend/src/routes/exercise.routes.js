import express from 'express';
import { body, param } from 'express-validator';
import {
  generateRoutine,
  refreshExercise,
  getAllExercisesForMuscleGroup,
  searchExerciseGif
} from '../controllers/exercise.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Generate routine for a day (Push/Pull/Legs)
router.get('/routine/:name',
  [
    param('name').isIn(['Push', 'Pull', 'Legs']).withMessage('Invalid routine type'),
    validate
  ],
  optionalAuth,
  generateRoutine
);

// Refresh specific exercise in routine
router.post('/routine/:name/refresh/:index',
  [
    param('name').isIn(['Push', 'Pull', 'Legs']).withMessage('Invalid routine type'),
    param('index').isInt({ min: 0 }).withMessage('Invalid index'),
    body('currentExercises').isArray().withMessage('Current exercises must be an array'),
    validate
  ],
  optionalAuth,
  refreshExercise
);

// Get all exercises for a muscle group
router.get('/exercises/:muscleGroup',
  [
    param('muscleGroup').trim().notEmpty().withMessage('Muscle group is required'),
    validate
  ],
  optionalAuth,
  getAllExercisesForMuscleGroup
);

// Search for exercise GIF
router.get('/gif/:exerciseName',
  [
    param('exerciseName').trim().notEmpty().withMessage('Exercise name is required'),
    validate
  ],
  searchExerciseGif
);

export default router;
