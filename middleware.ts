import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Edge-runtime-safe verify (avoid importing the server-only lib here)
async function verify(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.sub === 'string';
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('eval_session')?.value;
  const valid = token ? await verify(token) : false;

  if (!valid) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('reason', 'auth');
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/evaluate/:path*'],
};
