"use client";

import * as React from "react";
import { Loader2, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/page-header";
import { PromptBox } from "@/components/prompt-box";
import { ImageResult } from "@/components/image-result";
import { MaskCanvas, type MaskCanvasHandle } from "@/components/mask-canvas";
import { useApiKey } from "@/components/key-provider";
import { callEdit, ApiError } from "@/lib/openai";
import { downscaleToMax } from "@/lib/downscale";
import type { ImageResult as ImageResultT } from "@/lib/types";

type Source = {
  blob: Blob;
  url: string;
  width: number;
  height: number;
};

export default function MaskedEditPage() {
  const { key } = useApiKey();
  const { toast } = useToast();

  const [source, setSource] = React.useState<Source | null>(null);
  const [prompt, setPrompt] = React.useState(
    "Replace the painted region with a tall arched window letting warm afternoon light into the room.",
  );
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<ImageResultT | null>(null);
  const maskRef = React.useRef<MaskCanvasHandle | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    return () => {
      if (source?.url) URL.revokeObjectURL(source.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    try {
      const down = await downscaleToMax(file, 2048);
      if (source?.url) URL.revokeObjectURL(source.url);
      setSource(down);
      setResult(null);
    } catch (e) {
      toast({
        title: "Upload failed",
        description: String(e),
        variant: "destructive",
      });
    }
  };

  const run = async () => {
    if (!key || !source || !prompt.trim()) return;
    const maskBlob = await maskRef.current?.exportMask();
    if (!maskBlob || !maskRef.current?.hasStrokes()) {
      toast({
        title: "No mask drawn",
        description: "Paint over the area you want to edit, then try again.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("prompt", prompt);
      fd.append("image", source.blob, "source.png");
      fd.append("mask", maskBlob, "mask.png");
      fd.append("size", `${source.width}x${source.height}`);
      fd.append("n", "1");
      fd.append("output_format", "png");
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
        title="Masked editing"
        description="Upload an image, paint over the region you want changed, and Image 2 edits only the masked area. White = edit region."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Source & mask</CardTitle>
          </CardHeader>
          <CardContent>
            {!source ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onUpload(e.dataTransfer.files);
                }}
                className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-card p-8 text-center"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  Drop a PNG or JPEG here, or
                </div>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Upload image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    onUpload(e.target.files);
                    e.target.value = "";
                  }}
                />
                <div className="text-xs text-muted-foreground">
                  Large images are downscaled to 2048 px long edge before upload.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <MaskCanvas
                  ref={maskRef}
                  imageUrl={source.url}
                  imageWidth={source.width}
                  imageHeight={source.height}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono">
                    {source.width} × {source.height}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (source.url) URL.revokeObjectURL(source.url);
                      setSource(null);
                      setResult(null);
                    }}
                  >
                    Replace image
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Edit prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PromptBox value={prompt} onChange={setPrompt} onSubmit={run} />
              <Button
                className="w-full"
                onClick={run}
                disabled={loading || !source || !prompt.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Editing…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Apply edit
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Editing…
                </div>
              ) : result ? (
                <ImageResult result={result} prompt={prompt} />
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                  The edited image will appear here.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
