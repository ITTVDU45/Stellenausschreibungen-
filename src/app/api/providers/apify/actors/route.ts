import { getApifyConfig } from "@/lib/env/apify";
import { fail, ok } from "@/lib/utils/responses";
import { ApifyClient } from "@/providers/apify/ApifyClient";

export async function GET() {
  const config = getApifyConfig();
  if (!config.apiToken) {
    return ok({
      authenticated: false,
      ownedActors: [],
      discoverActors: [],
    });
  }

  try {
    const client = new ApifyClient();
    const [ownedActors, discoverActors] = await Promise.all([
      client.listActors({ ownedOnly: true, limit: 50 }),
      client.listActors({ limit: 12 }),
    ]);

    return ok({
      authenticated: true,
      ownedActors: ownedActors.data,
      discoverActors: discoverActors.data,
    });
  } catch (error) {
    return fail("Actoren konnten nicht geladen werden", "APIFY_ACTORS_LIST_FAILED", 400, error);
  }
}
