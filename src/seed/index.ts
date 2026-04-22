import { createId } from "@/lib/utils/id";
import { normalizeText } from "@/lib/utils/format";
import type {
  ActivityLogRecord,
  AppDataSnapshot,
  EmployerContactRecord,
  EmployerRecord,
  JobAnalysisRecord,
  JobRecord,
  OutreachMessageRecord,
  SearchProfileRecord,
  SearchProfileProviderSettings,
  SearchRunRecord,
  TemplateRecord,
} from "@/types/domain";

const baseDate = new Date("2026-04-04T09:00:00.000Z");

function isoOffset(days: number, hours = 0) {
  const date = new Date(baseDate);
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(date.getUTCHours() + hours);
  return date.toISOString();
}

function buildDuplicateHash(title: string, company: string, location: string) {
  return normalizeText(`${title}-${company}-${location}`).replace(/\s+/g, "-");
}

interface JobSeedSpec {
  title: string;
  companyName: string;
  location: string;
  country: string;
  employmentType: string | null;
  providerName: string;
  providerSuffix: string;
  publishedAt: string;
  rawDescription: string;
}

const companies = [
  ["Nordic Talent Partners", "https://nordictalent.example", "https://nordictalent.example/careers", "hello@nordictalent.example", "+49 40 1234 9001", "Osterstraße 18, Hamburg", "https://linkedin.com/company/nordic-talent-partners", "Fokussiert auf internationale Fachkräfte im Tech-Umfeld."],
  ["Helios Process Systems", "https://helios-process.example", "https://helios-process.example/jobs", "jobs@helios-process.example", "+49 89 2201 9910", "Landsberger Straße 101, München", "https://linkedin.com/company/helios-process", "Wachsendes Operations-Team, mehrere EU-Standorte."],
  ["BridgeHire Solutions", "https://bridgehire.example", "https://bridgehire.example/careers", "careers@bridgehire.example", "+49 211 8811 5520", "Königsallee 55, Düsseldorf", "https://linkedin.com/company/bridgehire-solutions", "Gute Reaktionszeiten, kontaktfreudiges Recruiting-Team."],
  ["PeopleFlow Labs", "https://peopleflow.example", "https://peopleflow.example/jobs", "team@peopleflow.example", "+49 30 9090 2020", "Torstraße 22, Berlin", "https://linkedin.com/company/peopleflow-labs", "Remote-first, hoher Bedarf an mehrsprachigen Sourcern."],
  ["Atlas Mobility Hiring", "https://atlasmobility.example", "https://atlasmobility.example/careers", "mobility@atlasmobility.example", "+49 69 4400 2030", "Mainzer Landstraße 45, Frankfurt", "https://linkedin.com/company/atlas-mobility-hiring", "Starker Fokus auf Visa und Relocation im Blue-Collar-Bereich."],
  ["Crafted Commerce Recruiting", "https://craftedcommerce.example", "https://craftedcommerce.example/jobs", "recruiting@craftedcommerce.example", "+49 221 3131 4400", "Aachener Straße 121, Köln", "https://linkedin.com/company/crafted-commerce-recruiting", "E-Commerce Recruiting mit Fokus auf Performance Marketing und Sales Ops."],
  ["RheinScale Engineering", "https://rheinscale.example", "https://rheinscale.example/careers", "talent@rheinscale.example", "+49 711 6600 1100", "Theodor-Heuss-Straße 31, Stuttgart", "https://linkedin.com/company/rheinscale-engineering", "Mischung aus lokaler Fertigung und internationalem Recruiting."],
  ["Summit Medical Placement", "https://summitmedical.example", "https://summitmedical.example/careers", "placement@summitmedical.example", "+49 351 4400 8899", "Prager Straße 8, Dresden", "https://linkedin.com/company/summit-medical-placement", "Pflegt sehr strukturierte Klinik-Kontakte."],
] as const;

