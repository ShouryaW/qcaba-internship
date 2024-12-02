import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('Received login request:', { email });

    if (!email || !password) {
      console.error('Validation failed: Missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    console.log('GoogleAuth initialized');

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    console.log('Fetching data from Google Sheets:', { spreadsheetId });

    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Members!A:B', // Ensure this range matches your sheet
    });

    console.log('Google Sheets response:', readResponse.data);

    const rows = readResponse.data.values || [];
    const userRow = rows.find((row) => row[0] === email);

    if (!userRow) {
      console.error('User not found in Google Sheets:', email);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    console.log('User found:', userRow[0]);

    const isPasswordValid = await bcrypt.compare(password, userRow[1]);
    if (!isPasswordValid) {
      console.error('Password mismatch for user:', email);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    console.log('Login successful for user:', email);

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
