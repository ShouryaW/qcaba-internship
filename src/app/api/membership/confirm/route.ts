import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { googleConfig } from '../../../../lib/googleConfig';

export async function POST(request: Request) {
  try {
    const { membershipType } = await request.json();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: googleConfig.clientEmail,
        private_key: googleConfig.privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Append the user's membership to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: googleConfig.spreadsheetId,
      range: 'Members!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[membershipType, new Date().toISOString()]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Membership confirmation error:', error);
    return NextResponse.json({ error: 'Failed to confirm membership' }, { status: 500 });
  }
}
