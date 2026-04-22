import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { JobStatusBadge } from "@/components/ui/status-badge";
import { getAppContext } from "@/lib/db/app-store";
import { truncateText } from "@/lib/utils/format";

const providerLabels: Record<string, string> = {
  mock_stepstone: "Stepstone",
  mock_indeed: "Indeed",
  mock_linkedin_reference: "Linked",
  indeed_live: "Indeed Live",
};

function ProviderBadge({ providerName }: { providerName: string }) {
  const label = providerLabels[providerName] ?? providerName;
  const variant =
    providerName === "indeed_live"
      ? "success"
      : providerName === "mock_stepstone"
      ? "info"
      : providerName === "mock_indeed"
        ? "warning"
        : providerName === "mock_linkedin_reference"
          ? "success"
          : "neutral";

  return <Badge variant={variant}>{label}</Badge>;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams?: Promise<{ includeSeed?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const includeSeed = params?.includeSeed === "true";
  const { repositories } = getAppContext();
  const jobs = repositories.jobs.list({ page: 1, pageSize: 50, includeSeed }).items;

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader
        eyebrow="Jobs"
        title="Importierte Joblistings"
        description={
          includeSeed
            ? "Tabellarische Sicht auf Live-Imports und eingeblendete Seed-Daten."
            : "Standardansicht mit echten Live-Imports. Seed-Daten sind ausgeblendet."
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Badge variant={includeSeed ? "warning" : "success"}>
              {includeSeed ? "Seed sichtbar" : "Nur Live-Imports"}
            </Badge>
            <Link
              href={includeSeed ? "/jobs" : "/jobs?includeSeed=true"}
              className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              {includeSeed ? "Seed-Daten ausblenden" : "Seed-Daten einblenden"}
            </Link>
          </div>
        }
      />

      <Card className="hidden overflow-hidden p-0 lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-[0.16em] text-slate-500">
                <th className="px-4 py-4 font-semibold">Portal</th>
                <th className="px-4 py-4 font-semibold">Joblisting</th>
                <th className="px-4 py-4 font-semibold">Arbeitgeber</th>
                <th className="px-4 py-4 font-semibold">Standort</th>
                <th className="px-4 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {jobs.map((job) => (
                <tr key={job.id} className="align-top transition hover:bg-slate-50/80">
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <ProviderBadge providerName={job.providerName} />
                      {job.isSeed ? <Badge variant="neutral">Seed</Badge> : <Badge variant="success">Live</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/jobs/${job.id}`} className="block space-y-2">
                      <p className="font-semibold text-slate-950">{job.title}</p>
                      <CardDescription>{truncateText(job.rawDescription, 160)}</CardDescription>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{job.companyName}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <div className="space-y-1">
                      <p>{job.location}</p>
                      <p className="text-xs text-slate-500">{job.country}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <JobStatusBadge status={job.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 lg:hidden">
        {jobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`}>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <ProviderBadge providerName={job.providerName} />
                    {job.isSeed ? <Badge variant="neutral">Seed</Badge> : <Badge variant="success">Live</Badge>}
                    <JobStatusBadge status={job.status} />
                  </div>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>
                    {job.companyName} · {job.location}
                  </CardDescription>
                  <p className="text-sm text-slate-500">{truncateText(job.rawDescription, 150)}</p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
