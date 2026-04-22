"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function PollSearchRunButton({ runId }: { runId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant="secondary"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const response = await fetch(`/api/search-runs/${runId}/poll`, {
            method: "POST",
          });
          if (!response.ok) {
            throw new Error("Polling fehlgeschlagen.");
          }
          const payload = (await response.json()) as {
            success: boolean;
            data?: { importedCount?: number; datasetItemCount?: number; run?: { status?: string } };
          };
          const importedCount = payload.data?.importedCount ?? 0;
          const datasetCount = payload.data?.datasetItemCount ?? 0;
          const status = payload.data?.run?.status;
          toast.success(
            status === "completed"
              ? `Indeed Live aktualisiert: ${importedCount} Imports aus ${datasetCount} Dataset-Items`
              : "Run-Status aktualisiert",
          );
          router.refresh();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Polling fehlgeschlagen");
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "Pollt..." : "Run pollen"}
    </Button>
  );
}