function buildProviderSettings(input: {
  roles: string[];
  locations: string[];
  languages: string[];
  country?: string;
  stepstoneDomain?: string;
  linkedinCompanies?: string[];
  linkedinCompanyIds?: string[];
}): SearchProfileProviderSettings {
  const primaryRole = input.roles[0] ?? "Recruiter";
  const primaryLocation = input.locations.join(", ") || "Deutschland";
  const country = input.country ?? "Germany";
  const listingLanguage = input.languages.map((language) =>
    language.toLowerCase().includes("de") ? "GERMAN" : "ENGLISH",
  );

  return {
    stepstone: {
      startUrls: [],
      domain: input.stepstoneDomain ?? "stepstone.de",
      queries: input.roles,
      location: primaryLocation,
      distanceFromSource: "30",
      workRemote: [],
      applicationType: [],
      listingLanguage,
      workingHours: [],
      employmentType: [],
      experience: [],
      publishedDate: "last-7-days",
      limit: 80,
    },
    linkedin: {
      title: primaryRole,
      location: primaryLocation,
      companyName: input.linkedinCompanies ?? [],
      companyId: input.linkedinCompanyIds ?? [],
      publishedAt: "Any Time",
      rows: 50,
      workType: "",
      contractType: "",
      experienceLevel: "",
    },
    indeed: {
      position: primaryRole,
      maxItemsPerSearch: 100,
      country,
      location: primaryLocation,
      startUrls: [],
      parseCompanyDetails: true,
      saveOnlyUniqueItems: true,
      followApplyRedirects: true,
    },
  };
}

const profileSeeds: SearchProfileRecord[] = [
  {
    id: "profile_berlin_sales_ops",
    name: "Sales Operations DACH",
    targetRole: "Sales Operations Manager",
    targetRegion: "Berlin, Hamburg, Muenchen",
    targetCountry: "Deutschland",
    includeKeywords: ["sales ops", "crm", "hubspot", "pipeline"],
    excludeKeywords: ["praktikum", "werkstudent"],
    languages: ["Deutsch", "Englisch"],
    industry: "SaaS",
    priority: "high",
    activeSources: ["mock_stepstone", "mock_indeed", "mock_linkedin_reference"],
    providerSettings: buildProviderSettings({
      roles: ["Sales Operations Manager", "CRM Manager", "Revenue Operations Manager"],
      locations: ["Berlin", "Hamburg", "Muenchen"],
      languages: ["Deutsch", "Englisch"],
      country: "Germany",
      linkedinCompanies: ["HubSpot", "Pipedrive"],
      linkedinCompanyIds: ["2839350", "302160"],
    }),
    active: true,
    createdAt: isoOffset(-35),
  },
  {
    id: "profile_recruiting_healthcare",
    name: "Healthcare Recruiting",
    targetRole: "Talent Acquisition Specialist",
    targetRegion: "Stuttgart, Muenchen, Augsburg",
    targetCountry: "Deutschland",
    includeKeywords: ["recruiting", "healthcare", "talent acquisition"],
    excludeKeywords: ["intern", "student"],
    languages: ["Deutsch", "Englisch"],
    industry: "Healthcare",
    priority: "high",
    activeSources: ["mock_stepstone", "mock_indeed"],
    providerSettings: buildProviderSettings({
      roles: ["Talent Acquisition Specialist", "Healthcare Recruiter"],
      locations: ["Stuttgart", "Muenchen", "Augsburg"],
      languages: ["Deutsch", "Englisch"],
      country: "Germany",
    }),
    active: true,
    createdAt: isoOffset(-24),
  },
  {
    id: "profile_relocation_blue_collar",
    name: "Blue Collar Mobility",
    targetRole: "International Recruiting Lead",
    targetRegion: "Duisburg, Essen, Oberhausen",
    targetCountry: "Deutschland",
    includeKeywords: ["relocation", "visa", "recruiting", "blue collar"],
    excludeKeywords: ["senior director"],
    languages: ["Deutsch", "Polnisch", "Englisch"],
    industry: "Mobility",
    priority: "medium",
    activeSources: ["mock_indeed", "mock_linkedin_reference"],
    providerSettings: buildProviderSettings({
      roles: ["LKW Fahrer", "International Recruiting Lead", "Blue Collar Recruiter"],
      locations: ["Duisburg", "Essen", "Oberhausen"],
      languages: ["Deutsch", "Polnisch", "Englisch"],
      country: "Germany",
      linkedinCompanies: ["Google", "Microsoft"],
      linkedinCompanyIds: ["76987811", "1815218"],
    }),
    active: true,
    createdAt: isoOffset(-18),
  },
  {
    id: "profile_remote_people_ops",
    name: "Remote People Ops",
    targetRole: "People Operations Partner",
    targetRegion: "Berlin, Remote, Amsterdam",
    targetCountry: "Deutschland",
    includeKeywords: ["people ops", "remote", "employee experience"],
    excludeKeywords: ["assistant"],
    languages: ["Deutsch", "Englisch"],
    industry: "HR Tech",
    priority: "medium",
    activeSources: ["mock_linkedin_reference"],
    providerSettings: buildProviderSettings({
      roles: ["People Operations Partner", "HR Operations Partner"],
      locations: ["Berlin", "Remote", "Amsterdam"],
      languages: ["Deutsch", "Englisch"],
      country: "Germany",
      linkedinCompanies: ["Google", "Microsoft"],
      linkedinCompanyIds: ["76987811", "1815218"],
    }),
    active: false,
    createdAt: isoOffset(-11),
  },
];

