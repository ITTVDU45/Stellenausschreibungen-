import { getApifyConfigSignature, isApifyConfigured } from "@/lib/env/apify";
import { createSeedData } from "@/seed";
import { ApifySearchProvider } from "@/providers/apify/ApifySearchProvider";
import { MockSearchProvider } from "@/providers/mock/MockSearchProvider";
import { ActivityLogRepository } from "@/repositories/activity-log-repository";
import { EmployerRepository } from "@/repositories/employer-repository";
import { JobRepository } from "@/repositories/job-repository";
import { OutreachRepository } from "@/repositories/outreach-repository";
import { SearchProfileRepository } from "@/repositories/search-profile-repository";
import { SearchRunRepository } from "@/repositories/search-run-repository";
import { TemplateRepository } from "@/repositories/template-repository";
import { ActivityLogService } from "@/services/ActivityLogService";
import { AnalysisService } from "@/services/AnalysisService";
import { DashboardService } from "@/services/DashboardService";
import { EmployerService } from "@/services/EmployerService";
import { OutreachService } from "@/services/OutreachService";
import { SearchService } from "@/services/SearchService";
import { TemplateService } from "@/services/TemplateService";
import type { AppDataSnapshot } from "@/types/domain";
import type { SearchProvider } from "@/providers/contracts/SearchProvider";

export interface AppContext {
  state: AppDataSnapshot;
  repositories: {
    searchProfiles: SearchProfileRepository;
    searchRuns: SearchRunRepository;
    jobs: JobRepository;
    employers: EmployerRepository;
    templates: TemplateRepository;
    outreach: OutreachRepository;
    activityLogs: ActivityLogRepository;
  };
  services: {
    activityLogs: ActivityLogService;
    analysis: AnalysisService;
    employers: EmployerService;
    templates: TemplateService;
    outreach: OutreachService;
    search: SearchService;
    dashboard: DashboardService;
  };
}

declare global {
  var __jobSourcingAppContext: AppContext | undefined;
  var __jobSourcingConfigSignature: string | undefined;
}

function buildContext(): AppContext {
  const state = createSeedData();
  const repositories = {
    searchProfiles: new SearchProfileRepository(state),
    searchRuns: new SearchRunRepository(state),
    jobs: new JobRepository(state),
    employers: new EmployerRepository(state),
    templates: new TemplateRepository(state),
    outreach: new OutreachRepository(state),
    activityLogs: new ActivityLogRepository(state),
  };
  const activityLogs = new ActivityLogService(repositories.activityLogs);
  const templateService = new TemplateService(repositories.templates);
  const employerService = new EmployerService(repositories.employers, repositories.jobs, activityLogs);

  const searchProvider: SearchProvider = isApifyConfigured()
    ? new ApifySearchProvider()
    : new MockSearchProvider();

  return {
    state,
    repositories,
    services: {
      activityLogs,
      analysis: new AnalysisService(),
      employers: employerService,
      templates: templateService,
      outreach: new OutreachService(
        repositories.outreach,
        repositories.jobs,
        repositories.employers,
        templateService,
        activityLogs,
      ),
      search: new SearchService(
        repositories.searchProfiles,
        repositories.searchRuns,
        repositories.jobs,
        employerService,
        activityLogs,
        searchProvider,
      ),
      dashboard: new DashboardService(state),
    },
  };
}

export function getAppContext() {
  const configSignature = getApifyConfigSignature();

  if (
    !globalThis.__jobSourcingAppContext ||
    globalThis.__jobSourcingConfigSignature !== configSignature
  ) {
    globalThis.__jobSourcingAppContext = buildContext();
    globalThis.__jobSourcingConfigSignature = configSignature;
  }

  return globalThis.__jobSourcingAppContext;
}
