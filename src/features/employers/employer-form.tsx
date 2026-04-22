"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { employerUpdateSchema } from "@/lib/validation/schemas";
import type { EmployerRecord } from "@/types/domain";

type FormValues = z.infer<typeof employerUpdateSchema>;

export function EmployerForm({ employer }: { employer: EmployerRecord }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(employerUpdateSchema),
    defaultValues: {
      website: employer.website ?? "",
      careersUrl: employer.careersUrl ?? "",
      contactEmail: employer.contactEmail ?? "",
      phone: employer.phone ?? "",
      address: employer.address ?? "",
      linkedinUrl: employer.linkedinUrl ?? "",
      notes: employer.notes,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/employers/${employer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Arbeitgeber konnte nicht gespeichert werden.");
      }
      toast.success("Arbeitgeber aktualisiert");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Speichern fehlgeschlagen");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
      <Field>
        <FieldLabel htmlFor="website">Website</FieldLabel>
        <Input id="website" {...form.register("website")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="careersUrl">Karriereseite</FieldLabel>
        <Input id="careersUrl" {...form.register("careersUrl")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="contactEmail">Kontakt-E-Mail</FieldLabel>
        <Input id="contactEmail" {...form.register("contactEmail")} />
      </Field>
      <Field>
        <FieldLabel htmlFor="phone">Telefon</FieldLabel>
        <Input id="phone" {...form.register("phone")} />
      </Field>
      <Field className="md:col-span-2">
        <FieldLabel htmlFor="address">Adresse</FieldLabel>
        <Input id="address" {...form.register("address")} />
      </Field>
      <Field className="md:col-span-2">
        <FieldLabel htmlFor="linkedinUrl">LinkedIn</FieldLabel>
        <Input id="linkedinUrl" {...form.register("linkedinUrl")} />
      </Field>
      <Field className="md:col-span-2">
        <FieldLabel htmlFor="notes">Notizen</FieldLabel>
        <Textarea id="notes" rows={6} {...form.register("notes")} />
      </Field>
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Speichert..." : "Arbeitgeber aktualisieren"}
        </Button>
      </div>
    </form>
  );
}
