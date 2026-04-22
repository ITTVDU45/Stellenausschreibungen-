import { getAppContext } from "@/lib/db/app-store";
import { getApifyConfig } from "@/lib/env/apify";
import { ApifyClient } from "@/providers/apify/ApifyClient";

async function runDirectActorCheck() {
  const config = getApifyConfig();
  if (!config.apiToken) {
    return {
      ok: false,
      error: "APIFY_API_TOKEN fehlt.",
    };
  }

  const client = new ApifyClient();
  const input = {
    position: "LKW Fahrer",
    maxItemsPerSearch: 100,
    country: "DE",
    location: "Duisburg, Essen",
    parseCompanyDetails: true,
    saveOnlyUniqueItems: true,
    followApplyRedirects: true,
    startUrls: [],
  };

  const run = await client.callActorAndWait("hMvNSpz3JnHgl5jkh", input, 180);
  const datasetId = run.data.defaultDatasetId;
  const items = datasetId ? await client.getDatasetItems(datasetId, 100, 0) : [];

  return {
    ok: true,
    status: run.data.status,
    runId: run.data.id,
    datasetId,
    usageTotalUsd: run.data.usageTotalUsd ?? null,
    itemCount: items.length,
    sample: items.slice(0, 3).map((item) => ({
      title: item.title ?? item.jobTitle ?? item.positionName ?? item.position ?? null,
      company: item.companyName ?? item.company ?? null,
      location: item.location ?? item.jobLocation ?? item.city ?? null,
      url: item.url ?? item.sourceUrl ?? item.jobUrl ?? null,
    })),
  };
}

async function runAppFlowCheck() {
  const ctx = getAppContext();
  const profile = ctx.repositories.searchProfiles.findById("profile_relocation_blue_collar");

  if (!profile) {
    return {
      ok: false,
      error: "Profil profile_relocation_blue_collar nicht gefunden.",
    };
  }

  ctx.repositories.searchProfiles.update(profile.id, {
    name: "Indeed Test LKW Fahrer",
    targetRole: "LKW Fahrer",
    targetRegion: "Duisburg, Essen",
    targetCountry: "Germany",
    includeKeywords: ["LKW Fahrer"],
    activeSources: ["mock_indeed"],
    providerSettings: {
      ...profile.providerSettings,
      indeed: {
        position: "LKW Fahrer",
        maxItemsPerSearch: 100,
        country: "Germany",
        location: "Duisburg, Essen",
        parseCompanyDetails: true,
        saveOnlyUniqueItems: true,
        followApplyRedirects: true,
        startUrls: [],
      },
    },
  });

  const result = await ctx.services.search.startRun(profile.id);

  return {
    ok: true,
    runId: result?.run.id ?? null,
    status: result?.run.status ?? null,
    providerStatus: result?.run.providerStatus ?? null,
    resultCount: result?.run.resultCount ?? null,
    resultsImported: result?.run.resultsImported ?? null,
    usageTotalUsd: result?.run.usageTotalUsd ?? null,
    providerRuns: (result?.run.providerRuns ?? []).map((run) => ({
      actorReference: run.actorReference,
      providerRunId: run.providerRunId,
      providerDatasetId: run.providerDatasetId,
      providerStatus: run.providerStatus,
      usageTotalUsd: run.usageTotalUsd ?? null,
      errorMessage: run.errorMessage ?? null,
      inputPayload: run.inputPayload ?? null,
    })),
    importedCount: result?.importedJobs.length ?? 0,
    importedSample: (result?.importedJobs ?? []).slice(0, 3).map((job) => ({
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      providerName: job.providerName,
      isSeed: job.isSeed,
    })),
  };
}

async function main() {
  const direct = await runDirectActorCheck();
  const appFlow = await runAppFlowCheck();

  console.log(
    JSON.stringify(
      {
        direct,
        appFlow,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
        stack: error instanceof Error ? error.stack : null,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
