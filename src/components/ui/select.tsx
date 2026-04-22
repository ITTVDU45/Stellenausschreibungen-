import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
      className,
    )}
    {...props}
  />
));

Select.displayName = "Select";
