import { getAppContext } from "@/lib/db/app-store";
import { ok } from "@/lib/utils/responses";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { services } = getAppContext();
  return ok(
    services.employers.list({
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 24),
      query: url.searchParams.get("query") ?? undefined,
    }),
  );
}
