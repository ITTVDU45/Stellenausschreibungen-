"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function AnalyzeJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleClick() {
    setIsAnalyzing(true);
    const response = await fetch(`/api/jobs/${jobId}/analyze`, { method: "POST" });

    if (!response.ok) {
      toast.error("Analyse fehlgeschlagen");
      setIsAnalyzing(false);
      return;
    }

    toast.success("Analyse erstellt");
    router.refresh();
    setIsAnalyzing(false);
  }

  return <Button onClick={handleClick}>{isAnalyzing ? "Analysiert..." : "Analyse starten"}</Button>;
}
