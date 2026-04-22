import type { GenerateRequest, GenerateResponse } from "./types";

export class ApiError extends Error {
  status: number;
  type?: string;
  code?: string;
  constructor(message: string, status: number, type?: string, code?: string) {
    super(message);
    this.status = status;
    this.type = type;
    this.code = code;
  }
}

async function parseError(res: Response): Promise<ApiError> {
  let message = `Request failed with status ${res.status}`;
  let type: string | undefined;
  let code: string | undefined;
  try {
    const body = await res.json();
    if (body?.error?.message) message = body.error.message;
    type = body?.error?.type;
    code = body?.error?.code;
  } catch {
    // ignore parse errors
  }
  return new ApiError(message, res.status, type, code);
}

export async function callGenerate(
  key: string,
  body: GenerateRequest,
): Promise<GenerateResponse> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-openai-key": key,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as GenerateResponse;
}

export async function callEdit(
  key: string,
  formData: FormData,
): Promise<GenerateResponse> {
  const res = await fetch("/api/edit", {
    method: "POST",
    headers: {
      "x-openai-key": key,
    },
    body: formData,
    cache: "no-store",
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as GenerateResponse;
}

export function resultToDataUrl(
  r: { b64_json?: string; url?: string },
  format: string = "png",
): string | null {
  if (r.b64_json) return `data:image/${format};base64,${r.b64_json}`;
  if (r.url) return r.url;
  return null;
}
