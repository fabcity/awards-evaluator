import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
  verifyToken,
} from '@/lib/auth';

// GET /auth?t=<magic-link-jwt>
// Validates the magic-link token, exchanges it for a session cookie,
// then redirects to /dashboard.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('t');
  if (!token) {
    return NextResponse.redirect(new URL('/?reason=missing-token', req.url));
  }

  const claims = await verifyToken(token);
  if (!claims) {
    return NextResponse.redirect(new URL('/?reason=invalid-token', req.url));
  }

  const sessionToken = await signSessionToken(claims.sub);
  const res = NextResponse.redirect(new URL('/dashboard', req.url));
  res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
