"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, BrainCircuit, FileText, Mic, Sparkles } from "lucide-react";
import { nanoid } from "nanoid/non-secure";

import { AiThinking } from "@/components/ai/ai-thinking";
import { Dropzone } from "@/components/files/dropzone";
import { VoiceRecorder } from "@/components/voice/voice-recorder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { analyzeAudio, analyzeCase, analyzeFile } from "@/services/case-service";
import type { CaseAnalyzeResponse, RiskLevel } from "@/types/case";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace-store";

type Mode = "text" | "file" | "audio";

export default function CaseAnalysisPage() {
  const addCase = useWorkspaceStore((s) => s.addCase);

  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("Ev sahibim depozitomu geri vermiyor.");
  const [file, setFile] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);

  const [provider, setProvider] = useState<"ollama" | "openai">("ollama");
  const [model, setModel] = useState("llama3.1:8b");
  const [retrieval, setRetrieval] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "text") {
        return analyzeCase({ text, provider, model, retrieval });
      }
      if (mode === "file") {
        if (!file) throw new Error("Dosya seçilmedi");
        return analyzeFile(file, { provider, model, retrieval });
      }
      if (!audio) throw new Error("Ses kaydı alınmadı");
      return analyzeAudio(audio, { provider, model, retrieval });
    },
    onSuccess: (data) => {
      addCase({
        id: nanoid(),
        input_text: mode === "text" ? text : mode === "file" ? file?.name ?? "" : "Ses kaydı",
        source: mode,
        analysis: data,
      });
    },
  });

  const result = mutation.data ?? null;

  const canSubmit = useMemo(() => {
    if (mutation.isPending) return false;
    if (mode === "text") return text.trim().length >= 3;
    if (mode === "file") return Boolean(file);
    return Boolean(audio);
  }, [mode, text, file, audio, mutation.isPending]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">Core</div>
        <div className="text-2xl font-semibold tracking-tight">Vaka Analizi</div>
        <div className="text-sm text-muted-foreground">
          Metin, dosya veya ses girdisini yapılandırılmış çıktıya dönüştür.
        </div>
      </div>

      <Card className="p-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-primary" /> Analiz Ayarları
          </CardTitle>
          <CardDescription>Ücretsiz Ollama veya OpenAI ile çalıştır.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Provider</Label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as "ollama" | "openai")}
                className="h-11 w-full rounded-[calc(var(--radius)-6px)] border border-border bg-white/5 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="ollama">ollama (ücretsiz)</option>
                <option value="openai">openai (opsiyonel)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="llama3.1:8b" />
            </div>
            <div className="space-y-2">
              <Label>Retrieval</Label>
              <div className="flex items-center justify-between rounded-[calc(var(--radius)-6px)] border border-white/10 bg-white/5 px-3 py-3">
                <div className="text-sm">FAISS bağlamı</div>
                <button
                  type="button"
                  onClick={() => setRetrieval((v) => !v)}
                  className={cn(
                    "h-6 w-10 rounded-full border border-white/10 bg-white/10 p-0.5 transition-colors",
                    retrieval ? "bg-primary/35 border-primary/25" : "",
                  )}
                  aria-label="retrieval"
                >
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full bg-white/60 transition-transform",
                      retrieval ? "translate-x-4 bg-white/90" : "translate-x-0",
                    )}
                  />
                </button>
              </div>
              <div className="text-xs text-muted-foreground">
                Açıkken, daha önce yüklenen doküman parçaları ile semantik bağlam eklenir.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-success" /> Girdi
          </CardTitle>
          <CardDescription>İstediğin yöntemi seç ve analizi başlat.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="text" className="gap-2">
                <FileText className="h-4 w-4" /> Metin
              </TabsTrigger>
              <TabsTrigger value="file" className="gap-2">
                <FileText className="h-4 w-4" /> Dosya
              </TabsTrigger>
              <TabsTrigger value="audio" className="gap-2">
                <Mic className="h-4 w-4" /> Ses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <div className="space-y-3">
                <Label>Vaka anlatımı</Label>
                <Textarea value={text} onChange={(e) => setText(e.target.value)} />
                <div className="text-xs text-muted-foreground">
                  Kişisel veri, TC kimlik, açık adres gibi bilgileri yazmaman önerilir.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="file">
              <div className="space-y-3">
                <Dropzone
                  onFile={(f) => setFile(f)}
                  helper={file ? `Seçildi: ${file.name}` : "PDF • DOCX • TXT"}
                />
                {file ? (
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge>dosya: {file.name}</Badge>
                    <Badge>boyut: {Math.round(file.size / 1024)} KB</Badge>
                  </div>
                ) : null}
              </div>
            </TabsContent>

            <TabsContent value="audio">
              <div className="space-y-3">
                <VoiceRecorder onAudio={(f) => setAudio(f)} />
                <div className="text-xs text-muted-foreground">
                  Ses analizi için backend tarafında opsiyonel whisper paketi gerekir.
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-xs text-muted-foreground">
              Çıktı her zaman JSON doğrulamalı ve yapılandırılmış gelir.
            </div>
            <Button size="lg" onClick={() => mutation.mutate()} disabled={!canSubmit}>
              Analizi Başlat
            </Button>
          </div>
        </CardContent>
      </Card>

      {mutation.isPending ? <AiThinking /> : null}

      {mutation.isError ? (
        <Card className="border border-danger/25 bg-danger/10">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-danger" />
              <div>
                <div className="text-sm font-semibold">Analiz başarısız</div>
                <div className="mt-1 text-sm text-muted-foreground">{String(mutation.error?.message ?? "Hata")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {result ? <ResultPanel result={result} /> : null}
    </div>
  );
}

function ResultPanel({ result }: { result: CaseAnalyzeResponse }) {
  const riskTone: Record<RiskLevel, "success" | "warning" | "danger"> = {
    low: "success",
    medium: "warning",
    high: "danger",
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="primary">{result.legal_category}</Badge>
        <Badge variant={riskTone[result.risk_level]}>risk: {result.risk_level}</Badge>
        <Badge>provider: {result.llm_provider}</Badge>
        <Badge>model: {result.llm_model}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-0">
          <CardHeader>
            <CardTitle>Özet</CardTitle>
            <CardDescription>Yapılandırılmış temel alanlar</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3">
              <KeyValue label="İddia" value={result.claim} />
              <KeyValue label="Aktörler" value={result.actors.join(" • ") || "—"} />
            </div>
            <Separator className="my-4" />
            <div className="text-sm font-medium">Önerilen Süreç</div>
            <div className="mt-2 grid gap-2">
              {result.recommended_process.map((step, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">{String(idx + 1).padStart(2, "0")}</span>
                  {step}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Olay çizelgesi</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {result.timeline.length ? (
              <div className="grid gap-2">
                {result.timeline.map((e, idx) => (
                  <div key={idx} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-xs text-muted-foreground">{e.date ?? "Tarih yok"}</div>
                    <div className="text-sm">{e.event}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-muted-foreground">
                Timeline bulunamadı.
              </div>
            )}
            <Separator className="my-4" />
            <div className="text-sm font-medium">Entity Çıktısı</div>
            <pre className="mt-2 max-h-60 overflow-auto rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-foreground/90">
              {JSON.stringify(result.extracted_entities ?? {}, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

