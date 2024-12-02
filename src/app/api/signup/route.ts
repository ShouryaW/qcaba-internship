import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import bcrypt from 'bcryptjs';
import { googleConfig } from '../../../../lib/googleConfig';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: googleConfig.clientEmail,
        private_key: googleConfig.privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = googleConfig.spreadsheetId;

    // Check if the user already exists
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Members!A:A', // Only check the email column
    });

    const rows = readRes.data.values || [];
    const userExists = rows.some((row) => row[0] === email);

    if (userExists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Append the new user to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Members!A:E', // Ensure the range matches the sheet's columns
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[email, hashedPassword, 'None', '', '']],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
