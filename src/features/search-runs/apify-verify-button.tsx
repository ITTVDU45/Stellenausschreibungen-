"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ApifyVerifyButton() {
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant="secondary"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const response = await fetch("/api/providers/apify/verify");
          const payload = await response.json();
          if (!response.ok || !payload.success) {
            throw new Error("API-Verifikation fehlgeschlagen.");
          }

          const username = payload.data.username ? ` als ${payload.data.username}` : "";
          const actorHint = payload.data.actorConfigured ? "Actor konfiguriert" : "Actor fehlt";
          toast.success(`API verbunden${username} · ${actorHint}`);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "API-Verifikation fehlgeschlagen");
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "Prüft..." : "API prüfen"}
    </Button>
  );
}
