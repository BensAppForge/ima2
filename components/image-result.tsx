"use client";

import * as React from "react";
import { Copy, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { resultToDataUrl } from "@/lib/openai";
import { cn } from "@/lib/utils";
import type { ImageResult as ImageResultT } from "@/lib/types";

export function ImageResult({
  result,
  prompt,
  onRegen,
  format = "png",
  className,
}: {
  result: ImageResultT;
  prompt?: string;
  onRegen?: () => void;
  format?: string;
  className?: string;
}) {
  const src = resultToDataUrl(result, format);
  const { toast } = useToast();
  const filename = `ima2-image.${format}`;

  if (!src) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
        No image data
      </div>
    );
  }

  return (
    <div className={cn("group relative overflow-hidden rounded-md border border-border bg-card", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={prompt ?? "Generated image"}
        className="block h-auto w-full"
      />
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button asChild variant="secondary" size="icon" title="Download">
          <a href={src} download={filename}>
            <Download className="h-4 w-4" />
          </a>
        </Button>
        {prompt && (
          <Button
            variant="secondary"
            size="icon"
            title="Copy prompt"
            onClick={async () => {
              await navigator.clipboard.writeText(prompt);
              toast({ title: "Prompt copied" });
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
        {onRegen && (
          <Button variant="secondary" size="icon" title="Regenerate" onClick={onRegen}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>
      {result.revised_prompt && (
        <div className="border-t border-border bg-muted/50 p-3 text-xs text-muted-foreground">
          <span className="font-medium">Revised prompt:</span> {result.revised_prompt}
        </div>
      )}
    </div>
  );
}
