import { Card } from "@/components/ui/card";
import { formatDate, formatRelative } from "@/lib/utils/dates";
import type { ActivityLogRecord } from "@/types/domain";

export function ActivityFeed({ items }: { items: ActivityLogRecord[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="rounded-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.action}</p>
              <p className="mt-1 text-sm text-slate-500">{JSON.stringify(item.payload)}</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>{formatRelative(item.createdAt)}</p>
              <p>{formatDate(item.createdAt, "dd.MM.yyyy HH:mm")}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
