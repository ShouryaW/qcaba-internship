import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { google } from 'googleapis';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const auth = new google.auth.GoogleAuth({
            credentials: {
              client_email: process.env.GOOGLE_CLIENT_EMAIL,
              private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
          });

          const sheets = google.sheets({ version: 'v4', auth });
          const spreadsheetId = process.env.SPREADSHEET_ID;

          const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Members!A:B', // Email in column A, Password in column B
          });

          const rows = response.data.values || [];
          const userRow = rows.find((row) => row[0] === email);

          if (!userRow) {
            console.error('User not found');
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, userRow[1]);
          if (!isPasswordValid) {
            console.error('Invalid password');
            return null;
          }

          return { id: email, email }; // Return user data
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Use JWT-based sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Required for JWT signing
  debug: true, // Enable debug mode for logs
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };