"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.05),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)]">
      <Topbar />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar pathname={pathname} />
        <main className="min-h-[calc(100vh-74px)] flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
      <BottomNav pathname={pathname} />
    </div>
  );
}
