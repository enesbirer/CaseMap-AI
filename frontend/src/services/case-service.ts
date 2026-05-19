"use client";

import { api } from "@/services/api-client";
import type { CaseAnalyzeRequest, CaseAnalyzeResponse } from "@/types/case";

export async function analyzeCase(payload: CaseAnalyzeRequest): Promise<CaseAnalyzeResponse> {
  const r = await api.post<CaseAnalyzeResponse>("/cases/analyze", {
    text: payload.text,
    provider: payload.provider,
    model: payload.model,
    retrieval: payload.retrieval ?? true,
  });
  return r.data;
}

export async function uploadFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  const r = await api.post("/files/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return r.data as { file_id: string; filename: string; content_type: string; size_bytes: number; created_at: string };
}

export async function analyzeFile(
  file: File,
  opts: { provider?: "ollama" | "openai"; model?: string; retrieval?: boolean } = {},
): Promise<CaseAnalyzeResponse> {
  const form = new FormData();
  form.append("file", file);
  const r = await api.post<CaseAnalyzeResponse>("/cases/analyze-file", form, {
    params: {
      provider: opts.provider,
      model: opts.model,
      retrieval: opts.retrieval ?? true,
    },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return r.data;
}

export async function analyzeAudio(
  audio: File,
  opts: { provider?: "ollama" | "openai"; model?: string; retrieval?: boolean } = {},
): Promise<CaseAnalyzeResponse> {
  const form = new FormData();
  form.append("audio", audio);
  const r = await api.post<CaseAnalyzeResponse>("/cases/analyze-audio", form, {
    params: {
      provider: opts.provider,
      model: opts.model,
      retrieval: opts.retrieval ?? true,
    },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return r.data;
}