const baseSpecs: JobSeedSpec[] = [
  { title: "Sales Operations Manager", companyName: "Nordic Talent Partners", location: "Hamburg", country: "Deutschland", employmentType: "Vollzeit", providerName: "mock_stepstone", providerSuffix: "001", publishedAt: isoOffset(-8), rawDescription: "Wir suchen eine Person für Sales Operations mit CRM Fokus. Aufgaben: Reporting, Pipeline Management, HubSpot, Forecasting, Abstimmung mit Vertrieb. Deutsch und Englisch erforderlich. Relocation nicht vorgesehen." },
  { title: "Senior Recruiter Healthcare", companyName: "Summit Medical Placement", location: "Dresden", country: "Deutschland", employmentType: "Vollzeit", providerName: "mock_indeed", providerSuffix: "002", publishedAt: isoOffset(-10), rawDescription: "Recruiting für Kliniken und Pflegeeinrichtungen. Erfahrung in Talent Acquisition, Kandidatenansprache und Stakeholder Management. Deutsch C1, Englisch B2. Visa-Sponsoring möglich." },
  { title: "International Recruiting Lead", companyName: "Atlas Mobility Hiring", location: "Frankfurt", country: "Deutschland", employmentType: "Vollzeit", providerName: "mock_linkedin_reference", providerSuffix: "003", publishedAt: isoOffset(-7), rawDescription: "Aufbau internationaler Recruiting-Pipelines für Mobility-Projekte. Fokus auf Relocation, Visa-Koordination, Kampagnensteuerung und Arbeitgeberkommunikation. Deutsch und Polnisch von Vorteil." },
  { title: "People Operations Partner", companyName: "PeopleFlow Labs", location: "Berlin / Remote", country: "Deutschland", employmentType: "Hybrid", providerName: "mock_linkedin_reference", providerSuffix: "004", publishedAt: isoOffset(-5), rawDescription: "Remote-first Team sucht People Ops Partner mit Erfahrung in Employee Experience, HRIS, Onboarding und Zusammenarbeit mit Recruiting. Englisch fließend, Deutsch hilfreich." },
  { title: "Talent Sourcer DACH", companyName: "BridgeHire Solutions", location: "Düsseldorf", country: "Deutschland", employmentType: "Vollzeit", providerName: "mock_stepstone", providerSuffix: "005", publishedAt: isoOffset(-14), rawDescription: "Active Sourcing, Projektsteuerung, Kandidatenansprache und Suchprofil-Optimierung für DACH-Rollen. Sehr gute Deutsch- und Englischkenntnisse. LinkedIn Recruiter Erfahrung gewünscht." },
  { title: "Recruiting Coordinator", companyName: "Helios Process Systems", location: "München", country: "Deutschland", employmentType: "Vollzeit", providerName: "mock_indeed", providerSuffix: "006", publishedAt: isoOffset(-3), rawDescription: "Koordination von Interviews, Pflege des ATS, enge Abstimmung mit Hiring Managern. Deutsch C1. Erste Erfahrung im Recruiting. Keine Angaben zu Remote oder Visa." },
  { title: "Employer Branding Specialist", companyName: "Crafted Commerce Recruiting", location: "Köln", country: "Deutschland", employmentType: "Hybrid", providerName: "mock_stepstone", providerSuffix: "007", publishedAt: isoOffset(-2), rawDescription: "Employer Branding, Kampagnenmanagement und Performance-Auswertung für Hiring-Funnel. Erfahrung mit Content, Social, Analytics. Deutsch und Englisch. Standort Köln." },
  { title: "HR Project Manager", companyName: "RheinScale Engineering", location: "Stuttgart", country: "Deutschland", employmentType: "Vollzeit", providerName: "mock_indeed", providerSuffix: "008", publishedAt: isoOffset(-12), rawDescription: "Projektmanagement für HR-Initiativen, Prozessdesign, Stakeholdermanagement und Reporting. SAP SuccessFactors hilfreich. Deutsch erforderlich." },
];

