import { buildDuplicateHash } from "@/lib/utils/hash";
import type { SearchProviderJobResult, SearchProviderSearchInput } from "@/providers/contracts/SearchProvider";

type ActorSpecificInputResult =
  | { supported: true; payload: Record<string, unknown> }
  | { supported: false; reason: string };

function pickString(record: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return fallback;
}

function pickNullableString(record: Record<string, unknown>, keys: string[]) {
  const value = pickString(record, keys);
  return value || null;
}

function splitMultiValue(value?: string) {
  return value
    ?.split(/[,;/\n]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];
}

function compactStrings(values?: string[]) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

function toStartUrlObjects(values?: string[]) {
  return compactStrings(values).map((url) => ({ url }));
}

function sanitizeStepstoneDistance(value?: string) {
  const numeric = (value ?? "").replace(/[^\d]/g, "");
  const allowed = ["5", "10", "20", "30", "40", "50", "75", "100"];
  return allowed.includes(numeric) ? numeric : "30";
}

function mapCountryToIndeed(codeOrCountry?: string) {
  const value = (codeOrCountry ?? "").toLowerCase();
  const countryMap: Record<string, string> = {
    deutschland: "DE",
    germany: "DE",
    de: "DE",
    uk: "GB",
    grossbritannien: "GB",
    unitedkingdom: "GB",
    usa: "US",
    us: "US",
  };

  return countryMap[value] ?? (value ? value.toUpperCase() : "DE");
}

function mapCountryToLowerIndeed(codeOrCountry?: string) {
  return mapCountryToIndeed(codeOrCountry).toLowerCase();
}

function buildLinkedInJobUrls(input: SearchProviderSearchInput) {
  const roles = input.keywords.length > 0 ? input.keywords : splitMultiValue(input.targetRole);
  const locations = splitMultiValue(input.targetRegion).length > 0 ? splitMultiValue(input.targetRegion) : [input.targetRegion ?? "Deutschland"];
  const urls: string[] = [];

  for (const role of roles.slice(0, 3)) {
    for (const location of locations.slice(0, 3)) {
      const params = new URLSearchParams({
        keywords: role,
        location,
      });
      urls.push(`https://www.linkedin.com/jobs/search/?${params.toString()}`);
    }
  }

  return Array.from(new Set(urls));
}

export function mapSearchProfileToGenericApifyInput(input: SearchProviderSearchInput) {
  return {
    profileId: input.profileId,
    targetRole: input.targetRole ?? null,
    targetRegion: input.targetRegion ?? null,
    targetCountry: input.country ?? null,
    includeKeywords: input.keywords,
    excludeKeywords: input.excludeKeywords,
    languages: input.languages ?? [],
    industry: input.industry ?? null,
    activeSources: input.providerNames ?? [],
    page: input.page ?? 1,
    pageSize: input.pageSize ?? 12,
    maxItems: input.pageSize ?? 12,
  };
}

