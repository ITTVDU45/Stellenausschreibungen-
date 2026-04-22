import type {
  SearchProvider,
  SearchProviderRunMeta,
  SearchProviderSearchInput,
  SearchProviderSearchResult,
} from "@/providers/contracts/SearchProvider";
import { createProviderCatalog } from "@/seed";

const catalog = createProviderCatalog();

export class MockSearchProvider implements SearchProvider {
  readonly name = "mock_search";

  async startRun(input: SearchProviderSearchInput): Promise<SearchProviderRunMeta> {
    void input;
    return {
      providerRunId: null,
      providerActorId: null,
      providerDatasetId: null,
      providerStatus: "succeeded",
      providerStartedAt: new Date().toISOString(),
      providerFinishedAt: new Date().toISOString(),
      errorMessage: null,
    };
  }

  async getRunStatus(meta: SearchProviderRunMeta): Promise<SearchProviderRunMeta> {
    return meta;
  }

  async fetchResults(inputMeta: SearchProviderRunMeta, input: SearchProviderSearchInput): Promise<SearchProviderSearchResult> {
    void inputMeta;
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 10;
    const keywords = input.keywords.map((keyword) => keyword.toLowerCase());
    const excludedKeywords = input.excludeKeywords.map((keyword) => keyword.toLowerCase());

    const filtered = catalog
      .filter((job) =>
        input.providerNames?.length ? input.providerNames.includes(job.providerName) : true,
      )
      .filter((job) => (input.country ? job.country === input.country : true))
      .filter((job) => {
        const haystack = [job.title, job.companyName, job.location, job.rawDescription].join(" ").toLowerCase();
        const matchesKeywords =
          keywords.length === 0 ? true : keywords.some((keyword) => haystack.includes(keyword));
        const matchesExcluded = excludedKeywords.some((keyword) => haystack.includes(keyword));
        const matchesIndustry = input.industry ? haystack.includes(input.industry.toLowerCase()) : true;

        return matchesKeywords && !matchesExcluded && matchesIndustry;
      })
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      totalItems: filtered.length,
      providerName: this.name,
      page,
      pageSize,
    };
  }
}
