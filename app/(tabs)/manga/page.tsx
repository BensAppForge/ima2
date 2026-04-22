"use client";

import * as React from "react";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/page-header";
import { ImageResult } from "@/components/image-result";
import {
  MultiImageDropzone,
  type UploadedImage,
} from "@/components/multi-image-dropzone";
import { useApiKey } from "@/components/key-provider";
import { callEdit, ApiError } from "@/lib/openai";
import { downscaleToMax } from "@/lib/downscale";
import { MANGA_PRESETS } from "@/lib/prompts/manga";
import type { ImageResult as ImageResultT } from "@/lib/types";

export default function MangaPage() {
  const { key } = useApiKey();
  const { toast } = useToast();

  const [selected, setSelected] = React.useState(MANGA_PRESETS[0].id);
  const active = MANGA_PRESETS.find((p) => p.id === selected)!;
  const [characterRef, setCharacterRef] = React.useState<UploadedImage[]>([]);
  const [panels, setPanels] = React.useState<(ImageResultT | null)[]>(
    new Array(active.panels.length).fill(null),
  );
  const [loadingIndex, setLoadingIndex] = React.useState<number | null>(null);

  const selectPreset = (id: string) => {
    const preset = MANGA_PRESETS.find((p) => p.id === id)!;
    setSelected(id);
    setPanels(new Array(preset.panels.length).fill(null));
  };

  const generatePanel = async (index: number) => {
    if (!key || characterRef.length === 0) return;
    setLoadingIndex(index);
    try {
      const fd = new FormData();
      fd.append("prompt", active.panels[index]);
      for (const img of characterRef) {
        const down = await downscaleToMax(img.file, 1536);
        fd.append("image[]", down.blob, "ref.png");
      }
      fd.append("n", "1");
      fd.append("output_format", "png");
      fd.append("size", "1536x1536");
      const res = await callEdit(key, fd);
      const image = res.data?.[0];
      setPanels((prev) => {
        const next = [...prev];
        next[index] = image ?? null;
        return next;
      });
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e);
      toast({ title: "Panel failed", description: msg, variant: "destructive" });
    } finally {
      setLoadingIndex(null);
    }
  };

  const generateAll = async () => {
    for (let i = 0; i < active.panels.length; i++) {
      await generatePanel(i);
    }
  };

  return (
    <>
      <PageHeader
        title="Manga & character consistency"
        description="Upload a character reference, then generate multiple panels that keep the character's face, hair, and outfit consistent across frames."
      />
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4" />
                Story preset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {MANGA_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectPreset(p.id)}
                  className={`w-full rounded-md border p-3 text-left transition-colors ${
                    selected === p.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-foreground/30"
                  }`}
                >
                  <div className="text-sm font-medium">{p.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {p.description}
                  </div>
                  <div className="mt-2 text-[10px] font-mono uppercase tracking-wide text-muted-foreground">
                    {p.panels.length} panels
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Character reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <MultiImageDropzone
                images={characterRef}
                onChange={setCharacterRef}
                max={1}
                label="Upload one reference image"
              />
              <Button
                onClick={generateAll}
                disabled={loadingIndex !== null || characterRef.length === 0}
                className="w-full"
              >
                {loadingIndex !== null ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Panel{" "}
                    {(loadingIndex ?? 0) + 1} of {active.panels.length}…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate all panels
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {active.panels.map((panelPrompt, i) => {
            const panel = panels[i];
            const busy = loadingIndex === i;
            return (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      Panel {i + 1}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => generatePanel(i)}
                      disabled={loadingIndex !== null || characterRef.length === 0}
                    >
                      {busy ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Regen"
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {busy ? (
                    <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drawing…
                    </div>
                  ) : panel ? (
                    <ImageResult result={panel} prompt={panelPrompt} />
                  ) : (
                    <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                      Not generated yet
                    </div>
                  )}
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer">Panel prompt</summary>
                    <p className="mt-1 whitespace-pre-wrap">{panelPrompt}</p>
                  </details>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
