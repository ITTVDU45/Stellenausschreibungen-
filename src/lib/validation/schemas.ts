import { z } from "zod";

const multiStringArraySchema = z.array(z.string().min(1));
const defaultStringArraySchema = multiStringArraySchema.default([]);
const nonNegativeInt = z.coerce.number().int().min(1);

const stepstoneSettingsSchema = z.object({
  startUrls: defaultStringArraySchema,
  domain: z.string().min(2),
  queries: multiStringArraySchema.min(1),
  location: z.string().min(2),
  distanceFromSource: z.string().min(1),
  workRemote: defaultStringArraySchema,
  applicationType: defaultStringArraySchema,
  listingLanguage: defaultStringArraySchema,
  workingHours: defaultStringArraySchema,
  employmentType: defaultStringArraySchema,
  experience: defaultStringArraySchema,
  publishedDate: z.string().min(1),
  limit: nonNegativeInt,
});

const linkedinSettingsSchema = z.object({
  title: z.string().min(2),
  location: z.string().min(2),
  companyName: defaultStringArraySchema,
  companyId: defaultStringArraySchema,
  publishedAt: z.string().min(1),
  rows: nonNegativeInt,
  workType: z.string().default(""),
  contractType: z.string().default(""),
  experienceLevel: z.string().default(""),
});

const indeedSettingsSchema = z.object({
  position: z.string().min(2),
  maxItemsPerSearch: nonNegativeInt,
  country: z.string().min(2),
  location: z.string().min(2),
  startUrls: defaultStringArraySchema,
  parseCompanyDetails: z.boolean(),
  saveOnlyUniqueItems: z.boolean(),
  followApplyRedirects: z.boolean(),
});

export const searchProfileSchema = z.object({
  name: z.string().min(2),
  targetRole: z.string().min(2),
  targetRegion: z.string().min(2),
  targetCountry: z.string().min(2),
  includeKeywords: z.array(z.string().min(1)).min(1),
  excludeKeywords: z.array(z.string().min(1)).default([]),
  languages: z.array(z.string().min(1)).min(1),
  industry: z.string().min(2),
  priority: z.enum(["low", "medium", "high"]),
  activeSources: z
    .array(z.enum(["mock_stepstone", "mock_indeed", "mock_linkedin_reference"]))
    .min(1),
  providerSettings: z.object({
    stepstone: stepstoneSettingsSchema,
    linkedin: linkedinSettingsSchema,
    indeed: indeedSettingsSchema,
  }),
  active: z.boolean(),
});

export const templateSchema = z.object({
  name: z.string().min(2),
  language: z.string().min(2),
  channel: z.enum(["email", "linkedin", "phone_followup"]),
  subjectTemplate: z.string().min(3),
  bodyTemplate: z.string().min(10),
  active: z.boolean(),
});

export const employerUpdateSchema = z.object({
  website: z.string().url().nullable().optional().or(z.literal("")),
  careersUrl: z.string().url().nullable().optional().or(z.literal("")),
  contactEmail: z.string().email().nullable().optional().or(z.literal("")),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  linkedinUrl: z.string().url().nullable().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const jobStatusSchema = z.object({
  status: z.enum([
    "new",
    "reviewed",
    "analyzed",
    "shortlisted",
    "outreach_draft",
    "duplicate_review",
    "archived",
  ]),
});

export const outreachGenerateSchema = z.object({
  jobId: z.string().min(1),
  employerId: z.string().min(1),
  contactId: z.string().nullable(),
  templateId: z.string().min(1),
});

export const approvalSchema = z.object({
  approvalStatus: z.enum(["approved"]),
});

export const sendSchema = z.object({
  sendStatus: z.enum(["mock_sent"]),
});

export const analyzeBulkSchema = z.object({
  jobIds: z.array(z.string().min(1)).min(1),
});
