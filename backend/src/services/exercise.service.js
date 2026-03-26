import googleSheetsService from './googleSheets.service.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class ExerciseService {

  // Fetch exercise from ExerciseDB API as fallback
async fetchFromExerciseDB(muscleGroup) {
  try {
    const rapidApiKey = process.env.RAPID_API_KEY;
    
    if (!rapidApiKey) {
      console.error('❌ RAPID_API_KEY not set');
      return null;
    }

    // Map your muscle groups to ExerciseDB target muscles
    const targetMap = {
      'Shoulders': 'delts',
      'Chest': 'pectorals',
      'Upper Arms': 'biceps',
      'Back': 'lats',
      'Forearms': 'forearms',
      'Calves': 'calves',
      'Hips': 'glutes',
      'Thighs': 'quads'
    };
    
    const target = targetMap[muscleGroup];
    
    if (!target) {
      console.error(`❌ Unknown muscle group: ${muscleGroup}`);
      return null;
    }
    
    console.log(`🔍 Fetching from ExerciseDB for target: ${target}`);
    
    // Call ExerciseDB API to get exercises by target muscle
    const response = await axios.get(
      `https://exercisedb.p.rapidapi.com/exercises/target/${target}`,
      {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        },
        timeout: 5000
      }
    );
    
    if (!response.data || response.data.length === 0) {
      console.log(`❌ No exercises found for ${muscleGroup} (${target})`);
      return null;
    }
    
    // Get random exercise from results
    const exercises = response.data;
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    
    console.log(`✅ Found exercise: ${randomExercise.name}`);
    
    // Return just the name to match Google Sheets format
    return randomExercise.name;
    
  } catch (error) {
    console.error('Error fetching from ExerciseDB:', error.message);
    return null;
  }
}
  
  // Get random exercise by muscle group and type
  async getRandomExercise(muscleGroup) {
    try {
      const sheetData = await googleSheetsService.getExerciseData();
      
      // Check if Google Sheets returned data
      if (sheetData && sheetData.length > 0) {
        // Use Google Sheets
        const exercises = sheetData.filter(ex => ex.muscleGroup === muscleGroup);
        if (exercises.length > 0) {
          return exercises[Math.floor(Math.random() * exercises.length)];
        }
      }
    } catch (error) {
      console.log('Google Sheets failed, using ExerciseDB:', error.message);
    }
    
    // Fallback to ExerciseDB
    return this.fetchFromExerciseDB(muscleGroup);
  }

  // Get all exercises for a specific muscle group
  async getAllExercises(muscleGroup, type = 'Strength') {
    const rows = await googleSheetsService.getExerciseData();
    
    const exercises = rows
      .filter(row => row[3] === muscleGroup && row[2] === type)
      .map(row => row[1])
      .filter(name => name);

    return [...new Set(exercises)];
  }

  // Get muscle group for a specific exercise
  async getExerciseType(exerciseName, type = 'Strength') {
    const rows = await googleSheetsService.getExerciseData();
    
    const muscleGroups = rows
      .filter(row => row[1] === exerciseName && row[2] === type)
      .map(row => row[3])
      .filter(group => group);

    return muscleGroups.length > 0 ? muscleGroups[0] : null;
  }

  // Search for exercise GIF using ExerciseDB API (free, fitness-specific!)
  async searchExerciseGif(exerciseName) {
    try {
      const rapidApiKey = process.env.RAPID_API_KEY;
      
      if (!rapidApiKey) {
        return null;
      }
  
      // Clean the exercise name
      let searchName = exerciseName.toLowerCase().trim()
        .replace(/^dumbbell\s+/i, '')
        .replace(/^barbell\s+/i, '')
        .replace(/^cable\s+/i, '')
        .replace(/^machine\s+/i, '')
        .replace(/^band\s+/i, '')
        .replace(/^lever\s+/i, '');
  
      console.log(`🔍 Searching for: "${exerciseName}" → "${searchName}"`);
  
      // Search ExerciseDB by name to get ID
      const searchResponse = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(searchName)}`,
        {
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
          },
          timeout: 5000
        }
      );
  
      if (!searchResponse.data || searchResponse.data.length === 0) {
        console.log(`❌ No match found for: ${exerciseName}`);
        return null;
      }
  
      const exerciseId = searchResponse.data[0].id;
      console.log(`✅ Found match: "${searchResponse.data[0].name}" (ID: ${exerciseId})`);
  
      // ✅ RETURN YOUR BACKEND PROXY URL (not ExerciseDB direct URL!)
      const gifUrl = `http://localhost:3001/api/exercise-image/${exerciseId}`;
      
      return gifUrl;
  
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return null;
    }
  }
  // async searchExerciseGif(exerciseName) {
  //   try {
  //     const rapidApiKey = process.env.RAPID_API_KEY;
      
  //     if (!rapidApiKey) {
  //       return null;
  //     }
  
  //     // Try exact match first
  //     let searchName = exerciseName.toLowerCase().trim();
      
  //     // Remove common prefixes that might not match
  //     searchName = searchName
  //       .replace(/^dumbbell\s+/i, '')
  //       .replace(/^barbell\s+/i, '')
  //       .replace(/^cable\s+/i, '')
  //       .replace(/^machine\s+/i, '');
      
  //     const fetch = require('node-fetch');

  //     const url = 'https://exercisedb.p.rapidapi.com/image/${searchName}';
  //     const options = {
  //       method: 'GET',
  //       headers: {
  //         'x-rapidapi-key': 'c04b370c3fmshc75d6d118cad991p147713jsn41b586ad5f48',
  //         'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
  //         'Content-Type': 'application/json'
  //       }
  //     };

  //     try {
  //       const response = await fetch(url, options);
  //       const result = await response.text();
  //       console.log(result);
  //     } catch (error) {
  //       console.error(error);
  //     }
        
  //     // const response = await axios.get(
  //     //   `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(searchName)}`,
  //     //   {
  //     //     headers: {
  //     //       'X-RapidAPI-Key': rapidApiKey,
  //     //       'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  //     //     },
  //     //     timeout: 5000
  //     //   }
  //     // );

  
  //     // if (response.data && response.data.length > 0) {
  //     //   const exercise = response.data[0];
  //     //   const gifUrl = `https://v2.exercisedb.io/image/${exercise.id}`;
        
  //     //   console.log(`✅ GIF found: ${exerciseName} → ${exercise.name} (${exercise.id})`);
  //     //   return gifUrl;
  //     // }
  
  //     return null;
  
  //   } catch (error) {
  //     return null;
  //   }
  // }

  // Get exercise with GIF
  async getExerciseWithGif(exerciseName) {
    const gifUrl = await this.searchExerciseGif(exerciseName);
    return {
      name: exerciseName,
      gifUrl: gifUrl
    };
  }

  // Generate routine for a specific day type
  async generateRoutine(routineType) {
    const muscleGroupMap = {
      'Push': ['Shoulders', 'Chest'],
      'Pull': ['Upper Arms', 'Back', 'Forearms'],
      'Legs': ['Calves', 'Hips', 'Thighs']
    };

    const muscleGroups = muscleGroupMap[routineType];
    
    if (!muscleGroups) {
      throw new Error('Invalid routine type');
    }

    const routine = [];

    for (const muscleGroup of muscleGroups) {
      const exerciseName = await this.getRandomExercise(muscleGroup);
      
      if (exerciseName) {
        const exercise = await this.getExerciseWithGif(exerciseName);
        routine.push({
          muscleGroup,
          ...exercise
        });
      }
    }

    return routine;
  }
}

const exerciseService = new ExerciseService();

export default exerciseService;
