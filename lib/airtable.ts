// Server-only Airtable REST client. Never imported by client components.
import 'server-only';
import type {
  Assignment,
  EvaluationDraft,
  EvaluationField,
  Evaluator,
  FullSubmission,
  Submission,
  SupportingDocItem,
  SupportingMediaItem,
} from './types';

const BASE = process.env.AIRTABLE_BASE_ID!;
const PAT = process.env.AIRTABLE_PAT!;

const T = {
  PEOPLE: 'tblFx6qsvMOxa1V9w',
  SUBMISSIONS: 'tblNyPS8xtNXsbEdN',
  EVALUATIONS: 'tblixrizbyYOxHTNH',
  ASSIGNMENTS: 'tbly6bFlk5hhqs2xN',
  EDITIONS: 'tblV8iUpYnt4FYald',
};

const F = {
  // People
  person_fullName: 'fld9CggbgiNbclyMN',
  person_email: 'fld74eZhvZoKMVPS1',
  person_territory: 'fldr3LYcNMaqtQX1Z',
  person_status: 'fldB3fx1xvNCpxTij',
  person_assignments: 'fldZik7EfzBF0v2LW',

  // Submissions — basic
  sub_title: 'fldgIqJS44xkmxgU1',
  sub_applicant: 'fld2AQFX9cSIYNUdT',
  sub_country: 'fldD8STV0iniZoGTt',
  sub_continent: 'fldf3yApntukq0OFw',
  sub_applicantType: 'fldj4rCasiR0foMHK',
  sub_context: 'fldj2ELbMxfBK8HCk',
  sub_stage: 'fldU5bSpB8fMA5u1G',
  sub_tagline: 'fldiIQh2LEO4EyYP3',
  sub_supportingMedia: 'fldn5xiCvSmzdKKG5',
  // Submissions — extended
  sub_role: 'fldlAhNfBCbFsjSrb',
  sub_profession: 'fldHqZbmysNSvKSf0',
  sub_orgName: 'fld1cGvAGdQheOtpm',
  sub_orgType: 'fldl4mxUikcnHrgQk',
  sub_city: 'fld3edOW7PJ7ieoIb',
  sub_initiationYear: 'fldOno1eGZfkV8X0r',
  sub_projectBrief: 'fld2JJka4tbuaFfUr',
  sub_nature: 'fld4CCdyrik28juLy',
  sub_communities: 'fldJbJVAehX51Cs5y',
  sub_technologies: 'fldkGji361pbreZsc',
  sub_whoInvolved: 'fld2pnHDlSbXsFBPt',
  sub_primaryBeneficiaries: 'fld3W4S1lVzRQ5to8',
  sub_outputsDelivered: 'fld0iu6MVk9gjDU2X',
  sub_keyOutputsDescription: 'fldtzgrHROZLP3MJS',
  sub_indicator1Name: 'fldnTsoIYPznF6fxZ',
  sub_indicator1Value: 'fld02iWmVmMPueaz9',
  sub_indicator1Unit: 'fldPkoHSQXeV9WnBO',
  sub_indicator1Timeframe: 'fldAWhtJPfTruoAiB',
  sub_indicator1Method: 'fldtutIliDnVg0v7z',
  sub_additionalIndicators: 'fldGF0PEGOUCq3Ues',
  sub_whatsNext: 'fldX46FuSdWI4SK0S',
  sub_techNeeds: 'fldlM8dWQ2vQlOWID',
  sub_techNeedsDesc: 'fldxWfOcWRUIhfeYd',
  sub_supportingDocs: 'fld2k5ZL2WUCWQ5R3',
  sub_projectTeaserVideo: 'fldjLRy0MSjbcf86C',
  sub_rawVideo: 'fldgVNRqZ2CXk6yMT',
  sub_projectWebsite: 'fld9qrJBexMH8juhb',
  sub_socialMedia: 'fldk7k1vvge1cFM6f',
  sub_externalValidation: 'fldrlkko0lGAnkX1A',
  sub_imageCredits: 'fldfEy513XcpobX16',

  // Assignments
  assign_id: 'fldFMuoH32r1dhhnd',
  assign_status: 'fldTIzWs3oXCGWvSB',
  assign_evaluator: 'fld86mrNHo5GMiKH8',
  assign_submission: 'fldtTA5lh5d549q4q',
  assign_edition: 'fldJpmHgyFVkzYRXY',
  assign_at: 'fldUI4j6QkjGbGf3u',
  assign_evaluation: 'fld3jJf4Y4ggkvM2P',
  assign_coiFlagged: 'fldDeiS4OU9iUOKGh',
  assign_coiReason: 'fldI37DRkAzTaHZrC',

  // Evaluations
  eval_juror: 'fldHv2tMGVHzv5SVR',
  eval_projectEvaluated: 'fldK1KuipP3lDyaeV',
  eval_edition: 'fldyBMY5N5bdPAngQ',
  eval_legacyEcosystems: 'fldxvb9OsdrTQ2H0O',
  eval_legacyCommunities: 'fldRHMAd2oURdCVEr',
  eval_legacyTechnologies: 'fldqJCnfxPKY5foTj',
  eval_nature1: 'fldf9P7sEPLBSQu72',
  eval_nature2: 'fldawNNgjflW4rR2t',
  eval_nature3: 'fldo2bpBWOL7YI549',
  eval_community1: 'fld9Scen0nNUbVWQF',
  eval_community2: 'fldOI1PO6ciXWaRsO',
  eval_community3: 'fldEzThCXhm1mxyhN',
  eval_technology1: 'fldrldB76XdvsSx7k',
  eval_technology2: 'fldLYCjhXzpHKb6FM',
  eval_technology3: 'fld6MHmlFPF3AFL9h',
  eval_justNature: 'fldYGfc93ShdoPNjr',
  eval_justCommunity: 'fld1fiESyroDRId0m',
  eval_justTechnology: 'fld6WUgE9JVOX4vBm',
  eval_overallComments: 'fldJmdHnhhfO0pSmC',
  eval_nominateOverallImpact: 'fldRvyNT4i5Pe7fLY',
  eval_nominateThomasDuggan: 'fldAaD9Wx7LLTsLu8',
  eval_status: 'fldZ789qW4yvMHaHd',
  eval_startedAt: 'fldt1n82ZT648DXGa',
  eval_submittedAt: 'fldA5wleuFCpLlWnX',
  eval_activeMinutes: 'fldSoKtgRWlIQWxhM',
};

