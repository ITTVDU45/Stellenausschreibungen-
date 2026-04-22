import { describe, expect, it } from "vitest";

import { AnalysisService } from "@/services/AnalysisService";
import { createSeedData } from "@/seed";

describe("AnalysisService", () => {
  it("extrahiert Skills und Scores aus Jobbeschreibungen", () => {
    const service = new AnalysisService();
    const job = createSeedData().jobs[0];
    const analysis = service.analyze(job);

    expect(analysis.summaryShort).toContain(job.title);
    expect(analysis.relevanceScore).toBeGreaterThan(50);
    expect(analysis.extractedSkills.length).toBeGreaterThan(0);
  });
});
