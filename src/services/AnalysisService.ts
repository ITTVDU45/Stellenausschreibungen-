import { createId } from "@/lib/utils/id";
import type { JobAnalysisRecord, JobRecord } from "@/types/domain";

const skillPatterns = [
  "crm",
  "hubspot",
  "salesforce",
  "recruiting",
  "talent acquisition",
  "sourcing",
  "analytics",
  "reporting",
  "employee experience",
  "visa",
  "relocation",
  "stakeholder",
  "linkedin",
];

export class AnalysisService {
  analyze(job: JobRecord): Omit<JobAnalysisRecord, "id"> {
    const cleanDescription = job.rawDescription.replace(/\s+/g, " ").trim();
    const lower = cleanDescription.toLowerCase();
    const extractedSkills = skillPatterns.filter((pattern) => lower.includes(pattern));
    const extractedRequirements = cleanDescription
      .split(".")
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 10)
      .slice(0, 4);
    const extractedLanguageRequirements = ["Deutsch", "Englisch", "Polnisch"].filter((language) =>
      lower.includes(language.toLowerCase()),
    );
    const relevanceBoost = ["sales", "recruiting", "people", "talent"].some((keyword) =>
      lower.includes(keyword),
    )
      ? 10
      : 0;
    const relevanceScore = Math.min(
      98,
      52 + extractedSkills.length * 7 + extractedLanguageRequirements.length * 6 + relevanceBoost,
    );
    const confidenceScore = Math.min(95, 60 + extractedRequirements.length * 8 + extractedSkills.length * 4);

    return {
      jobId: job.id,
      summaryShort: `${job.title} bei ${job.companyName} mit Fokus auf ${extractedSkills[0] ?? "strukturierte Prozesse"}.`,
      summaryLong: `${job.title} in ${job.location}. Relevante Punkte: ${extractedRequirements.join("; ")}.`,
      extractedSkills,
      extractedRequirements,
      extractedLanguageRequirements,
      visaHint: lower.includes("visa") ? "Visa-Support erwähnt" : "Keine Visa-Hinweise gefunden",
      relocationHint: lower.includes("relocation")
        ? "Relocation-Anteil erwähnt"
        : "Keine Relocation-Hinweise gefunden",
      relevanceScore,
      confidenceScore,
    };
  }

  createRecord(job: JobRecord): JobAnalysisRecord {
    return {
      id: createId("analysis"),
      ...this.analyze(job),
    };
  }
}
