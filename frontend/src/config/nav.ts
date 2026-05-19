import {
  CalendarClock,
  FileStack,
  LayoutDashboard,
  Map,
  ScanText,
  Settings,
} from "lucide-react";

export const appNav = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/case-analysis", label: "Vaka Analizi", icon: ScanText },
  { href: "/app/hearings", label: "Duruşmalar", icon: CalendarClock },
  { href: "/app/documents", label: "Dokümanlar", icon: FileStack },
  { href: "/app/roadmap", label: "Roadmap", icon: Map },
  { href: "/app/settings", label: "Ayarlar", icon: Settings },
];

