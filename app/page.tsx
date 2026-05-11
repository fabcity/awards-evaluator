import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE_NAME, verifyToken } from '@/lib/auth';

export default async function LandingPage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  // If a valid session cookie is present, send the user straight to the dashboard
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (session) {
    const claims = await verifyToken(session);
    if (claims) redirect('/dashboard');
  }

  const reason = searchParams?.reason;
  let banner: string | null = null;
  if (reason === 'invalid-token')
    banner =
      'Your magic link is invalid or has expired. Contact josefina@fab.city for a fresh link.';
  else if (reason === 'missing-token')
    banner = 'Your link is missing its access token. Please use the full URL.';
  else if (reason === 'auth')
    banner =
      'Your session has expired. Please open your magic link again to log in.';

  return (
    <main className="min-h-screen flex flex-col bg-cream">
      <header className="bg-dark text-cream px-8 py-4 flex items-center gap-4 border-b border-dark">
        <span className="w-7 h-7 bg-red inline-block" aria-hidden="true" />
        <span className="font-heading font-bold uppercase text-sm tracking-wide">
          Fab City Awards 2026 · Evaluation
        </span>
      </header>

      <section className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="max-w-xl">
          <div className="text-xs uppercase tracking-widest text-muted font-bold mb-4">
            Private platform · jury access only
          </div>
          <h1 className="text-5xl leading-tight tracking-tight mb-6">
            Evaluator access by personal link.
          </h1>
          <p className="text-base leading-relaxed mb-6 max-w-md">
            This platform is reserved for the 32 confirmed jurors of the Fab
            City Awards 2026. If you are a jury member, check your inbox — your
            personal link grants direct access to your assigned submissions.
          </p>
          {banner && (
            <div className="border border-red bg-white p-4 text-sm mb-6 max-w-md">
              {banner}
            </div>
          )}
          <p className="text-sm text-muted">
            Lost your link?{' '}
            <a
              href="mailto:josefina@fab.city"
              className="text-red font-bold hover:underline"
            >
              Email josefina@fab.city
            </a>
            .
          </p>
        </div>
      </section>

      <footer className="px-8 py-4 border-t border-dark text-xs text-muted flex justify-between">
        <span>Fab City Foundation · 2026</span>
        <span>v0.4 · COI flow</span>
      </footer>
    </main>
  );
}
