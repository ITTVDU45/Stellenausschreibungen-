# Job Sourcing & Employer Outreach Platform

Mobile-first interne Next.js-Anwendung fuer Job Sourcing, Jobanalyse, Employer Enrichment und review-basierten Outreach. Phase 1 nutzt bewusst einen austauschbaren Mock-Provider und In-Memory-Repositories, damit UI, API und Workflows schon jetzt end-to-end testbar sind.

Die aktuelle Version kann zusaetzlich einen echten Apify-Actor als Search Provider nutzen, wenn die noetigen `env.local`-Werte vorhanden sind.

## Stack

- Next.js 16.2.2
- React 19.2.4
- TypeScript strict mode
- Tailwind CSS 4
- zod
- react-hook-form
- lucide-react
- sonner
- Vitest + Testing Library

## Schnellstart

```bash
npm install
npm run dev
```

Danach laeuft die App unter `http://localhost:3000`.

Fuer die Apify-Integration optional in `.env.local` hinterlegen:

```bash
APIFY_API_TOKEN=...
APIFY_ACTOR_ID=...
APIFY_BASE_URL=https://api.apify.com
APIFY_DATASET_LIMIT_DEFAULT=100
```

## Apify CLI

Die App nutzt fuer den produktiven Search-Provider das offizielle `apify-client` SDK. Zusaetzlich ist die Apify CLI hilfreich, um Actor-Runs lokal zu pruefen oder unabhaengig von der App zu debuggen.

### Installation unter Windows

```powershell
irm https://apify.com/install-cli.ps1 | iex
```

Nach der Installation kann es sein, dass du ein neues Terminal oeffnen musst. Falls `apify` im aktuellen Terminal noch nicht gefunden wird, funktioniert auf diesem Rechner direkt:

```powershell
C:\Users\Vardar\.apify\bin\apify.exe --version
```

### Login

Mit Browser-/Console-Flow:

```powershell
apify login
```

Mit Token direkt:

```powershell
apify login --token <DEIN_APIFY_TOKEN>
```

### Schneller Actor-Check

Wenn dein Actor in `APIFY_ACTOR_ID` steht, kannst du ihn auch direkt per CLI testen:

```powershell
apify call <actor-id> --input "{""profileId"":""debug"",""targetRole"":""Recruiter"",""targetCountry"":""Deutschland""}" --output-dataset
```

Oder mit Input-Datei:

```powershell
apify call <actor-id> --input-file .\actor-input.json --output-dataset
```

### Nuetzliche CLI-Kommandos

```powershell
apify --version
apify login
apify call <actor-id> --input-file .\actor-input.json --output-dataset
apify logout
apify upgrade
```

Weitere Checks:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
```

## Projektstruktur

```text
src/
  app/
    (dashboard)/       # Screens und App Shell
    api/               # Route Handlers
  components/
    layout/            # Topbar, Sidebar, Bottom Nav
    ui/                # interne UI-Bausteine
    activity/          # Activity Feed
  features/
    analysis/
    employers/
    jobs/
    outreach/
    search-profiles/
    search-runs/
    templates/
  lib/
    constants/
    db/                # In-Memory App Context / Singleton
    utils/
    validation/
  providers/
    contracts/
    mock/
    future/
  repositories/        # austauschbarer Data Layer
  services/            # Business- und Workflow-Logik
  seed/                # realistische Startdaten
  test/                # Vitest Tests
