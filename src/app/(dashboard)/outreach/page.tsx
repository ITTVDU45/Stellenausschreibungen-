import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ApprovalStatusBadge, SendStatusBadge } from "@/components/ui/status-badge";
import { getAppContext } from "@/lib/db/app-store";
import { formatRelative, formatDate } from "@/lib/utils/dates";

export default function OutreachPage() {
  const { services, repositories } = getAppContext();
  const messages = services.outreach.list({ page: 1, pageSize: 50 }).items;

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader eyebrow="Outreach" title="Review-Queue und Versandstatus" description="Generierte Nachrichten, Freigaben und Mock-Send Schritte in einer kompakten Übersicht." />
      <div className="grid gap-4">
        {messages.map((message) => {
          const job = repositories.jobs.findById(message.jobId);
          const employer = repositories.employers.findById(message.employerId);
          return (
            <Link key={message.id} href={`/outreach/${message.id}`}>
              <Card>
                <CardHeader>
                  <div className="space-y-2">
                    <CardTitle>{message.generatedSubject}</CardTitle>
                    <CardDescription>{job?.title ?? "Job unbekannt"} · {employer?.companyName ?? "Arbeitgeber offen"}</CardDescription>
                    <p className="text-sm text-slate-500">Erstellt {formatRelative(message.createdAt)} · {formatDate(message.createdAt, "dd.MM.yyyy HH:mm")}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <ApprovalStatusBadge status={message.approvalStatus} />
                    <SendStatusBadge status={message.sendStatus} />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
