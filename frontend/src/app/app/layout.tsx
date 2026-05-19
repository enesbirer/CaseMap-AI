"use client";

import { useState } from "react";

import { Protected } from "@/components/auth/protected";
import { MobileNav } from "@/components/nav/mobile-nav";
import { Sidebar } from "@/components/nav/sidebar";
import { Topbar } from "@/components/nav/topbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Protected>
      <div className="min-h-dvh">
        <Topbar onOpenMenu={() => setOpen(true)} />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-24 pt-6 md:grid-cols-[260px_1fr] md:pb-10">
          <aside className="hidden h-[calc(100dvh-6.5rem)] rounded-[calc(var(--radius)+8px)] border border-white/10 bg-white/5 md:sticky md:top-20 md:block">
            <Sidebar />
          </aside>

          <main className="min-w-0">{children}</main>
        </div>

        <MobileNav />

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0">
            <Sidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </Protected>
  );
}

