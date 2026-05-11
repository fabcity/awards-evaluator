import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SESSION_COOKIE_NAME, verifyToken } from '@/lib/auth';
import {
  getAssignmentForEvalAndSubmission,
  getEvaluator,
  getFullSubmission,
  getOrCreateEvaluation,
} from '@/lib/airtable';
import { ScoringPanel } from './ScoringPanel';
import { MediaCarousel } from './MediaCarousel';
import type { FullSubmission } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EvaluatePage({
  params,
}: {
  params: { submissionId: string };
}) {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  const claims = sessionCookie ? await verifyToken(sessionCookie) : null;
  if (!claims) redirect('/?reason=auth');

  const [evaluator, submission, assignment] = await Promise.all([
    getEvaluator(claims.sub),
    getFullSubmission(params.submissionId),
    getAssignmentForEvalAndSubmission(claims.sub, params.submissionId),
  ]);

  if (!evaluator || !submission) {
    return (
      <ErrorView
        title="Submission not found"
        body="The submission you're trying to evaluate could not be loaded. Please return to the dashboard."
      />
    );
  }
  if (!assignment) {
    return (
      <ErrorView
        title="Not assigned"
        body="You are not assigned to evaluate this submission. If you believe this is a mistake, contact Josefina Nano (josefina@fab.city)."
      />
    );
  }

  const evaluation = await getOrCreateEvaluation(
    evaluator.id,
    submission.id,
    assignment
  );

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
        </div>
      </header>

      {/* Eval top bar with breadcrumb */}
      <div className="bg-white border-b border-dark px-8 py-3.5 flex items-center justify-between sticky top-[58px] z-40">
        <div className="flex items-center gap-4 text-[13px]">
          <Link href="/dashboard" className="text-muted hover:text-dark">
            ← Back to dashboard
          </Link>
          <span className="text-light-gray">/</span>
          <span className="font-bold">{submission.projectTitle}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] min-h-[calc(100vh-116px)]">
        {/* LEFT: submission content */}
        <SubmissionPane submission={submission} />

        {/* RIGHT: scoring panel (client) */}
        <ScoringPanel
          evaluation={evaluation}
          evaluationId={evaluation.id}
          assignmentId={assignment.id}
        />
      </div>
    </main>
  );
}

