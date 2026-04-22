import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { RunStatusBadge } from "@/components/ui/status-badge";
import { getAppContext } from "@/lib/db/app-store";
import { formatDate } from "@/lib/utils/dates";
import { formatApiCostEuro } from "@/lib/utils/format";

export default function SearchRunsPage() {
  const { services, repositories } = getAppContext();
  const runs = services.search.listRuns({ page: 1, pageSize: 50 }).items;
  const completedCostUsd = runs
    .filter((run) => run.status === "completed")
    .reduce((sum, run) => sum + (run.usageTotalUsd ?? 0), 0);

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader
        eyebrow="Search Runs"
        title="Suchlaeufe und Import-Historie"
        description={`Indeed Live Runs mit Provider-Status, Dataset-Items, Importen und bisherigen API Kosten (${formatApiCostEuro(completedCostUsd)}).`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="block space-y-2">
            <CardDescription>Abgeschlossene Runs</CardDescription>
            <CardTitle className="text-3xl">{runs.filter((run) => run.status === "completed").length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="block space-y-2">
            <CardDescription>API Kosten</CardDescription>
            <CardTitle className="text-3xl">{formatApiCostEuro(completedCostUsd)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="block space-y-2">
            <CardDescription>Runs mit Import</CardDescription>
            <CardTitle className="text-3xl">{runs.filter((run) => run.resultsImported).length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4">
        {runs.map((run) => {
          const profile = repositories.searchProfiles.findById(run.profileId);
          const providerRuns = run.providerRuns ?? [];
          return (
            <Link key={run.id} href={`/search-runs/${run.id}`}>
              <Card className="transition hover:-translate-y-0.5 hover:shadow-lg">
                <CardHeader>
                  <div>
                    <CardTitle>{profile?.name ?? "Unbekanntes Profil"}</CardTitle>
                    <CardDescription>
                      Indeed Live · {run.resultCount} Imports · {run.datasetItemCount} Dataset-Items ·{" "}
                      {formatDate(run.runStartedAt, "dd.MM.yyyy HH:mm")}
                    </CardDescription>
                    <p className="mt-2 text-sm text-slate-500">API Kosten: {formatApiCostEuro(run.usageTotalUsd)}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge
                        variant={
                          run.providerStatus === "succeeded"
                            ? "success"
                            : run.providerStatus === "failed"
                              ? "danger"
                              : "info"
                        }
                      >
                        Provider {run.providerStatus}
                      </Badge>
                      {run.resultsImported ? (
                        <Badge variant="success">Importiert</Badge>
                      ) : (
                        <Badge variant="warning">Import ausstehend</Badge>
                      )}
                      <Badge variant="neutral">{providerRuns.length} Actor</Badge>
                      <Badge variant="neutral">{run.datasetItemCount} Dataset-Items</Badge>
                    </div>
                  </div>
                  <RunStatusBadge status={run.status} />
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
