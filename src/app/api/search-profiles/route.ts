import { getAppContext } from "@/lib/db/app-store";
import { searchProfileSchema } from "@/lib/validation/schemas";
import { fail, ok } from "@/lib/utils/responses";

export async function GET() {
  const { repositories } = getAppContext();
  return ok(repositories.searchProfiles.list({ page: 1, pageSize: 50 }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = searchProfileSchema.parse(body);
    const { repositories, services } = getAppContext();
    const record = repositories.searchProfiles.create(input);
    services.activityLogs.record("search_profile", record.id, "search_profile.created", {
      name: record.name,
      activeSources: record.activeSources,
    });
    return ok(record, { status: 201 });
  } catch (error) {
    return fail("Ungültige Suchprofil-Daten", "VALIDATION_ERROR", 400, error);
  }
}
