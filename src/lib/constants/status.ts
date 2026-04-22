import type {
  ApprovalStatus,
  JobStatus,
  SearchRunStatus,
  SendStatus,
} from "@/types/domain";

export const jobStatusLabels: Record<JobStatus, string> = {
  new: "Neu",
  reviewed: "Geprüft",
  analyzed: "Analysiert",
  shortlisted: "Priorisiert",
  outreach_draft: "Outreach-Entwurf",
  duplicate_review: "Dublette prüfen",
  archived: "Archiviert",
};

export const runStatusLabels: Record<SearchRunStatus, string> = {
  queued: "Geplant",
  running: "Läuft",
  completed: "Abgeschlossen",
  failed: "Fehlgeschlagen",
};

export const approvalStatusLabels: Record<ApprovalStatus, string> = {
  draft: "Entwurf",
  pending_review: "Wartet auf Freigabe",
  approved: "Freigegeben",
  rejected: "Abgelehnt",
};

export const sendStatusLabels: Record<SendStatus, string> = {
  not_sent: "Nicht versendet",
  queued: "In Warteschlange",
  mock_sent: "Mock versendet",
  failed: "Fehlgeschlagen",
};
