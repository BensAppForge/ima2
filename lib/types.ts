import type { OutputFormat, Quality, ReasoningEffort } from "./constants";

export type GenerateRequest = {
  prompt: string;
  size?: string;
  quality?: Quality;
  n?: number;
  output_format?: OutputFormat;
  reasoning_effort?: ReasoningEffort;
  web_search?: boolean;
  background?: "transparent" | "opaque";
};

export type ImageResult = {
  b64_json?: string;
  url?: string;
  revised_prompt?: string;
};

export type GenerateResponse = {
  created?: number;
  data: ImageResult[];
  reasoning?: { summary?: string; tokens?: number };
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
};

export type ErrorResponse = {
  error?: { message?: string; type?: string; code?: string };
};
