import { getAppContext } from "@/lib/db/app-store";
import { templateSchema } from "@/lib/validation/schemas";
import { fail, ok } from "@/lib/utils/responses";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const input = templateSchema.partial().parse(body);
    const { id } = await params;
    const { services } = getAppContext();
    const template = services.templates.update(id, input);

    if (!template) {
      return fail("Vorlage nicht gefunden", "NOT_FOUND", 404);
    }

    services.activityLogs.record("template", template.id, "template.updated", input);
    return ok(template);
  } catch (error) {
    return fail("Vorlage konnte nicht aktualisiert werden", "VALIDATION_ERROR", 400, error);
  }
}