export const EDITION_2026 = 'recRsptV4WR6XVaJK';

type AirtableRecord = {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
};

function withFieldIds(path: string): string {
  return path.includes('?')
    ? `${path}&returnFieldsByFieldId=true`
    : `${path}?returnFieldsByFieldId=true`;
}

async function airtableFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  if (!BASE || !PAT) {
    throw new Error(
      'Missing AIRTABLE_BASE_ID or AIRTABLE_PAT environment variables.'
    );
  }
  const url = `https://api.airtable.com/v0/${BASE}/${withFieldIds(path)}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${PAT}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    // Always fetch fresh from Airtable so saved evaluations show up
    // immediately when the juror reopens the page. Performance impact
    // is negligible at our scale (32 jurors).
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable ${res.status} on ${path}: ${body}`);
  }
  return res.json() as Promise<T>;
}

function selectName(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'name' in value) {
    return (value as { name: string }).name;
  }
  return null;
}

function selectNames(value: unknown): string[] {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => {
      if (typeof v === 'string') return v;
      if (v && typeof v === 'object' && 'name' in v) return String(v.name);
      return null;
    })
    .filter((v): v is string => !!v);
}

function firstAttachmentLargeUrl(value: unknown): string | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const a = value[0] as {
    thumbnails?: { large?: { url?: string }; full?: { url?: string } };
    url?: string;
  };
  return a.thumbnails?.large?.url ?? a.url ?? null;
}

function mapAttachments(value: unknown): SupportingMediaItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((a: any) => ({
    id: String(a.id ?? ''),
    url: String(a.url ?? ''),
    thumbnailUrl: a.thumbnails?.large?.url ?? a.url ?? '',
    filename: String(a.filename ?? 'attachment'),
    type: String(a.type ?? ''),
  }));
}

function mapDocs(value: unknown): SupportingDocItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((a: any) => ({
    id: String(a.id ?? ''),
    url: String(a.url ?? ''),
    filename: String(a.filename ?? 'document'),
    sizeBytes: Number(a.size ?? 0),
  }));
}

