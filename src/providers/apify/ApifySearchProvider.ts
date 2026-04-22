import { curatedApifyActors } from "@/lib/constants/apify-actors";
import { getApifyConfig } from "@/lib/env/apify";
import { ApifyClient } from "@/providers/apify/ApifyClient";
import { buildActorSpecificInput, mapApifyItemToSearchJob } from "@/providers/apify/apify-mapper";
import type {
  SearchProvider,
  SearchProviderChildRunMeta,
  SearchProviderRunMeta,
  SearchProviderSearchInput,
  SearchProviderSearchResult,
} from "@/providers/contracts/SearchProvider";

function mapApifyStatus(status?: string | null): SearchProviderRunMeta["providerStatus"] {
  switch (status) {
    case "RUNNING":
    case "READY":
      return "running";
    case "SUCCEEDED":
      return "succeeded";
    case "FAILED":
    case "ABORTED":
    case "TIMED-OUT":
      return "failed";
    default:
      return "queued";
  }
}

export class ApifySearchProvider implements SearchProvider {
  readonly name = "apify_actor";

  constructor(
    private readonly client = new ApifyClient(),
    private readonly config = getApifyConfig(),
  ) {}

  private getActors(input?: SearchProviderSearchInput) {
    const searchEnabledActors = curatedApifyActors.filter(
      (actor) => actor.enabledForSearch && !actor.requiresRental,
    );

    if (searchEnabledActors.length > 0) {
      return searchEnabledActors;
    }

    const selectedSources = new Set(input?.providerNames ?? []);
    const scopedActors = curatedApifyActors.filter((actor) => {
      if (actor.requiresRental) {
        return false;
      }

      if (selectedSources.size === 0) {
        return true;
      }

      return selectedSources.has(actor.source);
    });

    return scopedActors.length > 0 ? scopedActors : curatedApifyActors.filter((actor) => !actor.requiresRental);
  }

  private buildAggregateMeta(providerRuns: SearchProviderChildRunMeta[]): SearchProviderRunMeta {
    const successfulRuns = providerRuns.filter((run) => run.providerStatus === "succeeded");
    const failedRuns = providerRuns.filter((run) => run.providerStatus === "failed");
    const activeRuns = providerRuns.filter(
      (run) => run.providerStatus === "queued" || run.providerStatus === "running",
    );

    const providerStatus =
      activeRuns.length > 0
        ? "running"
        : successfulRuns.length > 0
          ? "succeeded"
          : failedRuns.length > 0
            ? "failed"
            : "queued";

    const startedAt =
      providerRuns
        .map((run) => run.providerStartedAt)
        .filter((value): value is string => Boolean(value))
        .sort()[0] ?? null;

    const finishedAt =
      providerRuns
        .map((run) => run.providerFinishedAt)
        .filter((value): value is string => Boolean(value))
        .sort()
        .at(-1) ?? null;

    const representativeRun =
      successfulRuns[0] ??
      providerRuns.find((run) => Boolean(run.providerRunId)) ??
      providerRuns[0] ??
      null;
    const errorMessage =
      failedRuns.length > 0
        ? failedRuns.map((run) => `${run.actorReference}: ${run.errorMessage ?? "fehlgeschlagen"}`).join(" | ")
        : null;

    return {
      providerRunId: representativeRun?.providerRunId ?? null,
      providerActorId: representativeRun?.providerActorId ?? null,
      providerDatasetId: representativeRun?.providerDatasetId ?? null,
      providerStatus,
      providerStartedAt: startedAt,
      providerFinishedAt: finishedAt,
      errorMessage,
      providerRuns,
      usageTotalUsd: providerRuns.reduce((sum, run) => sum + (run.usageTotalUsd ?? 0), 0),
      datasetItemCount: providerRuns.reduce((sum, run) => sum + (run.datasetItemCount ?? 0), 0),
    };
  }

