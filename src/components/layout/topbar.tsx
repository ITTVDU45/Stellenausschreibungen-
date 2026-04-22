import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-[rgba(245,247,250,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
            Job Sourcing & Employer Outreach Platform
          </p>
          <h1 className="text-lg font-semibold text-slate-900">Interne Sourcing-Oberfläche</h1>
        </div>
        <div className="hidden max-w-sm flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input placeholder="Jobs, Arbeitgeber, Vorlagen suchen" className="pl-9" />
          </div>
        </div>
        <Button variant="secondary" size="sm" className="rounded-2xl px-3">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
