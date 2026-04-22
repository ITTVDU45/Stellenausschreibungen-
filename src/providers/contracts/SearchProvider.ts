import type { ProviderRunStatus } from "@/types/domain";
import type { SearchProfileProviderSettings } from "@/types/domain";

export interface SearchProviderChildRunMeta {
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

export interface SearchProviderSearchInput {
  profileId: string;
  targetRole?: string;
  targetRegion?: string;
  keywords: string[];
  excludeKeywords: string[];
  languages?: string[];
  country?: string;
  industry?: string;
  providerNames?: string[];
  providerSettings?: SearchProfileProviderSettings;
  page?: number;
  pageSize?: number;
}

export interface SearchProviderJobResult {
  externalId: string;
  providerName: string;
  sourceUrl: string;
  title: string;
  companyName: string;
  location: string;
  country: string;
  employmentType: string | null;
  rawDescription: string;
  publishedAt: string;
  duplicateHash: string;
}

export interface SearchProviderSearchResult {
  items: SearchProviderJobResult[];
  totalItems: number;
  providerName: string;
  page: number;
  pageSize: number;
}

export interface SearchProviderRunMeta {
  providerRunId: string | null;
  providerActorId: string | null;
  providerDatasetId: string | null;
  providerStatus: ProviderRunStatus;
  providerStartedAt: string | null;
  providerFinishedAt: string | null;
  errorMessage: string | null;
  providerRuns?: SearchProviderChildRunMeta[];
  usageTotalUsd?: number | null;
  datasetItemCount?: number | null;
}

export interface SearchProvider {
  readonly name: string;
  startRun(input: SearchProviderSearchInput): Promise<SearchProviderRunMeta>;
  getRunStatus(meta: SearchProviderRunMeta): Promise<SearchProviderRunMeta>;
  fetchResults(
    meta: SearchProviderRunMeta,
    input: SearchProviderSearchInput,
  ): Promise<SearchProviderSearchResult>;
}
