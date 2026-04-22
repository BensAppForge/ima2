"use client";

import { ImageResult } from "@/components/image-result";
import type { ImageResult as ImageResultT } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ResultGallery({
  results,
  prompt,
  format = "png",
  columns,
}: {
  results: ImageResultT[];
  prompt?: string;
  format?: string;
  columns?: number;
}) {
  if (!results || results.length === 0) return null;
  const cols =
    columns ??
    (results.length <= 1 ? 1 : results.length <= 4 ? 2 : results.length <= 6 ? 3 : 4);

  const gridClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : cols === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={cn("grid gap-4", gridClass)}>
      {results.map((r, i) => (
        <ImageResult key={i} result={r} prompt={prompt} format={format} />
      ))}
    </div>
  );
}
