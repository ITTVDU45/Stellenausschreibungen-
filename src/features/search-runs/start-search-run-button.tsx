"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const MAX_POLL_ATTEMPTS = 20;
const POLL_INTERVAL_MS = 2500;

function sleep(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

export function StartSearchRunButton({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);

  async function handleClick() {
    setIsRunning(true);
    try {
      const response = await fetch("/api/search-runs/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      if (!response.ok) {
        throw new Error("Suchlauf konnte nicht gestartet werden.");
      }

      const payload = (await response.json()) as {
        success: boolean;
        data?: {
          run?: {
            id: string;
            status: string;
            providerStatus?: string;
            errorMessage?: string | null;
            datasetItemCount?: number;
            resultCount?: number;
          };
          importedJobs?: { id: string }[];
          importedCount?: number;
          datasetItemCount?: number;
          actorReference?: string | null;
        };
      };

      const runId = payload.data?.run?.id;
      if (!runId) {
        throw new Error("Kein Search Run wurde zurueckgegeben.");
      }

      const initialImportedCount = payload.data?.importedCount ?? payload.data?.importedJobs?.length ?? 0;
      const initialDatasetCount = payload.data?.datasetItemCount ?? payload.data?.run?.datasetItemCount ?? 0;

      if (initialImportedCount > 0) {
        toast.success(
          `${initialImportedCount} Indeed Live Jobs importiert${initialDatasetCount ? ` (${initialDatasetCount} Dataset-Items)` : ""}`,
        );
        router.push("/jobs");
        router.refresh();
        return;
      }

      toast.loading("Indeed Live Suche laeuft und Ergebnisse werden importiert...", { id: runId });

      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
        await sleep(POLL_INTERVAL_MS);

        const pollResponse = await fetch(`/api/search-runs/${runId}/poll`, {
          method: "POST",
        });

        if (!pollResponse.ok) {
          throw new Error("Search Run konnte nicht weiter abgefragt werden.");
        }

        const pollPayload = (await pollResponse.json()) as {
          success: boolean;
          data?: {
            run?: { status: string; errorMessage?: string | null; datasetItemCount?: number };
            importedJobs?: { id: string }[];
            importedCount?: number;
            datasetItemCount?: number;
          };
        };

        const runStatus = pollPayload.data?.run?.status;
        const importedCount = pollPayload.data?.importedCount ?? pollPayload.data?.importedJobs?.length ?? 0;
        const datasetCount = pollPayload.data?.datasetItemCount ?? pollPayload.data?.run?.datasetItemCount ?? 0;

        if (runStatus === "completed") {
          toast.success(
            `${importedCount} Indeed Live Jobs importiert${datasetCount ? ` (${datasetCount} Dataset-Items)` : ""}`,
            { id: runId },
          );
          router.push("/jobs");
          router.refresh();
          return;
        }

        if (runStatus === "failed") {
          throw new Error(pollPayload.data?.run?.errorMessage ?? "Suchlauf fehlgeschlagen.");
        }
      }

      toast.info("Suchlauf gestartet. Die Ergebnisse werden noch verarbeitet.", { id: runId });
      router.push(`/search-runs/${runId}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fehler beim Suchlauf");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <Button onClick={handleClick} disabled={isRunning}>
      {isRunning ? "Suche laeuft..." : "Suchverlauf starten"}
    </Button>
  );
}
