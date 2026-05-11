import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, verifyToken } from '@/lib/auth';
import { submitEvaluation } from '@/lib/airtable';

// POST /api/evaluations/submit
// Body: { evaluationId: string, assignmentId: string }
export async function POST(req: NextRequest) {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  const claims = sessionCookie ? await verifyToken(sessionCookie) : null;
  if (!claims) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: { evaluationId?: string; assignmentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.evaluationId || !body.assignmentId) {
    return NextResponse.json(
      { ok: false, error: 'Missing evaluationId or assignmentId' },
      { status: 400 }
    );
  }

  try {
    const result = await submitEvaluation(
      body.evaluationId,
      claims.sub,
      body.assignmentId
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
