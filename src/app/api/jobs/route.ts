import { getAppContext } from "@/lib/db/app-store";
import { ok } from "@/lib/utils/responses";
import type { JobStatus } from "@/types/domain";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { repositories } = getAppContext();
  const status = url.searchParams.get("status") as JobStatus | null;
  const jobs = repositories.jobs.list({
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 24),
    query: url.searchParams.get("query") ?? undefined,
    providerName: url.searchParams.get("providerName") ?? undefined,
    country: url.searchParams.get("country") ?? undefined,
    status: status ?? undefined,
    companyName: url.searchParams.get("companyName") ?? undefined,
    minRelevanceScore: url.searchParams.get("minRelevanceScore")
      ? Number(url.searchParams.get("minRelevanceScore"))
      : undefined,
    includeSeed: url.searchParams.get("includeSeed") === "true",
  });

  return ok(jobs);
}
