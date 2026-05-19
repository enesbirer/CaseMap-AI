"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState } from "react";

import { AuthBootstrap } from "@/providers/auth-bootstrap";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap />
        {children}
        <Toaster richColors theme="dark" position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

