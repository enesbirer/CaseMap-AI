"use client";

import { useMemo, useState } from "react";
import { addMonths, endOfMonth, format, isSameDay, startOfMonth, startOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarClock, Plus, TriangleAlert } from "lucide-react";
import { nanoid } from "nanoid/non-secure";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNow } from "@/hooks/use-now";
import { useWorkspaceStore, type HearingItem } from "@/store/workspace-store";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalDateTimeInput(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function HearingsPage() {
  const hearings = useWorkspaceStore((s) => s.hearings);
  const addHearing = useWorkspaceStore((s) => s.addHearing);
  const updateHearing = useWorkspaceStore((s) => s.updateHearing);
  const removeHearing = useWorkspaceStore((s) => s.removeHearing);
  const now = useNow({ intervalMs: 30_000 });

  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfMonth(cursor);
    const out: Date[] = [];
    let d = start;
    for (let i = 0; i < 42; i++) {
      out.push(d);
      d = addDays(d, 1);
      if (d > end && out.length >= 35 && d.getDay() === 1) break;
    }
    return out;
  }, [cursor]);

  const byDay = useMemo(() => {
    const m = new Map<string, HearingItem[]>();
    for (const h of hearings) {
      const key = format(new Date(h.date_iso), "yyyy-MM-dd");
      m.set(key, [...(m.get(key) ?? []), h]);
    }
    for (const [k, v] of m) {
      m.set(k, v.slice().sort((a, b) => new Date(a.date_iso).getTime() - new Date(b.date_iso).getTime()));
    }
    return m;
  }, [hearings]);

  const urgent = useMemo(() => {
    return hearings
      .filter((h) => h.status === "scheduled")
      .map((h) => ({ h, diff: new Date(h.date_iso).getTime() - now }))
      .filter((x) => x.diff <= 1000 * 60 * 60 * 24 * 3 && x.diff >= -1000 * 60 * 60 * 2)
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 4)
      .map((x) => x.h);
  }, [hearings, now]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">Takip</div>
        <div className="text-2xl font-semibold tracking-tight">Duruşma & Süreç Takibi</div>
        <div className="text-sm text-muted-foreground">Takvim, geri sayım ve öncelik göstergeleri.</div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_340px]">
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Takvim</CardTitle>
              <CardDescription>{format(cursor, "LLLL yyyy", { locale: tr })}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setCursor((d) => addMonths(d, -1))}>
                Önceki
              </Button>
              <Button variant="outline" onClick={() => setCursor(startOfMonth(new Date()))}>
                Bugün
              </Button>
              <Button variant="outline" onClick={() => setCursor((d) => addMonths(d, 1))}>
                Sonraki
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground">
              {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (
                <div key={d} className="px-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2">
              {days.map((d) => {
                const inMonth = d.getMonth() === cursor.getMonth();
                const isToday = isSameDay(d, new Date());
                const key = format(d, "yyyy-MM-dd");
                const list = byDay.get(key) ?? [];
                return (
                  <div
                    key={key}
                    className={cn(
                      "min-h-[88px] rounded-xl border border-white/10 bg-white/5 p-2",
                      inMonth ? "" : "opacity-40",
                      isToday ? "border-primary/35 bg-primary/10" : "",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className={cn("text-xs font-medium", isToday ? "text-foreground" : "text-muted-foreground")}>
                        {d.getDate()}
                      </div>
                      {list.length ? <Badge variant="primary">{list.length}</Badge> : null}
                    </div>
                    <div className="mt-2 space-y-1">
                      {list.slice(0, 2).map((h) => (
                        <div key={h.id} className="truncate rounded-lg bg-black/20 px-2 py-1 text-[11px]">
                          {h.title}
                        </div>
                      ))}
                      {list.length > 2 ? <div className="text-[11px] text-muted-foreground">+{list.length - 2}</div> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="p-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-success" /> Yaklaşanlar
                </CardTitle>
                <CardDescription>3 gün içinde olan kritikler</CardDescription>
              </div>
              <NewHearingDialog
                onCreate={(h) => addHearing(h)}
                trigger={
                  <Button size="icon" aria-label="Yeni duruşma">
                    <Plus className="h-4 w-4" />
                  </Button>
                }
              />
            </CardHeader>
            <CardContent className="pt-0">
              {urgent.length ? (
                <div className="space-y-2">
                  {urgent.map((h) => (
                    <div key={h.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-semibold">{h.title}</div>
                        <Badge variant="warning">yakın</Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{h.court}</div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {format(new Date(h.date_iso), "dd LLL yyyy • HH:mm", { locale: tr })}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => updateHearing(h.id, { status: "done" })}>
                          Tamamlandı
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => updateHearing(h.id, { status: "missed" })}>
                          Kaçırıldı
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => removeHearing(h.id)}>
                          Sil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-muted-foreground">
                  Yaklaşan kritik duruşma yok.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TriangleAlert className="h-4 w-4 text-warning" /> Akıllı Uyarılar
              </CardTitle>
              <CardDescription>Yerel heuristik kontrol</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <HeuristicLine ok={urgent.length === 0} label="3 gün içinde kritik duruşma" />
                <HeuristicLine ok={!hearings.some((h) => h.status === "missed")} label="Kaçırılmış duruşma" />
                <HeuristicLine ok={hearings.length > 0} label="Takvim veri seti" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function NewHearingDialog({ trigger, onCreate }: { trigger: React.ReactNode; onCreate: (h: HearingItem) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Duruşma");
  const [court, setCourt] = useState("İstanbul Adliyesi");
  const [date, setDate] = useState(() => toLocalDateTimeInput(new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Duruşma</DialogTitle>
          <DialogDescription>Takvime yeni bir kayıt ekle.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid gap-4">
          <div className="space-y-2">
            <Label>Başlık</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Mahkeme / Yer</Label>
            <Input value={court} onChange={(e) => setCourt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tarih</Label>
            <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <Button
            onClick={() => {
              const iso = new Date(date).toISOString();
              onCreate({ id: nanoid(), title: title.trim() || "Duruşma", court: court.trim() || "Mahkeme", date_iso: iso, status: "scheduled" });
              setOpen(false);
            }}
          >
            Kaydet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HeuristicLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <Badge variant={ok ? "success" : "warning"}>{ok ? "ok" : "dikkat"}</Badge>
    </div>
  );
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
