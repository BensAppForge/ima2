"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type UploadedImage = {
  file: File;
  previewUrl: string;
};

export function MultiImageDropzone({
  images,
  onChange,
  max = 4,
  label = "Reference images",
}: {
  images: UploadedImage[];
  onChange: (next: UploadedImage[]) => void;
  max?: number;
  label?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const add = (files: FileList | null) => {
    if (!files) return;
    const imgs = Array.from(files).slice(0, max - images.length);
    const next = [
      ...images,
      ...imgs.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ];
    onChange(next);
  };

  const removeAt = (i: number) => {
    const victim = images[i];
    if (victim) URL.revokeObjectURL(victim.previewUrl);
    onChange(images.filter((_, idx) => idx !== i));
  };

  React.useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">
          {images.length} / {max}
        </div>
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          add(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-wrap gap-3 rounded-md border border-dashed border-border bg-card p-3",
          images.length === 0 && "min-h-32 items-center justify-center",
        )}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative h-24 w-24 overflow-hidden rounded-md border border-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.previewUrl} alt="" className="h-full w-full object-cover" />
            <div className="absolute left-1 top-1 rounded bg-black/60 px-1 text-[10px] font-medium text-white">
              image {i + 1}
            </div>
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 rounded bg-black/60 p-0.5 text-white hover:bg-black/80"
              aria-label="Remove"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {images.length < max && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => inputRef.current?.click()}
            className="h-24 w-24 flex-col gap-1 border border-dashed border-border text-xs text-muted-foreground"
          >
            <Upload className="h-4 w-4" />
            Add
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
