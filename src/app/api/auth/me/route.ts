import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value; // Retrieve token from cookies

    if (!token) {
      return NextResponse.json({ error: 'Access Denied' }, { status: 401 });
    }

    // Verify the token with the secret from .env
    const decoded = verify(token, process.env.JWT_SECRET!);
    console.log('Decoded Token:', decoded); // Log decoded data for debugging

    // Return the decoded user information
    return NextResponse.json(decoded);
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Access Denied' }, { status: 401 });
  }
}
