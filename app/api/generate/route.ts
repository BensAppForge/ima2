import { NextRequest, NextResponse } from "next/server";
import { MODEL_ID } from "@/lib/constants";

export const runtime = "nodejs";
export const maxDuration = 120;

const UPSTREAM = "https://api.openai.com/v1/images/generations";

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-openai-key");
  if (!key) {
    return NextResponse.json(
      { error: { message: "Missing x-openai-key header." } },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body." } },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!body.model) body.model = MODEL_ID;

  const upstream = await fetch(UPSTREAM, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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
