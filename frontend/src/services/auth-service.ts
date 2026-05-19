"use client";

import { api } from "@/services/api-client";
import type { AuthUser } from "@/store/auth-store";

export type TokenResponse = { access_token: string; token_type: "bearer" };

export async function register(email: string, password: string): Promise<TokenResponse> {
  const r = await api.post<TokenResponse>("/auth/register", { email, password });
  return r.data;
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const r = await api.post<TokenResponse>("/auth/login", { email, password });
  return r.data;
}

export async function me(): Promise<AuthUser> {
  const r = await api.get<AuthUser>("/auth/me");
  return r.data;
}

