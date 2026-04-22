"use client";

import * as React from "react";
import { Loader2, Sparkles, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/page-header";
import { EditablePresetPrompt } from "@/components/editable-preset-prompt";
import { ResultGallery } from "@/components/result-gallery";
import { useApiKey } from "@/components/key-provider";
import { callGenerate, ApiError } from "@/lib/openai";
import { TYPOGRAPHY_PROMPTS } from "@/lib/prompts/typography";
import { ratioToSize } from "@/lib/constants";
import type { ImageResult } from "@/lib/types";

export default function TypographyPage() {
  const { key } = useApiKey();
  const { toast } = useToast();

  const [selected, setSelected] = React.useState(TYPOGRAPHY_PROMPTS[0].id);
  const active = TYPOGRAPHY_PROMPTS.find((p) => p.id === selected)!;
  const [prompt, setPrompt] = React.useState(active.prompt);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<ImageResult[]>([]);

  const run = async () => {
    if (!key || !prompt.trim()) return;
    setLoading(true);
    try {
      const res = await callGenerate(key, {
        prompt,
        size: ratioToSize("1:1", "2K"),
        quality: "high",
        n: 1,
        output_format: "png",
      });
      setResults(res.data ?? []);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e);
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Typography & multilingual text rendering"
        description="Image 2 renders crisp small UI labels, accented glyphs, and kerned multi-word layouts cleanly across English, German, French, Italian, and Spanish. Pick a curated prompt below."
      />
      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Type className="h-4 w-4" />
              Preset prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {TYPOGRAPHY_PROMPTS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelected(p.id);
                  setPrompt(p.prompt);
                }}
                className={`w-full rounded-md border p-3 text-left transition-colors ${
                  selected === p.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-foreground/30"
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide">
                    {p.language}
                  </span>
                </div>
                <div className="mt-1 text-sm font-medium">{p.title}</div>
              </button>
            ))}
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <EditablePresetPrompt
                key={active.id}
                initial={active.prompt}
                onChange={setPrompt}
                onSubmit={run}
                minHeight={200}
              />
              <Button onClick={run} disabled={loading || !prompt.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Result</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                </div>
              ) : results.length > 0 ? (
                <ResultGallery results={results} prompt={prompt} />
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                  Pick a preset and hit Generate.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
