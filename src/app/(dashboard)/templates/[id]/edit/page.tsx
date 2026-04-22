import { notFound } from "next/navigation";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { TemplateForm } from "@/features/templates/template-form";
import { getAppContext } from "@/lib/db/app-store";

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { repositories } = getAppContext();
  const template = repositories.templates.findById(id);
  if (!template) notFound();

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader eyebrow="Templates" title="Vorlage bearbeiten" description={template.name} />
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Template aktualisieren</CardTitle>
            <CardDescription>Änderungen gelten für neue Outreach-Generierungen.</CardDescription>
          </div>
        </CardHeader>
        <TemplateForm template={template} />
      </Card>
    </div>
  );
}
