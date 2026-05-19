"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Map, MoveRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useWorkspaceStore } from "@/store/workspace-store";
import { cn } from "@/lib/utils";

export default function RoadmapPage() {
  const cases = useWorkspaceStore((s) => s.cases);
  const [index, setIndex] = useState(0);

  const current = useMemo(() => cases[index]?.analysis ?? null, [cases, index]);
  const currentInput = useMemo(() => cases[index]?.input_text ?? "", [cases, index]);

  const steps = current?.recommended_process ?? [];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">Görselleştirme</div>
        <div className="text-2xl font-semibold tracking-tight">AI Legal Roadmap</div>
        <div className="text-sm text-muted-foreground">Analiz çıktısını süreç akışına çevir.</div>
      </div>

      <Card className="p-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-4 w-4 text-primary" /> Kaynak Analiz
            </CardTitle>
            <CardDescription>Roadmap, son analiz kayıtlarından beslenir.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={index <= 0} onClick={() => setIndex((v) => Math.max(0, v - 1))}>
              Önceki
            </Button>
            <Button
              variant="outline"
              disabled={index >= cases.length - 1}
              onClick={() => setIndex((v) => Math.min(cases.length - 1, v + 1))}
            >
              Sonraki
            </Button>
            <Button asChild>
              <a href="/app/case-analysis" className="inline-flex items-center gap-2">
                Yeni Analiz <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {current ? (
            <div className="grid gap-4 md:grid-cols-[1fr_360px]">
              <div className="rounded-[calc(var(--radius)+8px)] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="primary">{current.legal_category}</Badge>
                  <Badge variant={current.risk_level === "high" ? "danger" : current.risk_level === "medium" ? "warning" : "success"}>
                    risk: {current.risk_level}
                  </Badge>
                  <Badge>model: {current.llm_model}</Badge>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">Kullanıcı anlatımı</div>
                <div className="mt-1 text-sm font-medium">{currentInput}</div>

                <Separator className="my-5" />

                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Süreç Akışı</div>
                  <div className="text-xs text-muted-foreground">{steps.length} adım</div>
                </div>

                <div className="mt-4 grid gap-3">
                  {steps.map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                      className="relative"
                    >
                      <div className="rounded-[calc(var(--radius)+2px)] border border-white/10 bg-black/20 p-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary/15 ring-1 ring-primary/25">
                            <span className="font-mono text-xs text-primary">{String(idx + 1).padStart(2, "0")}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{s}</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              Önerilen aksiyon ve gerekli belgeler bu adım etrafında toplanır.
                            </div>
                          </div>
                          <MoveRight className="ml-auto h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      {idx !== steps.length - 1 ? (
                        <div className="mx-auto h-4 w-px bg-gradient-to-b from-white/20 to-transparent" />
                      ) : null}
                    </motion.div>
                  ))}
                </div>
              </div>

              <Card className="p-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-success" /> Süreç Tahmini
                  </CardTitle>
                  <CardDescription>Heuristik zaman aralığı</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid gap-3">
                    <Metric label="Gerekli Belge Sayısı (tahmini)" value={`${Math.max(2, Math.min(8, steps.length + 1))}`} />
                    <Metric label="Tahmini Süreç Süresi" value={steps.length >= 3 ? "2–8 hafta" : "1–4 hafta"} />
                    <Metric
                      label="Öncelik"
                      value={current.risk_level === "high" ? "Acil" : current.risk_level === "medium" ? "Önemli" : "Normal"}
                      tone={current.risk_level}
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="text-xs text-muted-foreground">
                    Bu panel, roadmap’i daha “operasyonel” hale getirmek için görsel tahmin katmanı sağlar.
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="rounded-[calc(var(--radius)+8px)] border border-white/10 bg-white/5 p-6 text-sm text-muted-foreground">
              Roadmap oluşturmak için önce bir vaka analizi yap.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "low" | "medium" | "high" }) {
  const toneClass =
    tone === "high" ? "text-danger" : tone === "medium" ? "text-warning" : tone === "low" ? "text-success" : "text-foreground";
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-lg font-semibold tracking-tight", toneClass)}>{value}</div>
    </div>
  );
}