function SubmissionPane({ submission: s }: { submission: FullSubmission }) {
  const hero = s.supportingMedia[0];
  const heroBg = hero
    ? { backgroundImage: `url('${hero.thumbnailUrl || hero.url}')` }
    : undefined;

  return (
    <div className="px-12 py-10 border-r border-dark bg-cream min-w-0">
      {/* Hero */}
      <section className="mb-9">
        <div className="text-[11px] uppercase tracking-[0.1em] text-muted font-bold mb-2.5">
          Submission · {[s.city, s.country].filter(Boolean).join(', ')}
          {s.applicantType ? ` · ${s.applicantType}` : ''}
        </div>
        <h1 className="text-[38px] leading-tight tracking-tight mb-2">
          {s.projectTitle}
        </h1>
        {s.tagline && (
          <p className="text-[17px] opacity-80 mb-5 max-w-2xl">{s.tagline}</p>
        )}
        {hero && (
          <div
            className="aspect-[16/9] bg-light-gray bg-cover bg-center border border-dark mb-3"
            style={heroBg}
          />
        )}
      </section>

      {/* Meta grid */}
      <MetaGrid s={s} />

      {/* Project brief */}
      {s.projectBrief && (
        <Section eyebrow="Project brief — as written by applicant" heading="What is it?">
          <Paragraphs text={s.projectBrief} />
        </Section>
      )}

      {/* Category narratives */}
      {(s.natureNarrative || s.communitiesNarrative || s.technologiesNarrative) && (
        <CategoryTabs s={s} />
      )}

      {/* People & reach */}
      {(s.whoInvolved.length > 0 || s.primaryBeneficiaries) && (
        <Section eyebrow="People & reach" heading="Who's involved?">
          {s.whoInvolved.length > 0 && (
            <p className="mb-3">
              <strong>Stakeholders:</strong> {s.whoInvolved.join(' · ')}.
            </p>
          )}
          {s.primaryBeneficiaries && (
            <>
              <p className="mb-2"><strong>Primary beneficiaries &amp; reach:</strong></p>
              <Paragraphs text={s.primaryBeneficiaries} />
            </>
          )}
        </Section>
      )}

      {/* Outputs & indicators */}
      <Section eyebrow="Outputs & indicators" heading="What has been delivered?">
        {s.outputsDelivered.length > 0 && (
          <p className="mb-3">
            <strong>Outputs delivered:</strong> {s.outputsDelivered.join(' · ')}.
          </p>
        )}
        {s.keyOutputsDescription && (
          <>
            <p className="mb-2"><strong>Key outputs description (verbatim):</strong></p>
            <Paragraphs text={s.keyOutputsDescription} />
          </>
        )}

        {(s.indicator1Name || s.indicator1Value) && (
          <>
            <h4 className="mt-6 mb-2 text-[15px] uppercase tracking-[0.06em] font-bold">Indicator 1 (primary)</h4>
            <IndicatorBox
              name={s.indicator1Name}
              valueLine={[s.indicator1Value, s.indicator1Unit, s.indicator1Timeframe].filter(Boolean).join(' · ')}
              method={s.indicator1Method}
            />
          </>
        )}

        {s.additionalIndicators && (
          <>
            <h4 className="mt-6 mb-2 text-[15px] uppercase tracking-[0.06em] font-bold">Additional indicators</h4>
            <div className="border border-dark bg-white p-4 text-[13px] whitespace-pre-wrap leading-relaxed">
              {s.additionalIndicators}
            </div>
          </>
        )}
      </Section>

      {/* What's next */}
      {s.whatsNext && (
        <Section eyebrow="What's next?" heading="Future trajectory">
          <Paragraphs text={s.whatsNext} />
        </Section>
      )}

      {/* Tech / Hardware needs */}
      {(s.techSupportNeeds || s.techNeedsDescription) && (
        <Section eyebrow="Tech / hardware support needs" heading="What the applicant is asking for">
          <div className="border border-dark bg-white p-4">
            {s.techSupportNeeds && (
              <span className="inline-block px-2.5 py-1 bg-blue text-white text-[11px] uppercase tracking-[0.08em] font-bold mb-2.5">
                {s.techSupportNeeds}
              </span>
            )}
            {s.techNeedsDescription && (
              <Paragraphs text={s.techNeedsDescription} />
            )}
          </div>
        </Section>
      )}

      {/* Supporting media */}
      {s.supportingMedia.length > 0 && (
        <Section
          eyebrow={`Supporting media · ${s.supportingMedia.length} image${s.supportingMedia.length === 1 ? '' : 's'}`}
          heading="Image gallery"
        >
          <MediaCarousel media={s.supportingMedia} />
          {s.imageCredits && (
            <div className="text-[11px] text-muted italic mt-2">
              Image credits &amp; usage rights: {s.imageCredits}
            </div>
          )}
        </Section>
      )}

      {/* Videos */}
      {(s.projectTeaserVideo || s.rawVideo) && (
        <Section eyebrow="Media" heading="Video teasers">
          {s.projectTeaserVideo && (
            <VideoLink url={s.projectTeaserVideo} label="Project teaser" />
          )}
          {s.rawVideo && (
            <VideoLink url={s.rawVideo} label="Raw footage" />
          )}
        </Section>
      )}

      {/* Supporting docs */}
      {s.supportingDocs.length > 0 && (
        <Section
          eyebrow={`Supporting documentation · ${s.supportingDocs.length} file${s.supportingDocs.length === 1 ? '' : 's'}`}
          heading="Inline PDFs"
        >
          {s.supportingDocs.map((d) => (
            <a
              key={d.id}
              href={d.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 border border-dark bg-white p-4 mb-2 hover:bg-light-gray transition-colors"
            >
              <div className="w-10 h-12 bg-red text-white flex items-center justify-center text-[10px] font-bold">PDF</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[14px] truncate">{d.filename}</div>
                <div className="text-[12px] text-muted">{formatBytes(d.sizeBytes)}</div>
              </div>
              <div className="text-[12px] uppercase tracking-[0.06em] font-bold text-red">Open →</div>
            </a>
          ))}
        </Section>
      )}

      {/* External validation */}
      {s.externalValidation && (
        <Section
          eyebrow="External validation · media spotlights"
          heading="Press, social, and partner features"
        >
          <div className="text-[13px] whitespace-pre-wrap break-all leading-relaxed">
            {linkify(s.externalValidation)}
          </div>
        </Section>
      )}

      {/* Links */}
      {(s.projectWebsite || s.socialMedia) && (
        <Section eyebrow="Links" heading="Project website & social">
          <div>
            {s.projectWebsite && (
              <a
                href={s.projectWebsite}
                target="_blank"
                rel="noreferrer"
                className="flex justify-between py-3 border-b border-light-gray text-[14px] hover:text-red"
              >
                <span>{s.projectWebsite}</span>
                <span className="text-[11px] text-muted uppercase tracking-[0.06em]">Website ↗</span>
              </a>
            )}
            {s.socialMedia && (
              <div className="py-3 border-b border-light-gray text-[14px] whitespace-pre-wrap break-all">
                {linkify(s.socialMedia)}
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  );
}

function MetaGrid({ s }: { s: FullSubmission }) {
  const cells = [
    { label: 'Applicant', val: s.applicantName },
    { label: 'Role', val: s.role },
    { label: 'Profession', val: s.profession },
    {
      label: 'Applicant type',
      val: s.applicantType,
      hint:
        s.applicantType === 'Representative'
          ? 'Applying on behalf of an organization, collective, or team'
          : s.applicantType === 'Individual Applicant'
          ? 'A single person applying with their own project'
          : null,
    },
    { label: 'Organization type', val: s.organizationType },
    { label: 'Initiated', val: s.initiatedYear },
    {
      label: 'Implementation context',
      val: s.context,
      hint:
        s.context === 'Urban'
          ? 'Dense city environment'
          : s.context === 'Peri-Urban'
          ? 'Transitional zone between city and countryside'
          : s.context === 'Rural'
          ? 'Low-density, countryside'
          : null,
    },
    {
      label: 'Current implementation stage',
      val: s.stage,
    },
    { label: 'City / Country', val: [s.city, s.country].filter(Boolean).join(' · ') || null },
  ];
  return (
    <div className="grid grid-cols-3 gap-px bg-dark border border-dark mb-6">
      {cells.map((c) => (
        <div key={c.label} className="bg-cream p-3.5">
          <div className="text-[10px] uppercase tracking-[0.1em] font-bold text-muted mb-1">
            {c.label}
          </div>
          <div className="font-bold text-[14px]">{c.val || '—'}</div>
          {c.hint && (
            <div className="text-[11px] font-normal text-muted mt-1 leading-snug">
              {c.hint}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CategoryTabs({ s }: { s: FullSubmission }) {
  return (
    <div className="mb-9 pb-9 border-b border-light-gray">
      <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-bold mb-3">
        Category narratives — full text as written by applicant
      </div>
      <h3 className="text-[20px] mb-4">Category-specific alignment</h3>
      {s.natureNarrative && (
        <div className="mb-6">
          <h4 className="text-[15px] uppercase tracking-[0.06em] font-bold mb-2 text-green">
            It is about NATURE
          </h4>
          <Paragraphs text={s.natureNarrative} />
        </div>
      )}
      {s.communitiesNarrative && (
        <div className="mb-6">
          <h4 className="text-[15px] uppercase tracking-[0.06em] font-bold mb-2 text-gold">
            It is about COMMUNITY
          </h4>
          <Paragraphs text={s.communitiesNarrative} />
        </div>
      )}
      {s.technologiesNarrative && (
        <div className="mb-2">
          <h4 className="text-[15px] uppercase tracking-[0.06em] font-bold mb-2 text-blue">
            It is about TECHNOLOGY
          </h4>
          <Paragraphs text={s.technologiesNarrative} />
        </div>
      )}
    </div>
  );
}

function Section({
  eyebrow,
  heading,
  children,
}: {
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-9 pb-9 border-b border-light-gray last:border-b-0">
      <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-bold mb-3">
        {eyebrow}
      </div>
      <h3 className="text-[20px] mb-4">{heading}</h3>
      <div className="text-[14.5px] leading-[1.65]">{children}</div>
    </section>
  );
}

function Paragraphs({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-3 last:mb-0 whitespace-pre-wrap">
          {p}
        </p>
      ))}
    </>
  );
}

function IndicatorBox({
  name,
  valueLine,
  method,
}: {
  name: string | null;
  valueLine: string;
  method: string | null;
}) {
  return (
    <div className="border border-dark p-4 grid grid-cols-2 gap-4 mb-3">
      <div>
        <div className="text-[11px] uppercase tracking-[0.08em] font-bold text-muted mb-1">
          Name
        </div>
        <div className="font-bold text-[14px]">{name || '—'}</div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-[0.08em] font-bold text-muted mb-1">
          Value · Unit · Timeframe
        </div>
        <div className="font-bold text-[14px]">{valueLine || '—'}</div>
      </div>
      {method && (
        <div className="col-span-2">
          <div className="text-[11px] uppercase tracking-[0.08em] font-bold text-muted mb-1">
            Measurement method &amp; source
          </div>
          <div className="text-[14px] font-normal leading-snug whitespace-pre-wrap">
            {linkify(method)}
          </div>
        </div>
      )}
    </div>
  );
}

function VideoLink({ url, label }: { url: string; label: string }) {
  const ytId = extractYouTubeId(url);
  const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block relative aspect-video bg-dark mb-2.5 overflow-hidden group"
    >
      {thumb && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${thumb}')` }}
        />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-red text-white flex items-center justify-center text-[22px]">
          ▶
        </div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 text-white text-[12px]">
        {label} · {url}
      </div>
    </a>
  );
}

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^?&]+)/);
  return m ? m[1] : null;
}

function formatBytes(bytes: number): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Convert URLs inside a string into clickable links
function linkify(text: string): React.ReactNode {
  const parts = text.split(/(https?:\/\/\S+)/g);
  return parts.map((p, i) => {
    if (p.match(/^https?:\/\//)) {
      return (
        <a
          key={i}
          href={p}
          target="_blank"
          rel="noreferrer"
          className="text-red hover:underline break-all"
        >
          {p}
        </a>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

function ErrorView({ title, body }: { title: string; body: string }) {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-8">
      <div className="max-w-md text-center">
        <h1 className="text-3xl mb-3">{title}</h1>
        <p className="text-muted mb-6">{body}</p>
        <Link
          href="/dashboard"
          className="inline-block bg-dark text-cream font-bold uppercase tracking-wide text-xs px-5 py-3"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
