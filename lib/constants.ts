export const MODEL_ID = "gpt-image-2";
export const MODEL_SNAPSHOT = "gpt-image-2-2026-04-21";

export type AspectRatio =
  | "1:1"
  | "16:9"
  | "9:16"
  | "3:2"
  | "2:3"
  | "4:3"
  | "21:9"
  | "3:1"
  | "1:3";

export const ASPECT_RATIOS: { ratio: AspectRatio; label: string; hint: string }[] = [
  { ratio: "1:1", label: "1:1", hint: "Square" },
  { ratio: "16:9", label: "16:9", hint: "Widescreen" },
  { ratio: "9:16", label: "9:16", hint: "Vertical" },
  { ratio: "3:2", label: "3:2", hint: "Print" },
  { ratio: "2:3", label: "2:3", hint: "Portrait" },
  { ratio: "4:3", label: "4:3", hint: "Classic" },
  { ratio: "21:9", label: "21:9", hint: "Cinematic" },
  { ratio: "3:1", label: "3:1", hint: "Ultrawide" },
  { ratio: "1:3", label: "1:3", hint: "Skyscraper" },
];

// Size strings passed to the API. Numerator is the longer edge.
// 2K ~= 2048px long edge, 4K ~= 4096px long edge.
export function ratioToSize(ratio: AspectRatio, tier: "2K" | "4K"): string {
  const long = tier === "4K" ? 4096 : 2048;
  const [a, b] = ratio.split(":").map(Number);
  const shortEdge = Math.round((long * b) / a);
  if (a >= b) return `${long}x${shortEdge}`;
  const longV = Math.round((long * a) / b);
  return `${longV}x${long}`;
}

export type Quality = "low" | "medium" | "high";

export const QUALITIES: Quality[] = ["low", "medium", "high"];

export type ReasoningEffort = "off" | "medium";

export const OUTPUT_FORMATS = ["png", "webp", "jpeg"] as const;
export type OutputFormat = (typeof OUTPUT_FORMATS)[number];
