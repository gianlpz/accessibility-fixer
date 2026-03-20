# Access4U

## Overview
Stateless web app that scans HTML for WCAG accessibility violations using axe-core (client-side), then uses Gemini AI to explain violations in plain language and generate corrected code with before/after diffs.

## Tech Stack
- Next.js 16, React 19, Tailwind CSS v4
- AI SDK (`@ai-sdk/google`, `ai`) with `generateObject()` for structured output
- axe-core for client-side accessibility auditing
- react-diff-viewer-continued for code diffs
- jsPDF for PDF report export

## Key Architecture Decisions
- **Client-side axe-core**: Runs in a hidden iframe (srcdoc, same-origin) — no server-side puppeteer needed
- **Two iframes**: Hidden (audit, same-origin) + visible (preview, sandboxed)
- **`generateObject()`** over `streamText()`: Need structured JSON mapped to violation IDs
- **No database, no auth**: Stateless tool, ephemeral processing

## Commands
```bash
npm run dev          # Dev server
npm run build        # Production build
npm run test         # Vitest (run once)
npm run test:watch   # Vitest (watch mode)
npm run lint         # ESLint
```

## Environment Variables
- `GOOGLE_GENERATIVE_AI_API_KEY` — Gemini API key (in `.env.local`)

## File Structure
- `src/app/lib/axe-runner.ts` — Runs axe-core in hidden iframe
- `src/app/lib/types.ts` — Shared TypeScript interfaces
- `src/app/lib/prompts.ts` — Gemini system prompt construction
- `src/app/lib/format-report.ts` — PDF/JSON export
- `src/app/api/analyze/route.ts` — POST endpoint for AI violation analysis
- `src/app/audit/page.tsx` — Main audit page (client component)
- `public/axe.min.js` — axe-core bundle (copied from node_modules)
