import { getAppContext } from "@/lib/db/app-store";
import { ok } from "@/lib/utils/responses";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const approvalStatus = url.searchParams.get("approvalStatus");
  const { services } = getAppContext();

  return ok(
    services.outreach.list({
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 24),
      approvalStatus:
        approvalStatus === "draft" ||
        approvalStatus === "pending_review" ||
        approvalStatus === "approved" ||
        approvalStatus === "rejected"
          ? approvalStatus
          : undefined,
    }),
  );
}
