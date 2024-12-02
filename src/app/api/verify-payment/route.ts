import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { google } from 'googleapis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Fetch session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    });

    const customerEmail = session.customer_details?.email;
    const lineItem = session.line_items?.data[0];
    const membershipType = lineItem?.description; // Get membership type from Stripe description

    if (!customerEmail || !membershipType) {
      return NextResponse.json({ error: 'Invalid session data' }, { status: 400 });
    }

    // Update Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Fetch rows from the Google Sheet
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Members!A:E', // Adjust range as needed
    });

    const rows = readRes.data.values || [];
    const userRowIndex = rows.findIndex((row) => row[0] === customerEmail);

    if (userRowIndex === -1) {
      return NextResponse.json({ error: 'User not found in Google Sheets' }, { status: 404 });
    }

    // Update membership details
    const currentDate = new Date();
    const expiresDate = new Date();
    expiresDate.setFullYear(currentDate.getFullYear() + 1); // 1-year membership

    const updateRes = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Members!C${userRowIndex + 1}:E${userRowIndex + 1}`, // Adjust column indices
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[membershipType, currentDate.toISOString(), expiresDate.toISOString()]],
      },
    });

    if (updateRes.status !== 200) {
      return NextResponse.json({ error: 'Failed to update Google Sheets' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error verifying payment:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
