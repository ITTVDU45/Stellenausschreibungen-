import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityFeed } from "@/components/activity/activity-feed";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ApprovalStatusBadge, JobStatusBadge, SendStatusBadge } from "@/components/ui/status-badge";
import { AnalyzeJobButton } from "@/features/analysis/analyze-job-button";
import { JobStatusForm } from "@/features/jobs/job-status-form";
import { GenerateOutreachForm } from "@/features/outreach/generate-outreach-form";
import { getAppContext } from "@/lib/db/app-store";
import { formatDate, formatRelative } from "@/lib/utils/dates";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { repositories, services } = getAppContext();
  const job = repositories.jobs.findById(id);
  if (!job) notFound();

  const analysis = repositories.jobs.getAnalysis(job.id);
  const employer = job.employerId ? repositories.employers.findById(job.employerId) : null;
  const contacts = employer ? repositories.employers.getContacts(employer.id) : [];
  const outreach = repositories.outreach.findByJobId(job.id);
  const activityLogs = services.activityLogs.list({ entityType: "job", entityId: job.id, pageSize: 20 }).items;

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader eyebrow="Job Detail" title={job.title} description={`${job.companyName} · ${job.location} · ${job.providerName}`} />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <div className="flex flex-wrap gap-2">
                  <JobStatusBadge status={job.status} />
                  {job.employmentType ? <Badge variant="info">{job.employmentType}</Badge> : <Badge variant="warning">Employment Type fehlt</Badge>}
                  <Badge>{formatRelative(job.publishedAt)}</Badge>
                </div>
                <CardTitle className="mt-3">Stellenbeschreibung</CardTitle>
                <CardDescription>Quelle: <a href={job.sourceUrl} target="_blank" rel="noreferrer" className="underline">{job.sourceUrl}</a></CardDescription>
              </div>
            </CardHeader>
            <div className="space-y-4 text-sm text-slate-600">
              <p>{job.rawDescription}</p>
              <p className="rounded-3xl bg-slate-50 p-4">
                <span className="font-semibold text-slate-900">Bereinigt:</span> {job.cleanDescription ?? "Noch nicht bereinigt"}
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Analyse</CardTitle>
                <CardDescription>Regelbasiertes Phase-1-Scoring mit austauschbarer Service-Schicht.</CardDescription>
              </div>
              <AnalyzeJobButton jobId={job.id} />
            </CardHeader>
            {analysis ? (
              <div className="space-y-4 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">Kurzfassung:</span> {analysis.summaryShort}</p>
                <p><span className="font-semibold text-slate-900">Langfassung:</span> {analysis.summaryLong}</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.extractedSkills.map((skill) => <Badge key={skill} variant="info">{skill}</Badge>)}
                </div>
                <p><span className="font-semibold text-slate-900">Sprachen:</span> {analysis.extractedLanguageRequirements.join(", ") || "Keine erkannt"}</p>
                <p><span className="font-semibold text-slate-900">Scores:</span> Relevanz {analysis.relevanceScore} / Confidence {analysis.confidenceScore}</p>
                <p><span className="font-semibold text-slate-900">Hints:</span> {analysis.visaHint} · {analysis.relocationHint}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Für diesen Job liegt noch keine Analyse vor.</p>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Status & Routing</CardTitle>
                <CardDescription>Review- und Prozessstatus direkt pflegen.</CardDescription>
              </div>
            </CardHeader>
            <div className="space-y-3">
              <JobStatusForm jobId={job.id} currentStatus={job.status} />
              <p className="text-sm text-slate-500">Importiert am {formatDate(job.importedAt, "dd.MM.yyyy HH:mm")}</p>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Arbeitgeber & Outreach</CardTitle>
                <CardDescription>{employer ? employer.companyName : "Noch kein Arbeitgeber verknüpft"}</CardDescription>
              </div>
            </CardHeader>
            {employer ? (
              <div className="space-y-4">
                <Link href={`/employers/${employer.id}`} className="text-sm font-semibold text-slate-900 underline">
                  Arbeitgeberdetail öffnen
                </Link>
                <GenerateOutreachForm job={job} employer={employer} contacts={contacts} templates={repositories.templates.getAll().filter((template) => template.active)} />
              </div>
            ) : (
              <p className="text-sm text-slate-500">Arbeitgeber wird automatisch beim Import angelegt.</p>
            )}
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Outreach-Historie</CardTitle>
                <CardDescription>Entwürfe, Freigaben und Mock-Send Status.</CardDescription>
              </div>
            </CardHeader>
            <div className="space-y-3">
              {outreach.map((message) => (
                <Link key={message.id} href={`/outreach/${message.id}`} className="block rounded-3xl border border-slate-200 px-4 py-4">
                  <p className="font-medium text-slate-900">{message.generatedSubject}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <ApprovalStatusBadge status={message.approvalStatus} />
                    <SendStatusBadge status={message.sendStatus} />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <SectionHeader title="Activity Feed" />
      <ActivityFeed items={activityLogs} />
    </div>
  );
}
