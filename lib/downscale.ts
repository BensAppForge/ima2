// Client-side image downscaling to keep multipart request bodies reasonable.
// Preserves aspect ratio; returns a PNG Blob + natural dimensions.
export async function downscaleToMax(
  file: File,
  maxEdge = 2048,
): Promise<{ blob: Blob; width: number; height: number; url: string }> {
  const bitmap = await createImageBitmap(file);
  const { width: w, height: h } = bitmap;
  const scale = Math.min(1, maxEdge / Math.max(w, h));
  const tw = Math.round(w * scale);
  const th = Math.round(h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, tw, th);
  bitmap.close?.();

  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png",
    ),
  );
  const url = URL.createObjectURL(blob);
  return { blob, width: tw, height: th, url };
}
