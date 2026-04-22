import type { ListResponse } from "@/types/domain";

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 10,
  meta?: Record<string, unknown>,
): ListResponse<T> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize;
  const pagedItems = items.slice(start, start + safePageSize);
  const totalPages = Math.max(1, Math.ceil(items.length / safePageSize));

  return {
    items: pagedItems,
    pagination: {
      page: safePage,
      pageSize: safePageSize,
      totalItems: items.length,
      totalPages,
    },
    meta,
  };
}
