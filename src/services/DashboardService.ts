import type { DashboardStatsDto } from "@/types/api";
import type { AppDataSnapshot } from "@/types/domain";

export class DashboardService {
  constructor(private readonly state: AppDataSnapshot) {}

  getStats(): DashboardStatsDto {
    return {
      searchProfilesCount: this.state.searchProfiles.length,
      jobsTotal: this.state.jobs.length,
      jobsNew: this.state.jobs.filter((job) => job.status === "new").length,
      jobsAnalyzed: this.state.jobAnalyses.length,
      openOutreach: this.state.outreachMessages.filter((message) => message.sendStatus !== "mock_sent").length,
      awaitingApproval: this.state.outreachMessages.filter(
        (message) => message.approvalStatus === "pending_review",
      ).length,
      sentMessages: this.state.outreachMessages.filter((message) => message.sendStatus === "mock_sent").length,
      employersTotal: this.state.employers.length,
      lastRuns: [...this.state.searchRuns]
        .sort((a, b) => b.runStartedAt.localeCompare(a.runStartedAt))
        .slice(0, 4),
      latestActivities: [...this.state.activityLogs]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 8),
    };
  }
}
