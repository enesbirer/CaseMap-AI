"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium tracking-tight",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/5 text-foreground",
        primary: "border-primary/25 bg-primary/15 text-foreground",
        success: "border-success/25 bg-success/15 text-foreground",
        warning: "border-warning/25 bg-warning/15 text-foreground",
        danger: "border-danger/25 bg-danger/15 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

