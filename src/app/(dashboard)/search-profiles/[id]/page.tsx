import { notFound } from "next/navigation";

import { ActivityFeed } from "@/components/activity/activity-feed";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { RunStatusBadge } from "@/components/ui/status-badge";
import { StartSearchRunButton } from "@/features/search-runs/start-search-run-button";
import { getAppContext } from "@/lib/db/app-store";
import { formatDate } from "@/lib/utils/dates";

const sourceLabels: Record<string, string> = {
  mock_stepstone: "Stepstone",
  mock_indeed: "Indeed",
  mock_linkedin_reference: "Linked",
};

export default async function SearchProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { repositories, services } = getAppContext();
  const profile = repositories.searchProfiles.findById(id);
  if (!profile) notFound();

  const runs = services.search.listRuns({ page: 1, pageSize: 20, profileId: id }).items;
  const logs = services.activityLogs.list({ entityType: "search_profile", entityId: id, pageSize: 20 }).items;

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader
        eyebrow="Search Profile Detail"
        title={profile.name}
        description={`${profile.targetRole} · ${profile.targetRegion}`}
        action={<StartSearchRunButton profileId={profile.id} />}
      />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Profilparameter</CardTitle>
              <CardDescription>Grundlage fuer den verifizierten Indeed Live Run.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-3 px-6 pb-6 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">Land:</span> {profile.targetCountry}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Branche:</span> {profile.industry}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Sprachen:</span> {profile.languages.join(", ")}
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.includeKeywords.map((keyword) => (
                <Badge key={keyword} variant="info">
                  {keyword}
                </Badge>
              ))}
            </div>
            <p>
              Erstellt am {formatDate(profile.createdAt)} · Profil-Portale:{" "}
              {profile.activeSources.map((source) => sourceLabels[source] ?? source).join(", ")}
            </p>
            <p>Live Search Actor: Indeed Live · misceres/indeed-scraper</p>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Indeed Live Payload</p>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Core</p>
                  <p className="mt-2 text-sm">Position: {profile.providerSettings?.indeed.position ?? "n/a"}</p>
                  <p className="text-sm">Location: {profile.providerSettings?.indeed.location ?? "n/a"}</p>
                  <p className="text-sm">Country: {profile.providerSettings?.indeed.country ?? "n/a"}</p>
                  <p className="text-sm">Limit: {profile.providerSettings?.indeed.maxItemsPerSearch ?? "n/a"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Flags</p>
                  <p className="mt-2 text-sm">
                    Company Details: {profile.providerSettings?.indeed.parseCompanyDetails ? "true" : "false"}
                  </p>
                  <p className="text-sm">
                    Unique Only: {profile.providerSettings?.indeed.saveOnlyUniqueItems ? "true" : "false"}
                  </p>
                  <p className="text-sm">
                    Follow Redirects: {profile.providerSettings?.indeed.followApplyRedirects ? "true" : "false"}
                  </p>
                  <p className="text-sm">
                    Start URLs: {profile.providerSettings?.indeed.startUrls.join(", ") || "[]"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Letzte Runs</CardTitle>
              <CardDescription>Historie der Indeed Live Suchlaeufe fuer dieses Profil.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-3 px-6 pb-6">
            {runs.map((run) => (
              <div key={run.id} className="rounded-3xl border border-slate-200 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">Indeed Live</p>
                    <p className="text-sm text-slate-500">
                      {run.resultCount} Imports · {run.datasetItemCount} Dataset-Items ·{" "}
                      {formatDate(run.runStartedAt, "dd.MM.yyyy HH:mm")}
                    </p>
                  </div>
                  <RunStatusBadge status={run.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <SectionHeader title="Aktivitaeten" />
      <ActivityFeed items={logs} />
    </div>
  );
}
