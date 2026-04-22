import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchProfileForm } from "@/features/search-profiles/search-profile-form";

export default function NewSearchProfilePage() {
  return (
    <div className="space-y-6 pb-24">
      <SectionHeader eyebrow="Search Profiles" title="Neues Suchprofil" description="Lege actor-faehige Suchparameter fuer Stepstone, Linked und Indeed fest." />
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Profilkonfiguration</CardTitle>
            <CardDescription>Die Profile steuern spaetere Suchlaeufe, Importfilter und Portal-spezifische Inputs.</CardDescription>
          </div>
        </CardHeader>
        <SearchProfileForm />
      </Card>
    </div>
  );
}
