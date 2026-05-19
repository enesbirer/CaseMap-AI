"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNav } from "@/config/nav";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const items = appNav.slice(0, 5);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-background/75 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-5 px-2 py-2">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] transition-colors",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

