import { getAppContext } from "@/lib/db/app-store";
import { ok } from "@/lib/utils/responses";

export async function POST() {
  const { state, services } = getAppContext();
  const syncedAt = new Date().toISOString();
  services.activityLogs.record("sync", "employers", "sync.employers.triggered", {
    entityCount: state.employers.length,
  });
  return ok({
    accepted: true,
    provider: "mock_crm_sync",
    syncedAt,
    entityCount: state.employers.length,
  });
}
