"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldHint, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import type { EmployerContactRecord, EmployerRecord, JobRecord, TemplateRecord } from "@/types/domain";

export function GenerateOutreachForm({
  job,
  employer,
  contacts,
  templates,
}: {
  job: JobRecord;
  employer: EmployerRecord | null;
  contacts: EmployerContactRecord[];
  templates: TemplateRecord[];
}) {
  const router = useRouter();
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [contactId, setContactId] = useState(contacts[0]?.id ?? "");
  const [busy, setBusy] = useState(false);

  const canGenerate = useMemo(() => Boolean(employer && templateId), [employer, templateId]);

  async function handleSubmit() {
    if (!employer) {
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          employerId: employer.id,
          contactId: contactId || null,
          templateId,
        }),
      });
      if (!response.ok) {
        throw new Error("Outreach konnte nicht erzeugt werden.");
      }

      toast.success("Outreach-Entwurf erstellt");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erzeugung fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel>Vorlage</FieldLabel>
        <Select value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <FieldLabel>Kontakt</FieldLabel>
        <Select value={contactId} onChange={(event) => setContactId(event.target.value)}>
          <option value="">Kein direkter Kontakt</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.fullName} · {contact.role}
            </option>
          ))}
        </Select>
        <FieldHint>Wenn kein Kontakt gesetzt ist, wird ein generischer Hiring-Team-Ansprechpartner genutzt.</FieldHint>
      </Field>
      <Button disabled={!canGenerate || busy} onClick={handleSubmit}>
        {busy ? "Erzeugt..." : "Outreach generieren"}
      </Button>
    </div>
  );
}
