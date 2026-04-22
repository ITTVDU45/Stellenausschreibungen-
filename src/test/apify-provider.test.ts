import { afterEach, describe, expect, it, vi } from "vitest";

import { ApifySearchProvider } from "@/providers/apify/ApifySearchProvider";
import type { SearchProviderRunMeta } from "@/providers/contracts/SearchProvider";

describe("ApifySearchProvider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mappt Search Input auf Actor-Run und Dataset-Ergebnisse", async () => {
    const provider = new ApifySearchProvider({
      callActorAndWait: vi.fn().mockResolvedValue({
        data: {
          id: "run_123",
          status: "SUCCEEDED",
          actId: "actor_1",
          defaultDatasetId: "dataset_1",
          startedAt: "2026-04-04T10:00:00.000Z",
          finishedAt: "2026-04-04T10:05:00.000Z",
        },
      }),
      getActorRun: vi.fn().mockResolvedValue({
        data: {
          id: "run_123",
          status: "SUCCEEDED",
          actId: "actor_1",
          defaultDatasetId: "dataset_1",
          startedAt: "2026-04-04T10:00:00.000Z",
          finishedAt: "2026-04-04T10:05:00.000Z",
        },
      }),
      getDatasetItems: vi.fn().mockResolvedValue([
        {
          title: "Senior Recruiter",
          companyName: "Acme GmbH",
          location: "Berlin",
          country: "Deutschland",
          sourceUrl: "https://example.com/job",
          description: "Recruiting und sourcing in Berlin",
          provider_name: "stepstone",
          publishedAt: "2026-04-04T10:00:00.000Z",
          external_id: "job_42",
        },
      ]),
    } as never, {
      apiToken: "test-token",
      actorId: "actor_1",
      baseUrl: "https://api.apify.com",
      datasetLimitDefault: 100,
    });

    const input = {
      profileId: "profile_1",
      targetRole: "Recruiter",
      targetRegion: "Berlin",
      keywords: ["recruiting"],
      excludeKeywords: [],
      languages: ["Deutsch"],
      country: "Deutschland",
      industry: "HR",
      providerNames: ["mock_stepstone"],
      page: 1,
      pageSize: 10,
    };

    const started = await provider.startRun(input);
    expect(started.providerRunId).toBe("run_123");
    expect(started.providerRuns?.length).toBeGreaterThan(0);

    const status = await provider.getRunStatus(started);
    expect(status.providerStatus).toBe("succeeded");

    const results = await provider.fetchResults(status as SearchProviderRunMeta, input);
    expect(results.items[0].title).toBe("Senior Recruiter");
    expect(results.items[0].providerName).toBe("mock_stepstone");
  });
});
