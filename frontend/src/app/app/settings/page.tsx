"use client";

import { useMemo } from "react";
import { Globe, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/auth-store";
import { useSettingsStore } from "@/store/settings-store";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { language, notifications, ai, setLanguage, setNotification, setAi } = useSettingsStore();

  const roleLabel = useMemo(() => (user?.role === "admin" ? "Admin" : "User"), [user?.role]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">Ayarlar</div>
        <div className="text-2xl font-semibold tracking-tight">Profil & Tercihler</div>
        <div className="text-sm text-muted-foreground">Uygulama davranışını kişiselleştir.</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-0">
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>Kimlik bilgileri</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="text-xs text-muted-foreground">E-posta</div>
                <div className="mt-1 text-sm font-medium">{user?.email ?? "—"}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">role: {roleLabel}</Badge>
                <Badge variant={user?.is_active ? "success" : "danger"}>{user?.is_active ? "active" : "inactive"}</Badge>
              </div>
              <Separator className="my-2" />
              <div className="text-xs text-muted-foreground">
                Profil güncelleme endpoint’i bu sürümde backend’de yok. İstersen ekleriz.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Dil
            </CardTitle>
            <CardDescription>Uygulama dili</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="text-sm">Türkçe</div>
                <Switch checked={language === "tr"} onCheckedChange={() => setLanguage("tr")} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="text-sm">English</div>
                <Switch checked={language === "en"} onCheckedChange={() => setLanguage("en")} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-success" /> AI Tercihleri
            </CardTitle>
            <CardDescription>Varsayılan sağlayıcı ve model</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3">
              <div className="space-y-2">
                <Label>Varsayılan Provider</Label>
                <select
                  value={ai.default_provider}
                  onChange={(e) => setAi({ default_provider: e.target.value as "ollama" | "openai" })}
                  className="h-11 w-full rounded-[calc(var(--radius)-6px)] border border-border bg-white/5 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="ollama">ollama</option>
                  <option value="openai">openai</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Varsayılan Model</Label>
                <Input value={ai.default_model} onChange={(e) => setAi({ default_model: e.target.value })} />
              </div>
              <Button
                variant="outline"
                onClick={() => toast.success("Kaydedildi")}
              >
                Kaydet
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-warning" /> Bildirimler
            </CardTitle>
            <CardDescription>Hatırlatmalar ve özetler</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div>
                  <div className="text-sm font-medium">Duruşma hatırlatmaları</div>
                  <div className="text-xs text-muted-foreground">Yaklaşan tarihler için uyarı</div>
                </div>
                <Switch
                  checked={notifications.hearing_reminders}
                  onCheckedChange={(v) => setNotification("hearing_reminders", v)}
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div>
                  <div className="text-sm font-medium">Haftalık özet</div>
                  <div className="text-xs text-muted-foreground">Analiz ve takvim özeti</div>
                </div>
                <Switch
                  checked={notifications.weekly_digest}
                  onCheckedChange={(v) => setNotification("weekly_digest", v)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

