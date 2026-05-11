import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, verifyToken } from '@/lib/auth';
import { flagAssignmentCOI } from '@/lib/airtable';

// POST /api/assignments/coi
// Body: { assignmentId: string, reason?: string }
export async function POST(req: NextRequest) {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  const claims = sessionCookie ? await verifyToken(sessionCookie) : null;
  if (!claims) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  let body: { assignmentId?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400 }
    );
  }
  if (!body.assignmentId) {
    return NextResponse.json(
      { ok: false, error: 'Missing assignmentId' },
      { status: 400 }
    );
  }

  try {
    const result = await flagAssignmentCOI(
      claims.sub,
      body.assignmentId,
      body.reason ?? null
    );
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
