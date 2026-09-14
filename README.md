# Prayat

Khmer-first scam simulation. You cannot talk to the scammer — only to your
Auntie, and she is already half convinced.

## Run

```bash
npm install
npm run dev          # client on :5173, api on :3001
```

| Script | Does |
|---|---|
| `npm run dev` | Vite client + API server together |
| `npm run build` | Builds `dist/` (client) and `dist-server/` (api) |
| `npm start` | Serves both from one port |
| `npm run lint:tokens` | Fails if any hardcoded value leaks outside `global.css` |
| `npm run typecheck` | `tsc --noEmit` |

## The one rule

**Every visual value is a token in [`src/styles/global.css`](src/styles/global.css).**

No hex, no `rgb()`, no Tailwind palette classes (`bg-slate-900`, `text-red-500`)
anywhere else in `src/`. No hardcoded spacing, radius, font size or duration in
components either. If a value has no token, add the token first, then use it.

The entire app restyles by editing that one file. `npm run lint:tokens` enforces it.

Motion values are read from CSS, never duplicated in JS:

```ts
import { motionToken, sleep } from './hooks/useMotionToken'
await sleep(motionToken('--timing-typing-min'))
```

## Build plan

Phase by phase, with a gate at the end of each:
[`prayat_build_plan_phased.md`](prayat_build_plan_phased.md)
