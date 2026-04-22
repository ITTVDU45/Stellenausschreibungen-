import type { EmployerContactRecord } from "@/types/domain";

import { EmployerRepository } from "@/repositories/employer-repository";
import { JobRepository } from "@/repositories/job-repository";
import { ActivityLogService } from "@/services/ActivityLogService";

export class EmployerService {
  constructor(
    private readonly employers: EmployerRepository,
    private readonly jobs: JobRepository,
    private readonly activityLogs: ActivityLogService,
  ) {}

  list(params?: { page?: number; pageSize?: number; query?: string }) {
    return this.employers.list(params);
  }

  getDetail(id: string) {
    const employer = this.employers.findById(id);
    if (!employer) {
      return null;
    }

    return {
      employer,
      contacts: this.employers.getContacts(id),
      jobs: this.jobs.findByEmployerId(id),
      activityLogs: this.activityLogs.list({ entityType: "employer", entityId: id, pageSize: 20 }).items,
    };
  }

  ensureEmployer(companyName: string) {
    return this.employers.upsertFromCompanyName(companyName);
  }

  update(id: string, input: Parameters<EmployerRepository["update"]>[1]) {
    const updated = this.employers.update(id, input);
    if (updated) {
      this.activityLogs.record("employer", id, "employer.updated", input as Record<string, unknown>);
    }
    return updated;
  }

  addContact(input: Omit<EmployerContactRecord, "id">) {
    const contact = this.employers.addContact(input);
    this.activityLogs.record("employer", input.employerId, "employer.contact_added", {
      fullName: input.fullName,
      role: input.role,
    });
    return contact;
  }
}
