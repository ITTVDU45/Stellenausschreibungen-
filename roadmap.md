Roadmap: Job-Sourcing- und Outreach-System mit Mock-Suchservice
1. Ziel des Systems

Das System soll später:

offene Jobs finden
Jobs analysieren und zusammenfassen
Arbeitgeberdaten strukturieren
Kontaktmöglichkeiten vorbereiten
vorformulierte Nachrichten verwalten
Nachrichten personalisieren
Kontaktaufnahme dokumentieren
später an echte Suchquellen per API/Feed angebunden werden

Wichtig für Phase 1:
Der Suchservice wird nicht direkt live an APIs angeschlossen, sondern als Mock Provider gebaut. Dadurch bleibt die Architektur sauber, testbar und erweiterbar.

2. Produktvision
Kernidee

Eine kleine interne Applikation, mit der das Team:

Suchprofile anlegt
passende Stellen aus einem Mock-Feed sieht
Stellen automatisch zusammenfassen lässt
Jobs nach Relevanz priorisiert
Arbeitgeber und Kontakte vorbereitet
Nachrichten aus Vorlagen generiert
Outreach kontrolliert auslöst
alle Schritte dokumentiert
Architekturprinzip

Der Suchservice wird als abstrakte Schnittstelle gebaut:

SearchProvider
MockSearchProvider
später:
StepstoneProvider
IndeedProvider
LinkedInReferenceProvider
CareerPageCrawlerProvider

So kann der Mock später ersetzt werden, ohne den Rest des Systems umzubauen.

3. Systemmodule
Modul A — Search Profiles

Verwaltung von Suchprofilen:

Jobtitel
Keywords
Ausschlusskeywords
Region/Land
Sprache
Branche
Priorität
Quelle aktiv/inaktiv
Modul B — Search Service

Zunächst nur Mock:

liefert Test-Jobdaten
simuliert verschiedene Quellen
erzeugt wiederholbare Ergebnisse
unterstützt Filter und Pagination

Später austauschbar gegen echte Provider.

Modul C — Job Analysis
Textbereinigung
Extraktion relevanter Informationen
KI-Zusammenfassung
Tagging
Relevanzscore
Modul D — Employer Enrichment
Arbeitgeberprofil
Website
Karriereseite
Kontaktfelder
Notizen
Vertrauens-/Vollständigkeitsscore
Modul E — Outreach Templates
Textvorlagen verwalten
Sprache wählen
Kanal wählen
Variablen einsetzen
Personalisierung vorbereiten
Modul F — Outreach Workflow
Review-Queue
Freigabe
Statuspflege
Kontaktlog
Follow-up-Vorbereitung
Modul G — CRM Sync Ready
API-First-Schnittstellen
spätere Übergabe an CRM
Status- und Historienexport
4. Technische Zielarchitektur
Frontend
Next.js
Tailwind
interne Admin-/Sales-Oberfläche
Backend
Node.js mit NestJS oder Express
REST API
KI-Service
Python FastAPI
Aufgaben:
Zusammenfassung
Extraktion
Scoring
Personalisierung
Datenbank
PostgreSQL
Queue / Async
Redis + BullMQ
Storage
optional MinIO/S3 für Exporte, Snapshots, Anhänge

Das passt zur vorhandenen technischen Ausrichtung mit Frontend, Node-Backend, Python-KI und modularer Infrastruktur.

5. Mock-Strategie für den Suchservice
Ziel

Nicht sofort echte Integrationen bauen, sondern die Suchlogik simulieren.

MockSearchProvider soll:
definierte Testjobs aus JSON/DB liefern
Filter auf Keywords, Land, Branche unterstützen
verschiedene Quellen simulieren:
mock_stepstone
mock_indeed
mock_linkedin_reference
realistische Datenstrukturen liefern
Dubletten simulieren
fehlende Felder simulieren
wechselnde Aktualität simulieren
Vorteil

Damit kannst du bereits vollständig entwickeln:

