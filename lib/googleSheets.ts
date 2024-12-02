import { google } from 'googleapis';

// Authenticate with Google API using service account credentials
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle key formatting
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export const getSheetData = async (range: string) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
    });
    return response.data.values || [];
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw new Error('Failed to fetch data from Google Sheets');
  }
};
