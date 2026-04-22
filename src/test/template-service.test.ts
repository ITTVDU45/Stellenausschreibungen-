import { describe, expect, it } from "vitest";

import { TemplateRepository } from "@/repositories/template-repository";
import { TemplateService } from "@/services/TemplateService";
import { createSeedData } from "@/seed";

describe("TemplateService", () => {
  it("ersetzt Variablen in Betreff und Body", () => {
    const state = createSeedData();
    const service = new TemplateService(new TemplateRepository(state));
    const templateId = state.templates[0].id;

    const rendered = service.render(templateId, {
      company_name: "Acme GmbH",
      job_title: "Recruiter",
      location: "Berlin",
      contact_name: "Anna",
      language: "Deutsch",
      specialization: "Healthcare Recruiting",
    });

    expect(rendered?.generatedSubject).toContain("Recruiter");
    expect(rendered?.generatedBody).toContain("Acme GmbH");
    expect(rendered?.generatedBody).toContain("Anna");
  });
});
