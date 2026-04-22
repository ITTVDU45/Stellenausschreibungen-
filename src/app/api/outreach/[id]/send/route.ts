import { getAppContext } from "@/lib/db/app-store";
import { sendSchema } from "@/lib/validation/schemas";
import { fail, ok } from "@/lib/utils/responses";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await sendSchema.parseAsync(await request.json());
    const { id } = await params;
    const { services } = getAppContext();
    const message = services.outreach.send(id);
    if (!message) {
      return fail("Nachricht nicht freigegeben oder nicht gefunden", "INVALID_STATE", 400);
    }
    return ok(message);
  } catch (error) {
    return fail("Mock-Send fehlgeschlagen", "VALIDATION_ERROR", 400, error);
  }
}
