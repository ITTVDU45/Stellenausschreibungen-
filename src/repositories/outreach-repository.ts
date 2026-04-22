import { createId } from "@/lib/utils/id";
import { paginate } from "@/lib/utils/pagination";
import type { AppDataSnapshot, ApprovalStatus, OutreachMessageRecord, SendStatus } from "@/types/domain";

export interface CreateOutreachInput {
  jobId: string;
  employerId: string;
  contactId: string | null;
  templateId: string;
  generatedSubject: string;
  generatedBody: string;
}

export class OutreachRepository {
  constructor(private readonly state: AppDataSnapshot) {}

  list(params?: {
    page?: number;
    pageSize?: number;
    approvalStatus?: ApprovalStatus;
    sendStatus?: SendStatus;
  }) {
    const items = [...this.state.outreachMessages]
      .filter((message) =>
        params?.approvalStatus ? message.approvalStatus === params.approvalStatus : true,
      )
      .filter((message) => (params?.sendStatus ? message.sendStatus === params.sendStatus : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return paginate(items, params?.page, params?.pageSize ?? 10);
  }

  findById(id: string) {
    return this.state.outreachMessages.find((message) => message.id === id) ?? null;
  }

  findByJobId(jobId: string) {
    return this.state.outreachMessages.filter((message) => message.jobId === jobId);
  }

  create(input: CreateOutreachInput) {
    const record: OutreachMessageRecord = {
      id: createId("outreach"),
      ...input,
      approvalStatus: "draft",
      sendStatus: "not_sent",
      createdAt: new Date().toISOString(),
      sentAt: null,
      followUpAt: null,
    };
    this.state.outreachMessages.unshift(record);
    return record;
  }

  updateApproval(id: string, approvalStatus: ApprovalStatus) {
    const index = this.state.outreachMessages.findIndex((message) => message.id === id);
    if (index < 0) {
      return null;
    }

    const updated = { ...this.state.outreachMessages[index], approvalStatus };
    this.state.outreachMessages[index] = updated;
    return updated;
  }

  updateSendStatus(id: string, sendStatus: SendStatus) {
    const index = this.state.outreachMessages.findIndex((message) => message.id === id);
    if (index < 0) {
      return null;
    }

    const current = this.state.outreachMessages[index];
    const updated = {
      ...current,
      sendStatus,
      sentAt: sendStatus === "mock_sent" ? new Date().toISOString() : current.sentAt,
    };
    this.state.outreachMessages[index] = updated;
    return updated;
  }
}
