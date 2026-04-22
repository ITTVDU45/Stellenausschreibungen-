import type {
  ActivityLogRecord,
  ApprovalStatus,
  EmployerContactRecord,
  EmployerRecord,
  JobAnalysisRecord,
  JobRecord,
  JobStatus,
  ListResponse,
  OutreachMessageRecord,
  SearchProfileRecord,
  SearchRunRecord,
  SendStatus,
  TemplateRecord,
} from "@/types/domain";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export type SearchProfilesListDto = ListResponse<SearchProfileRecord>;
export type SearchRunsListDto = ListResponse<SearchRunRecord>;
export type JobsListDto = ListResponse<JobRecord>;
export type EmployersListDto = ListResponse<EmployerRecord>;
export type TemplatesListDto = ListResponse<TemplateRecord>;
export type OutreachListDto = ListResponse<OutreachMessageRecord>;
export type ActivityLogsListDto = ListResponse<ActivityLogRecord>;

export interface DashboardStatsDto {
  searchProfilesCount: number;
  jobsTotal: number;
  jobsNew: number;
  jobsAnalyzed: number;
  openOutreach: number;
  awaitingApproval: number;
  sentMessages: number;
  employersTotal: number;
  lastRuns: SearchRunRecord[];
  latestActivities: ActivityLogRecord[];
}

export interface JobDetailDto {
  job: JobRecord;
  analysis: JobAnalysisRecord | null;
  employer: EmployerRecord | null;
  contacts: EmployerContactRecord[];
  outreachMessages: OutreachMessageRecord[];
  activityLogs: ActivityLogRecord[];
}

export interface EmployerDetailDto {
  employer: EmployerRecord;
  contacts: EmployerContactRecord[];
  jobs: JobRecord[];
  activityLogs: ActivityLogRecord[];
}

export interface TemplateDetailDto {
  template: TemplateRecord;
  usageCount: number;
}

export interface OutreachDetailDto {
  outreachMessage: OutreachMessageRecord;
  job: JobRecord;
  employer: EmployerRecord | null;
  contact: EmployerContactRecord | null;
  template: TemplateRecord | null;
  activityLogs: ActivityLogRecord[];
}

export interface SearchRunDetailDto {
  run: SearchRunRecord;
  profile: SearchProfileRecord | null;
  importedJobs: JobRecord[];
  providerRunId: string | null;
  providerDatasetId: string | null;
  providerStatus: SearchRunRecord["providerStatus"];
  lastPolledAt: string | null;
  errorMessage: string | null;
  resultsImported: boolean;
  datasetItemCount: number;
  importedCount: number;
  inputPayload: Record<string, unknown> | null;
  actorReference: string | null;
}

export interface SyncPlaceholderResponse {
  accepted: boolean;
  provider: "mock_crm_sync";
  syncedAt: string;
  entityCount: number;
}

export interface ApifyVerifyDto {
  authenticated: boolean;
  username: string | null;
  actorConfigured: boolean;
}

export interface ApifyActorListItemDto {
  id: string;
  name: string;
  username: string;
  slug: string;
  createdAt: string;
  modifiedAt: string;
}

export interface ApifyActorsListDto {
  authenticated: boolean;
  ownedActors: ApifyActorListItemDto[];
  discoverActors: ApifyActorListItemDto[];
}

export interface UpdateJobStatusPayload {
  status: JobStatus;
}

export interface ApprovalPayload {
  approvalStatus: ApprovalStatus;
}

export interface SendPayload {
  sendStatus: SendStatus;
}
