"use client";

import { motion } from "framer-motion";

export function AiThinking({ label = "Analiz ediliyor" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="relative h-7 w-7">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/25 blur-sm"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/70 via-white/20 to-success/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="mt-1 flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-white/40"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
      <div className="text-xs text-muted-foreground">LLM • JSON</div>
    </div>
  );
}

