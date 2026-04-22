# ima2 — Image 2 capability showcase

Internal, bring-your-own-key playground for OpenAI's **Image 2** (`gpt-image-2`,
snapshot `gpt-image-2-2026-04-21`, released 2026-04-21). Nine tabs, one capability each.

## Tabs

1. **Text to Image** — prompt, size, quality, single image.
2. **Typography** — curated English / German / French / Italian / Spanish prompts that exercise small UI labels, accented glyphs, and kerning.
3. **Reasoning** — toggle `reasoning_effort` between off and medium, optional web-search grounding, side-by-side runs with latency.
4. **Aspect Ratios** — every ratio from 3:1 to 1:3, 2K or 4K long edge.
5. **Batch** — up to 10 variants per prompt.
6. **Masked Edit** — upload a source image, paint a mask, Image 2 edits only the painted region.
7. **Multi-reference Edit** — 2–4 uploads, refer to them as `image 1`, `image 2`, … in the prompt.
8. **Infographics** — templates for charts, slides, org charts, and maps; reasoning + web search on by default.
9. **Manga** — character-consistent panels from a single reference image.

## BYOK

Paste your OpenAI key into the **API key** dialog in the top nav. The key is:

- stored only in this browser's `localStorage`
- sent per request to our `/api/generate` and `/api/edit` proxy routes via the `x-openai-key` header
- forwarded to OpenAI and discarded — nothing is persisted server-side

## Run it

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to
`/text-to-image` and prompted for your key on first load.

## Build

```bash
pnpm build && pnpm start
```

## Notes

- API routes run on the Node.js runtime with `maxDuration = 120` — reasoning
  mode can take 30–60 s.
- Uploads are downscaled client-side to a 2048 px long edge before multipart
  POST so request bodies stay reasonable.
- `lib/constants.ts` exports `MODEL_ID` and `MODEL_SNAPSHOT` — flip between the
  rolling alias and the dated snapshot in one place.
