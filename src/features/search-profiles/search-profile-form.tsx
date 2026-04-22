"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldHint, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { searchProfileSchema } from "@/lib/validation/schemas";
import type { SearchProfileRecord } from "@/types/domain";

const sourceOptions = [
  { value: "mock_stepstone", label: "Stepstone", description: "URL- oder Keyword-basierte Suche auf Stepstone-Domaenen." },
  { value: "mock_linkedin_reference", label: "Linked", description: "LinkedIn Job Search mit Titeln, Firmenfiltern und Publikationsfenster." },
  { value: "mock_indeed", label: "Indeed", description: "Indeed-Suche mit Keywords, Standorten und eindeutigen Listings." },
] as const;

const priorityOptions = [
  { value: "low", label: "Niedrig" },
  { value: "medium", label: "Mittel" },
  { value: "high", label: "Hoch" },
] as const;

const stepstoneDomainOptions = ["stepstone.de", "stepstone.at", "stepstone.be", "stepstone.nl"] as const;
const linkedPublishedAtOptions = ["Any Time", "Past 24 hours", "Past Week", "Past Month"] as const;
const stepstonePublishedDateOptions = [
  { value: "any-time", label: "Jederzeit" },
  { value: "last-24-hours", label: "Letzte 24 Stunden" },
  { value: "last-3-days", label: "Letzte 3 Tage" },
  { value: "last-7-days", label: "Letzte 7 Tage" },
  { value: "last-14-days", label: "Letzte 14 Tage" },
] as const;

type SourceOption = (typeof sourceOptions)[number]["value"];

type WizardValues = {
  name: string;
  roleText: string;
  locationText: string;
  languagesText: string;
  targetCountry: string;
  industry: string;
  activeSources: SourceOption[];
  priority: "low" | "medium" | "high";
  active: boolean;
  stepstoneStartUrlsText: string;
  stepstoneDomain: string;
  stepstoneQueriesText: string;
  stepstoneLocation: string;
  stepstoneDistanceFromSource: string;
  stepstoneWorkRemoteText: string;
  stepstoneApplicationTypeText: string;
  stepstoneListingLanguageText: string;
  stepstoneWorkingHoursText: string;
  stepstoneEmploymentTypeText: string;
  stepstoneExperienceText: string;
  stepstonePublishedDate: string;
  stepstoneLimit: number;
  linkedinTitle: string;
  linkedinLocation: string;
  linkedinCompanyNameText: string;
  linkedinCompanyIdText: string;
  linkedinPublishedAt: string;
  linkedinRows: number;
  linkedinWorkType: string;
  linkedinContractType: string;
  linkedinExperienceLevel: string;
  indeedPosition: string;
  indeedMaxItemsPerSearch: number;
  indeedCountry: string;
  indeedLocation: string;
  indeedStartUrlsText: string;
  indeedParseCompanyDetails: boolean;
  indeedSaveOnlyUniqueItems: boolean;
  indeedFollowApplyRedirects: boolean;
};

function parseMultiValue(value?: string) {
  return value
    ?.split(/[\n,;]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];
}

function joinMultiValue(value?: string[]) {
  return (value ?? []).join(", ");
}

function buildProfileName(roleText: string, locationText: string) {
  const roles = parseMultiValue(roleText);
  const locations = parseMultiValue(locationText);
  const rolePreview = roles.slice(0, 2).join(" / ") || "Job Search";
  const locationPreview = locations.slice(0, 2).join(" / ") || "Deutschland";
  return `${rolePreview} - ${locationPreview}`;
}

function sourceLabel(value: SourceOption) {
  return sourceOptions.find((source) => source.value === value)?.label ?? value;
}

function isSourceSelected(values: WizardValues, source: SourceOption) {
  return values.activeSources.includes(source);
}

