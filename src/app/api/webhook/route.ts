import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { google } from 'googleapis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature') || '';

  let event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email;
    const membership = session.metadata?.membershipType;
    const purchaseDate = new Date().toISOString();
    const expiryDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ).toISOString();

    if (email && membership) {
      try {
        // Google Sheets API setup
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.SPREADSHEET_ID;

        // Fetch existing rows
        const res = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: 'Members!A:E',
        });

        const rows = res.data.values || [];
        const userRow = rows.findIndex((row) => row[0] === email);

        if (userRow !== -1) {
          // Update the user row
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `Members!C${userRow + 1}:E${userRow + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[membership, purchaseDate, expiryDate]],
            },
          });
        }
      } catch (err) {
        console.error('Google Sheets update error:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
