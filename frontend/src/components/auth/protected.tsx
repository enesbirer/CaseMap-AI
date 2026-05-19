"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";

export function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
  }, [token, router, pathname]);

  if (!token) return null;
  return <>{children}</>;
}

