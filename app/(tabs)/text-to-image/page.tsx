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
import { ResultGallery } from "@/components/result-gallery";
import { QualitySelect, FormatSelect } from "@/components/generate-controls";
import { useApiKey } from "@/components/key-provider";
import { callGenerate, ApiError } from "@/lib/openai";
import type { AspectRatio, OutputFormat, Quality } from "@/lib/constants";
import { ratioToSize } from "@/lib/constants";
import type { ImageResult } from "@/lib/types";

export default function TextToImagePage() {
  const { key } = useApiKey();
  const { toast } = useToast();
  const [prompt, setPrompt] = React.useState(
    "A red panda astronaut planting a flag on a candy-coloured moon, cinematic lighting, shallow depth of field.",
  );
  const [ratio, setRatio] = React.useState<AspectRatio>("1:1");
  const [tier, setTier] = React.useState<"2K" | "4K">("2K");
  const [quality, setQuality] = React.useState<Quality>("high");
  const [format, setFormat] = React.useState<OutputFormat>("png");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<ImageResult[]>([]);

  const run = async () => {
    if (!key || !prompt.trim()) return;
    setLoading(true);
    try {
      const res = await callGenerate(key, {
        prompt,
        size: ratioToSize(ratio, tier),
        quality,
        n: 1,
        output_format: format,
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
        title="Text to image"
        description="The basic Image 2 flow. Prompt → one photorealistic result at the size you pick. Good sanity check that your key and proxy are wired up."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating…
              </div>
            ) : results.length > 0 ? (
              <ResultGallery results={results} prompt={prompt} format={format} />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                Your image will appear here.
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <PromptBox value={prompt} onChange={setPrompt} onSubmit={run} />
            <div className="space-y-2">
              <Label>Aspect ratio</Label>
              <AspectRatioPicker value={ratio} onChange={setRatio} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Tier</Label>
                <div className="inline-flex h-9 rounded-md border border-input bg-card p-0.5">
                  {(["2K", "4K"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTier(t)}
                      className={`flex-1 rounded px-3 text-xs font-medium ${tier === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <QualitySelect value={quality} onChange={setQuality} />
              <FormatSelect value={format} onChange={setFormat} />
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
      </div>
    </>
  );
}
