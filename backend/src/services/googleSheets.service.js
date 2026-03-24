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

  async getExerciseData(forceRefresh = false) {
    const now = Date.now();
    
    // Return cached data if valid
    if (!forceRefresh && this.cache && this.cacheTimestamp && (now - this.cacheTimestamp < this.CACHE_DURATION)) {
      return this.cache;
    }

    try {
      const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
      const range = 'Illustrations!A:D';

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      this.cache = response.data.values || [];
      this.cacheTimestamp = now;
      
      return this.cache;
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error.message);
      
      // Return cached data if available, even if expired
      if (this.cache) {
        console.log('⚠️ Using stale cache due to fetch error');
        return this.cache;
      }
      
      throw error;
    }
  }

  clearCache() {
    this.cache = null;
    this.cacheTimestamp = null;
  }
}

// Create singleton instance
const googleSheetsService = new GoogleSheetsService();

export default googleSheetsService;
