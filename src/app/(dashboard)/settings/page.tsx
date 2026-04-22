import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { getApifyConfig } from "@/lib/env/apify";
import { ApifyVerifyButton } from "@/features/search-runs/apify-verify-button";

export default function SettingsPage() {
  const config = getApifyConfig();

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader
        eyebrow="Settings"
        title="Provider- und Integrations-Placeholder"
        description="Die Live-Suche kann über env.local aktiviert werden; MongoDB und CRM bleiben weiterhin vorbereitet, aber optional."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Provider Settings</CardTitle>
              <CardDescription>Aktueller Fokus: ein zentraler Actor als Search Provider.</CardDescription>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p>APIFY_API_TOKEN: {config.apiToken ? "vorhanden" : "fehlt"}</p>
                <p>APIFY_ACTOR_ID: optional</p>
                <p>APIFY_BASE_URL: {config.baseUrl}</p>
                <p className="pt-2 text-xs text-slate-500">
                  Fuer Agentenliste, Verifikation und Suchlaeufe reicht jetzt dein Token. Die App nutzt die sechs
                  kuratierten Actoren aus der Agenten-Seite automatisch fuer Search Runs.
                </p>
              </div>
              <div className="mt-4">
                <ApifyVerifyButton />
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>CRM Sync</CardTitle>
              <CardDescription>
                Platzhalter für MongoDB-/CRM-Konfiguration, API Tokens und Mapping-Definitionen.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
