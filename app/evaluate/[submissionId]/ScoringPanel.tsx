'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { EvaluationDraft, EvaluationField } from '@/lib/types';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const CRITERIA = [
  {
    key: 'nature',
    label: 'It is about NATURE',
    sub: 'How the project works with nature and the more-than-human.',
    color: 'green',
    items: [
      {
        field: 'nature1',
        name: 'Ecological regeneration (33%)',
        desc:
          'Measurable impact on biodiversity, restoration of habitats, or strengthening of ecosystem services.',
      },
      {
        field: 'nature2',
        name: 'Human–Nature collaboration (33%)',
        desc:
          'How the project fosters collective stewardship, reciprocity, or cohabitation with more-than-human actors.',
      },
      {
        field: 'nature3',
        name: 'Long-term resilience (33%)',
        desc:
          'Potential for lasting ecological balance and capacity to adapt under changing environmental conditions.',
      },
    ],
  },
  {
    key: 'community',
    label: 'It is about COMMUNITY',
    sub: 'How people organize, participate, and build collective capacity.',
    color: 'gold',
    items: [
      {
        field: 'community1',
        name: 'Inclusivity & equity (33%)',
        desc: 'Extent to which diverse voices and marginalized groups are included and empowered.',
      },
      {
        field: 'community2',
        name: 'Collective capacity building (33%)',
        desc: 'How effectively the project strengthens community skills, knowledge, and ability to act together.',
      },
      {
        field: 'community3',
        name: 'Social cohesion & replicability (33%)',
        desc: 'Evidence of strengthened trust, solidarity, and the ability to replicate or inspire other communities.',
      },
    ],
  },
  {
    key: 'technology',
    label: 'It is about TECHNOLOGY',
    sub: 'How tools and platforms empower collaboration and scale impact.',
    color: 'blue',
    items: [
      {
        field: 'technology1',
        name: 'Accessibility & openness (33%)',
        desc: 'Degree to which the technology is open-source, affordable, and widely adoptable.',
      },
      {
        field: 'technology2',
        name: 'Facilitation of collective action (33%)',
        desc: 'How the technology enables collaboration, knowledge-sharing, or distributed production.',
      },
      {
        field: 'technology3',
        name: 'Scalability & adaptability (33%)',
        desc: 'Potential for the technology to grow across contexts while remaining adaptable to local needs.',
      },
    ],
  },
] as const;

function bandFor(n: number): 'weak' | 'moderate' | 'strong' | 'outstanding' {
  if (n <= 3) return 'weak';
  if (n <= 6) return 'moderate';
  if (n <= 8) return 'strong';
  return 'outstanding';
}

const BAND_BG: Record<string, string> = {
  weak: 'bg-[#B8000E] border-[#B8000E] text-white',
  moderate: 'bg-gold border-gold text-white',
  strong: 'bg-blue border-blue text-white',
  outstanding: 'bg-green border-green text-white',
};

