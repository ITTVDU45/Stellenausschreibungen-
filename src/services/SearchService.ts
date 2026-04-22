import type {
  SearchProvider,
  SearchProviderRunMeta,
  SearchProviderSearchInput,
} from "@/providers/contracts/SearchProvider";
import { EmployerService } from "@/services/EmployerService";
import { ActivityLogService } from "@/services/ActivityLogService";
import { JobRepository } from "@/repositories/job-repository";
import { SearchProfileRepository } from "@/repositories/search-profile-repository";
import { SearchRunRepository } from "@/repositories/search-run-repository";

export class SearchService {
  constructor(
    private readonly profiles: SearchProfileRepository,
    private readonly runs: SearchRunRepository,
    private readonly jobs: JobRepository,
    private readonly employers: EmployerService,
    private readonly activityLogs: ActivityLogService,
    private readonly provider: SearchProvider,
  ) {}

  private resolvePageSize(profileId: string) {
    const profile = this.profiles.findById(profileId);
    if (!profile) {
      return 50;
    }

    return Math.max(
      50,
      profile.providerSettings?.stepstone.limit ?? 50,
      profile.providerSettings?.indeed.maxItemsPerSearch ?? 50,
      profile.providerSettings?.linkedin.rows ?? 50,
    );
  }

  private buildSearchInput(profileId: string): SearchProviderSearchInput | null {
    const profile = this.profiles.findById(profileId);
    if (!profile) {
      return null;
    }

    return {
      profileId: profile.id,
      targetRole: profile.targetRole,
      targetRegion: profile.targetRegion,
      keywords: profile.includeKeywords,
      excludeKeywords: profile.excludeKeywords,
      languages: profile.languages,
      country: profile.targetCountry,
      industry: profile.industry,
      providerNames: profile.activeSources,
      providerSettings: profile.providerSettings,
      page: 1,
      pageSize: this.resolvePageSize(profileId),
    };
  }

  private toInternalStatus(meta: SearchProviderRunMeta) {
    return meta.providerStatus === "failed"
      ? "failed"
      : meta.providerStatus === "succeeded"
        ? "completed"
        : "running";
  }

