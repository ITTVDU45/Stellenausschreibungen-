import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { curatedApifyActors } from "@/lib/constants/apify-actors";
import { cn } from "@/lib/utils/cn";
import { getApifyConfig } from "@/lib/env/apify";
import { formatDate } from "@/lib/utils/dates";
import { ApifyApiError, ApifyClient, type ApifyActorListItem } from "@/providers/apify/ApifyClient";

const CATEGORY_FALLBACKS = ["AI", "Lead generation", "SEO tools", "Social media", "E-commerce", "Agents"];
const CURATED_ACTOR_REFERENCES = curatedApifyActors.map((actor) => actor.reference);

function normalizeText(value: string | null | undefined) {
  return (value ?? "").toLowerCase().trim();
}

function truncate(value: string | null | undefined, maxLength: number) {
  if (!value) {
    return null;
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trim()}...`;
}

function formatCompactNumber(value: number | null | undefined) {
  if (!value || value <= 0) {
    return null;
  }

  return new Intl.NumberFormat("de-DE", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCategoryLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildAvatarLabel(actor: ApifyActorListItem) {
  const source = actor.title ?? actor.name;
  return source
    .split(/[\s-_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "A";
}

function buildActorSummary(actor: ApifyActorListItem) {
  return (
    truncate(actor.readmeSummary, 160) ??
    truncate(actor.description, 160) ??
    "Keine Beschreibung verfuegbar. Dieser Actor kann spaeter fuer Search, Analyse oder Outreach bewertet werden."
  );
}

function isConfiguredActor(actor: ApifyActorListItem, configuredActorId: string | null) {
  if (!configuredActorId) {
    return false;
  }

  return actor.id === configuredActorId || actor.slug === configuredActorId || actor.name === configuredActorId;
}

function dedupeActors(actors: ApifyActorListItem[]) {
  const map = new Map<string, ApifyActorListItem>();

  for (const actor of actors) {
    map.set(actor.slug, actor);
  }

  return Array.from(map.values());
}

function collectCategories(actors: ApifyActorListItem[]) {
  const categorySet = new Set<string>();

  for (const actor of actors) {
    for (const category of actor.categories) {
      if (category.trim()) {
        categorySet.add(formatCategoryLabel(category));
      }
    }
  }

  const derivedCategories = Array.from(categorySet).sort((left, right) => left.localeCompare(right));
  return derivedCategories.length > 0 ? derivedCategories.slice(0, 10) : CATEGORY_FALLBACKS;
}

function matchesQuery(actor: ApifyActorListItem, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    actor.title,
    actor.name,
    actor.slug,
    actor.description,
    actor.readmeSummary,
    actor.username,
    ...actor.categories,
  ]
    .map((value) => normalizeText(value))
    .join(" ");

  return haystack.includes(query);
}

function matchesCategory(actor: ApifyActorListItem, selectedCategory: string) {
  if (!selectedCategory) {
    return true;
  }

  return actor.categories.some((category) => formatCategoryLabel(category) === selectedCategory);
}

function buildCategoryHref(query: string, category: string) {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (category) {
    params.set("category", category);
  }

  const search = params.toString();
  return search ? `/agents?${search}` : "/agents";
}

async function loadActors() {
  const config = getApifyConfig();
  if (!config.apiToken) {
    return {
      state: "missing" as const,
      actors: [] as ApifyActorListItem[],
      message: "API-Token fehlt. Hinterlege den Token in env.local, um Actoren zu laden.",
      configuredActorId: config.actorId,
    };
  }

  try {
    const client = new ApifyClient();
    const curatedActors = await client.getActorsByReferences(CURATED_ACTOR_REFERENCES);
    const mergedActors = dedupeActors(curatedActors.data);

    return {
      state: "ready" as const,
      actors: mergedActors,
      curatedCount: CURATED_ACTOR_REFERENCES.length,
      message: null,
      configuredActorId: config.actorId,
    };
  } catch (error) {
    const message =
      error instanceof ApifyApiError
        ? error.message
        : "Die Actor-Liste konnte gerade nicht geladen werden.";

    return {
      state: "error" as const,
      actors: [] as ApifyActorListItem[],
      curatedCount: CURATED_ACTOR_REFERENCES.length,
      message,
      configuredActorId: config.actorId,
    };
  }
}

export default async function AgentsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const query = normalizeText(
    typeof resolvedParams.q === "string" ? resolvedParams.q : Array.isArray(resolvedParams.q) ? resolvedParams.q[0] : "",
  );
  const selectedCategory =
    typeof resolvedParams.category === "string"
      ? resolvedParams.category
      : Array.isArray(resolvedParams.category)
        ? resolvedParams.category[0]
        : "";

  const { state, actors, curatedCount, message, configuredActorId } = await loadActors();
  const categories = collectCategories(actors);
  const filteredActors = actors.filter(
    (actor) => matchesQuery(actor, query) && matchesCategory(actor, selectedCategory),
  );
  const latestActor = [...actors].sort((left, right) => right.modifiedAt.localeCompare(left.modifiedAt))[0];

  return (
    <div className="space-y-8 pb-24">
      <SectionHeader
        eyebrow="Agenten"
        title="Agenten Store"
        description="Store-aehnliche Uebersicht deiner ausgewaehlten Actoren. Suche und Kategorien arbeiten nur auf dieser kuratierten Auswahl."
      />

      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur md:p-8">
        <div className="space-y-5">
          <div className="space-y-3">
            <h3 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">Agenten-Store Stil</h3>
            <p className="max-w-3xl text-sm text-slate-500 md:text-base">
              Browse-Ansicht fuer eine feste Auswahl relevanter Actoren mit Suchfeld, Kategorien und kuratiertem Kartenraster.
            </p>
          </div>

          <form action="/agents" className="flex flex-col gap-3 md:flex-row">
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search Actors"
              className="h-13 rounded-2xl border-slate-300 text-base md:max-w-xl"
            />
            {selectedCategory ? <input type="hidden" name="category" value={selectedCategory} /> : null}
            <Button type="submit" size="lg" className="h-13 rounded-2xl px-6">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <Link
              href={buildCategoryHref(query, "")}
              className={cn(
                buttonVariants({ variant: selectedCategory ? "secondary" : "primary", size: "sm" }),
                "rounded-full",
              )}
            >
              Alle
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={buildCategoryHref(query, category)}
                className={cn(
                  buttonVariants({ variant: selectedCategory === category ? "primary" : "secondary", size: "sm" }),
                  "rounded-full",
                )}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="block space-y-2">
            <CardDescription>Sichtbare Actoren</CardDescription>
            <CardTitle className="text-3xl">{actors.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="block space-y-2">
            <CardDescription>Kuratierte Auswahl</CardDescription>
            <CardTitle className="text-3xl">{curatedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="block space-y-2">
            <CardDescription>Filtertreffer</CardDescription>
            <CardTitle className="text-3xl">{filteredActors.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="block space-y-2">
            <CardDescription>Zuletzt aktualisiert</CardDescription>
            <CardTitle>{latestActor ? formatDate(latestActor.modifiedAt, "dd.MM.yyyy HH:mm") : "Nicht verfuegbar"}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {state === "missing" ? (
        <Card>
          <CardHeader className="block space-y-3">
            <div>
              <CardTitle>API-Anbindung ist noch nicht konfiguriert</CardTitle>
              <CardDescription>{message}</CardDescription>
            </div>
            <Link href="/settings" className={cn(buttonVariants(), "w-fit")}>
              Zu den Settings
            </Link>
          </CardHeader>
        </Card>
      ) : null}

      {state === "error" ? (
        <Card className="border-rose-200/80 bg-rose-50/80">
          <CardHeader className="block space-y-2">
            <CardTitle>Actor-Liste konnte nicht geladen werden</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {state === "ready" ? (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-slate-950">Alle Agenten</h3>
              <p className="mt-1 text-sm text-slate-500">
                {filteredActors.length} Treffer
                {query ? ` fuer "${query}"` : ""}
                {selectedCategory ? ` in ${selectedCategory}` : ""}
              </p>
            </div>
            {(query || selectedCategory) && (
              <Link href="/agents" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full")}>
                Filter zuruecksetzen
              </Link>
            )}
          </div>

          {filteredActors.length === 0 ? (
            <Card>
              <CardHeader className="block space-y-2">
                <CardTitle>Keine passenden Actoren gefunden</CardTitle>
                <CardDescription>
                  Passe Suche oder Kategorie an, damit wir innerhalb deiner kuratierten Actor-Auswahl wieder Treffer zeigen koennen.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredActors.map((actor) => {
                const isActive = isConfiguredActor(actor, configuredActorId);
                const engagement = formatCompactNumber(actor.totalUsers30Days ?? actor.totalUsers);
                const runVolume = formatCompactNumber(actor.totalRuns);

                return (
                  <Card
                    key={actor.slug}
                    className="flex h-full flex-col justify-between rounded-[28px] border-slate-200 bg-white p-0 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.35)]"
                  >
                    <div className="border-b border-slate-100 p-6">
                      <div className="mb-5 flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#111827_0%,#334155_100%)] text-base font-semibold text-white">
                          {buildAvatarLabel(actor)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="truncate text-[1.35rem] font-semibold leading-tight text-slate-950">
                              {actor.title ?? formatCategoryLabel(actor.name)}
                            </h4>
                            {isActive ? <Badge variant="success">Aktiv</Badge> : null}
                          </div>
                          <p className="mt-1 truncate text-sm text-slate-500">{actor.slug}</p>
                        </div>
                      </div>

                      <p className="min-h-[112px] text-[15px] leading-7 text-slate-700">{buildActorSummary(actor)}</p>
                    </div>

                    <div className="space-y-5 p-6">
                      <div className="flex flex-wrap gap-2.5">
                        {(actor.categories.length > 0 ? actor.categories.slice(0, 3).map(formatCategoryLabel) : ["General"]).map(
                          (category) => (
                            <Badge key={`${actor.slug}-${category}`} variant="neutral">
                              {category}
                            </Badge>
                          ),
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          <span>{actor.username}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          {engagement ? <span>{engagement} Nutzer</span> : null}
                          {runVolume ? <span>{runVolume} Runs</span> : null}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
