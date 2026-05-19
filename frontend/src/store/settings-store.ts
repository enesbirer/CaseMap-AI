"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "tr" | "en";

type SettingsState = {
  language: Language;
  notifications: {
    hearing_reminders: boolean;
    weekly_digest: boolean;
  };
  ai: {
    default_provider: "ollama" | "openai";
    default_model: string;
  };
  setLanguage: (lang: Language) => void;
  setNotification: (key: keyof SettingsState["notifications"], value: boolean) => void;
  setAi: (patch: Partial<SettingsState["ai"]>) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "tr",
      notifications: {
        hearing_reminders: true,
        weekly_digest: false,
      },
      ai: {
        default_provider: "ollama",
        default_model: "llama3.1:8b",
      },
      setLanguage: (language) => set({ language }),
      setNotification: (key, value) =>
        set((s) => ({ notifications: { ...s.notifications, [key]: value } })),
      setAi: (patch) => set((s) => ({ ai: { ...s.ai, ...patch } })),
    }),
    { name: "casemap-settings" },
  ),
);

