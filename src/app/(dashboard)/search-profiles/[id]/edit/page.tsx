import { notFound } from "next/navigation";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchProfileForm } from "@/features/search-profiles/search-profile-form";
import { getAppContext } from "@/lib/db/app-store";

export default async function EditSearchProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { repositories } = getAppContext();
  const profile = repositories.searchProfiles.findById(id);
  if (!profile) notFound();

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader eyebrow="Search Profiles" title="Suchprofil bearbeiten" description={profile.name} />
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Profil aktualisieren</CardTitle>
            <CardDescription>Aenderungen wirken bei zukuenftigen Suchlaeufen und Actor-Inputs.</CardDescription>
          </div>
        </CardHeader>
        <SearchProfileForm profile={profile} />
      </Card>
    </div>
  );
}
