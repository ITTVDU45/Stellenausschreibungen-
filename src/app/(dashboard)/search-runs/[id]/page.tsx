import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { JobStatusBadge, RunStatusBadge } from "@/components/ui/status-badge";
import { PollSearchRunButton } from "@/features/search-runs/poll-search-run-button";
import { getAppContext } from "@/lib/db/app-store";
import { formatDate } from "@/lib/utils/dates";
import { formatApiCostEuro } from "@/lib/utils/format";

function formatJson(value: unknown) {
  if (!value) {
    return "Kein Input gespeichert.";
  }

  return JSON.stringify(value, null, 2);
}

export default async function SearchRunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { services } = getAppContext();
  const detail = await services.search.getRunDetail(id);
  if (!detail) notFound();

  const providerRuns = detail.run.providerRuns ?? [];

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader
        eyebrow="Run Detail"
        title={detail.profile?.name ?? "Suchlauf"}
        description="Indeed Live"
        action={<PollSearchRunButton runId={detail.run.id} />}
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Run-Metadaten</CardTitle>
            <CardDescription>
              Start {formatDate(detail.run.runStartedAt, "dd.MM.yyyy HH:mm")} · Ende{" "}
              {formatDate(detail.run.runFinishedAt, "dd.MM.yyyy HH:mm")}
            </CardDescription>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                variant={
                  detail.providerStatus === "succeeded"
                    ? "success"
                    : detail.providerStatus === "failed"
                      ? "danger"
                      : "info"
                }
              >
                Provider {detail.providerStatus}
              </Badge>
              {detail.providerRunId ? <Badge variant="neutral">Run ID {detail.providerRunId}</Badge> : null}
              {detail.providerDatasetId ? <Badge variant="neutral">Dataset {detail.providerDatasetId}</Badge> : null}
              {detail.actorReference ? <Badge variant="neutral">Actor {detail.actorReference}</Badge> : null}
              <Badge variant="success">{detail.importedCount} Imports</Badge>
              <Badge variant="info">{detail.datasetItemCount} Dataset-Items</Badge>
              {detail.resultsImported ? (
                <Badge variant="success">Import abgeschlossen</Badge>
              ) : (
                <Badge variant="warning">Import ausstehend</Badge>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Letzter Poll: {formatDate(detail.lastPolledAt, "dd.MM.yyyy HH:mm")}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              API Kosten: {formatApiCostEuro(detail.run.usageTotalUsd)}
            </p>
            {detail.errorMessage ? <p className="mt-2 text-sm text-rose-600">{detail.errorMessage}</p> : null}
          </div>
          <RunStatusBadge status={detail.run.status} />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="block space-y-3">
          <div>
            <CardTitle>Gesendeter Live-Payload</CardTitle>
            <CardDescription>Der Payload entspricht dem erfolgreichen Terminal-Test fuer den Indeed Actor.</CardDescription>
          </div>
          <div className="overflow-x-auto rounded-2xl bg-slate-950 p-3">
            <pre className="text-xs leading-6 text-slate-100">{formatJson(detail.inputPayload)}</pre>
          </div>
        </CardHeader>
      </Card>

      {providerRuns.length > 0 ? (
        <Card>
          <CardHeader className="block space-y-3">
            <div>
              <CardTitle>Actor-Status</CardTitle>
              <CardDescription>Indeed Live Actor, Dataset-Zaehlung und API Kosten pro Lauf.</CardDescription>
            </div>
            <div className="grid gap-3">
              {providerRuns.map((providerRun) => (
                <div
                  key={`${providerRun.actorReference}-${providerRun.providerRunId ?? "no-run"}`}
                  className="rounded-3xl border border-slate-200 px-4 py-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <p className="font-medium text-slate-900">{providerRun.actorReference}</p>
                      <p className="text-sm text-slate-500">
                        Run {providerRun.providerRunId ?? "nicht gestartet"} · Dataset{" "}
                        {providerRun.providerDatasetId ?? "n/a"}
                      </p>
                      <p className="text-sm text-slate-500">
                        Dataset-Items: {providerRun.datasetItemCount ?? 0} · API Kosten:{" "}
                        {formatApiCostEuro(providerRun.usageTotalUsd)}
                      </p>
                      <div className="overflow-x-auto rounded-2xl bg-slate-950 p-3">
                        <pre className="text-xs leading-6 text-slate-100">
                          {formatJson(providerRun.inputPayload)}
                        </pre>
                      </div>
                      {providerRun.errorMessage ? (
                        <p className="text-sm text-rose-600">{providerRun.errorMessage}</p>
                      ) : null}
                    </div>
                    <Badge
                      variant={
                        providerRun.providerStatus === "succeeded"
                          ? "success"
                          : providerRun.providerStatus === "failed"
                            ? "danger"
                            : "info"
                      }
                    >
                      {providerRun.providerStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {detail.importedJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>
                  {job.companyName} · {job.location}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Indeed Live</Badge>
                <JobStatusBadge status={job.status} />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
