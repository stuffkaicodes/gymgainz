import axios from 'axios';
import { google } from 'googleapis';
import express from "express";

export async function exerciseSearch(rows, item) {

    // Filter rows where Column D (index 3) value is "name" of exercise defined above
    const filteredRows = rows.filter(row => row[3] === item && row[2] === 'Strength');

    if (filteredRows.length === 0) {
        return "No matching rows found.";
    }

    // Extract values from Column B (index 1) of the filtered rows
    const columnBValues = filteredRows.map(row => row[1]).filter(value => value);

    // Randomize and pick a value from Column B
    const randomIndex = Math.floor(Math.random() * columnBValues.length);

    return columnBValues[randomIndex];
}

export async function allExercisesSearch(rows, exercise){

    const allExercises = await rows.filter(row => row[3] === exercise && row[2] === 'Strength').map(row => row[1]);

    return allExercises
}

export async function exerciseTypeSearch(rows, exercise){
    
    const exerciseType = await rows.filter(row => row[1] === exercise && row[2] === 'Strength').map(row => row[3]);

    return exerciseType
}
