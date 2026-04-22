import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <Card className="border-dashed bg-slate-50/80 text-center">
      <div className="space-y-3 py-6">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mx-auto max-w-md text-sm text-slate-500">{description}</p>
        {ctaHref && ctaLabel ? (
          <Link href={ctaHref} className={buttonVariants()}>
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
