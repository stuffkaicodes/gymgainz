import axios from 'axios';
import { google } from 'googleapis';
import express from "express"; 
import dotenv from 'dotenv';

dotenv.config();

async function googleSheets() {

    const apiKey = process.env.API_KEY

    const auth = new google.auth.GoogleAuth({
    
        keyFile: "credentials.json",
        scopes:"https://www.googleapis.com/auth/spreadsheets",
    });
    
    // Create client instance for auth
    const client = await auth.getClient(); 
    
    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: 'v4', auth: client});
    
    const spreadsheetId = "1ZdCztT7mk5h7Bx_NrYRYxmrVoXajBljpoRJlMAFugGo";
    
    // Read data from the sheet
    const range = 'Illustrations!A:D'; // Adjust range if necessary
    const response = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    return response.data.values;
}

export default googleSheets;