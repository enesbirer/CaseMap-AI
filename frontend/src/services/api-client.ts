"use client";

import axios from "axios";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth-store";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      useAuthStore.getState().logout();
      toast.error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
    }
    const message =
      error?.response?.data?.error?.message ||
      error?.response?.data?.detail ||
      error?.message ||
      "İstek başarısız";
    if (status && status >= 400 && status !== 401) toast.error(String(message));
    return Promise.reject(error);
  },
);