  async startRun(profileId: string) {
    const profile = this.profiles.findById(profileId);
    const searchInput = this.buildSearchInput(profileId);
    if (!profile || !searchInput) {
      return null;
    }

    const run = this.runs.create({
      profileId: profile.id,
      providerName: this.provider.name,
      status: "queued",
    });

    try {
      const providerMeta = await this.provider.startRun(searchInput);
      const updatedRun = this.runs.update(run.id, {
        status: this.toInternalStatus(providerMeta),
        providerRunId: providerMeta.providerRunId,
        providerActorId: providerMeta.providerActorId,
        providerDatasetId: providerMeta.providerDatasetId,
        providerStatus: providerMeta.providerStatus,
        providerStartedAt: providerMeta.providerStartedAt,
        providerFinishedAt: providerMeta.providerFinishedAt,
        errorMessage: providerMeta.errorMessage,
        providerRuns: providerMeta.providerRuns ?? [],
        usageTotalUsd: providerMeta.usageTotalUsd ?? null,
        datasetItemCount: providerMeta.datasetItemCount ?? 0,
      });

      this.activityLogs.record("search_run", run.id, "search_run.started", {
        profileId: profile.id,
        providerName: this.provider.name,
        providerRunId: providerMeta.providerRunId,
      });

      if (providerMeta.providerStatus === "succeeded") {
        const detail = await this.pollRun(run.id);
        return detail ?? { run: updatedRun ?? run, importedJobs: [] };
      }

      return {
        run: updatedRun ?? run,
        importedJobs: [],
        datasetItemCount: updatedRun?.datasetItemCount ?? 0,
        importedCount: 0,
        inputPayload: updatedRun?.providerRuns?.[0]?.inputPayload ?? null,
        actorReference: updatedRun?.providerRuns?.[0]?.actorReference ?? null,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Search Run konnte nicht gestartet werden.";
      const failedRun = this.runs.update(run.id, {
        status: "failed",
        providerStatus: "failed",
        errorMessage: message,
        runFinishedAt: new Date().toISOString(),
      });

      this.activityLogs.record("search_run", run.id, "search_run.failed", {
        profileId: profile.id,
        errorMessage: message,
      });

      return {
        run: failedRun ?? run,
        importedJobs: [],
      };
    }
  }

  async pollRun(id: string) {
    const run = this.runs.findById(id);
    if (!run) {
      return null;
    }

    const searchInput = this.buildSearchInput(run.profileId);
    if (!searchInput) {
      return null;
    }

    try {
      const statusMeta = await this.provider.getRunStatus({
        providerRunId: run.providerRunId,
        providerActorId: run.providerActorId,
        providerDatasetId: run.providerDatasetId,
        providerStatus: run.providerStatus,
        providerStartedAt: run.providerStartedAt,
        providerFinishedAt: run.providerFinishedAt,
        errorMessage: run.errorMessage,
        providerRuns: run.providerRuns,
      });

      const updatedRun = this.runs.update(run.id, {
        status: this.toInternalStatus(statusMeta),
        providerRunId: statusMeta.providerRunId,
        providerActorId: statusMeta.providerActorId,
        providerDatasetId: statusMeta.providerDatasetId,
        providerStatus: statusMeta.providerStatus,
        providerStartedAt: statusMeta.providerStartedAt,
        providerFinishedAt: statusMeta.providerFinishedAt,
        lastPolledAt: new Date().toISOString(),
        errorMessage: statusMeta.errorMessage,
        providerRuns: statusMeta.providerRuns ?? run.providerRuns,
        usageTotalUsd: statusMeta.usageTotalUsd ?? run.usageTotalUsd ?? null,
        datasetItemCount: statusMeta.datasetItemCount ?? run.datasetItemCount ?? 0,
        runFinishedAt:
          statusMeta.providerStatus === "succeeded" || statusMeta.providerStatus === "failed"
            ? statusMeta.providerFinishedAt ?? new Date().toISOString()
            : null,
      });

      if (!updatedRun) {
        return null;
      }

      if (updatedRun.providerStatus !== "succeeded" || updatedRun.resultsImported) {
        if (updatedRun.providerStatus === "failed") {
          this.activityLogs.record("search_run", updatedRun.id, "search_run.failed", {
            errorMessage: updatedRun.errorMessage,
            providerRunId: updatedRun.providerRunId,
          });
        }

        return {
          run: updatedRun,
          importedJobs: this.jobs.findBySearchRunId(updatedRun.id),
          datasetItemCount: updatedRun.datasetItemCount ?? 0,
          importedCount: this.jobs.findBySearchRunId(updatedRun.id).length,
          inputPayload: updatedRun.providerRuns?.[0]?.inputPayload ?? null,
          actorReference: updatedRun.providerRuns?.[0]?.actorReference ?? null,
        };
      }

      const results = await this.provider.fetchResults(statusMeta, searchInput);
      const importedJobs = this.jobs.upsertMany(
        results.items.map((item) => {
          const employer = this.employers.ensureEmployer(item.companyName);
          const duplicates = this.jobs.findDuplicatesByHash(item.duplicateHash);

          return {
            searchRunId: updatedRun.id,
            isSeed: false,
            externalId: item.externalId,
            providerName: item.providerName,
            sourceUrl: item.sourceUrl,
            title: item.title,
            companyName: item.companyName,
            location: item.location,
            country: item.country,
            employmentType: item.employmentType,
            rawDescription: item.rawDescription,
            cleanDescription: null,
            publishedAt: item.publishedAt,
            importedAt: new Date().toISOString(),
            duplicateHash: item.duplicateHash,
            status: duplicates.length > 0 ? "duplicate_review" : "new",
            employerId: employer.id,
          };
        }),
      );

      const finishedRun = this.runs.update(updatedRun.id, {
        status: "completed",
        providerStatus: "succeeded",
        resultCount: importedJobs.length,
        runFinishedAt: new Date().toISOString(),
        resultsImported: true,
        usageTotalUsd: statusMeta.usageTotalUsd ?? updatedRun.usageTotalUsd ?? null,
        datasetItemCount: statusMeta.datasetItemCount ?? results.totalItems,
      });

      this.activityLogs.record("search_run", updatedRun.id, "search_run.completed", {
        profileId: updatedRun.profileId,
        importedCount: importedJobs.length,
        providerRunId: updatedRun.providerRunId,
        providerDatasetId: updatedRun.providerDatasetId,
      });

      importedJobs.forEach((job) => {
        this.activityLogs.record("job", job.id, "job.imported", {
          runId: updatedRun.id,
          providerName: job.providerName,
        });
      });

      return {
        run: finishedRun ?? updatedRun,
        importedJobs,
        datasetItemCount: finishedRun?.datasetItemCount ?? statusMeta.datasetItemCount ?? results.totalItems,
        importedCount: importedJobs.length,
        inputPayload: (finishedRun ?? updatedRun).providerRuns?.[0]?.inputPayload ?? null,
        actorReference: (finishedRun ?? updatedRun).providerRuns?.[0]?.actorReference ?? null,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Polling des Search Runs fehlgeschlagen.";
      const failedRun = this.runs.update(run.id, {
        status: "failed",
        providerStatus: "failed",
        lastPolledAt: new Date().toISOString(),
        errorMessage: message,
        runFinishedAt: new Date().toISOString(),
        usageTotalUsd: run.usageTotalUsd ?? null,
      });

      this.activityLogs.record("search_run", run.id, "search_run.failed", {
        errorMessage: message,
      });

      return {
        run: failedRun ?? run,
        importedJobs: this.jobs.findBySearchRunId(run.id),
        datasetItemCount: run.datasetItemCount ?? 0,
        importedCount: this.jobs.findBySearchRunId(run.id).length,
        inputPayload: run.providerRuns?.[0]?.inputPayload ?? null,
        actorReference: run.providerRuns?.[0]?.actorReference ?? null,
      };
    }
  }

  listRuns(params?: { page?: number; pageSize?: number; profileId?: string }) {
    return this.runs.list(params);
  }

  async getRunDetail(id: string) {
    const synced = await this.pollRun(id);
    const run = synced?.run ?? this.runs.findById(id);
    if (!run) {
      return null;
    }

    return {
      run,
      profile: this.profiles.findById(run.profileId),
      importedJobs: this.jobs.findBySearchRunId(run.id),
      providerRunId: run.providerRunId,
      providerDatasetId: run.providerDatasetId,
      providerStatus: run.providerStatus,
      lastPolledAt: run.lastPolledAt,
      errorMessage: run.errorMessage,
      resultsImported: run.resultsImported,
      datasetItemCount: run.datasetItemCount ?? 0,
      importedCount: this.jobs.findBySearchRunId(run.id).length,
      inputPayload: run.providerRuns?.[0]?.inputPayload ?? null,
      actorReference: run.providerRuns?.[0]?.actorReference ?? null,
    };
  }
}
