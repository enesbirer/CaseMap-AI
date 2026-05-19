"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, CalendarClock, FileStack, Gauge, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useNow } from "@/hooks/use-now";
import { useWorkspaceStore } from "@/store/workspace-store";

export default function DashboardPage() {
  const cases = useWorkspaceStore((s) => s.cases);
  const hearings = useWorkspaceStore((s) => s.hearings);
  const documents = useWorkspaceStore((s) => s.documents);
  const now = useNow({ intervalMs: 15_000 });

  const nextHearing = useMemo(() => {
    const upcoming = hearings
      .filter((h) => h.status === "scheduled")
      .map((h) => ({ ...h, ts: new Date(h.date_iso).getTime() }))
      .filter((h) => Number.isFinite(h.ts))
      .sort((a, b) => a.ts - b.ts);
    return upcoming[0] ?? null;
  }, [hearings]);

  const countdown = useMemo(() => {
    if (!nextHearing) return null;
    const ms = new Date(nextHearing.date_iso).getTime() - now;
    const sign = ms < 0 ? -1 : 1;
    const abs = Math.abs(ms);
    const d = Math.floor(abs / (1000 * 60 * 60 * 24));
    const h = Math.floor((abs / (1000 * 60 * 60)) % 24);
    const m = Math.floor((abs / (1000 * 60)) % 60);
    return { sign, d, h, m };
  }, [nextHearing, now]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Genel Bakış</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">Vaka akışın ve yaklaşan kritikler</div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/app/case-analysis">
              Yeni Analiz <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/documents">Doküman Yükle</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Aktif Analizler
            </CardTitle>
            <CardDescription>Son 30 analiz kaydı cihazında saklanır.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-baseline justify-between">
              <div className="text-4xl font-semibold">{cases.length}</div>
              <Badge variant="primary">{cases.length ? "Hazır" : "Boş"}</Badge>
            </div>
            <Separator className="my-4" />
            <div className="text-xs text-muted-foreground">
              Analizler, vaka analizi sayfasından oluşturulur ve dashboard’da özetlenir.
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-success" /> Yaklaşan Duruşma
            </CardTitle>
            <CardDescription>Takvim ve hatırlatmalar (yerel).</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {nextHearing ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">{nextHearing.title}</div>
                  <Badge variant="success">planlı</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{nextHearing.court}</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                  <div className="text-xs text-muted-foreground">Geri sayım</div>
                  <div className="mt-1 font-mono text-sm">
                    {countdown
                      ? `${countdown.sign < 0 ? "-" : ""}${countdown.d}g ${countdown.h}s ${countdown.m}d`
                      : "—"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-muted-foreground">
                Henüz duruşma eklenmedi.
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/app/hearings">Duruşma Yönet</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileStack className="h-4 w-4 text-warning" /> Dokümanlar
            </CardTitle>
            <CardDescription>Yüklenen dokümanların listesi (yerel).</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-baseline justify-between">
              <div className="text-4xl font-semibold">{documents.length}</div>
              <Badge variant={documents.length ? "warning" : "default"}>{documents.length ? "Arşiv" : "Boş"}</Badge>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">Arama + özet + entity çıkarımı</div>
              <Gauge className={cn("h-4 w-4", documents.length ? "text-warning" : "text-muted-foreground")} />
            </div>
            <div className="mt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/app/documents">Doküman Yönet</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-0">
        <CardHeader>
          <CardTitle>Son Analizler</CardTitle>
          <CardDescription>En güncel vaka çıktıları.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {cases.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {cases.slice(0, 6).map((c) => (
                <div key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold">{c.analysis.claim}</div>
                    <Badge variant="primary">{c.analysis.legal_category}</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground line-clamp-2">{c.input_text}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant={c.analysis.risk_level === "high" ? "danger" : c.analysis.risk_level === "medium" ? "warning" : "success"}>
                      risk: {c.analysis.risk_level}
                    </Badge>
                    <Badge>model: {c.analysis.llm_model}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
              Henüz analiz yok. Vaka Analizi sayfasından ilk analizi başlat.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
