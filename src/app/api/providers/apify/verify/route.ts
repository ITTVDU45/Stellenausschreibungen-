import { getApifyConfig } from "@/lib/env/apify";
import { fail, ok } from "@/lib/utils/responses";
import { ApifyClient } from "@/providers/apify/ApifyClient";

export async function GET() {
  const config = getApifyConfig();
  if (!config.apiToken) {
    return ok({
      authenticated: false,
      username: null,
      actorConfigured: false,
    });
  }

  try {
    const client = new ApifyClient();
    const response = await client.verifyAccount();

    return ok({
      authenticated: true,
      username: response.data.username ?? response.data.email ?? null,
      actorConfigured: true,
    });
  } catch (error) {
    return fail("API-Verifikation fehlgeschlagen", "APIFY_VERIFY_FAILED", 400, error);
  }
}