const jobTemplates: JobSeedSpec[] = Array.from({ length: 32 }, (_, index) => {
  const template = baseSpecs[index % baseSpecs.length];
  const company = companies[index % companies.length];
  const locationVariants = [template.location, "Berlin", "München", "Hamburg", "Remote / Deutschland", "Köln", "Frankfurt"];
  const providerNames = ["mock_stepstone", "mock_indeed", "mock_linkedin_reference"] as const;
  const providerName = providerNames[index % providerNames.length] ?? "mock_stepstone";

  return {
    ...template,
    title: index % 5 === 0 ? template.title : `${template.title}${index % 4 === 0 ? " (m/w/d)" : ""}`,
    companyName: company[0],
    location: locationVariants[index % locationVariants.length] ?? template.location,
    providerName,
    providerSuffix: `${String(index + 1).padStart(3, "0")}`,
    publishedAt: isoOffset(-14 + (index % 12), index % 6),
    rawDescription:
      index % 6 === 0
        ? `${template.rawDescription} Zusätzlich wichtig: Kandidaten aus dem EU-Ausland willkommen, strukturierte Outreach-Prozesse und Dokumentation im CRM.`
        : index % 7 === 0
          ? `${template.rawDescription} Hinweis: Remote-Anteil 3 Tage pro Woche, Reisebereitschaft gelegentlich erforderlich.`
          : template.rawDescription,
  };
});

function createJobRecord(spec: JobSeedSpec, index: number): JobRecord {
  const duplicatedLocation = index === 6 ? "Hamburg" : spec.location;
  const title = index === 6 ? "Sales Operations Manager" : spec.title;
  const companyName = index === 6 ? "Nordic Talent Partners" : spec.companyName;

  return {
    id: `job_${String(index + 1).padStart(3, "0")}`,
    searchRunId: index < 12 ? "run_001" : index < 21 ? "run_002" : index < 27 ? "run_003" : null,
    isSeed: true,
    externalId: `${spec.providerName}_${spec.providerSuffix}`,
    providerName: spec.providerName,
    sourceUrl: `https://jobs.example/${spec.providerName}/${spec.providerSuffix}`,
    title,
    companyName,
    location: duplicatedLocation,
    country: spec.country,
    employmentType: index % 9 === 0 ? null : spec.employmentType,
    rawDescription: index % 8 === 0 ? `${spec.rawDescription}   ` : spec.rawDescription,
    cleanDescription: index % 5 === 0 ? spec.rawDescription.replace(/\s+/g, " ").trim() : null,
    publishedAt: spec.publishedAt,
    importedAt: isoOffset(-4 + (index % 4), index % 3),
    duplicateHash: buildDuplicateHash(title, companyName, duplicatedLocation),
    status: index % 9 === 0 ? "duplicate_review" : index % 4 === 0 ? "analyzed" : index % 3 === 0 ? "reviewed" : "new",
    employerId: null,
  };
}

