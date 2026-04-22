import { getAppContext } from "@/lib/db/app-store";
import { templateSchema } from "@/lib/validation/schemas";
import { fail, ok } from "@/lib/utils/responses";

export async function GET() {
  const { services } = getAppContext();
  return ok(services.templates.list({ page: 1, pageSize: 50 }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = templateSchema.parse(body);
    const { services } = getAppContext();
    const template = services.templates.create(input);
    services.activityLogs.record("template", template.id, "template.created", {
      name: template.name,
    });
    return ok(template, { status: 201 });
  } catch (error) {
    return fail("Vorlage konnte nicht angelegt werden", "VALIDATION_ERROR", 400, error);
  }
}
