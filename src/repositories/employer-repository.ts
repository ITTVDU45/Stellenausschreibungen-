import { createId } from "@/lib/utils/id";
import { paginate } from "@/lib/utils/pagination";
import type { AppDataSnapshot, EmployerContactRecord, EmployerRecord } from "@/types/domain";

export interface EmployerUpdateInput {
  website?: string | null;
  careersUrl?: string | null;
  contactEmail?: string | null;
  phone?: string | null;
  address?: string | null;
  linkedinUrl?: string | null;
  notes?: string;
}

export class EmployerRepository {
  constructor(private readonly state: AppDataSnapshot) {}

  list(params?: { page?: number; pageSize?: number; query?: string }) {
    const query = params?.query?.toLowerCase();
    const items = [...this.state.employers]
      .filter((employer) =>
        query
          ? [employer.companyName, employer.notes, employer.website ?? ""]
              .join(" ")
              .toLowerCase()
              .includes(query)
          : true,
      )
      .sort((a, b) => a.companyName.localeCompare(b.companyName));

    return paginate(items, params?.page, params?.pageSize ?? 10);
  }

  findById(id: string) {
    return this.state.employers.find((employer) => employer.id === id) ?? null;
  }

  findByCompanyName(companyName: string) {
    return this.state.employers.find((employer) => employer.companyName === companyName) ?? null;
  }

  upsertFromCompanyName(companyName: string) {
    const existing = this.findByCompanyName(companyName);
    if (existing) {
      return existing;
    }

    const employer: EmployerRecord = {
      id: createId("employer"),
      companyName,
      website: null,
      careersUrl: null,
      contactEmail: null,
      phone: null,
      address: null,
      linkedinUrl: null,
      notes: "Automatisch aus Jobimport erstellt.",
      completenessScore: 20,
    };
    this.state.employers.unshift(employer);
    return employer;
  }

  update(id: string, input: EmployerUpdateInput) {
    const index = this.state.employers.findIndex((employer) => employer.id === id);
    if (index < 0) {
      return null;
    }

    const updated = {
      ...this.state.employers[index],
      ...input,
    };
    const completenessFields = [
      updated.website,
      updated.careersUrl,
      updated.contactEmail,
      updated.phone,
      updated.address,
      updated.linkedinUrl,
    ].filter(Boolean).length;
    updated.completenessScore = Math.round((completenessFields / 6) * 100);
    this.state.employers[index] = updated;
    return updated;
  }

  getContacts(employerId: string) {
    return this.state.employerContacts.filter((contact) => contact.employerId === employerId);
  }

  addContact(input: Omit<EmployerContactRecord, "id">) {
    const contact: EmployerContactRecord = {
      id: createId("contact"),
      ...input,
    };
    this.state.employerContacts.unshift(contact);
    return contact;
  }
}
