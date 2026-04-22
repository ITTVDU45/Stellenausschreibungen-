"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

async function postAction(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Aktion fehlgeschlagen");
  }
}

export function OutreachApproveButton({ outreachId }: { outreachId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant="secondary"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await postAction(`/api/outreach/${outreachId}/approve`, { approvalStatus: "approved" });
          toast.success("Nachricht freigegeben");
          router.refresh();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Freigabe fehlgeschlagen");
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "Prüft..." : "Freigeben"}
    </Button>
  );
}

export function OutreachSendButton({ outreachId }: { outreachId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await postAction(`/api/outreach/${outreachId}/send`, { sendStatus: "mock_sent" });
          toast.success("Nachricht mock-versendet");
          router.refresh();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Versand fehlgeschlagen");
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "Sendet..." : "Mock senden"}
    </Button>
  );
}
