import { NextResponse } from "next/server";

import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccessResponse<T>>(
    {
      success: true,
      data,
    },
    init,
  );
}

export function fail(
  message: string,
  code = "BAD_REQUEST",
  status = 400,
  details?: unknown,
) {
  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    },
    { status },
  );
}
