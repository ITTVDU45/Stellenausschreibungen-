import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";

export function SectionHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p> : null}
      </div>
      {action ??
        (actionHref && actionLabel ? (
          <Link href={actionHref} className={buttonVariants()}>
            {actionLabel}
          </Link>
        ) : null)}
    </div>
  );
}
