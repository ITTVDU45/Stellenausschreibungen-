import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { getAppContext } from "@/lib/db/app-store";
import { formatPercent } from "@/lib/utils/format";

export default function EmployersPage() {
  const { services } = getAppContext();
  const employers = services.employers.list({ page: 1, pageSize: 50 }).items;

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader eyebrow="Employers" title="Arbeitgeberdatenbank" description="Automatisch aus Jobs abgeleitete Arbeitgeber mit pflegbaren Kontakten und Vollständigkeitsscore." />
      <div className="grid gap-4 lg:grid-cols-2">
        {employers.map((employer) => (
          <Link key={employer.id} href={`/employers/${employer.id}`}>
            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <CardTitle>{employer.companyName}</CardTitle>
                    <Badge variant={employer.completenessScore >= 70 ? "success" : "warning"}>
                      Vollständigkeit {formatPercent(employer.completenessScore)}
                    </Badge>
                  </div>
                  <CardDescription>{employer.website ?? "Website fehlt"} · {employer.contactEmail ?? "E-Mail offen"}</CardDescription>
                  <p className="text-sm text-slate-500">{employer.notes}</p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
