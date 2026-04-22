import { getAppContext } from "@/lib/db/app-store";
import { fail, ok } from "@/lib/utils/responses";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { repositories, services } = getAppContext();
  const job = repositories.jobs.findById(id);

  if (!job) {
    return fail("Job nicht gefunden", "NOT_FOUND", 404);
  }

  const analysis = services.analysis.analyze(job);
  const saved = repositories.jobs.createAnalysis(analysis);
  repositories.jobs.updateStatus(job.id, "analyzed");
  services.activityLogs.record("job_analysis", saved.id, "job.analysis_created", {
    jobId: job.id,
    relevanceScore: saved.relevanceScore,
  });

  return ok(saved, { status: 201 });
}
