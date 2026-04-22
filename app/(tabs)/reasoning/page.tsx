"use client";

import * as React from "react";
import { Loader2, Sparkles, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/page-header";
import { PromptBox } from "@/components/prompt-box";
import { ReasoningToggle } from "@/components/reasoning-toggle";
import { ImageResult } from "@/components/image-result";
import { useApiKey } from "@/components/key-provider";
import { callGenerate, ApiError } from "@/lib/openai";
import type { ReasoningEffort } from "@/lib/constants";
import { ratioToSize } from "@/lib/constants";
import type { GenerateResponse } from "@/lib/types";

type Run = {
  effort: ReasoningEffort;
  webSearch: boolean;
  durationMs: number;
  response: GenerateResponse;
};

export default function ReasoningPage() {
  const { key } = useApiKey();
  const { toast } = useToast();

  const [prompt, setPrompt] = React.useState(
    "A line chart titled 'Average global surface temperature anomaly, 1950 – 2024 (°C vs 1951–1980 mean)'. Label the y-axis in tenths of a degree. Include 5-year gridlines. Add a short source footnote. Editorial style, single accent colour, clean sans-serif.",
  );
  const [effort, setEffort] = React.useState<ReasoningEffort>("medium");
  const [webSearch, setWebSearch] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [runs, setRuns] = React.useState<Run[]>([]);

  const run = async () => {
    if (!key || !prompt.trim()) return;
    setLoading(true);
    const started = performance.now();
    try {
      const res = await callGenerate(key, {
        prompt,
        size: ratioToSize("16:9", "2K"),
        quality: "high",
        n: 1,
        output_format: "png",
        reasoning_effort: effort,
        web_search: effort === "medium" ? webSearch : false,
      });
      const durationMs = performance.now() - started;
      setRuns((prev) => [
        { effort, webSearch: effort === "medium" ? webSearch : false, durationMs, response: res },
        ...prev,
      ]);
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
        title="Reasoning mode"
        description="Image 2's 'thinking' mode plans layout and content before drawing. With web search on, it can pull reference facts mid-generation — great for accurate diagrams, charts, and maps. Compare results side by side."
      />
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prompt & mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <PromptBox value={prompt} onChange={setPrompt} onSubmit={run} minHeight={160} />
            <ReasoningToggle
              effort={effort}
              onEffortChange={setEffort}
              webSearch={webSearch}
              onWebSearchChange={setWebSearch}
            />
            <Button className="w-full" onClick={run} disabled={loading || !prompt.trim()}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Running…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Run
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Tip: run the same prompt with <strong>Off</strong> then <strong>Medium</strong> to see the latency and quality difference.
            </p>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {runs.length === 0 && !loading && (
            <Card>
              <CardContent className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                No runs yet. Run the same prompt at different effort levels to compare.
              </CardContent>
            </Card>
          )}
          {loading && (
            <Card>
              <CardContent className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
              </CardContent>
            </Card>
          )}
          {runs.map((r, i) => {
            const image = r.response.data?.[0];
            return (
              <Card key={i}>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base">
                      Run #{runs.length - i}
                    </CardTitle>
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                      effort: {r.effort}
                    </span>
                    {r.webSearch && (
                      <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                        web_search
                      </span>
                    )}
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Timer className="h-3.5 w-3.5" />
                      {(r.durationMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {image ? (
                    <ImageResult result={image} prompt={prompt} />
                  ) : (
                    <div className="text-sm text-muted-foreground">No image returned.</div>
                  )}
                  {r.response.reasoning?.summary && (
                    <details className="rounded-md border border-border bg-muted/30 p-3 text-sm">
                      <summary className="cursor-pointer font-medium">
                        Reasoning summary
                      </summary>
                      <p className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">
                        {r.response.reasoning.summary}
                      </p>
                    </details>
                  )}
                  {r.response.usage && (
                    <details className="rounded-md border border-border bg-muted/30 p-3 text-sm">
                      <summary className="cursor-pointer font-medium">Usage</summary>
                      <pre className="mt-2 overflow-x-auto text-xs text-muted-foreground">
                        {JSON.stringify(r.response.usage, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
