import Link from "next/link";

import { primaryNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";

export function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-white/80 px-5 py-6 lg:block">
      <div className="mb-8 rounded-[28px] bg-slate-900 p-5 text-white">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Workspace</p>
        <h2 className="mt-3 text-xl font-semibold">Employer Outreach</h2>
        <p className="mt-2 text-sm text-slate-300">Review-first Workflow mit Mock-Providern</p>
      </div>
      <nav className="space-y-2">
        {primaryNavigation.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
