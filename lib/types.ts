export type Evaluator = {
  id: string;
  fullName: string;
  email: string;
  territory: string | null;
};

export type Submission = {
  id: string;
  projectTitle: string;
  applicantName: string;
  country: string | null;
  continent: string | null;
  applicantType: string | null;
  context: string | null;
  stage: string | null;
  tagline: string | null;
  thumbnailUrl: string | null;
};

export type AssignmentStatus =
  | 'Not started'
  | 'In progress'
  | 'Submitted'
  | 'Reassigned'
  | 'COI flagged';

export type Assignment = {
  id: string;
  assignmentId: string;
  status: AssignmentStatus;
  assignedAt: string | null;
  submission: Submission;
};