function arr(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

function str(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function num(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

function bool(value: unknown): boolean {
  return value === true;
}

async function fetchManyById(
  tableId: string,
  ids: string[]
): Promise<AirtableRecord[]> {
  if (ids.length === 0) return [];
  const out: AirtableRecord[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const formula = `OR(${batch.map((id) => `RECORD_ID()='${id}'`).join(',')})`;
    const params = new URLSearchParams({
      filterByFormula: formula,
      pageSize: '100',
    });
    const data = await airtableFetch<{ records: AirtableRecord[] }>(
      `${tableId}?${params}`
    );
    out.push(...data.records);
  }
  return out;
}

// -------------------- Evaluator --------------------

export async function getEvaluator(id: string): Promise<Evaluator | null> {
  try {
    const r = await airtableFetch<AirtableRecord>(`${T.PEOPLE}/${id}`);
    const f = r.fields;
    return {
      id: r.id,
      fullName: str(f[F.person_fullName]) ?? 'Evaluator',
      email: str(f[F.person_email]) ?? '',
      territory: str(f[F.person_territory]),
    };
  } catch (e) {
    console.error('getEvaluator failed', e);
    return null;
  }
}

// -------------------- Submission summary (for dashboard) --------------------

function mapSubmission(r: AirtableRecord): Submission {
  const f = r.fields;
  return {
    id: r.id,
    projectTitle: str(f[F.sub_title]) ?? 'Untitled',
    applicantName: str(f[F.sub_applicant]) ?? '',
    country: selectName(f[F.sub_country]),
    continent: selectName(f[F.sub_continent]),
    applicantType: selectName(f[F.sub_applicantType]),
    context: selectName(f[F.sub_context]),
    stage: selectName(f[F.sub_stage]),
    tagline: str(f[F.sub_tagline]),
    thumbnailUrl: firstAttachmentLargeUrl(f[F.sub_supportingMedia]),
  };
}

// -------------------- Submission full (for eval view) --------------------

export async function getFullSubmission(
  submissionId: string
): Promise<FullSubmission | null> {
  try {
    const r = await airtableFetch<AirtableRecord>(
      `${T.SUBMISSIONS}/${submissionId}`
    );
    const f = r.fields;
    return {
      id: r.id,
      projectTitle: str(f[F.sub_title]) ?? 'Untitled',
      tagline: str(f[F.sub_tagline]),
      applicantName: str(f[F.sub_applicant]) ?? '',
      role: str(f[F.sub_role]),
      profession: selectName(f[F.sub_profession]),
      organizationName: str(f[F.sub_orgName]),
      organizationType: selectName(f[F.sub_orgType]),
      applicantType: selectName(f[F.sub_applicantType]),
      city: str(f[F.sub_city]),
      country: selectName(f[F.sub_country]),
      continent: selectName(f[F.sub_continent]),
      context: selectName(f[F.sub_context]),
      stage: selectName(f[F.sub_stage]),
      initiatedYear: selectName(f[F.sub_initiationYear]),
      projectBrief: str(f[F.sub_projectBrief]),
      natureNarrative: str(f[F.sub_nature]),
      communitiesNarrative: str(f[F.sub_communities]),
      technologiesNarrative: str(f[F.sub_technologies]),
      whoInvolved: selectNames(f[F.sub_whoInvolved]),
      primaryBeneficiaries: str(f[F.sub_primaryBeneficiaries]),
      outputsDelivered: selectNames(f[F.sub_outputsDelivered]),
      keyOutputsDescription: str(f[F.sub_keyOutputsDescription]),
      indicator1Name: str(f[F.sub_indicator1Name]),
      indicator1Value: str(f[F.sub_indicator1Value]),
      indicator1Unit: str(f[F.sub_indicator1Unit]),
      indicator1Timeframe: str(f[F.sub_indicator1Timeframe]),
      indicator1Method: str(f[F.sub_indicator1Method]),
      additionalIndicators: str(f[F.sub_additionalIndicators]),
      whatsNext: str(f[F.sub_whatsNext]),
      techSupportNeeds: selectName(f[F.sub_techNeeds]),
      techNeedsDescription: str(f[F.sub_techNeedsDesc]),
      supportingMedia: mapAttachments(f[F.sub_supportingMedia]),
      supportingDocs: mapDocs(f[F.sub_supportingDocs]),
      projectTeaserVideo: str(f[F.sub_projectTeaserVideo]),
      rawVideo: str(f[F.sub_rawVideo]),
      projectWebsite: str(f[F.sub_projectWebsite]),
      socialMedia: str(f[F.sub_socialMedia]),
      externalValidation: str(f[F.sub_externalValidation]),
      imageCredits: str(f[F.sub_imageCredits]),
    };
  } catch (e) {
    console.error('getFullSubmission failed', e);
    return null;
  }
}

// -------------------- Assignments --------------------

export async function getAssignmentsForEvaluator(
  evaluatorId: string
): Promise<Assignment[]> {
  const person = await airtableFetch<AirtableRecord>(
    `${T.PEOPLE}/${evaluatorId}`
  );
  const assignmentIds = arr(person.fields[F.person_assignments]);
  if (assignmentIds.length === 0) return [];

  const allAssignments = await fetchManyById(T.ASSIGNMENTS, assignmentIds);
  const submissionIds = new Set<string>();
  const filtered: AirtableRecord[] = [];
  allAssignments.forEach((a) => {
    const editionLinks = arr(a.fields[F.assign_edition]);
    if (!editionLinks.includes(EDITION_2026)) return;
    filtered.push(a);
    arr(a.fields[F.assign_submission]).forEach((id) => submissionIds.add(id));
  });

  const submissionRecords = await fetchManyById(
    T.SUBMISSIONS,
    Array.from(submissionIds)
  );
  const submissionMap = new Map<string, Submission>();
  submissionRecords.forEach((r) => submissionMap.set(r.id, mapSubmission(r)));

  const result: Assignment[] = [];
  filtered.forEach((a) => {
    const subId = arr(a.fields[F.assign_submission])[0];
    if (!subId) return;
    const sub = submissionMap.get(subId);
    if (!sub) return;
    const status =
      (selectName(a.fields[F.assign_status]) as Assignment['status']) ??
      'Not started';
    // Hide COI-flagged + Reassigned from the evaluator's dashboard.
    // They still exist in Airtable for the Awards Lead to triage.
    if (status === 'COI flagged' || status === 'Reassigned') return;
    result.push({
      id: a.id,
      assignmentId: str(a.fields[F.assign_id]) ?? a.id,
      status,
      assignedAt: str(a.fields[F.assign_at]),
      submission: sub,
    });
  });
  return result;
}

// Flag this Assignment as a Conflict of Interest. The Awards Lead is
// alerted via the Airtable status field; an optional reason from the juror
// helps her triage the reassignment.
export async function flagAssignmentCOI(
  evaluatorId: string,
  assignmentId: string,
  reason: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const r = await airtableFetch<AirtableRecord>(
    `${T.ASSIGNMENTS}/${assignmentId}`
  );
  const evaluatorLinks = arr(r.fields[F.assign_evaluator]);
  if (!evaluatorLinks.includes(evaluatorId)) {
    return { ok: false, error: 'Not authorized to flag this assignment' };
  }
  const fields: Record<string, unknown> = {
    [F.assign_status]: 'COI flagged',
    [F.assign_coiFlagged]: true,
  };
  if (reason && reason.trim().length > 0) {
    fields[F.assign_coiReason] = reason.trim();
  }
  await airtableFetch(`${T.ASSIGNMENTS}/${assignmentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields, returnFieldsByFieldId: true }),
  });
  return { ok: true };
}

// Find the assignment for (evaluator, submission). Returns null if not authorized.
export async function getAssignmentForEvalAndSubmission(
  evaluatorId: string,
  submissionId: string
): Promise<AirtableRecord | null> {
  const person = await airtableFetch<AirtableRecord>(
    `${T.PEOPLE}/${evaluatorId}`
  );
  const assignmentIds = arr(person.fields[F.person_assignments]);
  if (assignmentIds.length === 0) return null;

  const all = await fetchManyById(T.ASSIGNMENTS, assignmentIds);
  return (
    all.find((a) => {
      const subs = arr(a.fields[F.assign_submission]);
      const eds = arr(a.fields[F.assign_edition]);
      return subs.includes(submissionId) && eds.includes(EDITION_2026);
    }) ?? null
  );
}

// -------------------- Evaluations --------------------

function mapEvaluation(r: AirtableRecord): EvaluationDraft {
  const f = r.fields;
  return {
    id: r.id,
    status: (selectName(f[F.eval_status]) as 'Draft' | 'Submitted') ?? 'Draft',
    startedAt: str(f[F.eval_startedAt]),
    submittedAt: str(f[F.eval_submittedAt]),
    scores: {
      nature1: num(f[F.eval_nature1]),
      nature2: num(f[F.eval_nature2]),
      nature3: num(f[F.eval_nature3]),
      community1: num(f[F.eval_community1]),
      community2: num(f[F.eval_community2]),
      community3: num(f[F.eval_community3]),
      technology1: num(f[F.eval_technology1]),
      technology2: num(f[F.eval_technology2]),
      technology3: num(f[F.eval_technology3]),
    },
    justifications: {
      nature: str(f[F.eval_justNature]) ?? '',
      community: str(f[F.eval_justCommunity]) ?? '',
      technology: str(f[F.eval_justTechnology]) ?? '',
    },
    overallComments: str(f[F.eval_overallComments]) ?? '',
    nominateOverallImpact: bool(f[F.eval_nominateOverallImpact]),
    nominateThomasDuggan: bool(f[F.eval_nominateThomasDuggan]),
  };
}

// Find or create the Evaluation row for this assignment.
// Side effect: if creating, also flips Assignment.Status to 'In progress'.
export async function getOrCreateEvaluation(
  evaluatorId: string,
  submissionId: string,
  assignment: AirtableRecord
): Promise<EvaluationDraft> {
  const existingIds = arr(assignment.fields[F.assign_evaluation]);
  if (existingIds.length > 0) {
    const r = await airtableFetch<AirtableRecord>(
      `${T.EVALUATIONS}/${existingIds[0]}`
    );
    return mapEvaluation(r);
  }

  // Create a fresh Evaluation
  const now = new Date().toISOString();
  const created = await airtableFetch<{ records: AirtableRecord[] }>(
    T.EVALUATIONS,
    {
      method: 'POST',
      body: JSON.stringify({
        records: [
          {
            fields: {
              [F.eval_juror]: [evaluatorId],
              [F.eval_projectEvaluated]: [submissionId],
              [F.eval_edition]: [EDITION_2026],
              [F.eval_status]: 'Draft',
              [F.eval_startedAt]: now,
            },
          },
        ],
        returnFieldsByFieldId: true,
      }),
    }
  );
  const newRecord = created.records[0];

  // Link it back to the Assignment and flip status to "In progress"
  const currentStatus = selectName(assignment.fields[F.assign_status]);
  const statusUpdate =
    currentStatus === 'Not started' ? 'In progress' : currentStatus;
  await airtableFetch(`${T.ASSIGNMENTS}/${assignment.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fields: {
        [F.assign_evaluation]: [newRecord.id],
        ...(statusUpdate ? { [F.assign_status]: statusUpdate } : {}),
      },
      returnFieldsByFieldId: true,
    }),
  });

  return mapEvaluation(newRecord);
}

const FIELD_MAP: Record<EvaluationField, string> = {
  nature1: F.eval_nature1,
  nature2: F.eval_nature2,
  nature3: F.eval_nature3,
  community1: F.eval_community1,
  community2: F.eval_community2,
  community3: F.eval_community3,
  technology1: F.eval_technology1,
  technology2: F.eval_technology2,
  technology3: F.eval_technology3,
  justNature: F.eval_justNature,
  justCommunity: F.eval_justCommunity,
  justTechnology: F.eval_justTechnology,
  overallComments: F.eval_overallComments,
  nominateOverallImpact: F.eval_nominateOverallImpact,
  nominateThomasDuggan: F.eval_nominateThomasDuggan,
};

// Update one field on the Evaluation. Used by the autosave endpoint.
export async function updateEvaluationField(
  evaluationId: string,
  evaluatorId: string,
  field: EvaluationField,
  value: number | string | boolean | null
): Promise<void> {
  // Ownership check: load and verify this evaluation belongs to the evaluator
  const r = await airtableFetch<AirtableRecord>(
    `${T.EVALUATIONS}/${evaluationId}`
  );
  const jurorLinks = arr(r.fields[F.eval_juror]);
  if (!jurorLinks.includes(evaluatorId)) {
    throw new Error('Forbidden: evaluation does not belong to this evaluator');
  }
  if (selectName(r.fields[F.eval_status]) === 'Submitted') {
    throw new Error('Cannot edit a Submitted evaluation');
  }

  const airtableField = FIELD_MAP[field];
  const update: Record<string, unknown> = { [airtableField]: value };

  // When sub-scores change, also recompute the legacy 3 fields so the
  // existing rollup chain (Results → Editions → Website) keeps working.
  if (field.startsWith('nature') || field.startsWith('community') || field.startsWith('technology')) {
    const next = { ...r.fields, [airtableField]: value };
    const natAvg = avgOrNull([
      num(next[F.eval_nature1]),
      num(next[F.eval_nature2]),
      num(next[F.eval_nature3]),
    ]);
    const comAvg = avgOrNull([
      num(next[F.eval_community1]),
      num(next[F.eval_community2]),
      num(next[F.eval_community3]),
    ]);
    const techAvg = avgOrNull([
      num(next[F.eval_technology1]),
      num(next[F.eval_technology2]),
      num(next[F.eval_technology3]),
    ]);
    if (natAvg !== null) update[F.eval_legacyEcosystems] = natAvg;
    if (comAvg !== null) update[F.eval_legacyCommunities] = comAvg;
    if (techAvg !== null) update[F.eval_legacyTechnologies] = techAvg;
  }

  await airtableFetch(`${T.EVALUATIONS}/${evaluationId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fields: update,
      returnFieldsByFieldId: true,
    }),
  });
}

function avgOrNull(vals: (number | null)[]): number | null {
  const filled = vals.filter((v): v is number => v !== null);
  if (filled.length === 0) return null;
  const sum = filled.reduce((a, b) => a + b, 0);
  return Math.round((sum / filled.length) * 100) / 100;
}

// Finalize submission. Validates all 9 scores + 3 justifications are filled.
// Sets Evaluation Status=Submitted and Submitted At=now.
// Updates linked Assignment Status to Submitted.
export async function submitEvaluation(
  evaluationId: string,
  evaluatorId: string,
  assignmentId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const r = await airtableFetch<AirtableRecord>(
    `${T.EVALUATIONS}/${evaluationId}`
  );
  const jurorLinks = arr(r.fields[F.eval_juror]);
  if (!jurorLinks.includes(evaluatorId)) {
    return { ok: false, error: 'Not authorized to submit this evaluation' };
  }
  if (selectName(r.fields[F.eval_status]) === 'Submitted') {
    return { ok: false, error: 'Evaluation already submitted' };
  }

  const scores = [
    num(r.fields[F.eval_nature1]),
    num(r.fields[F.eval_nature2]),
    num(r.fields[F.eval_nature3]),
    num(r.fields[F.eval_community1]),
    num(r.fields[F.eval_community2]),
    num(r.fields[F.eval_community3]),
    num(r.fields[F.eval_technology1]),
    num(r.fields[F.eval_technology2]),
    num(r.fields[F.eval_technology3]),
  ];
  if (scores.some((s) => s === null)) {
    return {
      ok: false,
      error: 'All 9 scores must be set before submitting',
    };
  }
  const justifications = [
    str(r.fields[F.eval_justNature]),
    str(r.fields[F.eval_justCommunity]),
    str(r.fields[F.eval_justTechnology]),
  ];
  if (justifications.some((j) => !j || wordCount(j) < 50)) {
    return {
      ok: false,
      error: 'Each category justification must be at least 50 words',
    };
  }

  const now = new Date().toISOString();
  await airtableFetch(`${T.EVALUATIONS}/${evaluationId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fields: {
        [F.eval_status]: 'Submitted',
        [F.eval_submittedAt]: now,
      },
      returnFieldsByFieldId: true,
    }),
  });

  // Mark the assignment as Submitted so the dashboard reflects it.
  await airtableFetch(`${T.ASSIGNMENTS}/${assignmentId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fields: { [F.assign_status]: 'Submitted' },
      returnFieldsByFieldId: true,
    }),
  });

  return { ok: true };
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}
