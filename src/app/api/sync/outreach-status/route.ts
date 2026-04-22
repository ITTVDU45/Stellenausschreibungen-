import { getAppContext } from "@/lib/db/app-store";
import { ok } from "@/lib/utils/responses";

export async function POST() {
  const { state, services } = getAppContext();
  const syncedAt = new Date().toISOString();
  services.activityLogs.record("sync", "outreach-status", "sync.outreach_status.triggered", {
    entityCount: state.outreachMessages.length,
  });
  return ok({
    accepted: true,
    provider: "mock_crm_sync",
    syncedAt,
    entityCount: state.outreachMessages.length,
  });
}