  async startRun(input: SearchProviderSearchInput): Promise<SearchProviderRunMeta> {
    const actors = this.getActors(input);

    const providerRuns = await Promise.all(
      actors.map(async (actor) => {
        const actorReference = actor.reference;
        const actorInput = buildActorSpecificInput(actorReference, input);
        if (!actorInput.supported) {
          return {
            actorReference,
            providerRunId: null,
            providerActorId: actorReference,
            providerDatasetId: null,
            providerStatus: "failed",
            providerStartedAt: new Date().toISOString(),
            providerFinishedAt: new Date().toISOString(),
            errorMessage: actorInput.reason,
            usageTotalUsd: null,
            datasetItemCount: 0,
            inputPayload: null,
          } satisfies SearchProviderChildRunMeta;
        }

        try {
          const response = await this.client.callActorAndWait(actorReference, actorInput.payload, 180);
          const run = response.data;
          const datasetItems = run.defaultDatasetId
            ? await this.client.getDatasetItems(run.defaultDatasetId, this.config.datasetLimitDefault, 0)
            : [];

          return {
            actorReference,
            providerRunId: run.id,
            providerActorId: run.actId ?? actorReference,
            providerDatasetId: run.defaultDatasetId ?? null,
            providerStatus: mapApifyStatus(run.status),
            providerStartedAt: run.startedAt ?? new Date().toISOString(),
            providerFinishedAt: run.finishedAt ?? null,
            errorMessage: null,
            usageTotalUsd: run.usageTotalUsd ?? null,
            datasetItemCount: datasetItems.length,
            inputPayload: actorInput.payload,
          } satisfies SearchProviderChildRunMeta;
        } catch (error) {
          return {
            actorReference,
            providerRunId: null,
            providerActorId: actorReference,
            providerDatasetId: null,
            providerStatus: "failed",
            providerStartedAt: new Date().toISOString(),
            providerFinishedAt: new Date().toISOString(),
            errorMessage: error instanceof Error ? error.message : "Actor konnte nicht gestartet werden.",
            usageTotalUsd: null,
            datasetItemCount: 0,
            inputPayload: actorInput.payload,
          } satisfies SearchProviderChildRunMeta;
        }
      }),
    );

    return this.buildAggregateMeta(providerRuns);
  }

  async getRunStatus(meta: SearchProviderRunMeta): Promise<SearchProviderRunMeta> {
    if (!meta.providerRuns?.length) {
      throw new Error("providerRuns fehlen fuer die Provider-Statusabfrage.");
    }

    const providerRuns = await Promise.all(
      meta.providerRuns.map(async (childRun) => {
        if (!childRun.providerRunId || childRun.providerStatus === "failed" || childRun.providerStatus === "succeeded") {
          return childRun;
        }

        try {
          const response = await this.client.getActorRun(childRun.providerRunId);
          const run = response.data;

          return {
            actorReference: childRun.actorReference,
            providerRunId: run.id,
            providerActorId: run.actId ?? childRun.providerActorId ?? childRun.actorReference,
            providerDatasetId: run.defaultDatasetId ?? childRun.providerDatasetId,
            providerStatus: mapApifyStatus(run.status),
            providerStartedAt: run.startedAt ?? childRun.providerStartedAt,
            providerFinishedAt: run.finishedAt ?? childRun.providerFinishedAt,
            errorMessage: null,
            usageTotalUsd: run.usageTotalUsd ?? childRun.usageTotalUsd ?? null,
            datasetItemCount: childRun.datasetItemCount ?? null,
            inputPayload: childRun.inputPayload ?? null,
          } satisfies SearchProviderChildRunMeta;
        } catch (error) {
          return {
            ...childRun,
            providerStatus: "failed",
            providerFinishedAt: new Date().toISOString(),
            errorMessage: error instanceof Error ? error.message : "Statusabfrage fehlgeschlagen.",
            usageTotalUsd: childRun.usageTotalUsd ?? null,
          } satisfies SearchProviderChildRunMeta;
        }
      }),
    );

    return this.buildAggregateMeta(providerRuns);
  }

  async fetchResults(
    meta: SearchProviderRunMeta,
    input: SearchProviderSearchInput,
  ): Promise<SearchProviderSearchResult> {
    if (!meta.providerRuns?.length) {
      throw new Error("providerRuns fehlen fuer den Dataset-Abruf.");
    }

    const datasetResponses = await Promise.all(
      meta.providerRuns
        .filter((run) => run.providerStatus === "succeeded" && run.providerDatasetId)
        .map(async (run) => ({
          actorReference: run.actorReference,
          items: await this.client.getDatasetItems(
            run.providerDatasetId!,
            input.pageSize ?? this.config.datasetLimitDefault,
            Math.max(0, ((input.page ?? 1) - 1) * (input.pageSize ?? this.config.datasetLimitDefault)),
          ),
        })),
    );

    const normalized = datasetResponses.flatMap((response) =>
      response.items.map((item) => mapApifyItemToSearchJob(item, input)),
    );

    return {
      items: normalized,
      totalItems: normalized.length,
      providerName: this.name,
      page: input.page ?? 1,
      pageSize: input.pageSize ?? this.config.datasetLimitDefault,
    };
  }
}
