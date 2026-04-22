"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldHint, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { templateSchema } from "@/lib/validation/schemas";
import type { TemplateRecord } from "@/types/domain";

type FormValues = z.infer<typeof templateSchema>;

export function TemplateForm({ template }: { template?: TemplateRecord | null }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: template?.name ?? "",
      language: template?.language ?? "Deutsch",
      channel: template?.channel ?? "email",
      subjectTemplate: template?.subjectTemplate ?? "",
      bodyTemplate: template?.bodyTemplate ?? "",
      active: template?.active ?? true,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSaving(true);
    try {
      const response = await fetch(template ? `/api/templates/${template.id}` : "/api/templates", {
        method: template ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Vorlage konnte nicht gespeichert werden.");
      }

      toast.success(template ? "Vorlage aktualisiert" : "Vorlage erstellt");
      router.push("/templates");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Speichern fehlgeschlagen");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="name">Vorlagenname</FieldLabel>
          <Input id="name" {...form.register("name")} />
          <FieldError>{form.formState.errors.name?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="language">Sprache</FieldLabel>
          <Input id="language" {...form.register("language")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="channel">Kanal</FieldLabel>
          <Select id="channel" {...form.register("channel")}>
            <option value="email">E-Mail</option>
            <option value="linkedin">LinkedIn</option>
            <option value="phone_followup">Telefon</option>
          </Select>
        </Field>
        <Field>
          <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <FieldLabel>Aktiv</FieldLabel>
              <FieldHint>Nur aktive Vorlagen erscheinen in der Outreach-Erzeugung.</FieldHint>
            </div>
            <Switch checked={form.watch("active")} onChange={(event) => form.setValue("active", event.currentTarget.checked)} />
          </div>
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="subjectTemplate">Betreff</FieldLabel>
        <Input id="subjectTemplate" {...form.register("subjectTemplate")} />
        <FieldHint>Unterstützte Variablen: {"{{company_name}}, {{job_title}}, {{location}}"}</FieldHint>
      </Field>
      <Field>
        <FieldLabel htmlFor="bodyTemplate">Nachricht</FieldLabel>
        <Textarea id="bodyTemplate" rows={10} {...form.register("bodyTemplate")} />
        <FieldHint>
          Zusätzliche Variablen: {"{{contact_name}}, {{language}}, {{specialization}}"}
        </FieldHint>
      </Field>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Speichert..." : template ? "Vorlage aktualisieren" : "Vorlage anlegen"}
        </Button>
      </div>
    </form>
  );
}
