import { ActivityFeed } from "@/components/activity/activity-feed";
import { SectionHeader } from "@/components/ui/section-header";
import { getAppContext } from "@/lib/db/app-store";

export default function ActivityPage() {
  const { services } = getAppContext();
  const activity = services.activityLogs.list({ page: 1, pageSize: 50 }).items;

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader eyebrow="Activity Logs" title="Chronologische Änderungen" description="Importe, Analysen, Freigaben und Sync-Placeholder in einer durchgehenden Historie." />
      <ActivityFeed items={activity} />
    </div>
  );
}
