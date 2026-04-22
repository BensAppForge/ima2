"use client";

import * as React from "react";
import { Eraser, Paintbrush, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export type MaskCanvasHandle = {
  exportMask: () => Promise<Blob | null>;
  hasStrokes: () => boolean;
  clear: () => void;
};

type Tool = "brush" | "eraser";

export const MaskCanvas = React.forwardRef<
  MaskCanvasHandle,
  {
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
  }
>(function MaskCanvas({ imageUrl, imageWidth, imageHeight }, ref) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const drawing = React.useRef(false);
  const lastPt = React.useRef<{ x: number; y: number } | null>(null);
  const strokesRef = React.useRef(false);

  const [tool, setTool] = React.useState<Tool>("brush");
  const [brush, setBrush] = React.useState(48);

  // Cap display size while keeping canvas native resolution
  const MAX_DISPLAY = 720;
  const scale = Math.min(1, MAX_DISPLAY / Math.max(imageWidth, imageHeight));
  const displayW = Math.round(imageWidth * scale);
  const displayH = Math.round(imageHeight * scale);

  React.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = imageWidth;
    c.height = imageHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    strokesRef.current = false;
  }, [imageWidth, imageHeight, imageUrl]);

  const pointerToCanvas = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * c.width;
    const y = ((e.clientY - rect.top) / rect.height) * c.height;
    return { x, y };
  };

  const paintSegment = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = brush * (c.width / displayW);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    strokesRef.current = true;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    drawing.current = true;
    const pt = pointerToCanvas(e);
    lastPt.current = pt;
    paintSegment(pt, pt);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const pt = pointerToCanvas(e);
    if (lastPt.current) paintSegment(lastPt.current, pt);
    lastPt.current = pt;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = false;
    lastPt.current = null;
    try {
      (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const clear = React.useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx?.clearRect(0, 0, c.width, c.height);
    strokesRef.current = false;
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      hasStrokes: () => strokesRef.current,
      clear,
      exportMask: async () => {
        const src = canvasRef.current;
        if (!src) return null;
        // Build binary mask: white where painted, transparent elsewhere.
        const out = document.createElement("canvas");
        out.width = src.width;
        out.height = src.height;
        const octx = out.getContext("2d");
        if (!octx) return null;
        octx.drawImage(src, 0, 0);
        const img = octx.getImageData(0, 0, out.width, out.height);
        for (let i = 0; i < img.data.length; i += 4) {
          if (img.data[i + 3] > 16) {
            img.data[i] = 255;
            img.data[i + 1] = 255;
            img.data[i + 2] = 255;
            img.data[i + 3] = 255;
          } else {
            img.data[i + 3] = 0;
          }
        }
        octx.putImageData(img, 0, 0);
        return await new Promise<Blob | null>((resolve) =>
          out.toBlob((b) => resolve(b), "image/png"),
        );
      },
    }),
    [clear],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-md border border-border bg-card p-0.5">
          <button
            type="button"
            onClick={() => setTool("brush")}
            className={`inline-flex h-8 items-center gap-1.5 rounded px-3 text-xs font-medium ${tool === "brush" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Paintbrush className="h-3.5 w-3.5" />
            Brush
          </button>
          <button
            type="button"
            onClick={() => setTool("eraser")}
            className={`inline-flex h-8 items-center gap-1.5 rounded px-3 text-xs font-medium ${tool === "eraser" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Eraser className="h-3.5 w-3.5" />
            Eraser
          </button>
        </div>
        <div className="flex min-w-48 flex-1 items-center gap-2">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">Size</Label>
          <Slider
            min={4}
            max={160}
            step={1}
            value={[brush]}
            onValueChange={(v) => setBrush(v[0])}
          />
          <span className="w-8 text-right text-xs text-muted-foreground tabular-nums">
            {brush}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={clear}>
          <Trash2 className="h-4 w-4" />
          Clear mask
        </Button>
      </div>
      <div
        className="relative mx-auto overflow-hidden rounded-md border border-border bg-muted"
        style={{ width: displayW, height: displayH }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Source"
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          draggable={false}
        />
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
          style={{ width: displayW, height: displayH }}
        />
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Paint over the region you want the model to change. White = edit area.
      </p>
    </div>
  );
});
