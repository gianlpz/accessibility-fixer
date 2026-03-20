# Access4U

## Overview
Stateless web app that scans HTML (paste or URL) for WCAG accessibility violations using axe-core (client-side), then uses AI (Gemini or Spike.land) to explain violations in plain language and generate corrected code with before/after diffs and visual previews.

## Tech Stack
- Next.js 16, React 19, Tailwind CSS v4
- AI SDK (`@ai-sdk/google`, `ai`) with `generateObject()` for structured output
- axe-core for client-side accessibility auditing
- react-diff-viewer-continued for code diffs
- jsPDF for PDF report export

## Key Architecture Decisions
- **Client-side axe-core**: Runs in a hidden iframe (srcdoc, same-origin) — no server-side puppeteer needed
- **Multiple iframes**: Hidden (audit, same-origin) + visible preview (single or split before/after when AI fixes are available)
- **`generateObject()`** over `streamText()`: Need structured JSON mapped to violation IDs
- **Multiple AI providers**: Gemini and Spike.land behind an abstraction layer (`ai-provider.ts`)
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
- `SPIKE_LAND_API_KEY` — Spike.land API key (optional, for Spike provider)
- `AI_PROVIDER` — Default AI provider: `gemini` or `spike` (defaults to `gemini`)

## File Structure

### Lib
- `src/app/lib/axe-runner.ts` — Runs axe-core in hidden iframe
- `src/app/lib/types.ts` — Shared TypeScript interfaces
- `src/app/lib/prompts.ts` — Gemini system prompt construction
- `src/app/lib/ai-provider.ts` — AI provider abstraction layer
- `src/app/lib/gemini-provider.ts` — Gemini AI implementation
- `src/app/lib/spike-provider.ts` — Spike.land AI implementation
- `src/app/lib/prd-filter.ts` — PRD filter config for Spike provider
- `src/app/lib/apply-fixes.ts` — Applies AI-generated fixes to original HTML
- `src/app/lib/format-report.ts` — PDF/JSON export
- `src/app/lib/colour-extractor.ts` — Extracts colour pairs from rendered HTML
- `src/app/lib/contrast-utils.ts` — Contrast ratio calculations
- `src/app/lib/url-scanner.ts` — URL scanning and screenshot capture

### API Routes
- `src/app/api/analyze/route.ts` — POST endpoint for AI violation analysis
- `src/app/api/scan-url/route.ts` — POST endpoint for URL scanning

### Pages
- `src/app/page.tsx` — Landing page
- `src/app/audit/page.tsx` — Main audit page (client component)
- `src/app/audit/import/page.tsx` — Browser extension import handler

### Other
- `public/axe.min.js` — axe-core bundle (copied from node_modules)
- `extension/` — Chrome browser extension for importing audit data
