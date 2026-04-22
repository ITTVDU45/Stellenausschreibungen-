import {
  ApifyApiError as SDKApifyApiError,
  ApifyClient as SDKApifyClient,
  ActorListSortBy,
} from "apify-client";

import { getApifyConfig } from "@/lib/env/apify";

export interface ApifyUserMe {
  username?: string;
  email?: string;
}

export interface ApifyActorRun {
  id: string;
  status?: string | null;
  defaultDatasetId?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  actId?: string | null;
  usageTotalUsd?: number | null;
}

export interface ApifyActorListItem {
  id: string;
  name: string;
  username: string;
  slug: string;
  createdAt: string;
  modifiedAt: string;
  title?: string | null;
  description?: string | null;
  readmeSummary?: string | null;
  categories: string[];
  totalRuns?: number | null;
  totalUsers30Days?: number | null;
  totalUsers?: number | null;
  isPublic?: boolean;
}

export interface ApifyActorListOptions {
  ownedOnly?: boolean;
  limit?: number;
}

export class ApifyApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

export class ApifyClient {
  private readonly config = getApifyConfig();
  private readonly client: SDKApifyClient;

  constructor(client?: SDKApifyClient) {
    this.client =
      client ??
      new SDKApifyClient({
        token: this.config.apiToken ?? undefined,
        baseUrl: this.config.baseUrl,
      });
  }

  private mapErrorCode(status?: number) {
    switch (status) {
      case 400:
        return "APIFY_BAD_REQUEST";
      case 401:
        return "APIFY_UNAUTHORIZED";
      case 403:
        return "APIFY_FORBIDDEN";
      case 429:
        return "APIFY_RATE_LIMITED";
      case 500:
        return "APIFY_CONFIG_MISSING";
      default:
        return "APIFY_REQUEST_FAILED";
    }
  }

