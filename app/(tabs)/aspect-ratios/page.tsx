"use client";

import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/page-header";
import { PromptBox } from "@/components/prompt-box";
import { AspectRatioPicker } from "@/components/aspect-ratio-picker";
import { ImageResult } from "@/components/image-result";
import { useApiKey } from "@/components/key-provider";
import { callGenerate, ApiError } from "@/lib/openai";
import type { AspectRatio } from "@/lib/constants";
import { ratioToSize } from "@/lib/constants";
import type { ImageResult as ImageResultT } from "@/lib/types";

export default function AspectRatiosPage() {
  const { key } = useApiKey();
  const { toast } = useToast();

  const [prompt, setPrompt] = React.useState(
    "A lone lighthouse on a basalt headland at golden hour, long streaks of sea mist, Nordic coast. Cinematic.",
  );
  const [ratio, setRatio] = React.useState<AspectRatio>("21:9");
  const [tier, setTier] = React.useState<"2K" | "4K">("2K");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{
    image: ImageResultT;
    size: string;
    ratio: AspectRatio;
  } | null>(null);

  const size = ratioToSize(ratio, tier);

  const run = async () => {
    if (!key || !prompt.trim()) return;
    setLoading(true);
    try {
      const res = await callGenerate(key, {
        prompt,
        size,
        quality: "high",
        n: 1,
        output_format: "png",
      });
      const image = res.data?.[0];
      if (image) setResult({ image, size, ratio });
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
        title="Aspect ratios & resolution"
        description="Image 2 supports aspect ratios from 3:1 to 1:3, up to 4K. Pick a preset, pick a tier, and compare dimensions."
      />
      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prompt & size</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <PromptBox value={prompt} onChange={setPrompt} onSubmit={run} />
            <div className="space-y-2">
              <Label>Aspect ratio</Label>
              <AspectRatioPicker value={ratio} onChange={setRatio} />
            </div>
            <div className="space-y-2">
              <Label>Resolution tier</Label>
              <div className="inline-flex h-9 w-full rounded-md border border-input bg-card p-0.5">
                {(["2K", "4K"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`flex-1 rounded px-3 text-xs font-medium ${tier === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {t === "2K" ? "2K (2048 long edge)" : "4K (4096 long edge)"}
                  </button>
                ))}
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                Resolved size: {size}
              </p>
            </div>
            <Button className="w-full" onClick={run} disabled={loading || !prompt.trim()}>
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
              <div className="flex h-96 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
              </div>
            ) : result ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded bg-muted px-2 py-0.5 font-mono">
                    ratio {result.ratio}
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono">
                    size {result.size}
                  </span>
                </div>
                <ImageResult result={result.image} prompt={prompt} />
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                Pick a ratio and tier and hit Generate.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
