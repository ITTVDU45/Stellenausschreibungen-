import { createId } from "@/lib/utils/id";
import { paginate } from "@/lib/utils/pagination";
import type { AppDataSnapshot, SearchProfileRecord } from "@/types/domain";
import type { SearchProfileProviderSettings } from "@/types/domain";

export interface SearchProfileInput {
  name: string;
  targetRole: string;
  targetRegion: string;
  targetCountry: string;
  includeKeywords: string[];
  excludeKeywords: string[];
  languages: string[];
  industry: string;
  priority: SearchProfileRecord["priority"];
  activeSources: string[];
  providerSettings: SearchProfileProviderSettings;
  active: boolean;
}

export class SearchProfileRepository {
  constructor(private readonly state: AppDataSnapshot) {}

  list(params?: { page?: number; pageSize?: number; active?: boolean }) {
    const items = [...this.state.searchProfiles]
      .filter((profile) => (params?.active === undefined ? true : profile.active === params.active))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return paginate(items, params?.page, params?.pageSize ?? 10);
  }

  getAll() {
    return [...this.state.searchProfiles].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  findById(id: string) {
    return this.state.searchProfiles.find((profile) => profile.id === id) ?? null;
  }

  create(input: SearchProfileInput) {
    const record: SearchProfileRecord = {
      id: createId("profile"),
      createdAt: new Date().toISOString(),
      ...input,
    };

    this.state.searchProfiles.unshift(record);
    return record;
  }

  update(id: string, input: Partial<SearchProfileInput>) {
    const index = this.state.searchProfiles.findIndex((profile) => profile.id === id);
    if (index < 0) {
      return null;
    }

    const updated = { ...this.state.searchProfiles[index], ...input };
    this.state.searchProfiles[index] = updated;
    return updated;
  }

  delete(id: string) {
    const index = this.state.searchProfiles.findIndex((profile) => profile.id === id);
    if (index < 0) {
      return false;
    }

    this.state.searchProfiles.splice(index, 1);
    return true;
  }
}
