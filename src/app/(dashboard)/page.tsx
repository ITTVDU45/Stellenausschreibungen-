import Link from "next/link";
import { Activity, ArrowRight, Briefcase, Building2, Mail, Search, Sparkles } from "lucide-react";

import { ActivityFeed } from "@/components/activity/activity-feed";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { RunStatusBadge } from "@/components/ui/status-badge";
import { getAppContext } from "@/lib/db/app-store";
import { formatRelative } from "@/lib/utils/dates";

export default function DashboardPage() {
  const { services } = getAppContext();
  const stats = services.dashboard.getStats();

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader
        eyebrow="Dashboard"
        title="Pipeline, Review-Queue und aktuelle Suchläufe"
        description="Schneller Überblick über Suchprofile, Jobs, Analyseabdeckung und offene Outreach-Aktivitäten."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Suchprofile" value={stats.searchProfilesCount} hint="aktive Suchlogik im MVP" icon={<Search className="h-5 w-5" />} />
        <StatCard title="Jobs gesamt" value={stats.jobsTotal} hint={`${stats.jobsNew} neu seit letztem Review`} icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="Outreach offen" value={stats.openOutreach} hint={`${stats.awaitingApproval} warten auf Freigabe`} icon={<Mail className="h-5 w-5" />} />
        <StatCard title="Arbeitgeber" value={stats.employersTotal} hint={`${stats.sentMessages} mock-versendete Nachrichten`} icon={<Building2 className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <div>
              <CardDescription>Quick Actions</CardDescription>
              <CardTitle className="mt-1 text-2xl">Nächste Schritte im Team</CardTitle>
            </div>
            <Sparkles className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/search-profiles/new", label: "Neues Suchprofil anlegen" },
              { href: "/jobs", label: "Jobliste priorisieren" },
              { href: "/templates/new", label: "Neue Vorlage erstellen" },
              { href: "/outreach", label: "Review-Queue öffnen" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                <span>{item.label}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardDescription>Review Fokus</CardDescription>
              <CardTitle className="mt-1 text-2xl">Offene Punkte</CardTitle>
            </div>
            <Activity className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <div className="space-y-3 text-sm text-slate-600">
            <p>{stats.awaitingApproval} Nachrichten warten auf Freigabe.</p>
            <p>{stats.jobsNew} Jobs haben noch keinen finalen Review-Status.</p>
            <p>{stats.jobsAnalyzed} Jobs sind bereits analysiert und scoring-ready.</p>
            <Link href="/outreach" className={`${buttonVariants()} w-full`}>
              Zur Review-Queue
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <div>
              <CardDescription>Letzte Suchläufe</CardDescription>
              <CardTitle className="mt-1 text-2xl">Mock-Provider Aktivität</CardTitle>
            </div>
          </CardHeader>
          <div className="space-y-3">
            {stats.lastRuns.map((run) => (
              <Link
                key={run.id}
                href={`/search-runs/${run.id}`}
                className="flex items-center justify-between rounded-3xl border border-slate-200 px-4 py-4 transition hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium text-slate-900">{run.providerName}</p>
                  <p className="text-sm text-slate-500">
                    {run.resultCount} Ergebnisse · gestartet {formatRelative(run.runStartedAt)}
                  </p>
                </div>
                <RunStatusBadge status={run.status} />
              </Link>
            ))}
          </div>
        </Card>
        <div>
          <SectionHeader title="Aktivitäten" description="Chronologische Übersicht der wichtigsten Änderungen." />
          <ActivityFeed items={stats.latestActivities} />
        </div>
      </div>
    </div>
  );
}
