"use client";

import * as React from "react";
import { BarChart3, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/page-header";
import { EditablePresetPrompt } from "@/components/editable-preset-prompt";
import { ImageResult } from "@/components/image-result";
import { useApiKey } from "@/components/key-provider";
import { callGenerate, ApiError } from "@/lib/openai";
import { INFOGRAPHIC_PROMPTS } from "@/lib/prompts/infographics";
import { ratioToSize } from "@/lib/constants";
import type { ImageResult as ImageResultT } from "@/lib/types";

export default function InfographicsPage() {
  const { key } = useApiKey();
  const { toast } = useToast();

  const [selected, setSelected] = React.useState(INFOGRAPHIC_PROMPTS[0].id);
  const active = INFOGRAPHIC_PROMPTS.find((p) => p.id === selected)!;
  const [prompt, setPrompt] = React.useState(active.prompt);
  const [webSearch, setWebSearch] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<ImageResultT | null>(null);

  const run = async () => {
    if (!key || !prompt.trim()) return;
    setLoading(true);
    try {
      const res = await callGenerate(key, {
        prompt,
        size: ratioToSize("16:9", "2K"),
        quality: "high",
        n: 1,
        output_format: "png",
        reasoning_effort: "medium",
        web_search: webSearch,
      });
      setResult(res.data?.[0] ?? null);
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
        title="Infographics, slides & maps"
        description="Image 2's reasoning + web search grounding is a huge leap for data-heavy images. Pick a template; the model plans the layout and, when web search is on, pulls real figures and labels mid-generation."
      />
      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {INFOGRAPHIC_PROMPTS.map((p) => (
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
                <div className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground">
                  {p.category}
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
            <CardContent className="space-y-4">
              <EditablePresetPrompt
                key={active.id}
                initial={active.prompt}
                onChange={setPrompt}
                onSubmit={run}
                minHeight={160}
              />
              <label className="flex items-center justify-between rounded-md border border-border bg-card p-3">
                <div>
                  <div className="text-sm font-medium">Web search grounding</div>
                  <div className="text-xs text-muted-foreground">
                    Use reasoning mode to pull real figures and labels.
                  </div>
                </div>
                <Switch checked={webSearch} onCheckedChange={setWebSearch} />
              </label>
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
                <div className="flex h-80 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking & generating…
                </div>
              ) : result ? (
                <ImageResult result={result} prompt={prompt} />
              ) : (
                <div className="flex h-80 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                  Pick a template and hit Generate.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
