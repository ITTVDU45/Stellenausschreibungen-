import { describe, expect, it } from "vitest";

import { SearchProfileRepository } from "@/repositories/search-profile-repository";
import { createSeedData } from "@/seed";

describe("SearchProfileRepository", () => {
  it("legt ein Profil an und listet es wieder", () => {
    const state = createSeedData();
    const repository = new SearchProfileRepository(state);

    const created = repository.create({
      name: "Testprofil",
      targetRole: "Recruiter",
      targetRegion: "Berlin",
      targetCountry: "Deutschland",
      includeKeywords: ["recruiting"],
      excludeKeywords: [],
      languages: ["Deutsch"],
      industry: "Healthcare",
      priority: "high",
      activeSources: ["mock_stepstone"],
      providerSettings: {
        stepstone: {
          startUrls: [],
          domain: "stepstone.de",
          queries: ["Recruiter"],
          location: "Berlin",
          distanceFromSource: "30km",
          workRemote: [],
          applicationType: [],
          listingLanguage: ["GERMAN"],
          workingHours: [],
          employmentType: [],
          experience: [],
          publishedDate: "last-7-days",
          limit: 50,
        },
        linkedin: {
          title: "Recruiter",
          location: "Berlin",
          companyName: [],
          companyId: [],
          publishedAt: "Any Time",
          rows: 50,
          workType: "",
          contractType: "",
          experienceLevel: "",
        },
        indeed: {
          position: "Recruiter",
          maxItemsPerSearch: 50,
          country: "Germany",
          location: "Berlin",
          startUrls: [],
          parseCompanyDetails: true,
          saveOnlyUniqueItems: true,
          followApplyRedirects: true,
        },
      },
      active: true,
    });

    const list = repository.list({ page: 1, pageSize: 20 });
    expect(list.items.some((item) => item.id === created.id)).toBe(true);
  });
});
