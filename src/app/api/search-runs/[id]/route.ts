import { getAppContext } from "@/lib/db/app-store";
import { fail, ok } from "@/lib/utils/responses";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { services } = getAppContext();
  const detail = await services.search.getRunDetail(id);

  if (!detail) {
    return fail("Suchlauf nicht gefunden", "NOT_FOUND", 404);
  }

  return ok(detail);
}
