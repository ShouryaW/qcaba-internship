import { google } from 'googleapis';

export async function updateGoogleSheets(email: string, membership: string) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // Fetch the spreadsheet data
  const readResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Members!A:E', // Adjust to match your sheet
  });

  const rows = readResponse.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === email);

  if (rowIndex === -1) {
    throw new Error(`User with email ${email} not found.`);
  }

  // Update membership, PurchasedAt, and ExpiresAt
  const now = new Date();
  const expiresAt = new Date();
  expiresAt.setFullYear(now.getFullYear() + 1);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Members!B${rowIndex + 1}:D${rowIndex + 1}`, // Adjust columns based on your data
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [membership, now.toISOString(), expiresAt.toISOString()],
      ],
    },
  });
}
