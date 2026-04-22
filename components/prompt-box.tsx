"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";

export function PromptBox({
  value,
  onChange,
  onSubmit,
  placeholder = "Describe the image you want to generate…",
  minHeight = 120,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            onSubmit?.();
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        style={{ minHeight }}
        className="font-mono text-sm"
      />
      <div className="pointer-events-none absolute bottom-1.5 right-2 text-[10px] text-muted-foreground">
        {value.length} chars · ⌘↵ to submit
      </div>
    </div>
  );
}
