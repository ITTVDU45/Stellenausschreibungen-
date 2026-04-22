import { describe, expect, it, vi } from "vitest";

import { ApifyClient, ApifyApiError } from "@/providers/apify/ApifyClient";

describe("ApifyClient", () => {
  it("verifiziert den Account über den offiziellen SDK-Client", async () => {
    process.env.APIFY_API_TOKEN = "test-token";

    const sdkClient = {
      user: vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue({
          username: "tester",
          email: "tester@example.com",
        }),
      }),
    };

    const client = new ApifyClient(sdkClient as never);
    const response = await client.verifyAccount();

    expect(sdkClient.user).toHaveBeenCalledWith("me");
    expect(response.data.username).toBe("tester");
  });

  it("mappt SDK-Fehler auf aussagekräftige Codes", async () => {
    process.env.APIFY_API_TOKEN = "bad-token";

    const sdkClient = {
      user: vi.fn().mockReturnValue({
        get: vi.fn().mockRejectedValue({
          message: "Invalid token",
          statusCode: 401,
        }),
      }),
    };

    const client = new ApifyClient(sdkClient as never);

    await expect(client.verifyAccount()).rejects.toBeInstanceOf(ApifyApiError);
    await expect(client.verifyAccount()).rejects.toMatchObject({
      code: "APIFY_UNAUTHORIZED",
      status: 401,
    });
  });
});
