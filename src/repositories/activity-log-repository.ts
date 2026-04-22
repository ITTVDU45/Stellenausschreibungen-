import { createId } from "@/lib/utils/id";
import { paginate } from "@/lib/utils/pagination";
import type { ActivityEntityType, ActivityLogRecord, AppDataSnapshot } from "@/types/domain";

export class ActivityLogRepository {
  constructor(private readonly state: AppDataSnapshot) {}

  list(params?: { page?: number; pageSize?: number; entityType?: ActivityEntityType; entityId?: string }) {
    const items = [...this.state.activityLogs]
      .filter((log) => (params?.entityType ? log.entityType === params.entityType : true))
      .filter((log) => (params?.entityId ? log.entityId === params.entityId : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return paginate(items, params?.page, params?.pageSize ?? 20);
  }

  add(input: Omit<ActivityLogRecord, "id" | "createdAt">) {
    const log: ActivityLogRecord = {
      id: createId("activity"),
      createdAt: new Date().toISOString(),
      ...input,
    };
    this.state.activityLogs.unshift(log);
    return log;
  }
}
