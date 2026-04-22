import { createId } from "@/lib/utils/id";
import { paginate } from "@/lib/utils/pagination";
import type { AppDataSnapshot, SearchRunRecord, SearchRunStatus } from "@/types/domain";
import type { SearchProviderRunMeta } from "@/providers/contracts/SearchProvider";

export interface CreateSearchRunInput {
  profileId: string;
  providerName: string;
  status: SearchRunStatus;
  providerMeta?: SearchProviderRunMeta;
}

export class SearchRunRepository {
  constructor(private readonly state: AppDataSnapshot) {}

  list(params?: { page?: number; pageSize?: number; profileId?: string }) {
    const items = [...this.state.searchRuns]
      .filter((run) => (params?.profileId ? run.profileId === params.profileId : true))
      .sort((a, b) => b.runStartedAt.localeCompare(a.runStartedAt));

    return paginate(items, params?.page, params?.pageSize ?? 10);
  }

  findById(id: string) {
    return this.state.searchRuns.find((run) => run.id === id) ?? null;
  }

  create(input: CreateSearchRunInput) {
    const run: SearchRunRecord = {
      id: createId("run"),
      profileId: input.profileId,
      providerName: input.providerName,
      status: input.status,
      resultCount: 0,
      runStartedAt: new Date().toISOString(),
      runFinishedAt: null,
      providerRunId: input.providerMeta?.providerRunId ?? null,
      providerActorId: input.providerMeta?.providerActorId ?? null,
      providerDatasetId: input.providerMeta?.providerDatasetId ?? null,
      providerStatus: input.providerMeta?.providerStatus ?? "queued",
      providerStartedAt: input.providerMeta?.providerStartedAt ?? null,
      providerFinishedAt: input.providerMeta?.providerFinishedAt ?? null,
      lastPolledAt: null,
      errorMessage: input.providerMeta?.errorMessage ?? null,
      resultsImported: false,
      providerRuns: input.providerMeta?.providerRuns ?? [],
      usageTotalUsd: input.providerMeta?.usageTotalUsd ?? null,
      datasetItemCount: input.providerMeta?.datasetItemCount ?? 0,
    };
    this.state.searchRuns.unshift(run);
    return run;
  }

  update(id: string, input: Partial<SearchRunRecord>) {
    const index = this.state.searchRuns.findIndex((run) => run.id === id);
    if (index < 0) {
      return null;
    }

    const updated = { ...this.state.searchRuns[index], ...input };
    this.state.searchRuns[index] = updated;
    return updated;
  }
}
