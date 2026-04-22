import type {
  SearchProvider,
  SearchProviderRunMeta,
  SearchProviderSearchInput,
  SearchProviderSearchResult,
} from "@/providers/contracts/SearchProvider";

export class LinkedInReferenceProvider implements SearchProvider {
  readonly name = "linkedin_reference";

  async startRun(input: SearchProviderSearchInput): Promise<SearchProviderRunMeta> {
    void input;
    throw new Error("LinkedInReferenceProvider ist in Phase 1 noch nicht implementiert.");
  }

  async getRunStatus(meta: SearchProviderRunMeta): Promise<SearchProviderRunMeta> {
    void meta;
    throw new Error("LinkedInReferenceProvider ist in Phase 1 noch nicht implementiert.");
  }

  async fetchResults(
    meta: SearchProviderRunMeta,
    input: SearchProviderSearchInput,
  ): Promise<SearchProviderSearchResult> {
    void meta;
    void input;
    throw new Error("LinkedInReferenceProvider ist in Phase 1 noch nicht implementiert.");
  }
}