```

## MVP-Umfang

Phase 1 enthaelt:

- Dashboard mit KPI-Karten, Quick Actions, Run-Uebersicht und Activity Feed
- Search Profile CRUD
- Mock Search Runs
- Jobliste und Jobdetail
- Regelbasierte Jobanalyse
- Employer Liste und Detailpflege
- Template Liste und Editor
- Outreach Queue und Detailworkflow
- Activity Logs
- CRM Sync Placeholder Endpunkte

## Architekturentscheidungen

### 1. Search as Provider

Die App koppelt sich nicht direkt an Mock-Daten, sondern an den Vertrag `SearchProvider`.

- Vertrag: [`src/providers/contracts/SearchProvider.ts`](src/providers/contracts/SearchProvider.ts)
- Mock-Implementierung: [`src/providers/mock/MockSearchProvider.ts`](src/providers/mock/MockSearchProvider.ts)
- Apify-Implementierung: [`src/providers/apify/ApifySearchProvider.ts`](src/providers/apify/ApifySearchProvider.ts)
- Apify-Client: [`src/providers/apify/ApifyClient.ts`](src/providers/apify/ApifyClient.ts)
- zukuenftige Provider-Stubs:
  - [`src/providers/future/StepstoneProvider.ts`](src/providers/future/StepstoneProvider.ts)
  - [`src/providers/future/IndeedProvider.ts`](src/providers/future/IndeedProvider.ts)
  - [`src/providers/future/LinkedInReferenceProvider.ts`](src/providers/future/LinkedInReferenceProvider.ts)
  - [`src/providers/future/CareerPageCrawlerProvider.ts`](src/providers/future/CareerPageCrawlerProvider.ts)

Der Rest des Systems arbeitet ausschliesslich mit normalisierten Jobdaten.

### 2. In-Memory jetzt, Mongo-ready spaeter

Phase 1 nutzt Seed-Daten plus In-Memory-Repositories. Die Business-Logik haengt an Repository-Vertraegen statt direkt an einem Storage-Format.

- App Context / Singleton: [`src/lib/db/app-store.ts`](src/lib/db/app-store.ts)
- Seed-Daten: [`src/seed/index.ts`](src/seed/index.ts)
- Repositories: [`src/repositories`](src/repositories)

Fuer MongoDB kann spaeter pro Repository eine neue Implementierung ergaenzt werden, ohne UI oder Services umzubauen.

### 3. Analysis as Service

Die Jobanalyse ist in Phase 1 heuristisch/regelbasiert, aber bereits als austauschbare Service-Schicht gekapselt.

- Service: [`src/services/AnalysisService.ts`](src/services/AnalysisService.ts)

Aktuell liefert sie:

- `clean_description`
- Kurz- und Langzusammenfassung
- Skill- und Requirement-Extraktion
- Sprachhinweise
- Visa-/Relocation-Hints
- Relevance- und Confidence-Score

### 4. Outreach as Workflow

Outreach bleibt bewusst review-first.

- Entwurf erzeugen
- Nachricht pruefen
- Freigeben
- Mock versenden
- Aktivitaet protokollieren

Zentrale Services:

- [`src/services/OutreachService.ts`](src/services/OutreachService.ts)
- [`src/services/TemplateService.ts`](src/services/TemplateService.ts)
- [`src/services/ActivityLogService.ts`](src/services/ActivityLogService.ts)

### 5. Apify als echter Search Provider

Wenn `APIFY_API_TOKEN` und `APIFY_ACTOR_ID` gesetzt sind, verwendet die App automatisch `ApifySearchProvider` statt `MockSearchProvider`.

Der Flow:

1. Search Run starten
2. Apify Actor asynchron anstossen
3. Run-Status on-demand pollen
4. Dataset-Ergebnisse normalisieren
5. Jobs importieren und deduplizieren

Neue Run-Metadaten umfassen:

- `providerRunId`
- `providerActorId`
- `providerDatasetId`
- `providerStatus`
- `lastPolledAt`
- `errorMessage`
- `resultsImported`

## API-Uebersicht

### Search Profiles

- `GET /api/search-profiles`
- `POST /api/search-profiles`
- `PATCH /api/search-profiles/:id`
- `DELETE /api/search-profiles/:id`

### Search Runs

- `GET /api/search-runs`
- `POST /api/search-runs/start`
- `GET /api/search-runs/:id`
- `POST /api/search-runs/:id/poll`

### Jobs

- `GET /api/jobs`
- `GET /api/jobs/:id`
- `PATCH /api/jobs/:id/status`
- `POST /api/jobs/:id/analyze`
- `POST /api/jobs/analyze-bulk`

### Employers

- `GET /api/employers`
- `GET /api/employers/:id`
- `PATCH /api/employers/:id`

### Templates

- `GET /api/templates`
- `POST /api/templates`
- `PATCH /api/templates/:id`

### Outreach

- `GET /api/outreach`
- `POST /api/outreach/generate`
- `POST /api/outreach/:id/approve`
- `POST /api/outreach/:id/send`

### CRM Sync Placeholder

- `POST /api/sync/employers`
- `POST /api/sync/outreach-status`

### Provider Verify

- `GET /api/providers/apify/verify`

## Seed-Daten

Die Seeds erzeugen ein realistisches internes Toolgefuehl:

- 4 Search Profiles
- 3 Search Runs
- 32 Jobs
- mehrere Provider (`mock_stepstone`, `mock_indeed`, `mock_linkedin_reference`)
- Dubletten und fehlende Felder
- mehrere Arbeitgeber und Kontakte
- mehrere Templates
- Outreach-Nachrichten in verschiedenen Stati
- Activity Logs

## Tests

Aktuell enthalten:

- Provider-Test
- Analysis-Service-Test
- Template-Service-Test
- Repository-Test
- UI-Test fuer Status-Badges

Tests liegen unter [`src/test`](src/test).

Zusaetzliche Apify-Tests:

- `ApifyClient`
- `ApifySearchProvider`
- `SearchService` Run-/Polling-Flow

## Spaetere Erweiterung um echte Provider

Fuer Phase 2+ ist vorgesehen:

1. Neue Provider-Klassen implementieren, die `SearchProvider` erfuellen.
2. Provider-Auswahl im `SearchService` dynamisch konfigurieren.
3. In-Memory-Repositories durch MongoDB-Repositories ersetzen.
4. CRM Sync Placeholder gegen echte Integrationen austauschen.
5. Analysis Service optional an einen echten KI-Service anbinden.

## Wichtige Hinweise zu Phase 1

- Keine echte externe Jobsuche
- Kein echtes E-Mail- oder LinkedIn-Sending
- Kein Auth- oder Rollenmodell
- Kein produktiver CRM-Sync
- Fokus auf lokale Lauffaehigkeit, klare Architektur und Erweiterbarkeit
