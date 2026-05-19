"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { appNav } from "@/config/nav";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="px-2">
        <Logo />
      </div>

      <div className="flex flex-col gap-1">
        {appNav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-[calc(var(--radius)-6px)] px-3 py-2 text-sm transition-colors",
                active ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto space-y-3">
        <div className="rounded-[calc(var(--radius)-6px)] border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground">
          Bu ürün hukuki danışmanlık değildir. Karar vermeden önce bir uzmana danışın.
        </div>
        <Button variant="outline" className="w-full" onClick={() => logout()}>
          Çıkış Yap
        </Button>
      </div>
    </div>
  );
}

