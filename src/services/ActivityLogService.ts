import type { ActivityEntityType } from "@/types/domain";

import { ActivityLogRepository } from "@/repositories/activity-log-repository";

export class ActivityLogService {
  constructor(private readonly activityLogs: ActivityLogRepository) {}

  list(params?: { page?: number; pageSize?: number; entityType?: ActivityEntityType; entityId?: string }) {
    return this.activityLogs.list(params);
  }

  record(entityType: ActivityEntityType, entityId: string, action: string, payload: Record<string, unknown>) {
    return this.activityLogs.add({ entityType, entityId, action, payload });
  }
}