function stepIsValid(step: number, values: WizardValues) {
  if (step === 0) {
    return values.activeSources.length > 0;
  }

  if (step === 1) {
    return (
      parseMultiValue(values.roleText).length > 0 &&
      parseMultiValue(values.locationText).length > 0 &&
      parseMultiValue(values.languagesText).length > 0 &&
      values.targetCountry.trim().length > 1 &&
      values.industry.trim().length > 1
    );
  }

  if (step === 2) {
    const needsStepstone =
      !isSourceSelected(values, "mock_stepstone") ||
      (parseMultiValue(values.stepstoneQueriesText).length > 0 &&
        values.stepstoneLocation.trim().length > 1 &&
        values.stepstoneDomain.trim().length > 1);
    const needsLinked =
      !isSourceSelected(values, "mock_linkedin_reference") ||
      (values.linkedinTitle.trim().length > 1 && values.linkedinLocation.trim().length > 1);
    const needsIndeed =
      !isSourceSelected(values, "mock_indeed") ||
      (values.indeedPosition.trim().length > 1 &&
        values.indeedLocation.trim().length > 1 &&
        values.indeedCountry.trim().length > 1);

    return needsStepstone && needsLinked && needsIndeed;
  }

  return values.name.trim().length >= 2;
}

function buildDefaultValues(profile?: SearchProfileRecord | null): WizardValues {
  const suggestedName = buildProfileName(profile?.targetRole ?? "Sales", profile?.targetRegion ?? "Deutschland");
  const settings = profile?.providerSettings;

  return {
    name: profile?.name ?? suggestedName,
    roleText: profile?.targetRole ?? joinMultiValue(profile?.includeKeywords) ?? "",
    locationText: profile?.targetRegion ?? "",
    languagesText: joinMultiValue(profile?.languages) || "Deutsch, Englisch",
    targetCountry: profile?.targetCountry ?? settings?.indeed.country ?? "Germany",
    industry: profile?.industry ?? "General",
    activeSources: (profile?.activeSources ?? ["mock_stepstone", "mock_linkedin_reference", "mock_indeed"]) as SourceOption[],
    priority: profile?.priority ?? "medium",
    active: profile?.active ?? true,
    stepstoneStartUrlsText: joinMultiValue(settings?.stepstone.startUrls),
    stepstoneDomain: settings?.stepstone.domain ?? "stepstone.de",
    stepstoneQueriesText:
      joinMultiValue(settings?.stepstone.queries) || profile?.targetRole || joinMultiValue(profile?.includeKeywords),
    stepstoneLocation: settings?.stepstone.location ?? profile?.targetRegion ?? "",
    stepstoneDistanceFromSource: settings?.stepstone.distanceFromSource ?? "30",
    stepstoneWorkRemoteText: joinMultiValue(settings?.stepstone.workRemote),
    stepstoneApplicationTypeText: joinMultiValue(settings?.stepstone.applicationType),
    stepstoneListingLanguageText: joinMultiValue(settings?.stepstone.listingLanguage) || joinMultiValue(profile?.languages),
    stepstoneWorkingHoursText: joinMultiValue(settings?.stepstone.workingHours),
    stepstoneEmploymentTypeText: joinMultiValue(settings?.stepstone.employmentType),
    stepstoneExperienceText: joinMultiValue(settings?.stepstone.experience),
    stepstonePublishedDate: settings?.stepstone.publishedDate ?? "last-7-days",
    stepstoneLimit: settings?.stepstone.limit ?? 80,
    linkedinTitle: settings?.linkedin.title ?? profile?.targetRole ?? "",
    linkedinLocation: settings?.linkedin.location ?? profile?.targetRegion ?? "",
    linkedinCompanyNameText: joinMultiValue(settings?.linkedin.companyName),
    linkedinCompanyIdText: joinMultiValue(settings?.linkedin.companyId),
    linkedinPublishedAt: settings?.linkedin.publishedAt ?? "Any Time",
    linkedinRows: settings?.linkedin.rows ?? 50,
    linkedinWorkType: settings?.linkedin.workType ?? "",
    linkedinContractType: settings?.linkedin.contractType ?? "",
    linkedinExperienceLevel: settings?.linkedin.experienceLevel ?? "",
    indeedPosition: settings?.indeed.position ?? profile?.targetRole ?? "",
    indeedMaxItemsPerSearch: settings?.indeed.maxItemsPerSearch ?? 100,
    indeedCountry: settings?.indeed.country ?? profile?.targetCountry ?? "Germany",
    indeedLocation: settings?.indeed.location ?? profile?.targetRegion ?? "",
    indeedStartUrlsText: joinMultiValue(settings?.indeed.startUrls),
    indeedParseCompanyDetails: settings?.indeed.parseCompanyDetails ?? true,
    indeedSaveOnlyUniqueItems: settings?.indeed.saveOnlyUniqueItems ?? true,
    indeedFollowApplyRedirects: settings?.indeed.followApplyRedirects ?? true,
  };
}

