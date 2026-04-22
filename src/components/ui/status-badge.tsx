import { Badge } from "@/components/ui/badge";
import {
  approvalStatusLabels,
  jobStatusLabels,
  runStatusLabels,
  sendStatusLabels,
} from "@/lib/constants/status";
import type { ApprovalStatus, JobStatus, SearchRunStatus, SendStatus } from "@/types/domain";

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const variant =
    status === "analyzed" || status === "shortlisted"
      ? "success"
      : status === "duplicate_review"
        ? "warning"
        : status === "archived"
          ? "neutral"
          : "info";

  return <Badge variant={variant}>{jobStatusLabels[status]}</Badge>;
}

export function RunStatusBadge({ status }: { status: SearchRunStatus }) {
  const variant =
    status === "completed" ? "success" : status === "failed" ? "danger" : status === "running" ? "info" : "neutral";
  return <Badge variant={variant}>{runStatusLabels[status]}</Badge>;
}

export function ApprovalStatusBadge({ status }: { status: ApprovalStatus }) {
  const variant =
    status === "approved" ? "success" : status === "pending_review" ? "warning" : status === "rejected" ? "danger" : "neutral";
  return <Badge variant={variant}>{approvalStatusLabels[status]}</Badge>;
}

export function SendStatusBadge({ status }: { status: SendStatus }) {
  const variant = status === "mock_sent" ? "success" : status === "failed" ? "danger" : "neutral";
  return <Badge variant={variant}>{sendStatusLabels[status]}</Badge>;
}
