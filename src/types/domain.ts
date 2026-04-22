export type EntityId = string;

export type Priority = "low" | "medium" | "high";
export type SearchRunStatus = "queued" | "running" | "completed" | "failed";
export type ProviderRunStatus = "queued" | "running" | "succeeded" | "failed";
export type JobStatus =
  | "new"
  | "reviewed"
  | "analyzed"
  | "shortlisted"
  | "outreach_draft"
  | "duplicate_review"
  | "archived";
export type ApprovalStatus = "draft" | "pending_review" | "approved" | "rejected";
export type SendStatus = "not_sent" | "queued" | "mock_sent" | "failed";
export type TemplateChannel = "email" | "linkedin" | "phone_followup";
export type ActivityEntityType =
  | "search_profile"
  | "search_run"
  | "job"
  | "job_analysis"
  | "employer"
  | "template"
  | "outreach_message"
  | "sync";

export interface ProviderRunRecord {
  actorReference: string;
  providerRunId: string | null;
  providerActorId: string | null;
  providerDatasetId: string | null;
  providerStatus: ProviderRunStatus;
  providerStartedAt: string | null;
  providerFinishedAt: string | null;
  errorMessage: string | null;
  usageTotalUsd: number | null;
  datasetItemCount?: number | null;
  inputPayload?: Record<string, unknown> | null;
}

export interface StepstoneProviderSettings {
  startUrls: string[];
  domain: string;
  queries: string[];
  location: string;
  distanceFromSource: string;
  workRemote: string[];
  applicationType: string[];
  listingLanguage: string[];
  workingHours: string[];
  employmentType: string[];
  experience: string[];
  publishedDate: string;
  limit: number;
}

export interface LinkedInProviderSettings {
  title: string;
  location: string;
  companyName: string[];
  companyId: string[];
  publishedAt: string;
  rows: number;
  workType: string;
  contractType: string;
  experienceLevel: string;
}

export interface IndeedProviderSettings {
  position: string;
  maxItemsPerSearch: number;
  country: string;
  location: string;
  startUrls: string[];
  parseCompanyDetails: boolean;
  saveOnlyUniqueItems: boolean;
  followApplyRedirects: boolean;
}

export interface SearchProfileProviderSettings {
  stepstone: StepstoneProviderSettings;
  linkedin: LinkedInProviderSettings;
  indeed: IndeedProviderSettings;
}

export interface SearchProfileRecord {
  id: EntityId;
  name: string;
  targetRole: string;
  targetRegion: string;
  targetCountry: string;
  includeKeywords: string[];
  excludeKeywords: string[];
  languages: string[];
  industry: string;
  priority: Priority;
  activeSources: string[];
  providerSettings: SearchProfileProviderSettings;
  active: boolean;
  createdAt: string;
}

export interface SearchRunRecord {
  id: EntityId;
  profileId: EntityId;
  providerName: string;
  runStartedAt: string;
  runFinishedAt: string | null;
  status: SearchRunStatus;
  resultCount: number;
  providerRunId: string | null;
  providerActorId: string | null;
  providerDatasetId: string | null;
  providerStatus: ProviderRunStatus;
  providerStartedAt: string | null;
  providerFinishedAt: string | null;
  lastPolledAt: string | null;
  errorMessage: string | null;
  resultsImported: boolean;
  providerRuns: ProviderRunRecord[];
  usageTotalUsd: number | null;
  datasetItemCount: number;
}

export interface JobRecord {
  id: EntityId;
  searchRunId: EntityId | null;
  isSeed: boolean;
  externalId: string;
  providerName: string;
  sourceUrl: string;
  title: string;
  companyName: string;
  location: string;
  country: string;
  employmentType: string | null;
  rawDescription: string;
  cleanDescription: string | null;
  publishedAt: string;
  importedAt: string;
  duplicateHash: string;
  status: JobStatus;
  employerId: EntityId | null;
}

export interface JobAnalysisRecord {
  id: EntityId;
  jobId: EntityId;
  summaryShort: string;
  summaryLong: string;
  extractedSkills: string[];
  extractedRequirements: string[];
  extractedLanguageRequirements: string[];
  visaHint: string;
  relocationHint: string;
  relevanceScore: number;
  confidenceScore: number;
}

export interface EmployerRecord {
  id: EntityId;
  companyName: string;
  website: string | null;
  careersUrl: string | null;
  contactEmail: string | null;
  phone: string | null;
  address: string | null;
  linkedinUrl: string | null;
  notes: string;
  completenessScore: number;
}

export interface EmployerContactRecord {
  id: EntityId;
  employerId: EntityId;
  fullName: string;
  role: string;
  email: string | null;
  phone: string | null;
  source: string;
  confidenceScore: number;
}

export interface TemplateRecord {
  id: EntityId;
  name: string;
  language: string;
  channel: TemplateChannel;
  subjectTemplate: string;
  bodyTemplate: string;
  active: boolean;
}

export interface OutreachMessageRecord {
  id: EntityId;
  jobId: EntityId;
  employerId: EntityId;
  contactId: EntityId | null;
  templateId: EntityId;
  generatedSubject: string;
  generatedBody: string;
  approvalStatus: ApprovalStatus;
  sendStatus: SendStatus;
  createdAt: string;
  sentAt: string | null;
  followUpAt: string | null;
}

export interface ActivityLogRecord {
  id: EntityId;
  entityType: ActivityEntityType;
  entityId: EntityId;
  action: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface AppDataSnapshot {
  searchProfiles: SearchProfileRecord[];
  searchRuns: SearchRunRecord[];
  jobs: JobRecord[];
  jobAnalyses: JobAnalysisRecord[];
  employers: EmployerRecord[];
  employerContacts: EmployerContactRecord[];
  templates: TemplateRecord[];
  outreachMessages: OutreachMessageRecord[];
  activityLogs: ActivityLogRecord[];
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ListResponse<T> {
  items: T[];
  pagination: PaginationMeta;
  meta?: Record<string, unknown>;
}
