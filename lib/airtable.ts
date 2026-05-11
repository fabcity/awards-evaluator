// Server-only Airtable REST client. Never imported by client components.
import 'server-only';
import type { Assignment, Evaluator, Submission } from './types';

const BASE = process.env.AIRTABLE_BASE_ID!;
const PAT = process.env.AIRTABLE_PAT!;

const T = {
  PEOPLE: 'tblFx6qsvMOxa1V9w',
  SUBMISSIONS: 'tblNyPS8xtNXsbEdN',
  ASSIGNMENTS: 'tbly6bFlk5hhqs2xN',
  EDITIONS: 'tblV8iUpYnt4FYald',
};

const F = {
  // People
  person_fullName: 'fld9CggbgiNbclyMN',
  person_email: 'fld74eZhvZoKMVPS1',
  person_territory: 'fldr3LYcNMaqtQX1Z',
  person_status: 'fldB3fx1xvNCpxTij',
  person_assignments: 'fldZik7EfzBF0v2LW', // reverse link from Assignments.Evaluator

  // Submissions
  sub_title: 'fldgIqJS44xkmxgU1',
  sub_applicant: 'fld2AQFX9cSIYNUdT',
  sub_country: 'fldD8STV0iniZoGTt',
  sub_continent: 'fldf3yApntukq0OFw',
  sub_applicantType: 'fldj4rCasiR0foMHK',
  sub_context: 'fldj2ELbMxfBK8HCk',
  sub_stage: 'fldU5bSpB8fMA5u1G',
  sub_tagline: 'fldiIQh2LEO4EyYP3',
  sub_supportingMedia: 'fldn5xiCvSmzdKKG5',

  // Assignments
  assign_id: 'fldFMuoH32r1dhhnd',
  assign_status: 'fldTIzWs3oXCGWvSB',
  assign_evaluator: 'fld86mrNHo5GMiKH8',
  assign_submission: 'fldtTA5lh5d549q4q',
  assign_edition: 'fldJpmHgyFVkzYRXY',
  assign_at: 'fldUI4j6QkjGbGf3u',
};

export const EDITION_2026 = 'recRsptV4WR6XVaJK';

type AirtableRecord = {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
};

async function airtableFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  if (!BASE || !PAT) {
    throw new Error(
      'Missing AIRTABLE_BASE_ID or AIRTABLE_PAT environment variables.'
    );
  }
  const url = `https://api.airtable.com/v0/${BASE}/${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${PAT}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    // Cache reads for 60 seconds — well inside Airtable signed URL lifetime
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable ${res.status} on ${path}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// Helper to pull select option name (singleSelect returns {id, name, color})
function selectName(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'object' && value !== null && 'name' in value) {
    return (value as { name: string }).name;
  }
  return null;
}

function firstAttachmentLargeUrl(value: unknown): string | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const a = value[0] as {
    thumbnails?: { large?: { url?: string }; full?: { url?: string } };
    url?: string;
  };
  return a.thumbnails?.large?.url ?? a.url ?? null;
}

function arr(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

function str(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

// -------------------- Public API --------------------

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

export async function getSubmissionsByIds(
  ids: string[]
): Promise<Map<string, Submission>> {
  if (ids.length === 0) return new Map();
  // Batch in groups of 10 (Airtable URL length safe limit)
  const result = new Map<string, Submission>();
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const params = new URLSearchParams();
    batch.forEach((id) => params.append('records[]', id));
    const data = await airtableFetch<{ records: AirtableRecord[] }>(
      `${T.SUBMISSIONS}?${params}`
    );
    for (const r of data.records) {
      result.set(r.id, mapSubmission(r));
    }
  }
  return result;
}

export async function getAssignmentsForEvaluator(
  evaluatorId: string
): Promise<Assignment[]> {
  // Step 1: load the People record to get linked assignment IDs
  const person = await airtableFetch<AirtableRecord>(`${T.PEOPLE}/${evaluatorId}`);
  const assignmentIds = arr(person.fields[F.person_assignments]);
  if (assignmentIds.length === 0) return [];

  // Step 2: fetch the assignments
  const assignmentMap = new Map<string, AirtableRecord>();
  for (let i = 0; i < assignmentIds.length; i += 10) {
    const batch = assignmentIds.slice(i, i + 10);
    const params = new URLSearchParams();
    batch.forEach((id) => params.append('records[]', id));
    const data = await airtableFetch<{ records: AirtableRecord[] }>(
      `${T.ASSIGNMENTS}?${params}`
    );
    for (const r of data.records) {
      assignmentMap.set(r.id, r);
    }
  }

  // Step 3: filter to 2026 edition and collect linked submission IDs
  const submissionIds = new Set<string>();
  const filteredAssignments: AirtableRecord[] = [];
  Array.from(assignmentMap.values()).forEach((a) => {
    const editionLinks = arr(a.fields[F.assign_edition]);
    if (!editionLinks.includes(EDITION_2026)) return;
    filteredAssignments.push(a);
    const subLinks = arr(a.fields[F.assign_submission]);
    subLinks.forEach((id) => submissionIds.add(id));
  });

  // Step 4: batch-fetch submissions
  const submissions = await getSubmissionsByIds(Array.from(submissionIds));

  // Step 5: assemble
  const result: Assignment[] = [];
  for (const a of filteredAssignments) {
    const subId = arr(a.fields[F.assign_submission])[0];
    if (!subId) continue;
    const sub = submissions.get(subId);
    if (!sub) continue;
    result.push({
      id: a.id,
      assignmentId: str(a.fields[F.assign_id]) ?? a.id,
      status:
        (selectName(a.fields[F.assign_status]) as Assignment['status']) ??
        'Not started',
      assignedAt: str(a.fields[F.assign_at]),
      submission: sub,
    });
  }
  return result;
}
