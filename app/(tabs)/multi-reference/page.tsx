"use client";

import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/page-header";
import { PromptBox } from "@/components/prompt-box";
import { ImageResult } from "@/components/image-result";
import {
  MultiImageDropzone,
  type UploadedImage,
} from "@/components/multi-image-dropzone";
import { useApiKey } from "@/components/key-provider";
import { callEdit, ApiError } from "@/lib/openai";
import { downscaleToMax } from "@/lib/downscale";
import type { ImageResult as ImageResultT } from "@/lib/types";

export default function MultiReferencePage() {
  const { key } = useApiKey();
  const { toast } = useToast();

  const [images, setImages] = React.useState<UploadedImage[]>([]);
  const [prompt, setPrompt] = React.useState(
    "Create a new product photograph. Place the object from image 1 in the setting from image 2, lit in the style of image 3. Match lighting direction and colour temperature across the scene.",
  );
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<ImageResultT | null>(null);

  const run = async () => {
    if (!key || images.length < 1 || !prompt.trim()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("prompt", prompt);
      for (const img of images) {
        const down = await downscaleToMax(img.file, 2048);
        fd.append("image[]", down.blob, img.file.name.replace(/\.[^.]+$/, "") + ".png");
      }
      fd.append("n", "1");
      fd.append("output_format", "png");
      fd.append("size", "2048x2048");
      const res = await callEdit(key, fd);
      setResult(res.data?.[0] ?? null);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e);
      toast({ title: "Edit failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Multi-image reference editing"
        description="Upload 2–4 images, then reference them as 'image 1', 'image 2', … in the prompt. Great for style transfer, compositional blending, and character consistency."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">References & result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <MultiImageDropzone images={images} onChange={setImages} max={4} />
            {loading ? (
              <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
              </div>
            ) : result ? (
              <ImageResult result={result} prompt={prompt} />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                The composited result will appear here.
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <PromptBox value={prompt} onChange={setPrompt} onSubmit={run} minHeight={180} />
            <Button
              className="w-full"
              onClick={run}
              disabled={loading || images.length === 0 || !prompt.trim()}
            >
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
            <p className="text-xs text-muted-foreground">
              Tip: refer to uploads explicitly as <code className="font-mono">image 1</code>,{" "}
              <code className="font-mono">image 2</code>, etc., in your prompt.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
