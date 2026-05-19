"use client";

import { useEffect } from "react";

import { me } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export function AuthBootstrap() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!token) return;
    if (user) return;
    me()
      .then((u) => setUser(u))
      .catch(() => logout());
  }, [token, user, setUser, logout]);

  return null;
}

