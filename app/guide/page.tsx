import type { Metadata } from 'next';
import AwardsLogo from '@/components/AwardsLogo';

export const metadata: Metadata = {
  title: 'Jury Guide — Fab City Awards 2026',
  description:
    'How to navigate, evaluate, and submit — the operator guide for the Fab City Awards 2026 jury.',
  robots: 'noindex, nofollow',
};

// Static — the guide doesn't depend on user/session state.
export const dynamic = 'force-static';

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-cream text-dark">
      {/* Sticky top bar — same pattern as dashboard */}
      <header className="bg-dark text-cream px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-3.5">
          <span className="w-7 h-7 bg-red inline-block" aria-hidden="true" />
          <span className="font-heading font-bold uppercase text-[13px] tracking-wide">
            Fab City Awards 2026 · Jury Guide
          </span>
        </div>
        <a
          href="/dashboard"
          className="text-[11px] uppercase tracking-widest opacity-70 hover:opacity-100"
        >
          ← Back to dashboard
        </a>
      </header>

      <article className="max-w-[1100px] mx-auto px-8 md:px-12 pt-12 pb-24 print:max-w-none print:px-0 print:pt-0">
        {/* Hero / sub-header — 2-degree lockup, schedule, label */}
        <section className="border-b-2 border-dark pb-10 mb-14 print:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-8 md:gap-12 items-start">
            <div className="text-red print:text-black">
              <AwardsLogo className="w-[140px] h-auto" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-bold mb-4">
                Awards 2026 · For evaluators
              </div>
              <h1 className="text-[56px] md:text-[64px] leading-[1] tracking-[-0.04em] font-medium mb-6">
                Jury&nbsp;Guide.
              </h1>
              <p className="text-[15px] leading-[1.6] text-dark max-w-[640px]">
                Everything you need to evaluate submissions, write defensible
                justifications, and submit on time. Quick start in section 1,
                rubric in section 2, FAQ for everything else.
              </p>
            </div>
          </div>

          {/* Schedule */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 border-t border-dark">
            {[
              ['Evaluation period', '13 May → 7 June'],
              ["Online jury's meetup", '10 June · 16h CEST'],
              ['Winners announced', '18 June'],
              ['Winners roundtable (online)', '1 July · 16h CEST'],
              ['Showcase · Fab26 Boston', '30 July'],
            ].map(([label, value], i, arr) => (
              <div
                key={label}
                className={
                  'py-4 px-1 sm:px-4 ' +
                  (i < arr.length - 1
                    ? 'border-b sm:border-b-0 lg:border-r border-light-gray'
                    : '')
                }
              >
                <div className="text-[10px] uppercase tracking-[0.12em] text-muted font-bold mb-1.5">
                  {label}
                </div>
                <div className="text-[14px] font-bold tracking-tight">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section nav strip */}
        <nav className="flex flex-wrap gap-x-8 gap-y-2 text-[12px] uppercase tracking-[0.12em] font-bold mb-16 pb-4 border-b border-light-gray print:hidden">
          <a href="#quick-start" className="text-red hover:underline">
            01 Quick start
          </a>
          <a href="#rubric" className="text-red hover:underline">
            02 The rubric
          </a>
          <a href="#faq" className="text-red hover:underline">
            03 FAQ
          </a>
          <a href="#help" className="text-red hover:underline">
            04 Help
          </a>
        </nav>

        {/* ────────────── 01 QUICK START ────────────── */}
        <section id="quick-start" className="mb-20 print:mb-12 scroll-mt-24">
          <SectionHeader number="01" title="Quick start." />

          <Step lead="Open the email">
            with your Awards 2026 evaluation link and click the magic link. It
            logs you in directly — no password, no account creation. The link is
            valid for 30 days; the session cookie lasts 7 days. If your session
            expires mid-cycle, please click the same link again from the email
            and you're back in.
          </Step>

          <Step lead="Land on the dashboard">
            at <Code>evaluate.fab.city/dashboard</Code>. You'll see your
            assigned submissions, each with a status pill:{' '}
            <Pill>Not started</Pill>, <Pill>In progress</Pill>, or{' '}
            <Pill>Submitted</Pill>. The greeting tells you how many you have
            left. Click a card to open it.
          </Step>

          <Step lead="Read the submission on the left pane">
            . It shows the applicant's entry verbatim — narrative, indicators,
            images, supporting PDFs, videos, links. Please read it fully before
            scoring. Plan around 30 minutes per evaluation.
          </Step>

          <Step lead="Score on the right pane">
            . Nine sub-scores on a 1–10 scale, grouped into NATURE, COMMUNITY,
            and TECHNOLOGY (3 sub-criteria each). Write one justification per
            category, 50 words minimum. Scores save the instant you click. Text
            autosaves about 1.2 seconds after you stop typing. There is no save
            button — close the tab anytime, your work is preserved. Reopen the
            submission later and you land exactly where you left off, scores
            and text and status intact.
          </Step>

          <Step lead="Before submitting (optional)">
            , add free-text Overall Comments, and decide whether to tick the
            Overall Impact Award nomination or the Thomas Duggan Mention
            nomination. See section 2 — these are not extra credit and most
            submissions should not be nominated.
          </Step>

          <Step lead="Click Submit Evaluation">
            . The button stays disabled until all 9 scores are set and all 3
            justifications meet the 50-word floor — the tooltip tells you
            what's missing. Once submitted, scores lock. To amend a submitted
            evaluation before June 10, please email Josefina.
          </Step>
        </section>

        {/* ────────────── 02 RUBRIC ────────────── */}
        <section id="rubric" className="mb-20 print:mb-12 scroll-mt-24">
          <SectionHeader number="02" title="The rubric." />

          {/* The four bands */}
          <h3 className="text-[22px] tracking-tight font-medium mb-5 mt-2">
            The four bands.
          </h3>
          <p className="mb-6 text-[15px] leading-[1.65] max-w-[800px]">
            Every sub-criterion is scored 1–10 with anchored bands. Use them as
            anchors, not a fine-grained scale.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mb-3 border border-dark print:break-inside-avoid">
            {[
              ['1–3', 'Weak', 'Absent, addressed superficially, or actively undermined.'],
              ['4–6', 'Moderate', 'Present but uneven. Partial evidence; clear gaps.'],
              ['7–8', 'Strong', 'Solidly demonstrated. Coherent evidence; good, not exemplary.'],
              ['9–10', 'Outstanding', 'Exceptional and defensible. A reference case.'],
            ].map(([range, label, desc], i) => (
              <div
                key={label}
                className={
                  'p-5 ' +
                  (i < 3 ? 'border-b lg:border-b-0 lg:border-r border-dark ' : '') +
                  (i === 3 ? 'bg-dark text-cream' : 'bg-white')
                }
              >
                <div className="text-[11px] uppercase tracking-[0.12em] font-bold opacity-70 mb-2">
                  {range}
                </div>
                <div className="text-[24px] tracking-tight font-medium mb-2">
                  {label}
                </div>
                <div className="text-[13px] leading-[1.55]">{desc}</div>
              </div>
            ))}
          </div>
          <p className="text-[14px] leading-[1.6] text-muted mb-12 max-w-[800px]">
            A 10 is not a default. Please reserve it for work you'd point
            another practitioner toward as a model.
          </p>

          {/* 9 sub-criteria */}
          <h3 className="text-[22px] tracking-tight font-medium mb-6">
            The 9 sub-criteria.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-dark mb-12 print:break-inside-avoid">
            <CriteriaColumn
              category="Nature"
              items={[
                [
                  'Ecological regeneration',
                  'Does the project actively restore ecosystems, or just minimize harm? Look for measurable ecological outcomes, not intent.',
                ],
                [
                  'Human–Nature collaboration',
                  'Is non-human life treated as a partner, stakeholder, or substrate? Look for design choices that integrate ecological cycles, species, or bioregional logic.',
                ],
                [
                  'Long-term resilience',
                  'Will this still function in 10–20 years under climate, supply-chain, or political stress? Look for redundancy, local sourcing, adaptive design.',
                ],
              ]}
              borderRight
              borderBottomOnly
            />
            <CriteriaColumn
              category="Community"
              items={[
                [
                  'Inclusivity & equity',
                  'Who participates, who decides, who benefits? Look for evidence the project addresses power, access, and representation — not just headcount.',
                ],
                [
                  'Collective capacity building',
                  'Does the project leave the community more capable than it found it? Look for skills transfer, knowledge commons, durable infrastructure.',
                ],
                [
                  'Social cohesion & replicability',
                  'Does it strengthen local ties and can it be picked up elsewhere? Look for open documentation, transferable methods, network effects.',
                ],
              ]}
              borderRight
              borderBottomOnly
            />
            <CriteriaColumn
              category="Technology"
              items={[
                [
                  'Accessibility & openness',
                  'Is the tech open-source, low-cost, repairable, documented? Look for actual artifacts (repos, BOMs, guides), not claims.',
                ],
                [
                  'Facilitation of collective action',
                  'Does the tech enable groups to do things they couldn’t before? Tools that organize, coordinate, or distribute production score higher than tools that automate consumption.',
                ],
                [
                  'Scalability & adaptability',
                  'Can other contexts adopt or fork it? Modular, well-documented, and culturally portable solutions score higher.',
                ],
              ]}
              borderBottomOnly
            />
          </div>

          {/* Justifications */}
          <h3 className="text-[22px] tracking-tight font-medium mb-5">
            Justifications: why the 50-word floor.
          </h3>
          <div className="max-w-[800px] space-y-5 text-[15px] leading-[1.7] mb-12">
            <p>
              One mandatory justification per category, 50 words minimum each.
              The justification — not the number — is what survives into the
              jury online session. When three jurors disagree on a submission,
              the panel reads your text side by side. A score of 8 with{' '}
              <em>"strong project, well executed"</em> cannot be defended. A
              score of 8 with a sentence that names what's strong, points to
              the evidence, and notes the limitation that kept it from being a
              9 can.
            </p>
            <p>
              A defensible justification does three things: names the evidence
              you used (which part of the submission), connects it to the
              sub-criteria, and explains what kept the score from being higher
              or what pushed it to outstanding. There is no upper limit —
              please write more if the call needs more.
            </p>
          </div>

          {/* Nominations */}
          <h3 className="text-[22px] tracking-tight font-medium mb-5">
            The two optional nominations — please use sparingly.
          </h3>
          <div className="max-w-[800px] space-y-5 text-[15px] leading-[1.7]">
            <p>
              Both checkboxes sit below the scoring panel and are independent
              of your scores. They are{' '}
              <strong>
                <em>not</em> extra credit
              </strong>{' '}
              you should toggle on for strong submissions. Please only check
              them if the submission genuinely fits what each distinction is
              for. If you're unsure, leave them unchecked.
            </p>

            <NominationCard title="Overall Impact Award.">
              <p>
                A cross-category recognition for a submission whose strength
                is its <em>integration</em> across NATURE, COMMUNITY, and
                TECHNOLOGY — not a project that is excellent in one category
                and average in the others. Category winners are decided
                separately by category scores; Overall Impact is a distinct
                distinction decided at the online session from nomination
                tallies. Please tick this only when the project's coherence
                across the three dimensions is what makes it remarkable.
              </p>
            </NominationCard>

            <NominationCard title="Thomas Duggan Mention.">
              <p>
                A memorial distinction in memory of Thomas Duggan — an artist
                and multidisciplinary researcher from Plymouth, UK, a member
                of our community and an ambassador of the Fab City Global
                Initiative. The mention recognizes Arts & Design contribution
                to the Fab City vision. The prize is a series of mentoring
                sessions with Stephen Davies, director at{' '}
                <a
                  href="https://www.socialdesigns.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red font-bold underline underline-offset-2"
                >
                  Social Designs
                </a>{' '}
                and a unique voice in sustainable architecture and community
                development. Please tick this only for projects where Arts &
                Design is <em>the core contribution</em> — visual practice,
                design methodology, creative pedagogy, aesthetic intelligence
                applied to systems.
              </p>
            </NominationCard>

            <p>
              Nominations are a signal, not a vote. A small number of
              considered nominations per juror is more useful than a long
              list.
            </p>
          </div>
        </section>

        {/* ────────────── 03 FAQ ────────────── */}
        <section id="faq" className="mb-20 print:mb-12 scroll-mt-24">
          <SectionHeader number="03" title="FAQ." />

          <Faq q="I lost the email with my link.">
            <p>
              Please reply to Lucas at{' '}
              <Email>luc@fab.city</Email>. A fresh link is regenerated within
              the hour. No need to dig through spam first — asking is faster.
            </p>
          </Faq>

          <Faq q="My session expired or the login screen came back.">
            <p>
              Click your original magic link from the email — it re-issues a
              fresh 7-day session cookie. The link itself is valid for 30 days
              from when it was sent, which covers the entire evaluation
              window. If you still can't get in, please email Lucas with a
              screenshot.
            </p>
          </Faq>

          <Faq q="I'm getting a redirect loop, a blank page, or a login error.">
            <p>
              Please screenshot what you're seeing, note your browser and OS,
              and send to Lucas. Server logs will show what's happening within
              minutes. It helps if you don't keep retrying the link in the
              meantime — repeated clicks can rate-limit you.
            </p>
          </Faq>

          <Faq q="Can I save and continue later?">
            <p>
              Yes — that's the default. Autosave is automatic and continuous:
              scores save the moment you click them, text saves about 1.2
              seconds after you stop typing. There is no save button. Close
              the tab, close the laptop, log out — your draft is intact. Open
              the same submission later and you land exactly where you left
              off, scores and text and status all preserved.
            </p>
            <p>
              You can also score in any order, across any number of sessions,
              and revise scores and text as often as you want. Nothing locks
              until you click Submit Evaluation.
            </p>
          </Faq>

          <Faq q="Does it track my time?">
            <p>
              The app records <em>active</em> minutes on each submission — only
              when the tab is focused and you're not idle. It's for internal
              analytics on evaluation effort, not visible to you and not used
              to judge anything. Idle and background minutes don't count. Take
              breaks freely.
            </p>
          </Faq>

          <Faq q="I know the applicant or there's a conflict of interest.">
            <p>
              Please use the "Flag conflict of interest" button on the
              evaluation page. A modal asks for an optional reason. On
              confirm, the assignment leaves your dashboard and Josefina (
              <Email>josefina@fab.city</Email>) is notified to reassign within
              24 hours.
            </p>
            <p>
              Country conflicts were pre-cleared during assignment design — no
              juror reviews from their own country. Please flag for less
              obvious cases: past collaboration, mentorship, advisory role,
              family, employer, or anything that would make a third party
              question your independence.
            </p>
          </Faq>

          <Faq q="Can I see who else is reviewing this submission, or their scores?">
            <p>
              No, not during the evaluation window. Each submission is
              reviewed independently by three jurors from different countries.
              After June 7 the category averages and aggregated justifications
              inform the online session decision. Individual scores are not
              circulated.
            </p>
          </Faq>

          <Faq q="How long should one evaluation take?">
            <p>
              Plan around 30 minutes per evaluation. Reading the left pane in
              full is important — narrative, indicators, images, at least a
              skim of supporting PDFs, the teaser video if there is one. A
              rushed evaluation rarely produces a justification that holds up
              under the online session, so we'd rather you do fewer in deeper
              sessions than try to power through.
            </p>
          </Faq>

          <Faq q="Why one justification per category, not per sub-criterion?">
            <p>
              To encourage a holistic read of NATURE, COMMUNITY, and
              TECHNOLOGY rather than nine fragmented snippets. The three
              sub-scores per category should be legible in your justification,
              but the narrative is what we use downstream when scores need to
              be defended or compared.
            </p>
          </Faq>

          <Faq q="Can I edit a score or justification after submitting?">
            <p>
              Not from the interface — submission locks the evaluation. If
              you spot a genuine mistake before June 10, please email Josefina
              with the submission title and what to change; she can reopen
              it. After June 10 the data feeds the online session and changes
              are not accepted.
            </p>
          </Faq>

          <Faq q="Should I score on each submission's own merits, or compare across my batch?">
            <p>
              On its own merits, against the rubric. You're not ranking your
              4–5. Three different jurors review each submission and scores
              are averaged across the full pool — comparative ranking within
              your batch would distort the aggregate.
            </p>
          </Faq>

          <Faq q="Do I need to read every linked PDF and watch every full video?">
            <p>
              Please read the applicant's narrative in full. Skim supporting
              PDFs to spot evidence; full read only where it changes your
              score. Watch the teaser video. Full-length project videos are
              optional unless the narrative explicitly relies on them. We
              trust your judgment on depth.
            </p>
          </Faq>

          <Faq q="A submission is missing a video, an indicator value, or a referenced document.">
            <p>
              Completeness is part of what you're judging. A submission that
              doesn't explain one of the three categories, skips an indicator,
              or omits supporting material is by definition less complete
              than one that does — and your scoring can and should reflect
              that. Please note the gap in your justification ("evidence for
              X was not present in the submission") so the rationale is on
              the record.
            </p>
            <p>
              If something looks clearly broken on our side — a linked PDF
              returns a 404, an embed fails to load — please let Lucas know
              so we can verify it's not an app issue.
            </p>
          </Faq>

          <Faq q="What if I can't finish by June 10?">
            <p>
              Please contact Josefina and Lucas as soon as you know, not on
              June 9. The deadline is firm — the online session is calendared
              and depends on complete data — but if there's a real issue
              (illness, travel emergency), reach out early and we'll work it
              out. The one thing that's hard to recover from is silence late
              in the cycle.
            </p>
          </Faq>

          <Faq q="When are winners announced and what happens at the jury online session?">
            <p>
              Winners are announced publicly on 18th June. The jury online
              session is scheduled for early June by Josefina, who will send
              the calendar invite. Purpose of the call: review category
              averages, discuss Overall Impact and Thomas Duggan nominations,
              settle ties and close calls. Attendance is expected for all
              jurors.
            </p>
          </Faq>
        </section>

        {/* ────────────── 04 HELP ────────────── */}
        <section id="help" className="mb-12 scroll-mt-24">
          <SectionHeader number="04" title="Where to go for help." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-dark mb-10 print:break-inside-avoid">
            <ContactBlock
              name="Josefina Nano"
              email="josefina@fab.city"
              role="Conflicts of interest · reassignment requests · post-submission score corrections · online session logistics."
              border
            />
            <ContactBlock
              name="Lucas Marangoni"
              email="luc@fab.city"
              role="Login problems · magic-link reissues · broken pages · anything visibly wrong in the app."
            />
          </div>
          <p className="text-[14px] leading-[1.6] max-w-[680px] text-muted">
            Thank you for the time you're putting into this. We don't take it
            for granted — it's the level of involvement our Global Network
            brings to the Initiative, and it's part of what makes the Awards
            worth running.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-light-gray flex flex-wrap justify-between items-center gap-4 print:hidden">
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-bold">
            Fab City Awards 2026 · Jury Guide
          </div>
          <a
            href="/dashboard"
            className="text-[11px] uppercase tracking-[0.12em] font-bold text-red hover:underline"
          >
            ← Back to dashboard
          </a>
        </footer>
      </article>
    </main>
  );
}

/* ───────────── Internal building blocks ───────────── */

function SectionHeader({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="mb-10 print:mb-6">
      <div className="text-[11px] uppercase tracking-[0.12em] text-red font-bold mb-3">
        Section {number}
      </div>
      <h2 className="text-[40px] md:text-[50px] leading-[1] tracking-[-0.04em] font-medium">
        {title}
      </h2>
    </div>
  );
}

function Step({
  lead,
  children,
}: {
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <p className="text-[15px] leading-[1.7] mb-5 max-w-[800px]">
      <strong className="font-bold">{lead}</strong>
      {children}
    </p>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[13px] bg-light-gray px-1.5 py-0.5">
      {children}
    </code>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[10px] uppercase tracking-[0.1em] font-bold border border-dark px-1.5 py-0.5 align-middle">
      {children}
    </span>
  );
}

function Email({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={`mailto:${children}`}
      className="text-red font-bold underline underline-offset-2"
    >
      {children}
    </a>
  );
}

function CriteriaColumn({
  category,
  items,
  borderRight = false,
  borderBottomOnly = false,
}: {
  category: string;
  items: [string, string][];
  borderRight?: boolean;
  borderBottomOnly?: boolean;
}) {
  return (
    <div
      className={
        'p-6 ' +
        (borderRight ? 'md:border-r border-dark ' : '') +
        (borderBottomOnly ? 'border-b md:border-b-0 border-dark' : '')
      }
    >
      <div className="text-[11px] uppercase tracking-[0.12em] text-red font-bold mb-4">
        {category}
      </div>
      <div className="space-y-4">
        {items.map(([name, desc]) => (
          <div key={name}>
            <div className="text-[14px] font-bold mb-1 leading-snug">
              {name}
            </div>
            <div className="text-[13px] leading-[1.55] text-dark/80">
              {desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NominationCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-dark p-5 my-3 bg-white print:break-inside-avoid">
      <div className="text-[16px] font-bold tracking-tight mb-2.5">
        {title}
      </div>
      <div className="text-[14.5px] leading-[1.7] space-y-3">{children}</div>
    </div>
  );
}

function Faq({
  q,
  children,
}: {
  q: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-light-gray py-6 print:break-inside-avoid">
      <h3 className="text-[18px] font-bold tracking-tight mb-3 leading-snug">
        {q}
      </h3>
      <div className="text-[14.5px] leading-[1.7] max-w-[800px] space-y-3">
        {children}
      </div>
    </div>
  );
}

function ContactBlock({
  name,
  email,
  role,
  border = false,
}: {
  name: string;
  email: string;
  role: string;
  border?: boolean;
}) {
  return (
    <div className={'p-6 ' + (border ? 'border-b md:border-b-0 md:border-r border-dark' : '')}>
      <div className="text-[11px] uppercase tracking-[0.12em] text-red font-bold mb-2">
        Contact
      </div>
      <div className="text-[20px] font-medium tracking-tight mb-1">
        {name}
      </div>
      <a
        href={`mailto:${email}`}
        className="text-[14px] text-dark underline underline-offset-2 font-mono"
      >
        {email}
      </a>
      <div className="text-[13.5px] leading-[1.6] text-muted mt-3">
        {role}
      </div>
    </div>
  );
}
