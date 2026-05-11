import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, verifyToken } from '@/lib/auth';
import { updateEvaluationField } from '@/lib/airtable';
import type { EvaluationField } from '@/lib/types';

// POST /api/evaluations/save
// Body: { evaluationId: string, field: EvaluationField, value: number | string | boolean | null }
export async function POST(req: NextRequest) {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  const claims = sessionCookie ? await verifyToken(sessionCookie) : null;
  if (!claims) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: { evaluationId?: string; field?: string; value?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { evaluationId, field, value } = body;
  if (!evaluationId || !field) {
    return NextResponse.json(
      { ok: false, error: 'Missing evaluationId or field' },
      { status: 400 }
    );
  }

  // Validate the field name
  const allowedFields: EvaluationField[] = [
    'nature1', 'nature2', 'nature3',
    'community1', 'community2', 'community3',
    'technology1', 'technology2', 'technology3',
    'justNature', 'justCommunity', 'justTechnology',
    'overallComments',
    'nominateOverallImpact', 'nominateThomasDuggan',
  ];
  if (!allowedFields.includes(field as EvaluationField)) {
    return NextResponse.json(
      { ok: false, error: `Invalid field: ${field}` },
      { status: 400 }
    );
  }

  // Type-validate the value
  let cleanValue: number | string | boolean | null = null;
  if (field.startsWith('nature') || field.startsWith('community') || field.startsWith('technology')) {
    if (value === null) {
      cleanValue = null;
    } else if (typeof value === 'number' && value >= 1 && value <= 10) {
      cleanValue = Math.round(value);
    } else {
      return NextResponse.json(
        { ok: false, error: 'Score must be a number 1–10 or null' },
        { status: 400 }
      );
    }
  } else if (field.startsWith('just') || field === 'overallComments') {
    cleanValue = typeof value === 'string' ? value : '';
  } else if (field.startsWith('nominate')) {
    cleanValue = !!value;
  }

  try {
    await updateEvaluationField(
      evaluationId,
      claims.sub,
      field as EvaluationField,
      cleanValue
    );
    return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    const status = message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
