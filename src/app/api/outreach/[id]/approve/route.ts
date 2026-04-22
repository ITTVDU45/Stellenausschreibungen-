import { getAppContext } from "@/lib/db/app-store";
import { approvalSchema } from "@/lib/validation/schemas";
import { fail, ok } from "@/lib/utils/responses";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await approvalSchema.parseAsync(await request.json());
    const { id } = await params;
    const { services } = getAppContext();
    const message = services.outreach.approve(id);
    if (!message) {
      return fail("Outreach-Nachricht nicht gefunden", "NOT_FOUND", 404);
    }
    return ok(message);
  } catch (error) {
    return fail("Freigabe fehlgeschlagen", "VALIDATION_ERROR", 400, error);
  }
}
