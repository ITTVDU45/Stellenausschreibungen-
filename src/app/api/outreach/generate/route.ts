import { getAppContext } from "@/lib/db/app-store";
import { outreachGenerateSchema } from "@/lib/validation/schemas";
import { fail, ok } from "@/lib/utils/responses";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = outreachGenerateSchema.parse(body);
    const { services } = getAppContext();
    const message = services.outreach.generate(input);

    if (!message) {
      return fail("Outreach-Nachricht konnte nicht erzeugt werden", "INVALID_STATE", 400);
    }

    return ok(message, { status: 201 });
  } catch (error) {
    return fail("Outreach-Nachricht konnte nicht erzeugt werden", "VALIDATION_ERROR", 400, error);
  }
}
