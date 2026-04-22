"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function DeleteSearchProfileButton({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant="danger"
      size="sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const response = await fetch(`/api/search-profiles/${profileId}`, { method: "DELETE" });
          if (!response.ok) {
            throw new Error("Suchprofil konnte nicht gelöscht werden.");
          }
          toast.success("Suchprofil gelöscht");
          router.refresh();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Löschen fehlgeschlagen");
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "Löscht..." : "Löschen"}
    </Button>
  );
}