function simpleAnalysis(job: JobRecord): JobAnalysisRecord {
  const cleaned = job.rawDescription.replace(/\s+/g, " ").trim();
  const lower = cleaned.toLowerCase();
  const skills = ["crm", "hubspot", "recruiting", "sourcing", "stakeholder management", "reporting", "analytics", "visa", "relocation", "employee experience"].filter((skill) => lower.includes(skill));
  const languageRequirements = ["Deutsch", "Englisch", "Polnisch"].filter((language) => lower.includes(language.toLowerCase()));
  const requirements = cleaned.split(".").map((sentence) => sentence.trim()).filter(Boolean).slice(0, 3);

  return {
    id: `analysis_${job.id}`,
    jobId: job.id,
    summaryShort: `${job.title} bei ${job.companyName} mit Fokus auf ${skills[0] ?? "strukturierte Recruiting-Prozesse"}.`,
    summaryLong: `${job.title} in ${job.location}. Zentrale Punkte: ${requirements.join("; ")}.`,
    extractedSkills: skills,
    extractedRequirements: requirements,
    extractedLanguageRequirements: languageRequirements,
    visaHint: lower.includes("visa") ? "Visa-Support erwähnt" : "Keine Visa-Angabe",
    relocationHint: lower.includes("relocation") ? "Relocation im Prozess berücksichtigt" : "Keine Relocation-Angabe",
    relevanceScore: Math.min(97, 55 + skills.length * 8 + languageRequirements.length * 5),
    confidenceScore: Math.min(94, 58 + requirements.length * 9),
  };
}

function createEmployersFromJobs(jobs: JobRecord[]): EmployerRecord[] {
  return companies.map((company, index) => {
    const matchingJobs = jobs.filter((job) => job.companyName === company[0]);
    const completenessFields = [company[1], company[2], company[3], company[4], company[5], company[6]].filter(Boolean).length;

    return {
      id: `employer_${String(index + 1).padStart(3, "0")}`,
      companyName: company[0],
      website: index === 5 ? null : company[1],
      careersUrl: index === 2 ? null : company[2],
      contactEmail: index === 6 ? null : company[3],
      phone: index === 3 ? null : company[4],
      address: company[5],
      linkedinUrl: company[6],
      notes: `${company[7]} Aktuell ${matchingJobs.length} verknüpfte Jobs im System.`,
      completenessScore: Math.round((completenessFields / 6) * 100),
    };
  });
}

function createContacts(employers: EmployerRecord[]): EmployerContactRecord[] {
  return employers.flatMap((employer, index) => [
    { id: `contact_${String(index + 1).padStart(3, "0")}_a`, employerId: employer.id, fullName: `Anna ${employer.companyName.split(" ")[0]}`, role: "Talent Acquisition Lead", email: index % 4 === 0 ? null : `anna.${employer.companyName.split(" ")[0]?.toLowerCase()}@example.com`, phone: `+49 170 ${String(550000 + index).padStart(6, "0")}`, source: "manual_research", confidenceScore: 78 + (index % 4) * 4 },
    { id: `contact_${String(index + 1).padStart(3, "0")}_b`, employerId: employer.id, fullName: `Lukas ${employer.companyName.split(" ")[0]}`, role: "People Operations Manager", email: `lukas.${employer.companyName.split(" ")[0]?.toLowerCase()}@example.com`, phone: index % 3 === 0 ? null : `+49 171 ${String(330000 + index).padStart(6, "0")}`, source: "linkedin_reference", confidenceScore: 68 + (index % 5) * 5 },
  ]);
}

