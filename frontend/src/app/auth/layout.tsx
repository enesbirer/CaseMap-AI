import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      <div className="pointer-events-none absolute inset-0 grid-dots opacity-[0.28]" />
      <div className="mx-auto flex min-h-dvh max-w-6xl items-stretch gap-10 px-4 py-10">
        <div className="hidden w-[42%] flex-col justify-between rounded-[calc(var(--radius)+8px)] border border-white/10 bg-white/5 p-8 md:flex">
          <Logo />
          <div className="space-y-3">
            <div className="text-3xl font-semibold tracking-tight">
              Legal sürecini{" "}
              <span className="bg-gradient-to-r from-primary via-white to-success bg-clip-text text-transparent">
                akıllı
              </span>{" "}
              hale getir.
            </div>
            <div className="text-sm text-muted-foreground">
              CaseMap AI; vaka analizi, önerilen süreç adımları, risk seviyesi ve timeline üretir.
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Hukuki danışmanlık değildir.</div>
        </div>
        <div className="flex flex-1 items-center justify-center">{children}</div>
      </div>
    </div>
  );
}

