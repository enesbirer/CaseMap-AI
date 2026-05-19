"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CaseAnalyzeResponse } from "@/types/case";

export type CaseWorkspaceItem = {
  id: string;
  input_text: string;
  source: "text" | "file" | "audio";
  analysis: CaseAnalyzeResponse;
};

export type HearingItem = {
  id: string;
  title: string;
  court: string;
  date_iso: string;
  status: "scheduled" | "done" | "missed";
  notes?: string;
};

export type DocumentItem = {
  id: string;
  filename: string;
  size_bytes: number;
  created_at: string;
  summary?: string;
  extracted_entities?: Record<string, unknown>;
};

type WorkspaceState = {
  cases: CaseWorkspaceItem[];
  hearings: HearingItem[];
  documents: DocumentItem[];
  addCase: (item: CaseWorkspaceItem) => void;
  addHearing: (item: HearingItem) => void;
  updateHearing: (id: string, patch: Partial<HearingItem>) => void;
  removeHearing: (id: string) => void;
  addDocument: (item: DocumentItem) => void;
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      cases: [],
      hearings: [],
      documents: [],
      addCase: (item) =>
        set((s) => ({
          cases: [item, ...s.cases].slice(0, 30),
        })),
      addHearing: (item) =>
        set((s) => ({
          hearings: [item, ...s.hearings].slice(0, 50),
        })),
      updateHearing: (id, patch) =>
        set((s) => ({
          hearings: s.hearings.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),
      removeHearing: (id) =>
        set((s) => ({
          hearings: s.hearings.filter((h) => h.id !== id),
        })),
      addDocument: (item) =>
        set((s) => ({
          documents: [item, ...s.documents].slice(0, 50),
        })),
    }),
    {
      name: "casemap-workspace",
      partialize: (s) => ({ cases: s.cases, hearings: s.hearings, documents: s.documents }),
    },
  ),
);