export function SearchProfileForm({ profile }: { profile?: SearchProfileRecord | null }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<WizardValues>({
    defaultValues: buildDefaultValues(profile),
    mode: "onChange",
  });

  const watchedValues = form.watch();
  const parsedRoles = useMemo(() => parseMultiValue(watchedValues.roleText), [watchedValues.roleText]);
  const parsedLocations = useMemo(() => parseMultiValue(watchedValues.locationText), [watchedValues.locationText]);
  const parsedLanguages = useMemo(() => parseMultiValue(watchedValues.languagesText), [watchedValues.languagesText]);
  const suggestedName = useMemo(
    () => buildProfileName(watchedValues.roleText, watchedValues.locationText),
    [watchedValues.locationText, watchedValues.roleText],
  );

  const submitHandler: SubmitHandler<WizardValues> = async (values) => {
    const payload = {
      name: values.name.trim() || suggestedName,
      targetRole: parsedRoles.join(", "),
      targetRegion: parsedLocations.join(", "),
      targetCountry: values.targetCountry.trim(),
      includeKeywords: parsedRoles,
      excludeKeywords: profile?.excludeKeywords ?? [],
      languages: parsedLanguages,
      industry: values.industry.trim(),
      priority: values.priority,
      activeSources: values.activeSources,
      providerSettings: {
        stepstone: {
          startUrls: parseMultiValue(values.stepstoneStartUrlsText),
          domain: values.stepstoneDomain.trim(),
          queries: parseMultiValue(values.stepstoneQueriesText),
          location: values.stepstoneLocation.trim(),
          distanceFromSource: values.stepstoneDistanceFromSource.trim(),
          workRemote: parseMultiValue(values.stepstoneWorkRemoteText),
          applicationType: parseMultiValue(values.stepstoneApplicationTypeText),
          listingLanguage: parseMultiValue(values.stepstoneListingLanguageText),
          workingHours: parseMultiValue(values.stepstoneWorkingHoursText),
          employmentType: parseMultiValue(values.stepstoneEmploymentTypeText),
          experience: parseMultiValue(values.stepstoneExperienceText),
          publishedDate: values.stepstonePublishedDate,
          limit: values.stepstoneLimit,
        },
        linkedin: {
          title: values.linkedinTitle.trim(),
          location: values.linkedinLocation.trim(),
          companyName: parseMultiValue(values.linkedinCompanyNameText),
          companyId: parseMultiValue(values.linkedinCompanyIdText),
          publishedAt: values.linkedinPublishedAt,
          rows: values.linkedinRows,
          workType: values.linkedinWorkType.trim(),
          contractType: values.linkedinContractType.trim(),
          experienceLevel: values.linkedinExperienceLevel.trim(),
        },
        indeed: {
          position: values.indeedPosition.trim(),
          maxItemsPerSearch: values.indeedMaxItemsPerSearch,
          country: values.indeedCountry.trim(),
          location: values.indeedLocation.trim(),
          startUrls: parseMultiValue(values.indeedStartUrlsText),
          parseCompanyDetails: values.indeedParseCompanyDetails,
          saveOnlyUniqueItems: values.indeedSaveOnlyUniqueItems,
          followApplyRedirects: values.indeedFollowApplyRedirects,
        },
      },
      active: values.active,
    };

    const validation = searchProfileSchema.safeParse(payload);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      toast.error(firstIssue?.message ?? "Bitte pruefe die Eingaben.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(profile ? `/api/search-profiles/${profile.id}` : "/api/search-profiles", {
        method: profile ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        throw new Error("Profil konnte nicht gespeichert werden.");
      }

      toast.success(profile ? "Suchprofil aktualisiert" : "Suchprofil angelegt");
      router.push("/search-profiles");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fehler beim Speichern");
    } finally {
      setIsSaving(false);
    }
  };

  const goNext = () => {
    const values = form.getValues();
    if (!stepIsValid(step, values)) {
      if (step === 0) toast.error("Waehle mindestens ein Portal aus.");
      if (step === 1) toast.error("Bitte Berufsbezeichnung, Standort, Sprachen, Land und Branche ausfuellen.");
      if (step === 2) toast.error("Bitte die aktiven Portale mit vollstaendigen Suchparametern befuellen.");
      return;
    }

    if (step === 1) {
      if (!form.getValues("name").trim()) form.setValue("name", suggestedName, { shouldDirty: true });
      if (!form.getValues("stepstoneQueriesText").trim()) form.setValue("stepstoneQueriesText", parsedRoles.join(", "), { shouldDirty: true });
      if (!form.getValues("stepstoneLocation").trim()) form.setValue("stepstoneLocation", parsedLocations.join(", "), { shouldDirty: true });
      if (!form.getValues("stepstoneListingLanguageText").trim()) form.setValue("stepstoneListingLanguageText", parsedLanguages.join(", "), { shouldDirty: true });
      if (!form.getValues("linkedinTitle").trim()) form.setValue("linkedinTitle", parsedRoles[0] ?? "", { shouldDirty: true });
      if (!form.getValues("linkedinLocation").trim()) form.setValue("linkedinLocation", parsedLocations.join(", "), { shouldDirty: true });
      if (!form.getValues("indeedPosition").trim()) form.setValue("indeedPosition", parsedRoles[0] ?? "", { shouldDirty: true });
      if (!form.getValues("indeedLocation").trim()) form.setValue("indeedLocation", parsedLocations.join(", "), { shouldDirty: true });
      if (!form.getValues("indeedCountry").trim()) form.setValue("indeedCountry", form.getValues("targetCountry"), { shouldDirty: true });
    }

    setStep((current) => Math.min(current + 1, 3));
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));
  const saveProfile = form.handleSubmit(submitHandler);

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      }}
    >
      <div className="rounded-[32px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.45)] md:p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Wizard</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Suchprofil als interaktive App-Maske
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Vollstaendige Portalkonfiguration fuer echte Live-Search-Runs.
            </p>
          </div>
          <Badge variant="info">Schritt {step + 1} / 4</Badge>
        </div>

        <div className="mb-8 grid grid-cols-4 gap-2">
          {["Portale", "Grunddaten", "Portal-Setup", "Abschluss"].map((item, index) => (
            <div key={item} className="space-y-2">
              <div className={`h-2 rounded-full ${index <= step ? "bg-slate-900" : "bg-slate-200"}`} />
              <p className={`text-xs font-medium ${index <= step ? "text-slate-900" : "text-slate-400"}`}>{item}</p>
            </div>
          ))}
        </div>

        {step === 0 ? (
          <div className="space-y-5">
            <div>
              <h4 className="text-xl font-semibold text-slate-950">Welche Portale sollen durchsucht werden?</h4>
              <p className="mt-2 text-sm text-slate-500">
                Die Auswahl steuert, welche Actoren spaeter mit den Profilwerten gestartet werden.
              </p>
            </div>
            <div className="grid gap-3">
              {sourceOptions.map((source) => {
                const isSelected = watchedValues.activeSources.includes(source.value);

                return (
                  <button
                    key={source.value}
                    type="button"
                    onClick={() => {
                      const current = form.getValues("activeSources");
                      form.setValue(
                        "activeSources",
                        isSelected
                          ? current.filter((entry) => entry !== source.value)
                          : [...current, source.value],
                        { shouldDirty: true },
                      );
                    }}
                    className={`rounded-[26px] border p-4 text-left transition ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold">{source.label}</p>
                        <p className={`mt-2 text-sm ${isSelected ? "text-slate-200" : "text-slate-500"}`}>
                          {source.description}
                        </p>
                      </div>
                      <div
                        className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border ${
                          isSelected ? "border-white bg-white text-slate-900" : "border-slate-300 text-transparent"
                        }`}
                      >
                        OK
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <FieldError>
              {watchedValues.activeSources.length === 0 ? "Mindestens ein Portal muss aktiviert sein." : ""}
            </FieldError>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-5">
            <div>
              <h4 className="text-xl font-semibold text-slate-950">Grunddaten fuer das Suchprofil</h4>
              <p className="mt-2 text-sm text-slate-500">
                Diese Angaben werden als gemeinsame Basis genutzt und in die Portalfelder vorbelegt.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <Field className="lg:col-span-2">
                <FieldLabel htmlFor="roleText">Berufsbezeichnung</FieldLabel>
                <Textarea
                  id="roleText"
                  {...form.register("roleText")}
                  placeholder="z. B. Recruiter, Talent Acquisition, Sales Operations Manager"
                />
                <FieldHint>Massenschlagwoerter erlaubt. Kommas oder neue Zeilen fuer mehrere Begriffe.</FieldHint>
              </Field>
              <Field className="lg:col-span-2">
                <FieldLabel htmlFor="locationText">Standort</FieldLabel>
                <Textarea
                  id="locationText"
                  {...form.register("locationText")}
                  placeholder="z. B. Duisburg, Essen, Oberhausen oder Berlin, Remote"
                />
                <FieldHint>Mehrere Standorte erlaubt. Diese Werte werden fuer Stepstone, Linked und Indeed vorbelegt.</FieldHint>
              </Field>
              <Field>
                <FieldLabel htmlFor="languagesText">Sprachen</FieldLabel>
                <Input id="languagesText" {...form.register("languagesText")} placeholder="Deutsch, Englisch" />
              </Field>
              <Field>
                <FieldLabel htmlFor="targetCountry">Land</FieldLabel>
                <Input id="targetCountry" {...form.register("targetCountry")} placeholder="Germany" />
              </Field>
              <Field className="lg:col-span-2">
                <FieldLabel htmlFor="industry">Branche</FieldLabel>
                <Input id="industry" {...form.register("industry")} placeholder="z. B. Healthcare, Mobility, SaaS" />
              </Field>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-slate-950">Actor-Eingaben pro Portal</h4>
              <p className="mt-2 text-sm text-slate-500">
                Diese Felder werden direkt an die konfigurierten Actoren uebergeben. Nur aktive Portale muessen gepflegt werden.
              </p>
            </div>

            {isSourceSelected(watchedValues, "mock_stepstone") ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-lg font-semibold text-slate-950">Stepstone</h5>
                    <p className="mt-1 text-sm text-slate-500">Start URLs oder Suchqueries fuer den Stepstone-Scraper.</p>
                  </div>
                  <Badge variant="info">Stepstone</Badge>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Field className="lg:col-span-2">
                    <FieldLabel htmlFor="stepstoneStartUrlsText">Stepstone URLs to scrape</FieldLabel>
                    <Textarea id="stepstoneStartUrlsText" {...form.register("stepstoneStartUrlsText")} placeholder="Optional: direkte Stepstone-URLs, getrennt per Komma oder Zeile" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stepstoneDomain">Stepstone country domain</FieldLabel>
                    <Select id="stepstoneDomain" {...form.register("stepstoneDomain")}>
                      {stepstoneDomainOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stepstoneLocation">Location filter</FieldLabel>
                    <Input id="stepstoneLocation" {...form.register("stepstoneLocation")} placeholder="Berlin, Hamburg" />
                  </Field>
                  <Field className="lg:col-span-2">
                    <FieldLabel htmlFor="stepstoneQueriesText">Search keywords</FieldLabel>
                    <Textarea id="stepstoneQueriesText" {...form.register("stepstoneQueriesText")} placeholder="Sales Operations Manager, CRM Manager" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stepstoneDistanceFromSource">Distance from source</FieldLabel>
                    <Input id="stepstoneDistanceFromSource" {...form.register("stepstoneDistanceFromSource")} placeholder="30" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stepstoneLimit">Limit</FieldLabel>
                    <Input id="stepstoneLimit" type="number" {...form.register("stepstoneLimit", { valueAsNumber: true })} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stepstonePublishedDate">Posting recency</FieldLabel>
                    <Select id="stepstonePublishedDate" {...form.register("stepstonePublishedDate")}>
                      {stepstonePublishedDateOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stepstoneListingLanguageText">Listing language</FieldLabel>
                    <Input id="stepstoneListingLanguageText" {...form.register("stepstoneListingLanguageText")} placeholder="GERMAN, ENGLISH" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stepstoneWorkRemoteText">Remote work preference</FieldLabel>
                    <Input id="stepstoneWorkRemoteText" {...form.register("stepstoneWorkRemoteText")} placeholder="remote, hybrid" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stepstoneApplicationTypeText">Application method</FieldLabel>
                    <Input id="stepstoneApplicationTypeText" {...form.register("stepstoneApplicationTypeText")} placeholder="easy-apply, external" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stepstoneWorkingHoursText">Working hours</FieldLabel>
                    <Input id="stepstoneWorkingHoursText" {...form.register("stepstoneWorkingHoursText")} placeholder="full-time, part-time" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stepstoneEmploymentTypeText">Employment type</FieldLabel>
                    <Input id="stepstoneEmploymentTypeText" {...form.register("stepstoneEmploymentTypeText")} placeholder="permanent, contract" />
                  </Field>
                  <Field className="lg:col-span-2">
                    <FieldLabel htmlFor="stepstoneExperienceText">Experience level</FieldLabel>
                    <Input id="stepstoneExperienceText" {...form.register("stepstoneExperienceText")} placeholder="entry-level, mid-senior-level" />
                  </Field>
                </div>
              </div>
            ) : null}

            {isSourceSelected(watchedValues, "mock_linkedin_reference") ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-lg font-semibold text-slate-950">Linked</h5>
                    <p className="mt-1 text-sm text-slate-500">Job title, company filters und Publikationsfenster fuer LinkedIn Jobs.</p>
                  </div>
                  <Badge variant="info">Linked</Badge>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="linkedinTitle">Job title</FieldLabel>
                    <Input id="linkedinTitle" {...form.register("linkedinTitle")} placeholder="Sales Operations Manager" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="linkedinLocation">Job location</FieldLabel>
                    <Input id="linkedinLocation" {...form.register("linkedinLocation")} placeholder="Berlin oder United States" />
                  </Field>
                  <Field className="lg:col-span-2">
                    <FieldLabel htmlFor="linkedinCompanyNameText">Company name</FieldLabel>
                    <Textarea id="linkedinCompanyNameText" {...form.register("linkedinCompanyNameText")} placeholder="Google, Microsoft" />
                  </Field>
                  <Field className="lg:col-span-2">
                    <FieldLabel htmlFor="linkedinCompanyIdText">Company id</FieldLabel>
                    <Textarea id="linkedinCompanyIdText" {...form.register("linkedinCompanyIdText")} placeholder="76987811, 1815218" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="linkedinPublishedAt">Published at</FieldLabel>
                    <Select id="linkedinPublishedAt" {...form.register("linkedinPublishedAt")}>
                      {linkedPublishedAtOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="linkedinRows">Total rows</FieldLabel>
                    <Input id="linkedinRows" type="number" {...form.register("linkedinRows", { valueAsNumber: true })} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="linkedinWorkType">On-site/Remote</FieldLabel>
                    <Input id="linkedinWorkType" {...form.register("linkedinWorkType")} placeholder="on-site, hybrid, remote" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="linkedinContractType">Job type</FieldLabel>
                    <Input id="linkedinContractType" {...form.register("linkedinContractType")} placeholder="full-time, contract" />
                  </Field>
                  <Field className="lg:col-span-2">
                    <FieldLabel htmlFor="linkedinExperienceLevel">Experience level</FieldLabel>
                    <Input id="linkedinExperienceLevel" {...form.register("linkedinExperienceLevel")} placeholder="internship, associate, director" />
                  </Field>
                </div>
              </div>
            ) : null}

            {isSourceSelected(watchedValues, "mock_indeed") ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-lg font-semibold text-slate-950">Indeed</h5>
                    <p className="mt-1 text-sm text-slate-500">Keyword-, Standort- und Listing-Optionen fuer den Indeed-Scraper.</p>
                  </div>
                  <Badge variant="info">Indeed</Badge>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="indeedPosition">Positions/keywords for search</FieldLabel>
                    <Input id="indeedPosition" {...form.register("indeedPosition")} placeholder="LKW Fahrer" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="indeedLocation">Location for search</FieldLabel>
                    <Input id="indeedLocation" {...form.register("indeedLocation")} placeholder="Duisburg, Essen, Oberhausen" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="indeedCountry">Country for search</FieldLabel>
                    <Input id="indeedCountry" {...form.register("indeedCountry")} placeholder="Germany" />
                  </Field>
                  <Field className="lg:col-span-2">
                    <FieldLabel htmlFor="indeedStartUrlsText">Start URLs</FieldLabel>
                    <Textarea
                      id="indeedStartUrlsText"
                      {...form.register("indeedStartUrlsText")}
                      placeholder="https://www.indeed.com/jobs?q=software+engineer&l=New+York"
                    />
                    <FieldHint>Optional. Wenn gesetzt, senden wir die URLs direkt als `startUrls` an den Indeed-Actor.</FieldHint>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="indeedMaxItemsPerSearch">Max job listings per search</FieldLabel>
                    <Input id="indeedMaxItemsPerSearch" type="number" {...form.register("indeedMaxItemsPerSearch", { valueAsNumber: true })} />
                  </Field>
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Scrape company details</p>
                        <p className="mt-1 text-xs text-slate-500">Zusatzdaten fuer spaetere Employer-Analyse mitsammeln.</p>
                      </div>
                      <Switch checked={watchedValues.indeedParseCompanyDetails} onChange={(event) => form.setValue("indeedParseCompanyDetails", event.currentTarget.checked, { shouldDirty: true })} />
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Save only unique job listings</p>
                        <p className="mt-1 text-xs text-slate-500">Indeed-Dubletten bereits im Actor reduzieren.</p>
                      </div>
                      <Switch checked={watchedValues.indeedSaveOnlyUniqueItems} onChange={(event) => form.setValue("indeedSaveOnlyUniqueItems", event.currentTarget.checked, { shouldDirty: true })} />
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 lg:col-span-2">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Follow redirects for apply link</p>
                        <p className="mt-1 text-xs text-slate-500">Fuer spaetere Outreach- und Arbeitgeberanalyse hilfreich.</p>
                      </div>
                      <Switch checked={watchedValues.indeedFollowApplyRedirects} onChange={(event) => form.setValue("indeedFollowApplyRedirects", event.currentTarget.checked, { shouldDirty: true })} />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5">
            <div>
              <h4 className="text-xl font-semibold text-slate-950">Abschluss und Vorschau</h4>
              <p className="mt-2 text-sm text-slate-500">
                Pruefe den Profilnamen und die fuer die Actoren gespeicherten Eingaben.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-5">
                <Field>
                  <FieldLabel htmlFor="name">Profilname</FieldLabel>
                  <Input id="name" {...form.register("name")} placeholder={suggestedName} />
                  <FieldHint>Falls leer, verwenden wir automatisch den Vorschlag aus Rolle und Standort.</FieldHint>
                </Field>
                <Field>
                  <FieldLabel htmlFor="priority">Prioritaet</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {priorityOptions.map((priority) => {
                      const isSelected = watchedValues.priority === priority.value;
                      return (
                        <button
                          key={priority.value}
                          type="button"
                          onClick={() => form.setValue("priority", priority.value as WizardValues["priority"], { shouldDirty: true })}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${isSelected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                        >
                          {priority.label}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Profil aktiv</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Inaktive Profile bleiben sichtbar, werden aber nicht fuer neue Runs gestartet.
                    </p>
                  </div>
                  <Switch checked={watchedValues.active} onChange={(event) => form.setValue("active", event.currentTarget.checked, { shouldDirty: true })} />
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Preview</p>
                <h5 className="mt-3 text-xl font-semibold">{watchedValues.name.trim() || suggestedName}</h5>
                <div className="mt-5 space-y-4 text-sm text-slate-200">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Portale</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {watchedValues.activeSources.map((source) => (
                        <Badge key={source} variant="info">{sourceLabel(source)}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Berufsbezeichnungen</p>
                    <p className="mt-2 leading-6">{parsedRoles.join(", ") || "Noch nicht gesetzt"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Standorte</p>
                    <p className="mt-2 leading-6">{parsedLocations.join(", ") || "Noch nicht gesetzt"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sprachen</p>
                    <p className="mt-2 leading-6">{parsedLanguages.join(", ") || "Noch nicht gesetzt"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">API-Parameter</p>
                    <p className="mt-2 leading-6">
                      Stepstone Queries: {parseMultiValue(watchedValues.stepstoneQueriesText).length}
                      {" · "}Linked Rows: {watchedValues.linkedinRows}
                      {" · "}Indeed Limit: {watchedValues.indeedMaxItemsPerSearch}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="secondary" onClick={goBack} disabled={step === 0 || isSaving}>
          Zurueck
        </Button>
        {step < 3 ? (
          <Button type="button" onClick={goNext}>Weiter</Button>
        ) : (
          <Button type="button" disabled={isSaving} onClick={() => void saveProfile()}>
            {isSaving ? "Speichert..." : profile ? "Profil aktualisieren" : "Profil anlegen"}
          </Button>
        )}
      </div>
    </form>
  );
}