export function ScoringPanel({
  evaluation,
  evaluationId,
  assignmentId,
}: {
  evaluation: EvaluationDraft;
  evaluationId: string;
  assignmentId: string;
}) {
  const router = useRouter();
  const [scores, setScores] = useState(evaluation.scores);
  const [justifications, setJustifications] = useState(evaluation.justifications);
  const [overallComments, setOverallComments] = useState(evaluation.overallComments);
  const [nominateOverall, setNominateOverall] = useState(evaluation.nominateOverallImpact);
  const [nominateThomas, setNominateThomas] = useState(evaluation.nominateThomasDuggan);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(evaluation.status === 'Submitted');
  const [coiOpen, setCoiOpen] = useState(false);
  const [coiReason, setCoiReason] = useState('');
  const [coiSubmitting, setCoiSubmitting] = useState(false);
  const [coiError, setCoiError] = useState<string | null>(null);

  const locked = submitted;

  async function save(field: EvaluationField, value: number | string | boolean | null) {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/evaluations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evaluationId, field, value }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      setSaveStatus('saved');
      setSavedAt(new Date());
    } catch (e) {
      console.error('save failed', e);
      setSaveStatus('error');
    }
  }

  // Debounce for textareas
  const textTimer = useRef<Record<string, NodeJS.Timeout | null>>({});
  function saveDebounced(field: EvaluationField, value: string, delay = 1200) {
    if (textTimer.current[field]) clearTimeout(textTimer.current[field]!);
    textTimer.current[field] = setTimeout(() => save(field, value), delay);
  }

  function pickScore(field: EvaluationField, value: number) {
    if (locked) return;
    setScores((prev) => ({ ...prev, [field]: value }));
    save(field, value);
  }

  function setJust(cat: 'nature' | 'community' | 'technology', value: string) {
    if (locked) return;
    setJustifications((prev) => ({ ...prev, [cat]: value }));
    const fieldMap = {
      nature: 'justNature',
      community: 'justCommunity',
      technology: 'justTechnology',
    } as const;
    saveDebounced(fieldMap[cat], value);
  }

  function setComments(value: string) {
    if (locked) return;
    setOverallComments(value);
    saveDebounced('overallComments', value);
  }

  function toggleOverall(checked: boolean) {
    if (locked) return;
    setNominateOverall(checked);
    save('nominateOverallImpact', checked);
  }

  function toggleThomas(checked: boolean) {
    if (locked) return;
    setNominateThomas(checked);
    save('nominateThomasDuggan', checked);
  }

  function openCOI() {
    setCoiError(null);
    setCoiReason('');
    setCoiOpen(true);
  }

  async function confirmCOI() {
    setCoiSubmitting(true);
    setCoiError(null);
    try {
      const res = await fetch('/api/assignments/coi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, reason: coiReason }),
      });
      const data = await res.json();
      if (!data.ok) {
        setCoiError(data.error || 'COI flag failed');
        setCoiSubmitting(false);
        return;
      }
      // Success — back to dashboard. The flagged assignment is filtered out
      // server-side so it won't appear there anymore.
      router.push('/dashboard');
    } catch (e) {
      setCoiError(e instanceof Error ? e.message : 'COI flag failed');
      setCoiSubmitting(false);
    }
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/evaluations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evaluationId, assignmentId }),
      });
      const data = await res.json();
      if (!data.ok) {
        setSubmitError(data.error || 'Submit failed');
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
      setSubmitting(false);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Submit failed');
      setSubmitting(false);
    }
  }

  // Validation for submit button
  const allScored = Object.values(scores).every((s) => s !== null);
  const allJustified = (['nature', 'community', 'technology'] as const).every(
    (c) => wordCount(justifications[c]) >= 50
  );
  const canSubmit = allScored && allJustified && !locked;

  const savedLabel =
    saveStatus === 'saving'
      ? 'Saving...'
      : saveStatus === 'saved' && savedAt
      ? `Draft saved · ${secondsAgo(savedAt)}`
      : saveStatus === 'error'
      ? 'Save error'
      : 'Autosave on';
  const savedDotColor =
    saveStatus === 'error'
      ? 'bg-red'
      : saveStatus === 'saving'
      ? 'bg-gold'
      : 'bg-green';

  if (submitted) {
    return (
      <div className="bg-white p-9 sticky top-[116px] self-start max-h-[calc(100vh-116px)] overflow-y-auto min-w-0">
        <div className="border border-green bg-cream p-6">
          <div className="w-12 h-12 bg-green text-white rounded-full flex items-center justify-center text-2xl mb-4">
            ✓
          </div>
          <h3 className="text-[20px] mb-2">Evaluation submitted</h3>
          <p className="text-[14px] text-muted mb-4">
            Your scores have been recorded. You can no longer edit this evaluation.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-red text-white font-bold uppercase tracking-wider text-[12px] py-3"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-9 sticky top-[116px] self-start max-h-[calc(100vh-116px)] overflow-y-auto min-w-0">
      <div className="flex justify-between items-center pb-4 mb-5 border-b-2 border-dark">
        <h3 className="text-[20px]">Score this submission</h3>
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] font-bold text-muted">
          <span className={'w-1.5 h-1.5 rounded-full ' + savedDotColor} />
          {savedLabel}
        </span>
      </div>

      <div className="bg-cream p-3.5 text-[12px] leading-snug mb-6 border-l-[3px] border-dark">
        <strong>1–10 scale, anchored in four bands.</strong>
        <br />
        1–3 Weak · 4–6 Moderate · 7–8 Strong · 9–10 Outstanding.
        <br />
        Score each of the 9 criteria, justify each category (min. 50 words).
        Scores auto-save as you click.
      </div>

      {CRITERIA.map((cat) => (
        <div
          key={cat.key}
          className="mb-8 pb-6 border-b border-light-gray last:border-b-0"
        >
          <h4
            className={
              'mb-4 flex items-center gap-2 text-[15px] uppercase tracking-[0.06em] font-bold ' +
              (cat.color === 'green'
                ? 'text-green'
                : cat.color === 'gold'
                ? 'text-gold'
                : 'text-blue')
            }
          >
            <span
              className={
                'w-2.5 h-2.5 ' +
                (cat.color === 'green'
                  ? 'bg-green'
                  : cat.color === 'gold'
                  ? 'bg-gold'
                  : 'bg-blue')
              }
            />
            {cat.label}
          </h4>
          <div className="text-[12px] text-muted italic mb-4">{cat.sub}</div>

          {cat.items.map((item) => {
            const selected = scores[item.field as keyof typeof scores];
            return (
              <div key={item.field} className="mb-5">
                <div className="text-[13px] font-bold mb-1">{item.name}</div>
                <div className="text-[11.5px] text-muted mb-2.5 leading-snug">
                  {item.desc}
                </div>
                <div className="grid grid-cols-10 gap-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                    const isSelected = selected === n;
                    const band = bandFor(n);
                    return (
                      <button
                        key={n}
                        onClick={() => pickScore(item.field as EvaluationField, n)}
                        disabled={locked}
                        className={
                          'py-2.5 border font-bold text-[13px] transition ' +
                          (isSelected
                            ? BAND_BG[band]
                            : 'border-dark bg-white hover:bg-cream') +
                          (locked ? ' cursor-not-allowed opacity-50' : '')
                        }
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-[3fr_3fr_2fr_2fr] gap-0.5 mt-1 text-[9.5px] uppercase tracking-[0.08em] font-bold">
                  <span className="text-center text-[#B8000E]">Weak</span>
                  <span className="text-center text-gold">Moderate</span>
                  <span className="text-center text-blue">Strong</span>
                  <span className="text-center text-green">Outstanding</span>
                </div>
              </div>
            );
          })}

          <Justification
            label={`Justification · ${cat.label.replace('It is about ', '')}`}
            value={justifications[cat.key as 'nature' | 'community' | 'technology']}
            onChange={(v) => setJust(cat.key as any, v)}
            disabled={locked}
          />
        </div>
      ))}

      {/* Nominations */}
      <div className="bg-cream p-5 mb-5 border border-dark">
        <div className="text-[11px] uppercase tracking-[0.1em] font-bold text-muted mb-3">
          Optional nominations
        </div>
        <label className="flex items-start gap-2.5 cursor-pointer mb-2.5">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 accent-red"
            checked={nominateOverall}
            onChange={(e) => toggleOverall(e.target.checked)}
            disabled={locked}
          />
          <div>
            <div className="text-[13px] font-bold">Nominate for Overall Impact Award</div>
            <div className="text-[11.5px] text-muted">
              Check only if this submission integrates NATURE, COMMUNITY and TECHNOLOGY exceptionally.
              Final selection is decided in the jury Zoom session — not scored separately.
            </div>
          </div>
        </label>
        <label className="flex items-start gap-2.5 cursor-pointer mt-3.5">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 accent-red"
            checked={nominateThomas}
            onChange={(e) => toggleThomas(e.target.checked)}
            disabled={locked}
          />
          <div>
            <div className="text-[13px] font-bold">Nominate for Thomas Duggan Mention</div>
            <div className="text-[11.5px] text-muted">
              A mention for Arts &amp; Design — considered, careful and thoughtful applications.
              Prize: mentoring sessions with Stephen Davies.
            </div>
          </div>
        </label>
      </div>

      <div className="mb-6">
        <label className="text-[11px] uppercase tracking-[0.08em] font-bold text-muted block mb-1.5">
          Overall comments (optional)
        </label>
        <textarea
          value={overallComments}
          onChange={(e) => setComments(e.target.value)}
          disabled={locked}
          className="w-full min-h-[80px] border border-dark p-2.5 text-[13px] leading-snug bg-white resize-y"
          placeholder="Any holistic observations, concerns, or context that doesn't fit above."
        />
      </div>

      {submitError && (
        <div className="border border-red text-red text-[13px] p-3 mb-4">
          {submitError}
        </div>
      )}

      {!canSubmit && !locked && (
        <div className="text-[11px] text-muted mb-3 leading-snug">
          To submit: all 9 scores set, each category justification ≥ 50 words.
        </div>
      )}

      <div className="flex gap-2 pt-5 border-t-2 border-dark">
        <button
          onClick={openCOI}
          disabled={locked}
          className="flex-1 py-3.5 px-5 border border-dark text-[12px] uppercase tracking-[0.06em] font-bold hover:bg-dark hover:text-cream disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Flag Conflict of Interest
        </button>
        <button
          onClick={submit}
          disabled={!canSubmit || submitting}
          className="flex-1 py-3.5 px-5 bg-red border border-red text-white text-[12px] uppercase tracking-[0.06em] font-bold hover:bg-dark hover:border-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit evaluation'}
        </button>
      </div>

      {coiOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 flex items-center justify-center p-6"
          onClick={() => !coiSubmitting && setCoiOpen(false)}
        >
          <div
            className="bg-cream max-w-xl w-full border-2 border-dark p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[11px] uppercase tracking-[0.12em] font-bold text-red mb-3">
              Confirm Conflict of Interest
            </div>
            <h2 className="text-[26px] leading-tight mb-4">
              You're about to flag this initiative as a Conflict of Interest.
            </h2>
            <div className="text-[14px] leading-relaxed mb-5">
              <p className="mb-3">
                If you confirm, the following will happen:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-3">
                <li>
                  <strong>This initiative will be removed from your dashboard</strong> immediately. You will not be expected to score it.
                </li>
                <li>
                  Any draft scores or notes you've already entered for it will be preserved in our records but will not be used in the final tally.
                </li>
                <li>
                  The Awards Lead, <strong>Josefina Nano</strong>, will be notified and will reassign the initiative to another juror to keep coverage at 3 evaluations.
                </li>
                <li>
                  She may reach out to you directly if she needs clarification.
                </li>
              </ul>
              <p>
                Per the Fab City Awards Confidentiality Policy, jurors are expected to flag a COI whenever they have a personal, professional, or financial relationship with an applicant — or any other reason that may compromise their impartiality.
              </p>
            </div>

            <label className="text-[11px] uppercase tracking-[0.08em] font-bold text-muted block mb-1.5">
              Reason (optional, but helpful for triage)
            </label>
            <textarea
              value={coiReason}
              onChange={(e) => setCoiReason(e.target.value)}
              disabled={coiSubmitting}
              className="w-full min-h-[80px] border border-dark p-2.5 text-[13px] leading-snug bg-white resize-y mb-4"
              placeholder="e.g., I am a board member of this organization, or I co-authored a publication with the applicant."
            />

            {coiError && (
              <div className="border border-red text-red text-[13px] p-3 mb-4">
                {coiError}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setCoiOpen(false)}
                disabled={coiSubmitting}
                className="flex-1 py-3 px-5 border border-dark text-[12px] uppercase tracking-[0.06em] font-bold hover:bg-dark hover:text-cream disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmCOI}
                disabled={coiSubmitting}
                className="flex-1 py-3 px-5 bg-red border border-red text-white text-[12px] uppercase tracking-[0.06em] font-bold hover:bg-dark hover:border-dark disabled:opacity-50"
              >
                {coiSubmitting ? 'Flagging...' : 'Yes, flag as COI'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Justification({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const words = wordCount(value);
  const remaining = Math.max(0, 50 - words);
  return (
    <div className="mt-3.5">
      <label className="text-[11px] uppercase tracking-[0.08em] font-bold text-muted block mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full min-h-[80px] border border-dark p-2.5 text-[13px] leading-snug bg-white resize-y focus:outline-none focus:border-red focus:border-2 focus:p-[9px]"
        placeholder="Minimum 50 words. Reference specific evidence from the submission."
      />
      <div className="text-[10px] text-muted text-right mt-1">
        {words} / 50 words
        {remaining > 0 ? (
          <span className="text-red"> · {remaining} more needed</span>
        ) : (
          <span className="text-green"> · complete</span>
        )}
      </div>
    </div>
  );
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function secondsAgo(d: Date): string {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s} sec ago`;
  const m = Math.floor(s / 60);
  return `${m} min ago`;
}
