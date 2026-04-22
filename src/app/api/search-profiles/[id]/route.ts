import { getAppContext } from "@/lib/db/app-store";
import { searchProfileSchema } from "@/lib/validation/schemas";
import { fail, ok } from "@/lib/utils/responses";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const input = searchProfileSchema.partial().parse(body);
    const { id } = await params;
    const { repositories, services } = getAppContext();
    const record = repositories.searchProfiles.update(id, input);

    if (!record) {
      return fail("Suchprofil nicht gefunden", "NOT_FOUND", 404);
    }

    services.activityLogs.record("search_profile", record.id, "search_profile.updated", input);
    return ok(record);
  } catch (error) {
    return fail("Suchprofil konnte nicht aktualisiert werden", "VALIDATION_ERROR", 400, error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { repositories, services } = getAppContext();
  const deleted = repositories.searchProfiles.delete(id);
  if (!deleted) {
    return fail("Suchprofil nicht gefunden", "NOT_FOUND", 404);
  }

  services.activityLogs.record("search_profile", id, "search_profile.deleted", {});
  return ok({ deleted: true });
}
