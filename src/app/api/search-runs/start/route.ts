import { z } from "zod";

import { getAppContext } from "@/lib/db/app-store";
import { fail, ok } from "@/lib/utils/responses";

const schema = z.object({
  profileId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = schema.parse(body);
    const { services } = getAppContext();
    const result = await services.search.startRun(input.profileId);

    if (!result) {
      return fail("Suchprofil nicht gefunden", "NOT_FOUND", 404);
    }

    return ok(result, { status: 201 });
  } catch (error) {
    return fail("Suchlauf konnte nicht gestartet werden", "VALIDATION_ERROR", 400, error);
  }
}
