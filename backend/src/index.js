import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import exerciseRoutes from './routes/exercise.routes.js';
import workoutRoutes from './routes/workout.routes.js';
import googleSheetsService from './services/googleSheets.service.js';
import axios from 'axios';
import rateLimit from 'express-rate-limit';
import { initDatabase } from './config/initDatabase.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Create tables if they don't exist
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1); 

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login/register attempts
  message: 'Too many attempts, please try again in 15 minutes'
});

// Apply limiters
app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// Proxy route for ExerciseDB images
app.get('/api/exercise-image/:id', async (req, res) => {
  try {
    // Get the exercise ID from the URL
    const { id } = req.params;
    
    // Get API key from environment variables
    const rapidApiKey = process.env.RAPID_API_KEY;

    console.log(`🖼️ Proxying GIF for exercise ID: ${id}`);
    
    // Make request to ExerciseDB WITH the API key
    const response = await axios.get(
      `https://exercisedb.p.rapidapi.com/image/?resolution=360&exerciseId=${id}`,
      {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        },
        responseType: 'arraybuffer'
      }
    );
    
    res.set('Content-Type', 'image/gif');
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    res.send(response.data);

    console.log(`✅ GIF delivered for exercise ${id}`);
    
  } catch (error) {
    console.error('Error proxying image:', error.message);
    res.status(404).send('Image not found');
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// // Initialize services and start server
// const startServer = async () => {
//   try {
//     // Initialize Google Sheets service
//     await googleSheetsService.initialize();
    
//     // Preload exercise data
//     await googleSheetsService.getExerciseData();
//     console.log('✅ Exercise data preloaded');

//     // Start server
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//       console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
//     });
//   } catch (error) {
//     console.error('❌ Failed to start server:', error);
//     process.exit(1);
//   }
// };

// startServer();

export default app;
