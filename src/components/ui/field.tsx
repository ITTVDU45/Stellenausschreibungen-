import type { HTMLAttributes, LabelHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Field({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-sm font-medium text-slate-700", className)} {...props} />;
}

export function FieldHint({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-slate-500", className)} {...props} />;
}

export function FieldError({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-rose-600", className)} {...props} />;
}