const templateSeeds: TemplateRecord[] = [
  { id: "template_email_intro_de", name: "Erstansprache Recruiting DE", language: "Deutsch", channel: "email", subjectTemplate: "Austausch zu {{job_title}} bei {{company_name}}", bodyTemplate: "Hallo {{contact_name}},\n\nmir ist Ihre Rolle {{job_title}} in {{location}} aufgefallen. Wir unterstützen Teams wie {{company_name}} dabei, passende Kandidat:innen mit {{specialization}} effizient anzusprechen.\n\nWenn es hilfreich ist, teile ich gern 2-3 passende Profile oder eine kurze Einschätzung zum aktuellen Markt.\n\nViele Grüße\nRecruiting Team", active: true },
  { id: "template_linkedin_short_de", name: "LinkedIn Kurzansprache", language: "Deutsch", channel: "linkedin", subjectTemplate: "Impuls zu {{company_name}}", bodyTemplate: "Hallo {{contact_name}}, ich habe Ihre Vakanz {{job_title}} gesehen. Falls {{language}}-starke Kandidat:innen mit {{specialization}} relevant sind, kann ich gern ein kurzes Marktbild teilen.", active: true },
  { id: "template_email_followup_en", name: "Follow-up Englisch", language: "Englisch", channel: "email", subjectTemplate: "Following up on {{job_title}}", bodyTemplate: "Hi {{contact_name}},\n\nsharing a short follow-up regarding {{job_title}} at {{company_name}}. We currently see strong profiles in {{location}} with experience in {{specialization}}.\n\nHappy to send a compact shortlist if useful.", active: true },
  { id: "template_phone_followup_de", name: "Telefonisches Follow-up", language: "Deutsch", channel: "phone_followup", subjectTemplate: "Telefonleitfaden {{company_name}}", bodyTemplate: "Bezug auf {{job_title}} nehmen, Bedarf in {{location}} abfragen, Engpässe bei {{specialization}} ansprechen und nächsten Schritt vereinbaren.", active: false },
];

function createOutreachMessages(jobs: JobRecord[], employers: EmployerRecord[], contacts: EmployerContactRecord[]): OutreachMessageRecord[] {
  return jobs.slice(0, 8).map((job, index) => {
    const employer = employers.find((entry) => entry.companyName === job.companyName) ?? employers[0];
    const contact = contacts.find((entry) => entry.employerId === employer?.id) ?? null;
    const template = templateSeeds[index % templateSeeds.length] ?? templateSeeds[0];

    return {
      id: `outreach_${String(index + 1).padStart(3, "0")}`,
      jobId: job.id,
      employerId: employer?.id ?? "employer_001",
      contactId: contact?.id ?? null,
      templateId: template.id,
      generatedSubject: template.subjectTemplate.replace("{{job_title}}", job.title).replace("{{company_name}}", job.companyName),
      generatedBody: template.bodyTemplate.replaceAll("{{company_name}}", job.companyName).replaceAll("{{job_title}}", job.title).replaceAll("{{location}}", job.location).replaceAll("{{contact_name}}", contact?.fullName ?? "Team").replaceAll("{{language}}", "Deutsch und Englisch").replaceAll("{{specialization}}", "Active Sourcing und strukturierter Outreach"),
      approvalStatus: index % 4 === 0 ? "approved" : index % 3 === 0 ? "pending_review" : "draft",
      sendStatus: index % 4 === 0 ? "mock_sent" : "not_sent",
      createdAt: isoOffset(-6 + index),
      sentAt: index % 4 === 0 ? isoOffset(-3 + index) : null,
      followUpAt: index % 3 === 0 ? isoOffset(3 + index) : null,
    };
  });
}

