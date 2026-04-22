import { describe, expect, it } from "vitest";

import { MockSearchProvider } from "@/providers/mock/MockSearchProvider";
import type { SearchProviderJobResult } from "@/providers/contracts/SearchProvider";

describe("MockSearchProvider", () => {
  it("filtert nach Keywords und paginiert Ergebnisse", async () => {
    const provider = new MockSearchProvider();
    const input = {
      profileId: "profile_test",
      keywords: ["recruiting"],
      excludeKeywords: ["praktikum"],
      country: "Deutschland",
      providerNames: ["mock_indeed", "mock_linkedin_reference"],
      page: 1,
      pageSize: 5,
    };
    const meta = await provider.startRun(input);

    const result = await provider.fetchResults(meta, input);

    expect(result.items.length).toBeLessThanOrEqual(5);
    expect(result.totalItems).toBeGreaterThan(0);
    expect(result.items.every((item: SearchProviderJobResult) => item.country === "Deutschland")).toBe(true);
  });
});