Jobliste
Jobdetail
Analyse
Zusammenfassung
Priorisierung
Templates
Outreach-Prozess
Logs
CRM-Vorbereitung
6. Datenmodell
search_profiles
id
name
target_role
target_region
target_country
include_keywords
exclude_keywords
languages
active
created_at
search_runs
id
profile_id
provider_name
run_started_at
run_finished_at
status
result_count
jobs
id
external_id
provider_name
source_url
title
company_name
location
country
employment_type
raw_description
clean_description
published_at
imported_at
duplicate_hash
status
job_analysis
id
job_id
summary_short
summary_long
extracted_skills
extracted_requirements
extracted_language_requirements
visa_hint
relocation_hint
relevance_score
confidence_score
employers
id
company_name
website
careers_url
contact_email
phone
address
linkedin_url
notes
employer_contacts
id
employer_id
full_name
role
email
phone
source
confidence_score
templates
id
name
language
channel
subject_template
body_template
active
outreach_messages
id
job_id
employer_id
contact_id
template_id
generated_subject
generated_body
approval_status
send_status
created_at
sent_at
activity_logs
id
entity_type
entity_id
action
payload
created_at
7. Roadmap nach Phasen
Phase 0 — Architektur & Vorbereitung
Ziel

Technisches Grundgerüst aufsetzen.

Aufgaben
Monorepo oder Multi-App-Struktur definieren
Backend-Projekt anlegen
Frontend-Projekt anlegen
DB-Schema vorbereiten
Auth für internes Team
Rollen definieren
API-Konventionen definieren
Mock-Suchservice-Schnittstelle definieren
Ergebnis
lauffähige Grundarchitektur
leere UI
API-Basis
DB-Migrationen
sauberer Provider-Vertrag
Phase 1 — Mock Search MVP
Ziel

Jobs aus Mock-Daten importieren und anzeigen.

Aufgaben
SearchProvider Interface definieren
MockSearchProvider implementieren
Mock-Datensätze als JSON oder Seed in DB
Search Profile CRUD
Search Run anstoßen
Jobs importieren
Jobliste im Frontend
Filter und Sortierung
Jobdetailseite
Ergebnis
Nutzer kann Suchprofil anlegen
Suchlauf starten
Mock-Jobs sehen
Jobs öffnen und prüfen
Phase 2 — Analyse & Zusammenfassung
Ziel

Jeder Job bekommt eine maschinenlesbare Auswertung.

Aufgaben
Raw Description Cleaning
Skill-Extraktion
Anforderungen extrahieren
Zusammenfassung generieren
Tagging
Relevanzscore
Analyse-Ergebnisse speichern
Anzeige der Analyse im Jobdetail
Ergebnis
jeder Job hat:
kurze Zusammenfassung
wichtige Anforderungen
Score
Hinweise zu Sprache/Visa/Relocation
Phase 3 — Arbeitgebermodul
Ziel

Arbeitgeber strukturiert aufbereiten.

Aufgaben
Employer-Entity
automatisches Matching Job → Employer
Employer-Detailseite
Website/Karriereseite Felder
Kontaktinformationen manuell oder halbautomatisch pflegen
Vollständigkeitsscore
Notizen
Dublettenerkennung bei Arbeitgebern
Ergebnis
Arbeitgeberdatenbank entsteht parallel zur Jobdatenbank
Jobs sind Firmen zugeordnet
Kontakte können vorbereitet werden
Phase 4 — Vorlagen & Personalisierung
Ziel

Outreach-Nachrichten generieren.

Aufgaben
Template-Verwaltung
Sprachumschaltung
Kanaldefinition
Variablen-System
KI-Personalisierung
Nachrichtenvorschau
manuelle Bearbeitung vor Freigabe
Ergebnis
Team kann aus Vorlagen wählen
Texte werden automatisch mit Job- und Firmendaten gefüllt
finale Nachricht ist reviewbar
Phase 5 — Outreach Workflow
Ziel

Kontaktaufnahme operativ abbilden.

Aufgaben
Review-Queue
Freigabestatus
Sendestatus
Aktivitätsprotokoll
Wiedervorlage
Antwortstatus
Notizen
manuelle oder halbautomatische Versandoption
Ergebnis
ein nachvollziehbarer Outreach-Prozess
klare Historie
keine verlorenen Kontakte
Phase 6 — CRM-Ready Integration
Ziel

Anbindung an euer Gesamtsystem vorbereiten.

Aufgaben
API-Endpunkte stabilisieren
Export-/Sync-Endpunkte
Employer Sync
Outreach Status Sync
Activity Feed Sync
Rollen- und Rechteprüfung
spätere Verknüpfung mit Matching-/Sales-/Adminportalen
Ergebnis
Modul ist eigenständig nutzbar
kann aber später sauber ins People4Europe-System integriert werden
Phase 7 — Echter Search Provider später
Ziel

Mock austauschbar durch echten Suchdienst.

