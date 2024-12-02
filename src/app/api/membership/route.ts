import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import bcrypt from 'bcryptjs';
import { googleConfig } from '../../../../lib/googleConfig'; // Import TypeScript config

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: googleConfig.clientEmail,
        private_key: googleConfig.privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const users = await sheets.spreadsheets.values.get({
      spreadsheetId: googleConfig.spreadsheetId,
      range: 'Members!A:B',
    });

    const user = users.data.values?.find((row) => row[0] === email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user[1]);

    if (isMatch) {
      return NextResponse.json({ status: 'active' });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Membership error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
