import type { ReactNode } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string | number;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <Card className="bg-linear-to-br from-white to-slate-50">
      <CardHeader className="items-center">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-2 text-3xl">{value}</CardTitle>
          <p className="mt-2 text-sm text-slate-500">{hint}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-3 text-white">{icon}</div>
      </CardHeader>
    </Card>
  );
}
