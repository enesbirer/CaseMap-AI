"use client";

import { useCallback, useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";

export function Dropzone({
  accept,
  onFile,
  helper,
}: {
  accept?: string;
  onFile: (file: File) => void;
  helper?: string;
}) {
  const [active, setActive] = useState(false);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  const onPick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFile(file);
      e.currentTarget.value = "";
    },
    [onFile],
  );

  const acceptLabel = useMemo(() => accept ?? ".pdf,.docx,.txt", [accept]);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={onDrop}
      className={cn(
        "relative grid place-items-center rounded-[calc(var(--radius)+8px)] border border-white/10 bg-white/5 p-8 text-center transition-colors",
        active ? "border-primary/40 bg-primary/10" : "hover:bg-white/6",
      )}
    >
      <input
        type="file"
        accept={acceptLabel}
        onChange={onPick}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <div className="space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
          <UploadCloud className={cn("h-6 w-6", active ? "text-primary" : "text-muted-foreground")} />
        </div>
        <div className="text-sm font-medium">Sürükle-bırak veya tıkla</div>
        <div className="text-xs text-muted-foreground">{helper ?? "PDF • DOCX • TXT"}</div>
      </div>
    </div>
  );
}

