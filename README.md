# Prayat

Khmer-first scam simulation. You cannot talk to the scammer — only to your Auntie,
and she is already half convinced.

One complete Guardian Mode scenario: a fake Ministry of Commerce compliance fee,
three stages, four options each. **The answer key lives on the server.** The browser
is never told which option is correct until after it has committed to one.

---

## Run it

```bash
npm install
npm run dev          # client :5173, api :3001
```

Open `http://<your-lan-ip>:5173` on a phone on the same network — the dev server binds
`0.0.0.0` for exactly this.

| Script | Does |
|---|---|
| `npm run dev` | Vite client + API server together |
| `npm run build` | Builds `dist/` (client, PWA) and `dist-server/` (api) |
| `npm start` | Serves both from one port — what Render runs |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint:tokens` | Fails if a hardcoded visual value leaks into `src/` |
| `npm run validate:content` | What is still unwritten in `content/` |
| `npm run test:strip` | The answer key cannot reach the wire format |
| `npm run test:api` | 48 API checks, no UI |
| `npm run preflight` | Check a deployment the way a judge meets it |

`BASE=https://…` works on `test:api` and `preflight` to run them against production.

---

## The one rule

**Every visual value is a token in [`src/styles/global.css`](src/styles/global.css).**

No hex, no `rgb()`, no Tailwind palette classes (`bg-slate-900`, `text-red-500`)
anywhere else in `src/`. No hardcoded spacing, radius, font size or duration in
components. If a value has no token, add the token first, then use it.

The entire app restyles by editing that one file. `npm run lint:tokens` enforces it,
and [`TOKENS.md`](TOKENS.md) says which token controls what.

Motion is read from CSS, never duplicated in JS:

```ts
import { motionToken, sleep } from './hooks/useMotionToken'
await sleep(motionToken('--timing-typing-min'))
```

### Khmer typography is not cosmetic

Khmer glyphs stack above *and* below the baseline; at a normal line-height the
diacritics clip. `--leading-kh` is applied through `:lang(km)`, which is why
`<html lang>` follows the selected language. The font is **self-hosted** so the
service worker can cache it — a Google Fonts `@import` cannot be cached on first
load, and the offline shell would render Khmer in a broken fallback.

---

## Layout

```
content/          the scenario — Khmer first, see AUTHORING.md
shared/           types + answer stripping, imported by BOTH sides
server/           express, sqlite, the answer key
src/              react app
  api/client.ts   every fetch call in the app
  styles/         the only file with raw values
scripts/          tests and tooling
```

`shared/types.ts` is imported by the client and the server, so the contract cannot
drift. `shared/strip.ts` is the single function that removes answers before anything
is sent — one place to get it wrong, one place to check.

---

## Documents

| File | What |
|---|---|
| [`prayat_build_plan_phased.md`](prayat_build_plan_phased.md) | The phased plan, with a gate at the end of each |
| [`TOKENS.md`](TOKENS.md) | Which token controls which part of the UI |
| [`DEPLOY.md`](DEPLOY.md) | Render, UptimeRobot, demo-day checklist |
| [`content/AUTHORING.md`](content/AUTHORING.md) | How to write the scenario |

---

## Status

Built and verified: all six screens, the full API, the PWA, the docs page.

**Not done, and not code:**

- The scenario is unwritten — 104 empty fields. `npm run validate:content` lists them.
  The app runs on placeholders and shows a banner whenever it does.
- No outside Khmer reviewer assigned. The writer and reviewer must be different
  people, and the reviewer must be over 45 and not on the team.
- Never deployed. See [`DEPLOY.md`](DEPLOY.md).
