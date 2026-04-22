import { createId } from "@/lib/utils/id";
import { paginate } from "@/lib/utils/pagination";
import type { AppDataSnapshot, JobAnalysisRecord, JobRecord } from "@/types/domain";

export interface JobFilters {
  page?: number;
  pageSize?: number;
  query?: string;
  providerName?: string;
  country?: string;
  status?: JobRecord["status"];
  companyName?: string;
  minRelevanceScore?: number;
  includeSeed?: boolean;
}

export class JobRepository {
  constructor(private readonly state: AppDataSnapshot) {}

  list(filters?: JobFilters) {
    const items = [...this.state.jobs]
      .filter((job) => {
        const query = filters?.query?.toLowerCase();
        const matchesQuery = query
          ? [job.title, job.companyName, job.location, job.rawDescription]
              .join(" ")
              .toLowerCase()
              .includes(query)
          : true;
        const matchesProvider = filters?.providerName ? job.providerName === filters.providerName : true;
        const matchesCountry = filters?.country ? job.country === filters.country : true;
        const matchesStatus = filters?.status ? job.status === filters.status : true;
        const matchesCompany = filters?.companyName ? job.companyName === filters.companyName : true;
        const matchesSeed = filters?.includeSeed ? true : !job.isSeed;
        const analysis = this.state.jobAnalyses.find((entry) => entry.jobId === job.id);
        const matchesRelevance = filters?.minRelevanceScore
          ? (analysis?.relevanceScore ?? 0) >= filters.minRelevanceScore
          : true;

        return (
          matchesQuery &&
          matchesProvider &&
          matchesCountry &&
          matchesStatus &&
          matchesCompany &&
          matchesSeed &&
          matchesRelevance
        );
      })
      .sort((a, b) => b.importedAt.localeCompare(a.importedAt));

    return paginate(items, filters?.page, filters?.pageSize ?? 12);
  }

  findById(id: string) {
    return this.state.jobs.find((job) => job.id === id) ?? null;
  }

  findByEmployerId(employerId: string) {
    return this.state.jobs.filter((job) => job.employerId === employerId);
  }

  findBySearchRunId(searchRunId: string) {
    return this.state.jobs.filter((job) => job.searchRunId === searchRunId);
  }

  findDuplicatesByHash(duplicateHash: string) {
    return this.state.jobs.filter((job) => job.duplicateHash === duplicateHash);
  }

  upsertMany(items: Omit<JobRecord, "id">[]) {
    const imported: JobRecord[] = [];

    items.forEach((item) => {
      const existingIndex = this.state.jobs.findIndex(
        (job) => job.externalId === item.externalId && job.providerName === item.providerName,
      );

      if (existingIndex >= 0) {
        const updated = { ...this.state.jobs[existingIndex], ...item };
        this.state.jobs[existingIndex] = updated;
        imported.push(updated);
        return;
      }

      const record: JobRecord = {
        id: createId("job"),
        ...item,
      };
      this.state.jobs.unshift(record);
      imported.push(record);
    });

    return imported;
  }

  updateStatus(id: string, status: JobRecord["status"]) {
    const index = this.state.jobs.findIndex((job) => job.id === id);
    if (index < 0) {
      return null;
    }

    const updated = { ...this.state.jobs[index], status };
    this.state.jobs[index] = updated;
    return updated;
  }

  saveAnalysis(analysis: JobAnalysisRecord) {
    const index = this.state.jobAnalyses.findIndex((entry) => entry.jobId === analysis.jobId);
    if (index >= 0) {
      this.state.jobAnalyses[index] = analysis;
      return analysis;
    }

    this.state.jobAnalyses.unshift(analysis);
    return analysis;
  }

  getAnalysis(jobId: string) {
    return this.state.jobAnalyses.find((entry) => entry.jobId === jobId) ?? null;
  }

  createAnalysis(analysis: Omit<JobAnalysisRecord, "id">) {
    const record: JobAnalysisRecord = {
      id: createId("analysis"),
      ...analysis,
    };
    this.saveAnalysis(record);
    return record;
  }
}
