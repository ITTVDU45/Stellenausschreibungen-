import { notFound } from "next/navigation";

import { ActivityFeed } from "@/components/activity/activity-feed";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ApprovalStatusBadge, SendStatusBadge } from "@/components/ui/status-badge";
import { OutreachApproveButton, OutreachSendButton } from "@/features/outreach/outreach-actions";
import { getAppContext } from "@/lib/db/app-store";

export default async function OutreachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { services } = getAppContext();
  const detail = services.outreach.getDetail(id);
  if (!detail) notFound();

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader eyebrow="Outreach Detail" title={detail.outreachMessage.generatedSubject} description={detail.job.title} />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <div className="flex flex-wrap gap-2">
                <ApprovalStatusBadge status={detail.outreachMessage.approvalStatus} />
                <SendStatusBadge status={detail.outreachMessage.sendStatus} />
              </div>
              <CardTitle className="mt-3">Nachrichtenvorschau</CardTitle>
              <CardDescription>{detail.employer?.companyName ?? "Arbeitgeber offen"} · {detail.contact?.fullName ?? "Kein Kontakt gesetzt"}</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-900">Betreff:</span> {detail.outreachMessage.generatedSubject}</p>
            <pre className="whitespace-pre-wrap rounded-3xl bg-slate-50 p-4">{detail.outreachMessage.generatedBody}</pre>
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Workflow</CardTitle>
                <CardDescription>Review-first Freigabe und Mock-Send.</CardDescription>
              </div>
            </CardHeader>
            <div className="flex flex-wrap gap-3">
              {detail.outreachMessage.approvalStatus !== "approved" ? <OutreachApproveButton outreachId={detail.outreachMessage.id} /> : null}
              {detail.outreachMessage.sendStatus !== "mock_sent" ? <OutreachSendButton outreachId={detail.outreachMessage.id} /> : null}
            </div>
          </Card>
          <SectionHeader title="Aktivitäten" />
          <ActivityFeed items={detail.activityLogs} />
        </div>
      </div>
    </div>
  );
}