Aufgaben
StepstoneProvider implementieren
IndeedProvider nur bei erlaubtem Zugang
CareerPageCrawlerProvider
optional LinkedInReferenceProvider nur als Referenz-/Manuell-Hilfe
Provider-Routing
Retry-Logik
Monitoring
Fehlerbehandlung
Ergebnis
echte Datenquellen ersetzen Mock
restliches System bleibt unverändert
8. API-Design
Interne Endpunkte
Search Profiles
GET /search-profiles
POST /search-profiles
PATCH /search-profiles/:id
DELETE /search-profiles/:id
Search Runs
POST /search-runs/start
GET /search-runs
GET /search-runs/:id
Jobs
GET /jobs
GET /jobs/:id
PATCH /jobs/:id/status
Analysis
POST /jobs/:id/analyze
POST /jobs/analyze-bulk
Employers
GET /employers
GET /employers/:id
PATCH /employers/:id
Templates
GET /templates
POST /templates
PATCH /templates/:id
Outreach
POST /outreach/generate
POST /outreach/:id/approve
POST /outreach/:id/send
GET /outreach
CRM Sync
POST /sync/employers
POST /sync/outreach-status
9. Ordnerstruktur
/apps
  /job-sourcing-web
  /job-sourcing-api

/services
  /job-ai-service

/packages
  /shared-types
  /provider-contracts
  /template-engine
  /scoring
  /utils

/data
  /mock-jobs
  /mock-employers
Provider-Struktur
/job-sourcing-api/src/providers
  /contracts
    SearchProvider.ts
  /mock
    MockSearchProvider.ts
  /future
    StepstoneProvider.ts
    IndeedProvider.ts
    LinkedInReferenceProvider.ts
10. Umsetzung in Sprints
Sprint 1
Projektsetup
DB-Schema
Auth
Search Profile CRUD
SearchProvider Interface
MockSearchProvider
Mock-Datenimport
Sprint 2
Jobliste
Jobdetailseite
Search Runs
Statuslogik
Filter und Suche in der UI
Sprint 3
Jobanalyse
Zusammenfassung
Scoring
Analyseanzeige im Frontend
Sprint 4
Arbeitgebermodul
Kontakte
Employer-Detailseite
Dublettenerkennung
Sprint 5
Vorlagenverwaltung
Variablenersetzung
Personalisierte Nachrichtengenerierung
Vorschau
Sprint 6
Outreach-Queue
Freigabe
Sendestatus
Aktivitätslog
Wiedervorlage
Sprint 7
Reporting
CRM-Schnittstellen
Exporte
Hardening
Tests
Dokumentation
11. Prioritäten
Must-have
Mock-Provider
Search Profile
Jobs importieren
Jobanalyse
Arbeitgeberzuordnung
Vorlagen
Outreach-Queue
Status und Logs
Should-have
Bulk-Analyse
Dublettenerkennung
Wiedervorlage
Exportfunktionen
CRM-Ready Endpunkte
Nice-to-have
Follow-up-Automatik
Mehrsprachige Vorlagen
Kontakt-Confidence-Scoring
Kampagnenansicht
12. Risiken und Gegenmaßnahmen
Risiko 1

Echte APIs kommen später anders als erwartet.
Maßnahme: klare Provider-Abstraktion.

Risiko 2

Mock-Daten sind zu simpel.
Maßnahme: realistische Seed-Daten mit Dubletten, fehlenden Feldern, verschiedenen Quellen.

Risiko 3

Analyse-Logik wird zu früh an Live-Quellen gekoppelt.
Maßnahme: Analyse nur gegen normalisierte Jobdaten bauen.

Risiko 4

Outreach wird zu früh automatisiert.
Maßnahme: zuerst Review-First-Workflow.

13. Endzustand nach dieser Roadmap

Nach der Umsetzung hast du ein System, das bereits produktionsnah funktioniert, obwohl die eigentliche Suche noch gemockt ist:

Suchprofile funktionieren
Jobdatenmodell steht
Jobs werden importiert
Jobs werden analysiert
Arbeitgeberdaten werden strukturiert
Vorlagen funktionieren
Outreach kann vorbereitet werden
alles ist API-ready
echter Suchservice kann später eingesteckt werden
14. Empfehlung für deine Umsetzung

Ich würde das System nicht direkt als “KI-Agent” labeln, sondern zunächst als:

Job Sourcing & Employer Outreach Platform

mit diesen Prinzipien:

Search as Provider
Analysis as Service
Outreach as Workflow
CRM as Integration Layer

Dadurch bleibt das Ganze klar, wartbar und später skalierbar — genau passend zur bereits geplanten People4Europe-Systemlandschaft mit modularen Diensten, CRM-Zentralisierung und KI-Services.