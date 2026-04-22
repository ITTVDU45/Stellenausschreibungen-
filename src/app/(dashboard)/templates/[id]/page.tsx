import Link from "next/link";
import { notFound } from "next/navigation";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { getAppContext } from "@/lib/db/app-store";

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { services } = getAppContext();
  const detail = services.templates.getDetail(id);
  if (!detail) notFound();

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader eyebrow="Template Detail" title={detail.template.name} description={`${detail.template.language} · ${detail.template.channel}`} action={<Link href={`/templates/${detail.template.id}/edit`} className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Bearbeiten</Link>} />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Betreff</CardTitle>
              <CardDescription>Mit Variablenersetzung</CardDescription>
            </div>
          </CardHeader>
          <p className="text-sm text-slate-600">{detail.template.subjectTemplate}</p>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Body</CardTitle>
              <CardDescription>Direkt in Outreach-Entwürfen wiederverwendbar.</CardDescription>
            </div>
          </CardHeader>
          <pre className="whitespace-pre-wrap text-sm text-slate-600">{detail.template.bodyTemplate}</pre>
        </Card>
      </div>
    </div>
  );
}
