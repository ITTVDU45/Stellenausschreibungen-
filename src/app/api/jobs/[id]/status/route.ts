import { getAppContext } from "@/lib/db/app-store";
import { jobStatusSchema } from "@/lib/validation/schemas";
import { fail, ok } from "@/lib/utils/responses";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const input = jobStatusSchema.parse(body);
    const { id } = await params;
    const { repositories, services } = getAppContext();
    const job = repositories.jobs.updateStatus(id, input.status);

    if (!job) {
      return fail("Job nicht gefunden", "NOT_FOUND", 404);
    }

    services.activityLogs.record("job", id, "job.status_updated", input);
    return ok(job);
  } catch (error) {
    return fail("Status konnte nicht aktualisiert werden", "VALIDATION_ERROR", 400, error);
  }
}