  private wrapError(error: unknown, fallbackMessage: string): ApifyApiError {
    if (error instanceof ApifyApiError) {
      return error;
    }

    if (error instanceof SDKApifyApiError) {
      return new ApifyApiError(
        error.message,
        error.statusCode ?? 500,
        this.mapErrorCode(error.statusCode),
        error,
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof (error as { statusCode?: unknown }).statusCode === "number"
    ) {
      const typedError = error as { statusCode: number; message?: unknown };
      const status = typedError.statusCode;
      const message =
        typeof typedError.message === "string" ? typedError.message : fallbackMessage;

      return new ApifyApiError(message, status, this.mapErrorCode(status), error);
    }

    if (error instanceof Error) {
      return new ApifyApiError(error.message || fallbackMessage, 500, "APIFY_REQUEST_FAILED", error);
    }

    return new ApifyApiError(fallbackMessage, 500, "APIFY_REQUEST_FAILED", error);
  }

  private ensureToken() {
    if (!this.config.apiToken) {
      throw new ApifyApiError("API-Token fehlt.", 500, "APIFY_CONFIG_MISSING");
    }
  }

  private async getActorDetails(reference: string): Promise<ApifyActorListItem | null> {
    try {
      const details = await this.client.actor(reference).get();
      if (!details) {
        return null;
      }

      return {
        id: details.id,
        name: details.name,
        username: details.username,
        slug: `${details.username}/${details.name}`,
        createdAt: new Date(details.createdAt).toISOString(),
        modifiedAt: new Date(details.modifiedAt).toISOString(),
        title: details.title ?? null,
        description: details.seoDescription ?? details.description ?? null,
        readmeSummary: details.readmeSummary ?? null,
        categories: details.categories ?? [],
        totalRuns: details.stats?.totalRuns ?? null,
        totalUsers30Days: details.stats?.totalUsers30Days ?? null,
        totalUsers: details.stats?.totalUsers ?? null,
        isPublic: details.isPublic,
      };
    } catch {
      return null;
    }
  }

  async verifyAccount(): Promise<{ data: ApifyUserMe }> {
    this.ensureToken();

    try {
      const user = await this.client.user("me").get();
      return {
        data: {
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      throw this.wrapError(error, "Account konnte nicht verifiziert werden.");
    }
  }

  async listActors(options?: ApifyActorListOptions): Promise<{ data: ApifyActorListItem[] }> {
    this.ensureToken();

    try {
      const previewItems: ApifyActorListItem[] = [];
      const limit = options?.limit ?? 50;

      for await (const actor of this.client.actors().list({
        my: options?.ownedOnly ? true : undefined,
        desc: true,
        sortBy: ActorListSortBy.LAST_RUN_STARTED_AT,
        limit,
      })) {
        previewItems.push({
          id: actor.id,
          name: actor.name,
          username: actor.username,
          slug: `${actor.username}/${actor.name}`,
          createdAt: new Date(actor.createdAt).toISOString(),
          modifiedAt: new Date(actor.modifiedAt).toISOString(),
          categories: [],
        });

        if (previewItems.length >= limit) {
          break;
        }
      }

      const detailedItems = await Promise.all(
        previewItems.map(async (actor) => (await this.getActorDetails(actor.slug)) ?? actor),
      );

      return { data: detailedItems };
    } catch (error) {
      throw this.wrapError(error, "Actoren konnten nicht geladen werden.");
    }
  }

  async getActorsByReferences(references: string[]): Promise<{ data: ApifyActorListItem[] }> {
    this.ensureToken();

    try {
      const items = await Promise.all(references.map((reference) => this.getActorDetails(reference)));
      return {
        data: items.filter((item): item is ApifyActorListItem => Boolean(item)),
      };
    } catch (error) {
      throw this.wrapError(error, "Kuratierte Actoren konnten nicht geladen werden.");
    }
  }

  async startActorRun(actorId: string, input: Record<string, unknown>): Promise<{ data: ApifyActorRun }> {
    this.ensureToken();

    try {
      const run = await this.client.actor(actorId).start(input);
      return {
        data: {
          id: run.id,
          status: run.status ?? null,
          defaultDatasetId: run.defaultDatasetId ?? null,
          startedAt: run.startedAt ? new Date(run.startedAt).toISOString() : null,
          finishedAt: run.finishedAt ? new Date(run.finishedAt).toISOString() : null,
          actId: run.actId ?? null,
          usageTotalUsd: typeof run.usageTotalUsd === "number" ? run.usageTotalUsd : null,
        },
      };
    } catch (error) {
      throw this.wrapError(error, "Actor konnte nicht gestartet werden.");
    }
  }

  async callActorAndWait(
    actorId: string,
    input: Record<string, unknown>,
    waitSecs = 180,
  ): Promise<{ data: ApifyActorRun }> {
    this.ensureToken();

    try {
      const run = await this.client.actor(actorId).call(input, { waitSecs });
      return {
        data: {
          id: run.id,
          status: run.status ?? null,
          defaultDatasetId: run.defaultDatasetId ?? null,
          startedAt: run.startedAt ? new Date(run.startedAt).toISOString() : null,
          finishedAt: run.finishedAt ? new Date(run.finishedAt).toISOString() : null,
          actId: run.actId ?? null,
          usageTotalUsd: typeof run.usageTotalUsd === "number" ? run.usageTotalUsd : null,
        },
      };
    } catch (error) {
      throw this.wrapError(error, "Actor konnte nicht synchron ausgefuehrt werden.");
    }
  }

  async getActorRun(runId: string): Promise<{ data: ApifyActorRun }> {
    this.ensureToken();

    try {
      const run = await this.client.run(runId).get();
      if (!run) {
        throw new ApifyApiError("Run nicht gefunden.", 404, "APIFY_REQUEST_FAILED");
      }

      return {
        data: {
          id: run.id,
          status: run.status ?? null,
          defaultDatasetId: run.defaultDatasetId ?? null,
          startedAt: run.startedAt ? new Date(run.startedAt).toISOString() : null,
          finishedAt: run.finishedAt ? new Date(run.finishedAt).toISOString() : null,
          actId: run.actId ?? null,
          usageTotalUsd: typeof run.usageTotalUsd === "number" ? run.usageTotalUsd : null,
        },
      };
    } catch (error) {
      throw this.wrapError(error, "Run konnte nicht geladen werden.");
    }
  }

  async getDatasetItems(datasetId: string, limit?: number, offset = 0) {
    this.ensureToken();

    try {
      const result = await this.client.dataset(datasetId).listItems({
        limit: limit ?? this.config.datasetLimitDefault,
        offset,
      });
      return result.items as Record<string, unknown>[];
    } catch (error) {
      throw this.wrapError(error, "Dataset-Abruf fehlgeschlagen.");
    }
  }

  async getRunLog(runId: string) {
    this.ensureToken();

    try {
      return await this.client.run(runId).log().get();
    } catch (error) {
      throw this.wrapError(error, "Log konnte nicht geladen werden.");
    }
  }
}
