import { getAppContext } from "@/lib/db/app-store";
import { analyzeBulkSchema } from "@/lib/validation/schemas";
import { fail, ok } from "@/lib/utils/responses";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = analyzeBulkSchema.parse(body);
    const { repositories, services } = getAppContext();

    const analyses = input.jobIds
      .map((jobId) => repositories.jobs.findById(jobId))
      .filter((job): job is NonNullable<typeof job> => Boolean(job))
      .map((job) => {
        const analysis = repositories.jobs.createAnalysis(services.analysis.analyze(job));
        repositories.jobs.updateStatus(job.id, "analyzed");
        services.activityLogs.record("job_analysis", analysis.id, "job.analysis_created", {
          jobId: job.id,
        });
        return analysis;
      });

    return ok({ items: analyses, count: analyses.length }, { status: 201 });
  } catch (error) {
    return fail("Bulk-Analyse fehlgeschlagen", "VALIDATION_ERROR", 400, error);
  }
}
