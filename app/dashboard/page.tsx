import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SESSION_COOKIE_NAME,
  verifyToken,
} from '@/lib/auth';
import {
  getAssignmentsForEvaluator,
  getEvaluator,
} from '@/lib/airtable';
import type { Assignment, Evaluator } from '@/lib/types';

export const dynamic = 'force-dynamic'; // always fetch fresh

export default async function DashboardPage() {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  const claims = sessionCookie ? await verifyToken(sessionCookie) : null;
  if (!claims) redirect('/?reason=auth');

  const evaluator: Evaluator | null = await getEvaluator(claims.sub);
  if (!evaluator) {
    return (
      <ErrorView
        title="Evaluator record not found"
        body={`No People row matches the evaluator ID ${claims.sub}. Please contact Lucas Marangoni (luc@fab.city).`}
      />
    );
  }

  let assignments: Assignment[] = [];
  let loadError: string | null = null;
  try {
    assignments = await getAssignmentsForEvaluator(evaluator.id);
  } catch (e) {
    loadError =
      e instanceof Error ? e.message : 'Failed to load assignments from Airtable';
  }

  // Order: Not started → In progress → Submitted → others
  const order: Record<string, number> = {
    'Not started': 0,
    'In progress': 1,
    Submitted: 2,
    Reassigned: 3,
    'COI flagged': 4,
  };
  assignments.sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99));

  const counts = {
    total: assignments.length,
    notStarted: assignments.filter((a) => a.status === 'Not started').length,
    inProgress: assignments.filter((a) => a.status === 'In progress').length,
    submitted: assignments.filter((a) => a.status === 'Submitted').length,
  };

  const initials = evaluator.fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <main className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="bg-dark text-cream px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3.5">
          <span className="w-7 h-7 bg-red inline-block" aria-hidden="true" />
          <span className="font-heading font-bold uppercase text-[13px] tracking-wide">
            Fab City Awards 2026 · Evaluation
          </span>
        </div>
        <div className="flex items-center gap-3.5 text-[13px]">
          <span className="w-[30px] h-[30px] bg-green text-white flex items-center justify-center font-bold text-xs">
            {initials || 'E'}
          </span>
          <span>{evaluator.fullName}</span>
          <a
            href="/api/logout"
            className="ml-4 text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100"
          >
            Log out
          </a>
        </div>
      </header>

      <section className="max-w-[1400px] mx-auto px-12 pt-10 pb-20">
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-dark pb-6 mb-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-bold mb-3">
              Your assignments · Fab City Awards 2026
            </div>
            <h1 className="text-[42px] leading-[1.1] tracking-tight">
              {counts.total} submission{counts.total === 1 ? '' : 's'} to evaluate
              <br />
              by May 26, 2026.
            </h1>
          </div>
          <div className="text-right text-[13px]">
            <div className="text-[34px] font-extrabold leading-none tracking-tight">
              {counts.submitted} / {counts.total}
            </div>
            <div className="text-muted">completed</div>
          </div>
        </div>

        {/* Progress strip */}
        <div className="flex gap-1 mb-10">
          {assignments.map((a) => (
            <div
              key={a.id}
              className={
                'flex-1 h-2.5 ' +
                (a.status === 'Submitted'
                  ? 'bg-green'
                  : a.status === 'In progress'
                  ? 'bg-blue'
                  : 'bg-light-gray')
              }
            />
          ))}
          {counts.total === 0 && (
            <div className="flex-1 h-2.5 bg-light-gray" />
          )}
        </div>

        {/* Glossary panel */}
        <div className="border border-dark bg-white p-5 mb-8">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-bold mb-3">
            Quick reference · how to read the submissions
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="px-4 md:border-r border-light-gray pb-3 md:pb-0">
              <div className="text-[11px] uppercase tracking-[0.08em] text-muted font-bold mb-2">
                Applicant type
              </div>
              <div className="text-[12.5px] leading-snug">
                <strong>Individual Applicant</strong> — a single person applying
                with their own project.
                <br />
                <strong>Representative</strong> — applying on behalf of an
                organization, collective, or team.
              </div>
            </div>
            <div className="px-4 md:border-r border-light-gray py-3 md:py-0">
              <div className="text-[11px] uppercase tracking-[0.08em] text-muted font-bold mb-2">
                Implementation context
              </div>
              <div className="text-[12.5px] leading-snug">
                <strong>Urban</strong> — dense city environment.
                <br />
                <strong>Peri-Urban</strong> — transitional zone between city and
                countryside.
                <br />
                <strong>Rural</strong> — low-density, countryside.
              </div>
            </div>
            <div className="px-4 pt-3 md:pt-0">
              <div className="text-[11px] uppercase tracking-[0.08em] text-muted font-bold mb-2">
                Current implementation stage
              </div>
              <div className="text-[12.5px] leading-snug">
                <strong>Pilot</strong> — tested in a limited setting.
                <br />
                <strong>Implemented</strong> — actively operating.
                <br />
                <strong>Scaling</strong> — expanding to new locations or
                audiences.
              </div>
            </div>
          </div>
        </div>

        {loadError && (
          <div className="border border-red p-4 mb-6 text-sm text-red">
            <strong>Error loading assignments:</strong> {loadError}
          </div>
        )}

        {assignments.length === 0 && !loadError ? (
          <div className="border border-dark p-12 text-center">
            <h3 className="text-xl mb-2">No assignments yet</h3>
            <p className="text-muted text-sm">
              Your assignments will appear here once the Awards team finalizes
              the jury distribution. Contact{' '}
              <a
                href="mailto:josefina@fab.city"
                className="text-red font-bold"
              >
                josefina@fab.city
              </a>{' '}
              if you believe this is a mistake.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assignments.map((a) => (
              <Card key={a.id} a={a} />
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-dark text-cream flex justify-between items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] font-bold opacity-70 mb-2">
              Need help?
            </div>
            <div className="text-sm">
              Awards &amp; rubric questions: Josefina Nano (josefina@fab.city).
              Technical / platform issues: Lucas Marangoni (luc@fab.city).
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({ a }: { a: Assignment }) {
  const { submission: s, status } = a;
  const statusStyle =
    status === 'Submitted'
      ? 'bg-green text-white'
      : status === 'In progress'
      ? 'bg-blue text-white'
      : status === 'COI flagged'
      ? 'bg-red text-white'
      : 'bg-light-gray text-dark';

  const cta =
    status === 'Not started'
      ? 'Start →'
      : status === 'Submitted'
      ? 'Review →'
      : 'Continue →';

  return (
    <div className="border border-dark bg-white flex flex-col hover:-translate-y-0.5 transition-transform">
      <div
        className="aspect-[16/7] bg-light-gray border-b border-dark bg-cover bg-center"
        style={
          s.thumbnailUrl
            ? { backgroundImage: `url('${s.thumbnailUrl}')` }
            : undefined
        }
      />
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span
            className={
              'text-[11px] uppercase tracking-[0.08em] font-bold py-1 px-2 ' +
              statusStyle
            }
          >
            {status}
          </span>
        </div>
        <h3 className="text-[20px] leading-tight tracking-tight mb-1">
          {s.projectTitle}
        </h3>
        <div className="text-[13px] text-muted mb-3.5">
          {s.applicantName}
          {s.country ? ` · ${s.country}` : ''}
        </div>
        <div className="flex justify-between items-center text-[12px] text-muted border-t border-light-gray pt-3">
          <span
            title={`${s.applicantType ?? '—'} · ${s.stage ?? '—'} · ${
              s.context ?? '—'
            }`}
          >
            {s.applicantType ?? '—'} · {s.stage?.split(' (')[0] ?? '—'}
          </span>
          <a
            href={`/evaluate/${s.id}`}
            className="font-bold text-red text-[12px] uppercase tracking-[0.06em] hover:underline"
          >
            {cta}
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorView({ title, body }: { title: string; body: string }) {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-8">
      <div className="max-w-md text-center">
        <h1 className="text-3xl mb-3">{title}</h1>
        <p className="text-muted mb-6">{body}</p>
        <a
          href="/api/logout"
          className="inline-block bg-dark text-cream font-bold uppercase tracking-wide text-xs px-5 py-3"
        >
          Log out
        </a>
      </div>
    </main>
  );
}
