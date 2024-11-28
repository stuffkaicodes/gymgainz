import axios from 'axios';
import { google } from 'googleapis';
import express from "express"; 
import {allExercisesSearch, exerciseSearch, exerciseTypeSearch} from './exerciseSearch.js'
import dataSearch from './dataSearch.js'
import googleSheets from './googleSheets.js'

const app = express();

//Muscle Groups for each day type
const exercises = {
    'Push': ['Upper Arms', 'Back', 'Forearms'], 
    'Pull': ['Shoulders', 'Chest'], 
    'Legs': ['Calves', 'Hips', 'Thighs'], 
    "I'm Dying Day": ['','','']
};

// memoize google sheets API call to raise time efficiency
const rows = await googleSheets();

export const fetchAddExercises = async (addedExercises, data) => {
    const responses = [];
    console.log(data)
    const existing = data.split(',')
    try {
        if (addedExercises.split(',')) {
            const allExercises = existing.concat(addedExercises.split(','));
            const responses = await Promise.all(allExercises.map( async (item) => {
                return [item, await dataSearch(item)]
            }));
            return responses 
        } else{
            const allExercises = existing.push(addedExercises);
            const responses = await Promise.all(allExercises.map( async (item) => {
                return [item, await dataSearch(item)]
            }));
            return responses
        }
    } catch (error){
        console.log(error);
    }
}

export const fetchExercises = async (exercise) => {

    const allExercises = await allExercisesSearch(rows, exercise);

    if (!allExercises){
        return ['No Exercises Found'];
    }

    return allExercises;
}

export const fetchData = async (route, index = null, buttonData) => {

    // if user refreshes single exercise
    if (index){ 
        const exerciseType = await exerciseTypeSearch(rows, buttonData[index][0])
        if (exerciseType != exercises[route][index]){
            buttonData[index] = await makeDataStructure(exerciseType[0])
            return buttonData

        } else{
            buttonData[index] = await makeDataStructure(exercises[route][index]);
            return buttonData
        }
    }

    const numberOfLoops = exercises[route].length;
    const newButtonData = []; 

    for (let i = 0; i <  numberOfLoops; i++ ){

        // create 3d array in this format [[exercise1info], [exercise2info]....]
        newButtonData.push(await makeDataStructure(exercises[route][i]));
    }

    return newButtonData;
}

// create an array (data) with generated information in this format [exerciseName, imageResponse, descriptionResponse]
const makeDataStructure = async (item) => {
    const data = []; 
    const exerciseName = await exerciseSearch(rows, item);
    data[0] = exerciseName;
    // data[1] = await dataSearch(exerciseName);

    return data
}