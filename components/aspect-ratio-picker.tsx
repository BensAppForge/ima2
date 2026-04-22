"use client";

import { ASPECT_RATIOS, type AspectRatio } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AspectRatioPicker({
  value,
  onChange,
}: {
  value: AspectRatio;
  onChange: (v: AspectRatio) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {ASPECT_RATIOS.map(({ ratio, label, hint }) => {
        const active = value === ratio;
        const [a, b] = ratio.split(":").map(Number);
        const portrait = b > a;
        const w = portrait ? 20 : 32;
        const h = portrait ? 32 : 20;
        const boxW = Math.round((w * a) / Math.max(a, b));
        const boxH = Math.round((h * b) / Math.max(a, b));
        return (
          <button
            key={ratio}
            type="button"
            onClick={() => onChange(ratio)}
            className={cn(
              "group flex flex-col items-center justify-center gap-1.5 rounded-md border p-3 text-xs transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-foreground/30",
            )}
          >
            <div className="flex h-8 items-center justify-center">
              <div
                className={cn(
                  "border",
                  active
                    ? "border-primary-foreground/60 bg-primary-foreground/20"
                    : "border-foreground/40 bg-muted",
                )}
                style={{ width: boxW, height: boxH }}
              />
            </div>
            <span className="font-mono">{label}</span>
            <span
              className={cn(
                "text-[10px]",
                active
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground",
              )}
            >
              {hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
