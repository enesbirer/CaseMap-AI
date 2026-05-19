"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, FileText, Shield, Sparkles, Timer, Workflow } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh">
      <div className="pointer-events-none absolute inset-0 grid-dots opacity-[0.35]" />

      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#urun" className="hover:text-foreground">
              Ürün
            </a>
            <a href="#nasil" className="hover:text-foreground">
              Nasıl Çalışır
            </a>
            <a href="#ozellik" className="hover:text-foreground">
              Özellikler
            </a>
            <a href="#yorum" className="hover:text-foreground">
              Yorumlar
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link href="/auth/login">Giriş</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">
                Başla <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-10 md:pt-24">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Yapılandırılmış dava analizi • Chatbot değil
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-6xl"
            >
              Hukuki karmaşayı{" "}
              <span className="bg-gradient-to-r from-primary via-white to-success bg-clip-text text-transparent">
                net eyleme
              </span>{" "}
              dönüştür.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground md:text-lg">
              CaseMap AI; metin, belge veya ses girdisini analiz eder, hukuki kategoriyi belirler, aktör/iddia/olay çizelgesini çıkarır ve
              uygulanabilir süreç adımları üretir.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/auth/register">
                  Ücretsiz Başla <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <a href="#urun">Ürünü İncele</a>
              </Button>
              <div className="text-xs text-muted-foreground">
                Varsayılan: Dark mode • Ollama (ücretsiz) veya OpenAI (opsiyonel)
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-12 grid gap-4 md:grid-cols-3" id="urun">
            <GlassFeature
              icon={Brain}
              title="Vaka Anlama Motoru"
              desc="Hikâyeyi yapılandırılmış vaka verisine çevirir: kategori, aktörler, iddia, risk ve öneriler."
            />
            <GlassFeature
              icon={Workflow}
              title="Legal Roadmap"
              desc="Süreç adımlarını ve kritik dönüm noktalarını timeline ile görselleştirir."
            />
            <GlassFeature
              icon={FileText}
              title="Belge + Dosya Desteği"
              desc="PDF/DOCX/TXT yükle; metin çıkarımı, indeksleme ve analiz."
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:py-16" id="ozellik">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Örnek Çıktı</div>
                  <div className="mt-2 text-lg font-semibold">“Ev sahibim depozitomu geri vermiyor.”</div>
                </div>
                <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-foreground">
                  Kira Hukuku
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                <MiniRow label="Aktörler" value="Kiracı • Ev Sahibi" />
                <MiniRow label="İddia" value="Depozito İadesi" />
                <MiniRow
                  label="Önerilen Süreç"
                  value="Yazılı talep • Arabuluculuk • Dava"
                />
                <MiniRow label="Risk" value="Orta" tone="warning" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <Shield className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Kurumsal Güvenlik</div>
                  <div className="text-sm text-muted-foreground">JWT, rate limit, dosya doğrulama, hata standardı</div>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <InfoPill icon={Timer} title="Hızlı" desc="Anında analiz ve rapor" />
                <InfoPill icon={Brain} title="Akıllı" desc="Hukuki kategori + risk" />
                <InfoPill icon={Workflow} title="Yapısal" desc="Timeline + süreç adımları" />
                <InfoPill icon={FileText} title="Belge" desc="Dosyadan analiz" />
              </div>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:py-16" id="nasil">
          <div className="flex flex-col gap-3">
            <div className="text-sm text-muted-foreground">Nasıl Çalışır</div>
            <div className="text-2xl font-semibold tracking-tight md:text-3xl">3 adımda net hukuki aksiyon</div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StepCard index="01" title="Anlat" desc="Metin yaz, dosya yükle veya ses kaydet." />
            <StepCard index="02" title="Analiz" desc="Kategori, aktör, iddia, timeline, risk üret." />
            <StepCard index="03" title="Uygula" desc="Roadmap ile süreç adımlarını takip et." />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:py-16" id="yorum">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-sm text-muted-foreground">Yorumlar</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Modern LegalTech hissi</div>
            </div>
            <Button variant="outline" asChild className="hidden md:inline-flex">
              <Link href="/auth/register">Demo Başlat</Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <QuoteCard
              name="Av. A."
              role="Kıdemli Avukat"
              quote="Analiz çıktısının yapılandırılmış olması vaka hazırlığını ciddi hızlandırıyor."
            />
            <QuoteCard
              name="Hukuk Stajyeri"
              role="Araştırma"
              quote="Timeline ve risk göstergeleri hangi adımı önce atacağımı netleştiriyor."
            />
            <QuoteCard
              name="Kurumsal Müşteri"
              role="Legal Ops"
              quote="Belge yönetimi + roadmap ile süreç takibi tek yerde toplandı."
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 pt-6">
          <div className="relative overflow-hidden rounded-[calc(var(--radius)+8px)] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-success/15 blur-3xl" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-2xl font-semibold tracking-tight">CaseMap AI ile ilk analizi başlat</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Ücretsiz Ollama ile çalıştır, istersen OpenAI modeline geç.
                </div>
              </div>
              <div className="flex gap-3">
                <Button asChild size="lg">
                  <Link href="/auth/register">
                    Hesap Oluştur <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/login">Giriş</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-background/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <Logo />
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CaseMap AI • Hukuki danışmanlık değildir.
          </div>
        </div>
      </footer>
    </div>
  );
}

function GlassFeature({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
        </div>
      </div>
    </Card>
  );
}

function MiniRow({ label, value, tone }: { label: string; value: string; tone?: "warning" | "success" | "danger" }) {
  const toneClass =
    tone === "warning"
      ? "text-warning"
      : tone === "success"
        ? "text-success"
        : tone === "danger"
          ? "text-danger"
          : "text-foreground";
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("text-xs font-medium", toneClass)}>{value}</div>
    </div>
  );
}

function InfoPill({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}

function StepCard({ index, title, desc }: { index: string; title: string; desc: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="text-2xl font-semibold tracking-tight">{title}</div>
        <div className="text-sm text-muted-foreground">{index}</div>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{desc}</div>
    </Card>
  );
}

function QuoteCard({ name, role, quote }: { name: string; role: string; quote: string }) {
  return (
    <Card className="p-6">
      <div className="text-sm text-muted-foreground">“{quote}”</div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{role}</div>
      </div>
    </Card>
  );
}

