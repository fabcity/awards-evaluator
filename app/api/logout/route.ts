import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.delete(SESSION_COOKIE_NAME);
  return res;
}

// Convenience: allow GET /api/logout for click-to-logout links
export async function GET(req: NextRequest) {
  return POST(req);
}
