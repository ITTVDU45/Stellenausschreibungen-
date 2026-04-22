import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Switch({ className, checked, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("relative inline-flex cursor-pointer items-center", className)}>
      <input type="checkbox" className="peer sr-only" checked={checked} {...props} />
      <span className="h-7 w-12 rounded-full bg-slate-200 transition peer-checked:bg-slate-900" />
      <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
    </label>
  );
}
