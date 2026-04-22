import { describe, expect, it, vi } from "vitest";

import { ActivityLogRepository } from "@/repositories/activity-log-repository";
import { EmployerRepository } from "@/repositories/employer-repository";
import { JobRepository } from "@/repositories/job-repository";
import { SearchProfileRepository } from "@/repositories/search-profile-repository";
import { SearchRunRepository } from "@/repositories/search-run-repository";
import { ActivityLogService } from "@/services/ActivityLogService";
import { EmployerService } from "@/services/EmployerService";
import { SearchService } from "@/services/SearchService";
import { createSeedData } from "@/seed";

describe("SearchService", () => {
  it("importiert Ergebnisse genau einmal nach erfolgreichem Provider-Run", async () => {
    const state = createSeedData();
    const profiles = new SearchProfileRepository(state);
    const runs = new SearchRunRepository(state);
    const jobs = new JobRepository(state);
    const activityLogs = new ActivityLogService(new ActivityLogRepository(state));
    const employers = new EmployerService(new EmployerRepository(state), jobs, activityLogs);

    const provider = {
      name: "apify_actor",
      startRun: vi.fn().mockResolvedValue({
        providerRunId: "run_real",
        providerActorId: "actor_1",
        providerDatasetId: "dataset_1",
        providerStatus: "running",
        providerStartedAt: "2026-04-04T10:00:00.000Z",
        providerFinishedAt: null,
        errorMessage: null,
      }),
      getRunStatus: vi
        .fn()
        .mockResolvedValueOnce({
          providerRunId: "run_real",
          providerActorId: "actor_1",
          providerDatasetId: "dataset_1",
          providerStatus: "running",
          providerStartedAt: "2026-04-04T10:00:00.000Z",
          providerFinishedAt: null,
          errorMessage: null,
        })
        .mockResolvedValueOnce({
          providerRunId: "run_real",
          providerActorId: "actor_1",
          providerDatasetId: "dataset_1",
          providerStatus: "succeeded",
          providerStartedAt: "2026-04-04T10:00:00.000Z",
          providerFinishedAt: "2026-04-04T10:05:00.000Z",
          errorMessage: null,
        }),
      fetchResults: vi.fn().mockResolvedValue({
        items: [
          {
            externalId: "ext_1",
            providerName: "stepstone",
            sourceUrl: "https://example.com/job",
            title: "Recruiter",
            companyName: "Acme GmbH",
            location: "Berlin",
            country: "Deutschland",
            employmentType: "Vollzeit",
            rawDescription: "Recruiting in Berlin",
            publishedAt: "2026-04-04T10:00:00.000Z",
            duplicateHash: "recruiter-acme-berlin",
          },
        ],
        totalItems: 1,
        providerName: "apify_actor",
        page: 1,
        pageSize: 12,
      }),
    };

    const service = new SearchService(profiles, runs, jobs, employers, activityLogs, provider);
    const start = await service.startRun("profile_berlin_sales_ops");
    expect(start?.importedJobs).toHaveLength(0);

    const firstPoll = await service.pollRun(start!.run.id);
    expect(firstPoll?.run.resultsImported).toBe(false);

    const secondPoll = await service.pollRun(start!.run.id);
    expect(secondPoll?.run.resultsImported).toBe(true);
    expect(secondPoll?.importedJobs).toHaveLength(1);

    const thirdPoll = await service.pollRun(start!.run.id);
    expect(thirdPoll?.importedJobs).toHaveLength(1);
    expect(provider.fetchResults).toHaveBeenCalledTimes(1);
  });
});
