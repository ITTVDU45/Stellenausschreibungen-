import { getAppContext } from "@/lib/db/app-store";
import { fail, ok } from "@/lib/utils/responses";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { repositories, services } = getAppContext();
  const job = repositories.jobs.findById(id);
  if (!job) {
    return fail("Job nicht gefunden", "NOT_FOUND", 404);
  }

  const employer = job.employerId ? repositories.employers.findById(job.employerId) : null;
  const contacts = employer ? repositories.employers.getContacts(employer.id) : [];
  const outreachMessages = repositories.outreach.findByJobId(job.id);

  return ok({
    job,
    analysis: repositories.jobs.getAnalysis(job.id),
    employer,
    contacts,
    outreachMessages,
    activityLogs: services.activityLogs.list({ entityType: "job", entityId: job.id }).items,
  });
}