function createActivityLogs(snapshot: Omit<AppDataSnapshot, "activityLogs">): ActivityLogRecord[] {
  const logs: ActivityLogRecord[] = [];

  snapshot.searchProfiles.forEach((profile) => {
    logs.push({ id: createId("activity"), entityType: "search_profile", entityId: profile.id, action: "search_profile.created", payload: { name: profile.name, active: profile.active }, createdAt: profile.createdAt });
  });
  snapshot.searchRuns.forEach((run) => {
    logs.push({ id: createId("activity"), entityType: "search_run", entityId: run.id, action: "search_run.completed", payload: { providerName: run.providerName, resultCount: run.resultCount }, createdAt: run.runFinishedAt ?? run.runStartedAt });
  });
  snapshot.jobs.slice(0, 12).forEach((job) => {
    logs.push({ id: createId("activity"), entityType: "job", entityId: job.id, action: "job.imported", payload: { providerName: job.providerName, status: job.status }, createdAt: job.importedAt });
  });
  snapshot.outreachMessages.forEach((message) => {
    logs.push({ id: createId("activity"), entityType: "outreach_message", entityId: message.id, action: message.sendStatus === "mock_sent" ? "outreach.sent" : message.approvalStatus === "pending_review" ? "outreach.pending_review" : "outreach.generated", payload: { approvalStatus: message.approvalStatus, sendStatus: message.sendStatus }, createdAt: message.sentAt ?? message.createdAt });
  });

  return logs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSeedData(): AppDataSnapshot {
  const jobs = jobTemplates.map(createJobRecord);
  const employers = createEmployersFromJobs(jobs);
  const employerByName = new Map(employers.map((entry) => [entry.companyName, entry.id]));
  const jobsWithEmployers = jobs.map((job) => ({ ...job, employerId: employerByName.get(job.companyName) ?? null }));
  const jobAnalyses = jobsWithEmployers.filter((_, index) => index % 2 === 0).map((job) => simpleAnalysis(job));
  const contacts = createContacts(employers);
  const outreachMessages = createOutreachMessages(jobsWithEmployers, employers, contacts);
  const searchRuns: SearchRunRecord[] = [
    { id: "run_001", profileId: profileSeeds[0].id, providerName: "mock_search", runStartedAt: isoOffset(-4, -2), runFinishedAt: isoOffset(-4, -1), status: "completed", resultCount: 12, providerRunId: null, providerActorId: null, providerDatasetId: null, providerStatus: "succeeded", providerStartedAt: isoOffset(-4, -2), providerFinishedAt: isoOffset(-4, -1), lastPolledAt: isoOffset(-4, -1), errorMessage: null, resultsImported: true, providerRuns: [], usageTotalUsd: 0, datasetItemCount: 12 },
    { id: "run_002", profileId: profileSeeds[1].id, providerName: "mock_search", runStartedAt: isoOffset(-3, -3), runFinishedAt: isoOffset(-3, -2), status: "completed", resultCount: 9, providerRunId: null, providerActorId: null, providerDatasetId: null, providerStatus: "succeeded", providerStartedAt: isoOffset(-3, -3), providerFinishedAt: isoOffset(-3, -2), lastPolledAt: isoOffset(-3, -2), errorMessage: null, resultsImported: true, providerRuns: [], usageTotalUsd: 0, datasetItemCount: 9 },
    { id: "run_003", profileId: profileSeeds[2].id, providerName: "mock_search", runStartedAt: isoOffset(-1, -4), runFinishedAt: isoOffset(-1, -3), status: "completed", resultCount: 6, providerRunId: null, providerActorId: null, providerDatasetId: null, providerStatus: "succeeded", providerStartedAt: isoOffset(-1, -4), providerFinishedAt: isoOffset(-1, -3), lastPolledAt: isoOffset(-1, -3), errorMessage: null, resultsImported: true, providerRuns: [], usageTotalUsd: 0, datasetItemCount: 6 },
  ];
  const snapshotBase = { searchProfiles: profileSeeds, searchRuns, jobs: jobsWithEmployers, jobAnalyses, employers, employerContacts: contacts, templates: templateSeeds, outreachMessages };

  return { ...snapshotBase, activityLogs: createActivityLogs(snapshotBase) };
}

export function createProviderCatalog() {
  return jobTemplates.map((spec, index) => {
    const record = createJobRecord(spec, index);
    return { externalId: record.externalId, providerName: record.providerName, sourceUrl: record.sourceUrl, title: record.title, companyName: record.companyName, location: record.location, country: record.country, employmentType: record.employmentType, rawDescription: record.rawDescription, publishedAt: record.publishedAt, duplicateHash: record.duplicateHash };
  });
}
