"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FileText, Search, Sparkles, UploadCloud } from "lucide-react";
import { nanoid } from "nanoid/non-secure";
import { toast } from "sonner";

import { Dropzone } from "@/components/files/dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@/services/api-client";
import { analyzeFile } from "@/services/case-service";
import { useWorkspaceStore } from "@/store/workspace-store";
import { cn } from "@/lib/utils";

type UploadResult = { file_id: string; filename: string; content_type: string; size_bytes: number; created_at: string };

export default function DocumentsPage() {
  const docs = useWorkspaceStore((s) => s.documents);
  const addDocument = useWorkspaceStore((s) => s.addDocument);
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter((d) => d.filename.toLowerCase().includes(q));
  }, [docs, query]);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Dosya seçilmedi");
      setProgress(0);
      const form = new FormData();
      form.append("file", file);
      const r = await api.post<UploadResult>("/files/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (!e.total) return;
          setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      return r.data;
    },
    onSuccess: (r) => {
      addDocument({
        id: nanoid(),
        filename: r.filename,
        size_bytes: r.size_bytes,
        created_at: r.created_at,
      });
      toast.success("Doküman yüklendi");
      setFile(null);
      setProgress(0);
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (selected: File) => {
      return analyzeFile(selected, { provider: "ollama", model: "llama3.1:8b", retrieval: true });
    },
    onSuccess: (res) => {
      addDocument({
        id: nanoid(),
        filename: `Analiz • ${res.claim}`,
        size_bytes: 0,
        created_at: res.created_at,
        summary: `Kategori: ${res.legal_category}\nAktörler: ${res.actors.join(", ")}\nRisk: ${res.risk_level}\nSüreç: ${res.recommended_process.join(" > ")}`,
        extracted_entities: res.extracted_entities,
      });
      toast.success("Doküman analizi tamamlandı");
    },
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">Arşiv</div>
        <div className="text-2xl font-semibold tracking-tight">Doküman Yönetimi</div>
        <div className="text-sm text-muted-foreground">Yükle, ara ve analiz çıktılarıyla ilişkilendir.</div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_360px]">
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dokümanlar</CardTitle>
              <CardDescription>Yerel liste + backend upload</CardDescription>
            </div>
            <div className="relative w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Ara..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {filtered.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {filtered.map((d) => (
                  <div key={d.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{d.filename}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {d.size_bytes ? `${Math.round(d.size_bytes / 1024)} KB` : "—"} • {new Date(d.created_at).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant="primary">
                        <FileText className="h-3.5 w-3.5" />
                      </Badge>
                    </div>
                    {d.summary ? (
                      <pre className="mt-3 max-h-40 overflow-auto rounded-xl border border-white/10 bg-black/25 p-3 text-xs">
                        {d.summary}
                      </pre>
                    ) : (
                      <div className="mt-3 text-xs text-muted-foreground">Özet yok</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
                Doküman bulunamadı.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="p-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4 text-warning" /> Yükle
              </CardTitle>
              <CardDescription>PDF/DOCX/TXT</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Dropzone
                onFile={(f) => setFile(f)}
                helper={file ? `Seçildi: ${file.name}` : "PDF • DOCX • TXT"}
              />
              {file ? (
                <div className="mt-3 space-y-2">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge>dosya: {file.name}</Badge>
                    <Badge>boyut: {Math.round(file.size / 1024)} KB</Badge>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div className={cn("h-full bg-primary/60 transition-all")} style={{ width: `${progress}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground">%{progress}</div>
                </div>
              ) : null}

              <div className="mt-4 grid gap-2">
                <Button disabled={!file || uploadMutation.isPending} onClick={() => uploadMutation.mutate()}>
                  Yükle
                </Button>
                <Button
                  variant="outline"
                  disabled={!file || analyzeMutation.isPending}
                  onClick={() => file && analyzeMutation.mutate(file)}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" /> Yükle + Analiz Et
                </Button>
              </div>

              <Separator className="my-4" />
              <div className="text-xs text-muted-foreground">
                “Yükle + Analiz Et”, dosyayı backend’e gönderir ve AI ile analiz ederek özet/entitiy çıktısı üretir.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

