import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { DeleteSearchProfileButton } from "@/features/search-profiles/delete-search-profile-button";
import { StartSearchRunButton } from "@/features/search-runs/start-search-run-button";
import { getAppContext } from "@/lib/db/app-store";

const sourceLabels: Record<string, string> = {
  mock_stepstone: "Stepstone",
  mock_indeed: "Indeed",
  mock_linkedin_reference: "Linked",
};

export default function SearchProfilesPage() {
  const { repositories } = getAppContext();
  const profiles = repositories.searchProfiles.getAll();

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader
        eyebrow="Search Profiles"
        title="Suchprofile verwalten"
        description="Profile buendeln Zielrolle, Regionen und actor-spezifische Inputs fuer wiederholbare Indeed Live Runs."
        action={
          <Link
            href="/search-profiles/new"
            className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Profil anlegen
          </Link>
        }
      />
      {profiles.length === 0 ? (
        <EmptyState
          title="Noch keine Suchprofile"
          description="Lege ein Profil an, um echte Indeed Live Suchlaeufe und Jobimporte zu starten."
          ctaHref="/search-profiles/new"
          ctaLabel="Profil erstellen"
        />
      ) : (
        <div className="grid gap-4">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader className="flex-col gap-4 md:flex-row md:items-start">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-xl">{profile.name}</CardTitle>
                    <Badge variant={profile.active ? "success" : "neutral"}>
                      {profile.active ? "Aktiv" : "Inaktiv"}
                    </Badge>
                    <Badge>{profile.priority}</Badge>
                  </div>
                  <CardDescription>
                    {profile.targetRole} · {profile.targetRegion} · {profile.targetCountry}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {profile.includeKeywords.map((keyword) => (
                      <Badge key={keyword} variant="info">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">
                    Profil-Portale: {profile.activeSources.map((source) => sourceLabels[source] ?? source).join(", ")} ·
                    Live Search: Indeed Live · Position {profile.providerSettings?.indeed.position || "n/a"} ·
                    Standort {profile.providerSettings?.indeed.location || "n/a"} · Limit{" "}
                    {profile.providerSettings?.indeed.maxItemsPerSearch ?? "n/a"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <StartSearchRunButton profileId={profile.id} />
                  <Link
                    href={`/search-profiles/${profile.id}`}
                    className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/search-profiles/${profile.id}/edit`}
                    className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    Bearbeiten
                  </Link>
                  <DeleteSearchProfileButton profileId={profile.id} />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
