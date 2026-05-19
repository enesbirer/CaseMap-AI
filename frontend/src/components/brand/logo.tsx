"use client";

import { Scale } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
        <Scale className={cn("h-5 w-5 text-primary", iconClassName)} />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-tight">CaseMap AI</div>
        <div className="text-xs text-muted-foreground">Legal Intelligence OS</div>
      </div>
    </div>
  );
}

