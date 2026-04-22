import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { getAppContext } from "@/lib/db/app-store";

export default function TemplatesPage() {
  const { repositories } = getAppContext();
  const templates = repositories.templates.getAll();

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader eyebrow="Templates" title="Outreach-Vorlagen" description="Kanal- und sprachabhängige Templates mit Variablenersetzung für Outreach-Workflows." action={<Link href="/templates/new" className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Vorlage anlegen</Link>} />
      <div className="grid gap-4">
        {templates.map((template) => (
          <Link key={template.id} href={`/templates/${template.id}`}>
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <CardTitle>{template.name}</CardTitle>
                    <Badge variant={template.active ? "success" : "neutral"}>{template.active ? "Aktiv" : "Inaktiv"}</Badge>
                    <Badge variant="info">{template.channel}</Badge>
                  </div>
                  <CardDescription>{template.language}</CardDescription>
                  <p className="text-sm text-slate-500">{template.subjectTemplate}</p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
