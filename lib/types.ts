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

export type SupportingMediaItem = {
  id: string;
  url: string;
  thumbnailUrl: string;
  filename: string;
  type: string;
};

export type SupportingDocItem = {
  id: string;
  url: string;
  filename: string;
  sizeBytes: number;
};

export type FullSubmission = {
  id: string;
  // identity
  projectTitle: string;
  tagline: string | null;
  applicantName: string;
  role: string | null;
  profession: string | null;
  organizationName: string | null;
  organizationType: string | null;
  applicantType: string | null;
  // location
  city: string | null;
  country: string | null;
  continent: string | null;
  context: string | null;
  stage: string | null;
  // initiative
  initiatedYear: string | null;
  // narratives
  projectBrief: string | null;
  natureNarrative: string | null;
  communitiesNarrative: string | null;
  technologiesNarrative: string | null;
  // people & reach
  whoInvolved: string[];
  primaryBeneficiaries: string | null;
  // outputs
  outputsDelivered: string[];
  keyOutputsDescription: string | null;
  // indicators
  indicator1Name: string | null;
  indicator1Value: string | null;
  indicator1Unit: string | null;
  indicator1Timeframe: string | null;
  indicator1Method: string | null;
  additionalIndicators: string | null;
  // future
  whatsNext: string | null;
  // tech needs
  techSupportNeeds: string | null;
  techNeedsDescription: string | null;
  // media
  supportingMedia: SupportingMediaItem[];
  supportingDocs: SupportingDocItem[];
  projectTeaserVideo: string | null;
  rawVideo: string | null;
  // links & validation
  projectWebsite: string | null;
  socialMedia: string | null;
  externalValidation: string | null;
  imageCredits: string | null;
};

export type EvaluationStatus = 'Draft' | 'Submitted';

export type EvaluationDraft = {
  id: string; // Airtable record ID for the Evaluation row
  status: EvaluationStatus;
  startedAt: string | null;
  submittedAt: string | null;
  scores: {
    nature1: number | null;
    nature2: number | null;
    nature3: number | null;
    community1: number | null;
    community2: number | null;
    community3: number | null;
    technology1: number | null;
    technology2: number | null;
    technology3: number | null;
  };
  justifications: {
    nature: string;
    community: string;
    technology: string;
  };
  overallComments: string;
  nominateOverallImpact: boolean;
  nominateThomasDuggan: boolean;
};

export type EvaluationField =
  | 'nature1'
  | 'nature2'
  | 'nature3'
  | 'community1'
  | 'community2'
  | 'community3'
  | 'technology1'
  | 'technology2'
  | 'technology3'
  | 'justNature'
  | 'justCommunity'
  | 'justTechnology'
  | 'overallComments'
  | 'nominateOverallImpact'
  | 'nominateThomasDuggan';