export function buildActorSpecificInput(
  actorReference: string,
  input: SearchProviderSearchInput,
): ActorSpecificInputResult {
  const primaryRole = input.keywords[0] ?? input.targetRole ?? "Recruiter";
  const primaryLocation = splitMultiValue(input.targetRegion)[0] ?? input.targetRegion ?? "Deutschland";
  const pageSize = Math.max(10, input.pageSize ?? 12);
  const stepstoneSettings = input.providerSettings?.stepstone;
  const linkedinSettings = input.providerSettings?.linkedin;
  const indeedSettings = input.providerSettings?.indeed;

  switch (actorReference) {
    case "hMvNSpz3JnHgl5jkh":
      return {
        supported: true as const,
        payload: {
          position: indeedSettings?.position || primaryRole,
          location: indeedSettings?.location || primaryLocation,
          country: mapCountryToIndeed(indeedSettings?.country || input.country),
          maxItemsPerSearch: indeedSettings?.maxItemsPerSearch ?? pageSize,
          startUrls: toStartUrlObjects(indeedSettings?.startUrls),
          parseCompanyDetails: indeedSettings?.parseCompanyDetails ?? true,
          saveOnlyUniqueItems: indeedSettings?.saveOnlyUniqueItems ?? true,
          followApplyRedirects: indeedSettings?.followApplyRedirects ?? true,
        },
      };

    case "MXLpngmVpE8WTESQr":
      return {
        supported: true as const,
        payload: {
          query: indeedSettings?.position || primaryRole,
          location: indeedSettings?.location || primaryLocation,
          country: mapCountryToLowerIndeed(indeedSettings?.country || input.country),
          maxRows: indeedSettings?.maxItemsPerSearch ?? pageSize,
          maxRowsPerUrl: indeedSettings?.maxItemsPerSearch ?? pageSize,
          enableUniqueJobs: indeedSettings?.saveOnlyUniqueItems ?? true,
          includeSimilarJobs: false,
          sort: "date",
        },
      };

    case "hKByXkMQaC5Qt9UMN":
      return {
        supported: true as const,
        payload: {
          urls: buildLinkedInJobUrls(input),
          scrapeCompany: true,
          count: Math.max(10, linkedinSettings?.rows ?? pageSize),
          splitByLocation: false,
        },
      };

    case "BHzefUZlZRKWxkTck":
      return {
        supported: true as const,
        payload: {
          title: linkedinSettings?.title || primaryRole,
          location: linkedinSettings?.location || primaryLocation,
          companyName: compactStrings(linkedinSettings?.companyName),
          companyId: compactStrings(linkedinSettings?.companyId),
          rows: Math.min(1000, Math.max(20, linkedinSettings?.rows ?? pageSize)),
          publishedAt: linkedinSettings?.publishedAt || "Any Time",
          workType: linkedinSettings?.workType || undefined,
          contractType: linkedinSettings?.contractType || undefined,
          experienceLevel: linkedinSettings?.experienceLevel || undefined,
          proxy: {
            useApifyProxy: true,
            apifyProxyGroups: ["RESIDENTIAL"],
          },
        },
      };

    case "IGjzUXKHqlsJaT58u":
      return {
        supported: true as const,
        payload: {
          startUrls: compactStrings(stepstoneSettings?.startUrls),
          domain: stepstoneSettings?.domain || "stepstone.de",
          queries:
            compactStrings(stepstoneSettings?.queries).length > 0
              ? compactStrings(stepstoneSettings?.queries)
              : input.keywords.length > 0
                ? input.keywords.slice(0, 4)
                : [primaryRole],
          location: stepstoneSettings?.location || primaryLocation,
          distanceFromSource: sanitizeStepstoneDistance(stepstoneSettings?.distanceFromSource),
          workRemote: compactStrings(stepstoneSettings?.workRemote),
          ApplicationType: compactStrings(stepstoneSettings?.applicationType),
          listingLanguage:
            compactStrings(stepstoneSettings?.listingLanguage).length > 0
              ? compactStrings(stepstoneSettings?.listingLanguage)
              : (input.languages ?? [])
                  .map((language) => (language.toLowerCase().includes("de") ? "GERMAN" : "ENGLISH"))
                  .filter(Boolean),
          WorkingHours: compactStrings(stepstoneSettings?.workingHours),
          employmentType: compactStrings(stepstoneSettings?.employmentType),
          experience: compactStrings(stepstoneSettings?.experience),
          publishedDate: stepstoneSettings?.publishedDate || "last-7-days",
          limit: Math.max(10, stepstoneSettings?.limit ?? Math.max(50, pageSize)),
          proxy: {
            useApifyProxy: true,
          },
        },
      };

    case "YGO6eh6ICQXnan9L4":
      return {
        supported: true as const,
        payload: {
          keyword: primaryRole,
          location: primaryLocation,
          discipline: input.industry || "Human Resources",
          results_wanted: pageSize,
          max_pages: 3,
        },
      };

    default:
      return {
        supported: true as const,
        payload: mapSearchProfileToGenericApifyInput(input),
      };
  }
}

function normalizeProviderName(providerName: string) {
  const value = providerName.toLowerCase();
  if (value === "apify_actor") return "indeed_live";
  if (value.includes("stepstone")) return "mock_stepstone";
  if (value.includes("indeed")) return "mock_indeed";
  if (value.includes("linkedin")) return "mock_linkedin_reference";
  if (value.includes("xing")) return "mock_linkedin_reference";
  return providerName;
}

export function mapApifyItemToSearchJob(
  item: Record<string, unknown>,
  fallbackInput: SearchProviderSearchInput,
): SearchProviderJobResult {
  const title = pickString(
    item,
    ["title", "jobTitle", "positionTitle", "positionName", "position"],
    fallbackInput.targetRole ?? "Unbekannter Job",
  );
  const companyName = pickString(item, ["companyName", "company", "employer", "organization", "company_name"], "Unbekanntes Unternehmen");
  const location = pickString(item, ["location", "jobLocation", "city"], fallbackInput.targetRegion ?? "Unbekannt");
  const country = pickString(item, ["country", "jobCountry"], fallbackInput.country ?? "Unbekannt");
  const sourceUrl = pickString(item, ["sourceUrl", "url", "jobUrl", "link"], "https://apify.com");
  const rawDescription = pickString(
    item,
    ["rawDescription", "description", "jobDescription", "text", "snippet"],
    "Keine Beschreibung aus dem Actor-Dataset erhalten.",
  );
  const providerName = normalizeProviderName(
    pickString(item, ["provider_name", "providerName", "source", "originProvider"], "apify_actor"),
  );
  const publishedAt = pickString(item, ["publishedAt", "postedAt", "createdAt", "datePosted"], new Date().toISOString());
  const externalId = pickString(item, ["external_id", "externalId", "id", "jobId"], `${providerName}_${title}`);

  return {
    externalId,
    providerName,
    sourceUrl,
    title,
    companyName,
    location,
    country,
    employmentType: pickNullableString(item, ["employmentType", "contractType", "jobType"]),
    rawDescription,
    publishedAt,
    duplicateHash: buildDuplicateHash(title, companyName, location),
  };
}
