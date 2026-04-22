import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Briefcase,
  Building2,
  House,
  Mail,
  Network,
  Search,
  Settings,
  Text,
} from "lucide-react";

export interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const primaryNavigation: NavigationItem[] = [
  { href: "/", label: "Dashboard", icon: House },
  { href: "/search-profiles", label: "Profile", icon: Search },
  { href: "/search-runs", label: "Runs", icon: Activity },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/employers", label: "Arbeitgeber", icon: Building2 },
  { href: "/agents", label: "Agenten", icon: Network },
  { href: "/templates", label: "Vorlagen", icon: Text },
  { href: "/outreach", label: "Outreach", icon: Mail },
  { href: "/activity", label: "Aktivitäten", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];
