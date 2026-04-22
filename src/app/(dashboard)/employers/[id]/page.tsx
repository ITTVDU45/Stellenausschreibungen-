import { notFound } from "next/navigation";

import { ActivityFeed } from "@/components/activity/activity-feed";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { EmployerForm } from "@/features/employers/employer-form";
import { getAppContext } from "@/lib/db/app-store";
import { formatPercent } from "@/lib/utils/format";

export default async function EmployerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { services } = getAppContext();
  const detail = services.employers.getDetail(id);
  if (!detail) notFound();

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader eyebrow="Employer Detail" title={detail.employer.companyName} description={detail.employer.website ?? "Website noch offen"} />
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <div className="flex flex-wrap gap-2">
                  <CardTitle>Arbeitgeberprofil</CardTitle>
                  <Badge variant={detail.employer.completenessScore >= 70 ? "success" : "warning"}>
                    {formatPercent(detail.employer.completenessScore)}
                  </Badge>
                </div>
                <CardDescription>Kontaktdaten, Karriereseiten und interne Notizen pflegen.</CardDescription>
              </div>
            </CardHeader>
            <EmployerForm employer={detail.employer} />
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Kontakte</CardTitle>
                <CardDescription>Confidence und Quelle der Ansprechpartner.</CardDescription>
              </div>
            </CardHeader>
            <div className="space-y-3">
              {detail.contacts.map((contact) => (
                <div key={contact.id} className="rounded-3xl border border-slate-200 px-4 py-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">{contact.fullName}</p>
                  <p>{contact.role}</p>
                  <p>{contact.email ?? "E-Mail offen"} · {contact.phone ?? "Telefon offen"}</p>
                  <p className="text-xs text-slate-400">{contact.source} · Confidence {contact.confidenceScore}%</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Verknüpfte Jobs</CardTitle>
                <CardDescription>Alle Jobs, die diesem Arbeitgeber zugeordnet sind.</CardDescription>
              </div>
            </CardHeader>
            <div className="space-y-3">
              {detail.jobs.map((job) => (
                <div key={job.id} className="rounded-3xl border border-slate-200 px-4 py-4">
                  <p className="font-medium text-slate-900">{job.title}</p>
                  <p className="text-sm text-slate-500">{job.location} · {job.providerName}</p>
                </div>
              ))}
            </div>
          </Card>
          <SectionHeader title="Aktivitäten" />
          <ActivityFeed items={detail.activityLogs} />
        </div>
      </div>
    </div>
  );
}
