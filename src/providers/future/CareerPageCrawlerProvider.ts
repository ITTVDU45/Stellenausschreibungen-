import type {
  SearchProvider,
  SearchProviderRunMeta,
  SearchProviderSearchInput,
  SearchProviderSearchResult,
} from "@/providers/contracts/SearchProvider";

export class CareerPageCrawlerProvider implements SearchProvider {
  readonly name = "career_page_crawler";

  async startRun(input: SearchProviderSearchInput): Promise<SearchProviderRunMeta> {
    void input;
    throw new Error("CareerPageCrawlerProvider ist in Phase 1 noch nicht implementiert.");
  }

  async getRunStatus(meta: SearchProviderRunMeta): Promise<SearchProviderRunMeta> {
    void meta;
    throw new Error("CareerPageCrawlerProvider ist in Phase 1 noch nicht implementiert.");
  }

  async fetchResults(
    meta: SearchProviderRunMeta,
    input: SearchProviderSearchInput,
  ): Promise<SearchProviderSearchResult> {
    void meta;
    void input;
    throw new Error("CareerPageCrawlerProvider ist in Phase 1 noch nicht implementiert.");
  }
}
