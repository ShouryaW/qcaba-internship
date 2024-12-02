import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { googleConfig } from '../../../../lib/googleConfig';

export async function POST(request: Request) {
  try {
    const { email, membershipType } = await request.json();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: googleConfig.clientEmail,
        private_key: googleConfig.privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const today = new Date().toISOString().split('T')[0]; // Current date (YYYY-MM-DD)
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year from today
    const expiresAt = expirationDate.toISOString().split('T')[0]; // Expiration date

    // Fetch the current members data
    const users = await sheets.spreadsheets.values.get({
      spreadsheetId: googleConfig.spreadsheetId,
      range: 'Members!A:E',
    });

    const userIndex = users.data.values?.findIndex((row) => row[0] === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update membership status, purchase date, and expiration date
    await sheets.spreadsheets.values.update({
      spreadsheetId: googleConfig.spreadsheetId,
      range: `Members!C${userIndex + 1}:E${userIndex + 1}`, // Update row with new data
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[membershipType, today, expiresAt]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Membership purchase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
