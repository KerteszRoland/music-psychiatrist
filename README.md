# Music Psychiatrist

Next.js app that fetches song lyrics and analyzes them for **schema therapy** patterns using the Vercel AI SDK.

## Stack

- Next.js 15 (App Router)
- Tailwind CSS v4 + shadcn/ui
- Lucide icons
- TanStack Query
- No database

## Local development

```bash
npm install
cp .env.example .env
# Add your AI provider credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Set these in `.env` locally and in the Vercel project dashboard for production:

| Variable | Description |
|----------|-------------|
| `AI_PROVIDER` | `openai`, `anthropic`, `google`, or `openai-compatible` |
| `AI_MODEL` | Model id for your provider |
| `OPENAI_API_KEY` | Required when `AI_PROVIDER=openai` |
| `ANTHROPIC_API_KEY` | Required when `AI_PROVIDER=anthropic` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Required when `AI_PROVIDER=google` |
| `OPENAI_COMPATIBLE_API_KEY` | Required when `AI_PROVIDER=openai-compatible` |
| `OPENAI_COMPATIBLE_BASE_URL` | Base URL for compatible providers |

## Storage

Analyses are saved after each run and can be reopened via shareable links:

- **Production (Vercel):** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) — set `BLOB_READ_WRITE_TOKEN` (auto-linked if you create a Blob store in the Vercel dashboard)
- **Local dev:** `.data/` folder (no token needed)

Shareable URL format: `/analysis/{id}`

Previously analyzed songs are returned from cache instantly (no new AI call).

## OpenRouter credits

When using `AI_PROVIDER=openai-compatible` with OpenRouter, the app shows remaining credits on the homepage and blocks new analyses when credits are exhausted.

## Deploy to Vercel

```bash
npx vercel
```

Or connect the GitHub repo in the [Vercel dashboard](https://vercel.com/new) and add the environment variables above.

## Disclaimer

Thematic lyrical analysis only — not a clinical diagnostic tool.
