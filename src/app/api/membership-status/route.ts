import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Members!A:C', // Assuming email is in column A and membership status is in column C
    });

    const rows = res.data.values || [];
    const userRow = rows.find((row) => row[0] === email);

    if (!userRow || !userRow[2]) {
      return NextResponse.json({ membership: null });
    }

    return NextResponse.json({ membership: userRow[2] });
  } catch (error) {
    console.error('Error fetching membership status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
