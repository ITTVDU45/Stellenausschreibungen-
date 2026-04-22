import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { TemplateForm } from "@/features/templates/template-form";

export default function NewTemplatePage() {
  return (
    <div className="space-y-6 pb-24">
      <SectionHeader eyebrow="Templates" title="Neue Vorlage" description="Lege Betreff, Body und Variablen für den Outreach-Workflow fest." />
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Vorlageneditor</CardTitle>
            <CardDescription>Die Platzhalter werden später aus Job-, Employer- und Kontaktkontext gefüllt.</CardDescription>
          </div>
        </CardHeader>
        <TemplateForm />
      </Card>
    </div>
  );
}
