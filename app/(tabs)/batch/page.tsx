"use client";

import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/page-header";
import { PromptBox } from "@/components/prompt-box";
import { ResultGallery } from "@/components/result-gallery";
import { useApiKey } from "@/components/key-provider";
import { callGenerate, ApiError } from "@/lib/openai";
import { ratioToSize } from "@/lib/constants";
import type { ImageResult } from "@/lib/types";

export default function BatchPage() {
  const { key } = useApiKey();
  const { toast } = useToast();

  const [prompt, setPrompt] = React.useState(
    "A minimalist vector app icon for a meditation timer, rounded square, bold single-colour symbol on a pastel background.",
  );
  const [n, setN] = React.useState(6);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<ImageResult[]>([]);

  const run = async () => {
    if (!key || !prompt.trim()) return;
    setLoading(true);
    try {
      const res = await callGenerate(key, {
        prompt,
        size: ratioToSize("1:1", "2K"),
        quality: "medium",
        n,
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
        title="Batch generation"
        description="Image 2 can return up to 10 variants in one shot. Great for exploration and variant selection."
      />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PromptBox value={prompt} onChange={setPrompt} onSubmit={run} />
          <div className="flex items-center gap-4">
            <Label className="whitespace-nowrap">Variants (n)</Label>
            <Slider min={1} max={10} step={1} value={[n]} onValueChange={(v) => setN(v[0])} />
            <span className="w-10 text-right font-mono text-sm tabular-nums">{n}</span>
          </div>
          <Button onClick={run} disabled={loading || !prompt.trim()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating {n}…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate {n}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating {n} images…
        </div>
      ) : results.length > 0 ? (
        <ResultGallery results={results} prompt={prompt} />
      ) : (
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
          Set a batch size and generate to see all variants here.
        </div>
      )}
    </>
  );
}
