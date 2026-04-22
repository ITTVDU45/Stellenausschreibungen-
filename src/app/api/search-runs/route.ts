import { getAppContext } from "@/lib/db/app-store";
import { ok } from "@/lib/utils/responses";

export async function GET() {
  const { services } = getAppContext();
  return ok(services.search.listRuns({ page: 1, pageSize: 50 }));
}
