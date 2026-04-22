import { ActivityLogService } from "@/services/ActivityLogService";
import { EmployerRepository } from "@/repositories/employer-repository";
import { JobRepository } from "@/repositories/job-repository";
import { OutreachRepository } from "@/repositories/outreach-repository";
import { TemplateService } from "@/services/TemplateService";

export class OutreachService {
  constructor(
    private readonly outreach: OutreachRepository,
    private readonly jobs: JobRepository,
    private readonly employers: EmployerRepository,
    private readonly templates: TemplateService,
    private readonly activityLogs: ActivityLogService,
  ) {}

  list(params?: {
    page?: number;
    pageSize?: number;
    approvalStatus?: "pending_review" | "approved" | "draft" | "rejected";
  }) {
    return this.outreach.list(params);
  }

  generate(input: { jobId: string; employerId: string; contactId: string | null; templateId: string }) {
    const job = this.jobs.findById(input.jobId);
    const employer = this.employers.findById(input.employerId);
    const contact = input.contactId
      ? this.employers.getContacts(input.employerId).find((entry) => entry.id === input.contactId) ?? null
      : null;

    if (!job || !employer) {
      return null;
    }

    const rendered = this.templates.render(input.templateId, {
      company_name: employer.companyName,
      job_title: job.title,
      location: job.location,
      contact_name: contact?.fullName ?? "Hiring Team",
      language: "Deutsch und Englisch",
      specialization: job.title,
    });

    if (!rendered) {
      return null;
    }

    const message = this.outreach.create({
      jobId: job.id,
      employerId: employer.id,
      contactId: contact?.id ?? null,
      templateId: input.templateId,
      generatedSubject: rendered.generatedSubject,
      generatedBody: rendered.generatedBody,
    });

    this.activityLogs.record("outreach_message", message.id, "outreach.generated", {
      templateId: input.templateId,
      employerId: employer.id,
      jobId: job.id,
    });

    return message;
  }

  approve(id: string) {
    const updated = this.outreach.updateApproval(id, "approved");
    if (updated) {
      this.activityLogs.record("outreach_message", id, "outreach.approved", {});
    }
    return updated;
  }

  send(id: string) {
    const existing = this.outreach.findById(id);
    if (!existing || existing.approvalStatus !== "approved") {
      return null;
    }

    const updated = this.outreach.updateSendStatus(id, "mock_sent");
    if (updated) {
      this.activityLogs.record("outreach_message", id, "outreach.sent", {
        sendStatus: updated.sendStatus,
      });
    }
    return updated;
  }

  getDetail(id: string) {
    const outreachMessage = this.outreach.findById(id);
    if (!outreachMessage) {
      return null;
    }

    const job = this.jobs.findById(outreachMessage.jobId);
    if (!job) {
      return null;
    }

    const employer = this.employers.findById(outreachMessage.employerId);
    const contact = outreachMessage.contactId
      ? this.employers
          .getContacts(outreachMessage.employerId)
          .find((entry) => entry.id === outreachMessage.contactId) ?? null
      : null;

    return {
      outreachMessage,
      job,
      employer,
      contact,
      template: this.templates.getDetail(outreachMessage.templateId)?.template ?? null,
      activityLogs: this.activityLogs.list({
        entityType: "outreach_message",
        entityId: outreachMessage.id,
      }).items,
    };
  }
}
