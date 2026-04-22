import { NextRequest, NextResponse } from "next/server";
import { MODEL_ID } from "@/lib/constants";

export const runtime = "nodejs";
export const maxDuration = 120;

const UPSTREAM = "https://api.openai.com/v1/images/edits";

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-openai-key");
  if (!key) {
    return NextResponse.json(
      { error: { message: "Missing x-openai-key header." } },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  let incoming: FormData;
  try {
    incoming = await req.formData();
  } catch {
    return NextResponse.json(
      { error: { message: "Expected multipart/form-data body." } },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const forward = new FormData();
  let hasModel = false;
  for (const [name, value] of incoming.entries()) {
    if (name === "model") hasModel = true;
    forward.append(name, value);
  }
  if (!hasModel) forward.append("model", MODEL_ID);

  const upstream = await fetch(UPSTREAM, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      // Let fetch set the multipart boundary
    },
    body: forward,
  });

  const contentType = upstream.headers.get("content-type") ?? "application/json";
  const text = await upstream.text();

  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
