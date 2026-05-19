"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, Square, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RecorderState = "idle" | "recording" | "ready";

export function VoiceRecorder({ onAudio }: { onAudio: (file: File) => void }) {
  const [state, setState] = useState<RecorderState>("idle");
  const [ms, setMs] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const recorder = useRef<MediaRecorder | null>(null);
  const timer = useRef<number | null>(null);

  const timeLabel = useMemo(() => {
    const s = Math.floor(ms / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }, [ms]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearInterval(timer.current);
      if (url) URL.revokeObjectURL(url);
      recorder.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, [url]);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const r = new MediaRecorder(stream);
    chunks.current = [];
    r.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };
    r.onstop = () => {
      const blob = new Blob(chunks.current, { type: r.mimeType || "audio/webm" });
      const objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
      const file = new File([blob], `recording_${Date.now()}.webm`, { type: blob.type });
      onAudio(file);
      setState("ready");
    };
    recorder.current = r;
    r.start(250);
    setState("recording");
    setMs(0);
    timer.current = window.setInterval(() => setMs((v) => v + 250), 250);
  }

  function stop() {
    recorder.current?.stop();
    recorder.current?.stream.getTracks().forEach((t) => t.stop());
    if (timer.current) window.clearInterval(timer.current);
  }

  function reset() {
    if (url) URL.revokeObjectURL(url);
    setUrl(null);
    setState("idle");
    setMs(0);
  }

  return (
    <div className="rounded-[calc(var(--radius)+8px)] border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10")}>
            <Mic className={cn("h-5 w-5", state === "recording" ? "text-danger" : "text-primary")} />
          </div>
          <div>
            <div className="text-sm font-medium">Ses kaydı</div>
            <div className="text-xs text-muted-foreground">{state === "recording" ? "Kayıt sürüyor" : "WebM"}</div>
          </div>
        </div>
        <div className="font-mono text-sm text-muted-foreground">{timeLabel}</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {state !== "recording" ? (
          <Button onClick={start} className="gap-2">
            <Mic className="h-4 w-4" /> Kaydı Başlat
          </Button>
        ) : (
          <Button onClick={stop} variant="danger" className="gap-2">
            <Square className="h-4 w-4" /> Durdur
          </Button>
        )}
        <Button onClick={reset} variant="outline" className="gap-2" disabled={state === "recording" && !url}>
          <Trash2 className="h-4 w-4" /> Temizle
        </Button>
      </div>

      {url ? (
        <div className="mt-4">
          <audio controls src={url} className="w-full" />
        </div>
      ) : null}
    </div>
  );
}

