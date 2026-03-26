import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

class GoogleSheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.cache = null;
    this.cacheTimestamp = null;
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  async initialize() {
    try {
      this.auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      });

      const client = await this.auth.getClient();
      this.sheets = google.sheets({ version: 'v4', auth: client });
      
      console.log('✅ Google Sheets API initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets:', error.message);
      throw error;
    }
  }

  async getExerciseData() {
    // ADD THIS CHECK FIRST! ↓
    if (!this.auth) {
      console.log('⚠️ Google Sheets auth not initialized, returning null');
      return null;
    }
    
    // Then your existing code:
    const sheets = google.sheets({ version: 'v4', auth: this.auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'Sheet1!A:Z'
    });
    
    return response.data.values;
  }

  clearCache() {
    this.cache = null;
    this.cacheTimestamp = null;
  }
}

// Create singleton instance
const googleSheetsService = new GoogleSheetsService();

export default googleSheetsService;
