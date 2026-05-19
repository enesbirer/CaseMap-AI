"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { appNav } from "@/config/nav";
import { useAuthStore } from "@/store/auth-store";

export function Topbar({ onOpenMenu }: { onOpenMenu?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const title = useMemo(() => appNav.find((i) => i.href === pathname)?.label ?? "CaseMap AI", [pathname]);

  return (
    <div className="sticky top-0 z-30 border-b border-white/5 bg-background/45 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMenu} aria-label="Menü">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="text-sm font-semibold tracking-tight">{title}</div>
          <div className="text-xs text-muted-foreground">Yapılandırılmış analiz ve süreç takibi</div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Tema"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="max-w-[180px] truncate">
              {user?.email ?? "Hesap"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => router.push("/app/settings")}>Ayarlar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                logout();
                router.push("/auth/login");
              }}
            >
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

