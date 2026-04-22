"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Select } from "@/components/ui/select";
import type { JobStatus } from "@/types/domain";

const options: { value: JobStatus; label: string }[] = [
  { value: "new", label: "Neu" },
  { value: "reviewed", label: "Geprüft" },
  { value: "analyzed", label: "Analysiert" },
  { value: "shortlisted", label: "Priorisiert" },
  { value: "outreach_draft", label: "Outreach-Entwurf" },
  { value: "duplicate_review", label: "Dublette prüfen" },
  { value: "archived", label: "Archiviert" },
];

export function JobStatusForm({ jobId, currentStatus }: { jobId: string; currentStatus: JobStatus }) {
  const router = useRouter();
  const [value, setValue] = useState(currentStatus);

  async function handleChange(nextValue: JobStatus) {
    setValue(nextValue);
    const response = await fetch(`/api/jobs/${jobId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextValue }),
    });

    if (!response.ok) {
      toast.error("Status konnte nicht aktualisiert werden.");
      setValue(currentStatus);
      return;
    }

    toast.success("Jobstatus aktualisiert");
    router.refresh();
  }

  return (
    <Select value={value} onChange={(event) => handleChange(event.target.value as JobStatus)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
