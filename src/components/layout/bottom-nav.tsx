import Link from "next/link";

import { primaryNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";

export function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-slate-200/80 bg-white/90 px-2 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {primaryNavigation.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-2xl text-[11px] font-medium",
                active ? "bg-slate-900 text-white" : "text-slate-500",
              )}
            >
              <Icon className="mb-1 h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
