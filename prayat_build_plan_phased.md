# Prayat — Phased Build Plan
### v2.0 · 14 September 2026
### Decisions locked · derived from Implementation Plan v3.1 + the Frontend Token Brief

> **Read this first.** Nothing here is built in one pass. Every phase ends at a **gate** — a short, checkable list. You do not start the next phase until the gate passes. If a gate fails, you fix it inside that phase; you do not carry the failure forward.
>
> `⚪ VERIFY` — check on real hardware, do not take on faith
> `🚪 GATE` — stop here, review, then continue
> `⚠️ OPEN` — still unresolved, has an owner and a deadline

---

## Phase map

| Phase | Name | Day | Output | Blocks |
|---|---|---|---|---|
| **0** | Decisions | 1 AM | ✅ **CLOSED** — see below | — |
| **1** | Foundation | 1 PM | Repo runs, deploys, tokens live, Khmer font proven | 2, 3 |
| **2** | Contract + content | 2 AM | `shared/types.ts` frozen, scenario written and reviewed | 3, 4 |
| **3** | UI on fixtures | 2 PM – 4 | Six screens, six review gates | 5 |
| **4** | Backend | 3 – 4 | Every endpoint working in Postman | 5 |
| **5** | Integration | 5 AM | Fixtures swapped for live API | 6 |
| **6** | PWA + API docs | 5 PM | Installable, offline shell, `/api/docs` | 7 |
| **7** | Harden + demo | 6 – 7 | 10 real testers, rehearsed script, backup video | — |

### Two ways to run phases 3 and 4

**If two or more people write code:** phases 3 and 4 run **in parallel** the moment Phase 2 closes. That is the whole reason Phase 2 exists — the contract is frozen, so neither side waits.

**If one person writes all the code:** run them sequentially in this order — **4 before 3**.

```
Phase 2 → Phase 4 (backend) → Phase 3 (UI) → Phase 5 (integration)
```

Backend first, because the contract gets proven against a real server before any UI is built on top of it. The UI is still built on fixtures, so nothing changes in Phase 3 except that the fixtures are now known to match what the server actually returns. Phase 5 shrinks to almost nothing.

---

# Phase 0 — Decisions ✅ CLOSED

**Approved 14 September 2026 · So Sereysokbotra**

| # | Decision | Locked as |
|---|---|---|
| 1 | Brand approach | **Option B — real brands as channels only** |
| 2 | Game structure | **3 stages × 4 options** = 12 options, 12 replies |
| 3 | Scoring | **100 per correct, 0 per wrong, max 300.** Final decision determines win/lose |
| 4 | Scenario | **Cambodian shop payment scam** — Auntie Sothea, $200, shop closure threat |
| 5 | Khmer writer | So Sereysokbotra |
| 7 | Demo hotspot | So Sereysokbotra |
| 8 | Missing option D | So Sereysokbotra — reasonable, believable, too slow to stop the payment |

**Do not reopen these mid-build.** That is how hackathon weeks die.

### 0.1 What "Option B" means in practice

This is the decision the content writer needs in front of them. It is a line, not a vibe.

**Allowed — real names as channels:**
- *"He messaged her on Facebook"*
- *"He sent a Wing QR code"*
- *"He asked her to pay to a personal Wing number"*
- The debrief rule in its strong, usable form:
  > **Government agencies in Cambodia do not collect fees, fines, or taxes through Facebook Messenger or personal Wing accounts. If anyone claiming to be an official asks for money through these channels, it is always a scam.**

**Forbidden — rendered branding:**
- No bank logos, anywhere, in any asset
- No fake ABA / ACLEDA / Wing login screens
- No fake receipts or transaction confirmations
- No official-looking Ministry letterhead, seal, or crest
- The scammer's avatar is a generic photo, not a copied institutional profile

**The test:** a real brand may be *named* as the channel a scammer abused. It may never be *drawn*. If you are making an image of someone else's product, stop.

**The line to say if a judge asks:**
> Accurate bank branding is a partnership deliverable, not a launch risk. We name the channel because that is what the player has to recognise on Tuesday. We don't forge the interface, because we intend to ask those banks to partner with us.

### 0.2 ⚠️ OPEN — the Khmer reviewer

Item 6 of the decision sheet assigns the reviewer role to So Sereysokbotra, who is also the writer (item 5).

**This does not satisfy the requirement, and the requirement is the reason it exists.** The rule is:

- The writer and the reviewer are **different people**
- The reviewer is **over 45** and **not on the team**

The scam messages have to sound the way a 54-year-old shopkeeper reads them. Someone writing for a 54-year-old and then checking their own work gets the register wrong every time — too casual, too modern, too obviously fake to someone who has actually received one of these. You cannot audit your own ear.

This is not a person you need to recruit. It is a parent, an aunt, a neighbour who runs a shop. **Ten minutes of their time on day 1 morning.**

**Ask them one question:**
> *"Would you believe this message?"*

Not *"is this good Khmer?"* — you need credibility, not grammar.

- **Reviewer name:** ______________________
- **Owner:** So Sereysokbotra
- **Deadline:** day 1, before Gate 2

Everything else in Phase 0 is closed. This is the only item still open, and Gate 2 does not pass without it.

---

# Phase 1 — Foundation

**Duration:** day 1 PM.
**Goal:** a repo that runs with one command, deploys to a live HTTPS URL, has the complete token system in place, and renders Khmer correctly on a real phone. **No features.**

### 1.1 Scaffold

```bash
npm create vite@latest prayat -- --template react-ts
cd prayat
npm install react-router-dom zustand lucide-react
npm install -D tailwindcss@^3 postcss autoprefixer concurrently tsx
npx tailwindcss init -p
```

Pin Tailwind at `^3` in `package.json`. A fresh `npm install` on day 4 must not silently pull v4.

### 1.2 Repository structure

```
prayat/
├── package.json
├── vite.config.ts              ← dev proxy to :3001
├── tailwind.config.ts          ← maps tokens, defines nothing itself
├── tsconfig.json
├── tsconfig.server.json
│
├── public/
│   └── fonts/
│       └── NotoSansKhmer-Regular.woff2   ← self-hosted, §1.5
│
├── shared/
│   └── types.ts                ← Phase 2, imported by BOTH sides
│
├── content/
│   └── shop-payment-scam.json  ← Phase 2
│
├── server/                     ← Phase 4
│   ├── index.ts
│   ├── db.ts
│   ├── routes/
│   ├── lib/{scoring.ts,strip.ts}
│   └── openapi.json
│
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles/
    │   └── global.css          ← THE ONLY FILE WITH RAW VALUES
    ├── fixtures/
    │   └── scenario.ts         ← Phase 2
    ├── pages/
    │   ├── Home.tsx
    │   ├── Guardian.tsx
    │   ├── Consequence.tsx
    │   ├── Debrief.tsx
    │   └── ComingSoon.tsx
    ├── components/
    │   ├── ChatBubble.tsx
    │   ├── ChatWindow.tsx
    │   ├── TypingIndicator.tsx
    │   ├── OptionButton.tsx
    │   ├── LanguageToggle.tsx
    │   ├── RedFlagCard.tsx
    │   ├── ScoreDisplay.tsx
    │   └── ThemeToggle.tsx     ← DEV ONLY, removed in Phase 7
    ├── hooks/
    │   └── useMotionToken.ts   ← reads timing tokens from CSS
    ├── store/gameStore.ts
    └── api/client.ts           ← Phase 5
```

> **Filename note:** the frontend brief says `src/styles/global.css`. Implementation Plan v3.1 said `index.css`. **`global.css` wins** — it is the newer instruction and the entire token rule is written against that name.

`package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"npm:dev:*\"",
    "dev:client": "vite",
    "dev:server": "tsx watch server/index.ts",
    "build": "vite build && tsc -p tsconfig.server.json",
    "start": "node dist-server/index.js"
  }
}
```

### 1.3 The token system — `src/styles/global.css`

This is the contract that makes the whole UI restylable from one file. **Full token file is in Appendix A.** Build it now, complete, before any component exists. A component written before the tokens exist will contain hardcoded values, and you will not find them all later.

**The hard rules:**

1. No hex, no `rgb()`, no Tailwind palette classes (`bg-slate-900`, `text-red-500`, `border-gray-200`) anywhere in `src/` outside `global.css`.
2. No hardcoded spacing, radius, font size, or animation duration in components.
3. If a value has no token, **add the token first**, then use it. Never inline "just this once."
4. Motion values are read in TS via `getComputedStyle`, never duplicated as JS numbers.

**Enforcement — add this now, not later:**

```json
// package.json scripts
"lint:tokens": "! grep -rEn '#[0-9a-fA-F]{6}|rgb\\(|bg-(slate|gray|red|green|amber|blue|zinc|neutral)-[0-9]' src/ --include='*.tsx' --include='*.ts'"
```

Five seconds to run. Run it at every gate from here on. If it prints anything, the gate fails.

### 1.4 `tailwind.config.ts` — maps tokens, defines nothing

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:              'rgb(var(--color-bg) / <alpha-value>)',
        surface:         'rgb(var(--color-surface) / <alpha-value>)',
        'surface-alt':   'rgb(var(--color-surface-alt) / <alpha-value>)',
        text:            'rgb(var(--color-text) / <alpha-value>)',
        muted:           'rgb(var(--color-text-muted) / <alpha-value>)',
        border:          'rgb(var(--color-border) / <alpha-value>)',
        primary:         'rgb(var(--color-primary) / <alpha-value>)',
        'primary-text':  'rgb(var(--color-primary-text) / <alpha-value>)',
        danger:          'rgb(var(--color-danger) / <alpha-value>)',
        safe:            'rgb(var(--color-safe) / <alpha-value>)',
        caution:         'rgb(var(--color-caution) / <alpha-value>)',
        'bubble-scammer':'rgb(var(--color-bubble-scammer) / <alpha-value>)',
        'bubble-auntie': 'rgb(var(--color-bubble-auntie) / <alpha-value>)',
        'bubble-player': 'rgb(var(--color-bubble-player) / <alpha-value>)',
        'zone-threat':   'rgb(var(--color-zone-threat) / <alpha-value>)',
      },
      borderRadius: {
        card:   'var(--radius-card)',
        bubble: 'var(--radius-bubble)',
        button: 'var(--radius-button)',
      },
      fontFamily: {
        kh: ['var(--font-kh)'],
        en: ['var(--font-en)'],
      },
      fontSize: {
        title: 'var(--text-title)',
        body:  'var(--text-body)',
        small: 'var(--text-small)',
        rule:  'var(--text-rule)',
      },
      lineHeight: {
        kh: 'var(--leading-kh)',
        en: 'var(--leading-en)',
      },
      spacing: {
        'screen-x': 'var(--space-screen-x)',
        section:    'var(--space-section)',
        stack:      'var(--space-stack)',
        tap:        'var(--space-tap)',
      },
    },
  },
  plugins: [],
} satisfies Config
```

The channel-only colour format is what keeps `bg-surface/50` working. ⚪ VERIFY with one throwaway div in Phase 1 — if opacity modifiers are broken you want to know now, not on day 4.

### 1.5 Khmer font — self-hosted

Download **Noto Sans Khmer** to `public/fonts/`. Load with `@font-face` in `global.css`. **Do not use a Google Fonts `@import`** — it blocks rendering, it is slow on mobile data, and a service worker cannot cache what CSS fetches before the worker registers on first load.

```css
@font-face {
  font-family: 'Noto Sans Khmer';
  src: url('/fonts/NotoSansKhmer-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

⚪ **VERIFY on a real mid-range Android phone over mobile data, not a desktop browser at 375px:**
- [ ] Khmer diacritics are not clipped — they stack above *and* below the baseline
- [ ] `--leading-kh: 2` is enough; raise it if not
- [ ] A long Khmer sentence in a button wraps to 3 lines without overflow
- [ ] The font loads with the network throttled

### 1.6 Deploy a skeleton

Before anyone builds on top of it. One Render Node service:
- Build: `npm run build` · Start: `npm start`
- Bind `process.env.PORT` — hardcoding 3001 fails in production
- Page says "Prayat", `/api/health` returns `{ok:true}`

HTTPS is required for PWA install, which is why this happens on day 1 and not day 5.

### 🚪 GATE 1
- [ ] `npm run dev` starts client and server with one command
- [ ] Live Render HTTPS URL loads the placeholder page
- [ ] `global.css` contains the complete token set from Appendix A
- [ ] `tailwind.config.ts` maps every token and defines no raw value
- [ ] `bg-surface/50` renders at 50% opacity
- [ ] `npm run lint:tokens` prints nothing
- [ ] Toggling `.theme-light` on `<html>` in devtools visibly flips the placeholder page
- [ ] Khmer verified on real hardware

---

# Phase 2 — Contract + content

**Duration:** day 2 AM.
**Goal:** the data shape is frozen and the scenario is written and reviewed. Everything downstream depends on this phase being finished, not nearly finished.

### 2.1 `shared/types.ts` — freeze it

```ts
export type Localized = { kh: string; en: string }

// ---------- Content (server-side, includes answers) ----------
export interface ScenarioFull {
  id: string
  title: Localized
  scamType: 'government' | 'job' | 'crypto' | 'romance' | 'malware'
  relative: { name: Localized; age: number; avatar: string }
  stages: StageFull[]
  debrief: Debrief
}

export interface StageFull {
  id: number                   // 1, 2, 3
  scammerMessages: Localized[] // top zone
  relativeMessage: Localized   // what Auntie says to the player
  options: OptionFull[]        // exactly 4
}

export interface OptionFull {
  id: 'a' | 'b' | 'c' | 'd'
  text: Localized
  isCorrect: boolean           // NEVER sent to the client
  reply: Localized             // her response to this choice
  note?: Localized             // why it was tempting — debrief only
}

export interface Debrief {
  scamName: Localized
  redFlags: Localized[]        // exactly 3
  rule: Localized
  realLifeAction: Localized
  outcomeWin: Localized
  outcomeLose: Localized
  consequence: Localized       // the three-days-later scene
}

// ---------- Wire format (what the client receives) ----------
export type Option = Omit<OptionFull, 'isCorrect' | 'reply' | 'note'>
export type Stage = Omit<StageFull, 'options'> & { options: Option[] }

export interface DecisionResult {
  isCorrect: boolean
  relativeReply: Localized
  nextStage: Stage | null      // null = scenario over
  done: boolean
}

export interface SessionSummary {
  sessionId: string
  scenarioId: string
  decisions: { stageId: number; optionId: string; isCorrect: boolean }[]
  score: number
  maxScore: number
  level: 'Aware' | 'Alert' | 'Defender' | 'Guardian' | 'Protector'
  won: boolean
  debrief: Debrief
}
```

`Debrief.consequence` carries the three-days-later message — page deleted, transfer irreversible, $200 gone, five other shopkeepers on the same street. It is the emotional payload of the failure path and the Consequence screen reads from it.

### 2.2 The content sprint — this does not get cut

`content/shop-payment-scam.json`, complete, in Khmer. **Decision 4:** Auntie Sothea, 54, small-shop owner, $200, shop-closure threat.

- 3 stages
- 12 options, **each authored to feel reasonable** — if the wrong answer is obviously stupid, no learning happens
- 12 replies, one per option
- Full debrief: scam name, exactly 3 red flags, one rule, real-life action, win outcome, lose outcome, consequence scene
- Option B brand policy (§0.1) applied consistently — channels named, branding never drawn

**Option design — keep these roles intact across all three stages:**

| Option | Role |
|---|---|
| A | The trap — sounds like caring reassurance, not stupidity |
| B | Sounds smart, hands the scammer a chance to send a fake link |
| C | Correct — requires knowing the specific rule about official channels |
| D | Reasonable but too slow while she is about to pay |

**Stage 3 needs a written option D** (decision sheet item 8). The source material only has three options at the pushback stage. Option D there is the one that sounds most caring and costs the most time — *"Let me come to the shop after work and we'll look at it together"* is the shape. It is reasonable. It is also two hours too late.

### 2.3 Reviewer session — ⚠️ blocks Gate 2

Hand the finished file to the outside reviewer from §0.2. One question: *"Would you believe this message?"*

### 2.4 `src/fixtures/scenario.ts`

The same content, typed as `ScenarioFull`, imported directly by components in Phase 3. Phase 5 deletes those imports in favour of `api/client.ts`. Because both conform to `shared/types.ts`, the swap is one line per call site.

### 🚪 GATE 2
- [ ] `shared/types.ts` compiles and is imported by at least one file on each side
- [ ] `shop-payment-scam.json` complete: 12 options, 12 replies, 3 red flags, consequence
- [ ] **An outside reviewer over 45 has read every scam message and answered the credibility question** ⚠️
- [ ] No English-first phrasing left in the Khmer
- [ ] No drawn branding anywhere in the content or assets
- [ ] Fixture file type-checks against `ScenarioFull`

---

# Phase 3 — UI on fixtures

**Duration:** day 2 PM through day 4 (or after Phase 4 on the solo path).
**Goal:** six screens, built with fixture data, no API calls.

**Build one at a time. Stop after each for review.** Six sub-gates below.

### Rules that apply to every screen in this phase

- Mobile first. Correct at **375 px** wide, **no horizontal scroll**, ever
- Minimum **44 px** tap targets — use `min-h-tap`
- Every screen has **loading, ready, and error** states. No screen is ever blank
- Any element that can contain Khmer uses `leading-kh`
- `npm run lint:tokens` passes before the sub-gate is called

### 3.1 Home

Logo, tagline, KH/EN toggle, Guardian Mode card (enabled), Speed Triage + The Investigation cards (locked, dimmed, "Coming soon"), cumulative score strip.

🚪 **Sub-gate:** locked cards are visibly locked but still legible; toggle swaps every string on screen; score strip reads from the store.

### 3.2 ComingSoon

Mode name, description, back button. Deliberately small — it exists so the locked cards go somewhere real.

🚪 **Sub-gate:** both locked cards route here with the correct mode name; back button returns to Home.

### 3.3 Chat components

`ChatBubble`, `ChatWindow`, `TypingIndicator`, `OptionButton`. Build these **before** Guardian — Guardian is an assembly of them, and building it first means building them badly.

- `ChatBubble` takes a `variant`: `scammer` | `auntie` | `player`, mapping to the three bubble tokens
- `ChatWindow` scrolls independently and auto-scrolls to newest
- `OptionButton` **grows to fit its content**, wraps to 2–3 lines, never clips. Write the longest real Khmer option first, then size the button to it
- `TypingIndicator` duration comes from `--timing-typing-min` via `useMotionToken`

🚪 **Sub-gate:** a scratch route renders all three bubble variants and a 3-line Khmer option button at 375 px without clipping.

### 3.4 Guardian

Three vertical zones:

| Zone | Height | Behaviour |
|---|---|---|
| Scammer → Auntie | ~30% | Threat-tinted (`bg-zone-threat`), **read-only** — the player cannot intervene |
| You ↔ Auntie | ~40% | The player's conversation |
| Options | ~30% | Four buttons |

Both chat zones scroll independently and auto-scroll to newest.

> **Deck note:** the pitch deck mocks this as a **left/right** dual window. The build is **vertically stacked** because it is mobile-first. Redraw the deck mockup to match what ships — a judge who sees the phone and then the slide will notice.

**Flow:**
```
mount
  → loading state
  → render scammer messages, staggered --timing-scammer-stagger apart
  → typing indicator, --timing-typing-min
  → render Auntie's message
  → fade in four options at --timing-option-fade
tap an option
  → DISABLE ALL BUTTONS IMMEDIATELY   ← double-tap is your most likely demo bug
  → render the choice as a player bubble
  → typing indicator
  → render the reply
  → next stage, or → Consequence / Debrief
```

The typing indicator is doing real work: it covers latency and makes the conversation feel like a conversation. Keep it even when the fixture responds instantly.

🚪 **Sub-gate:** full 3-stage playthrough on fixtures; double-tap submits once; both zones scroll independently; no horizontal scroll at 375 px.

### 3.5 Consequence

Single full-screen outcome message, held for `--timing-consequence`, then on to Debrief. Reads `debrief.consequence`. Failure path only.

🚪 **Sub-gate:** readable at 375 px; timing driven by the token, not a JS constant.

### 3.6 Debrief

Outcome banner, scam name, three red flag cards, **the rule as the heaviest element on screen** (`text-rule`), real-life action, score, share button, play again, back to home.

The share button is prominent because it earns its place twice — it is also the distribution channel.

🚪 **Sub-gate:** win and lose variants both render; the rule is unmistakably the visual anchor; share button is at least 44 px.

### 3.7 Theming proof

`.theme-light` on `<html>` overrides the same tokens with a light palette. **Zero component changes.** A dev-only `ThemeToggle` button makes this checkable.

**Removing it later:** it is a single component, mounted once in `App.tsx`. Delete `src/components/ThemeToggle.tsx` and its one import + one JSX line in `App.tsx`. Nothing else references it. Do this in Phase 7, not before — you want it during Phase 6 polish.

### 🚪 GATE 3
- [ ] All six screens built and individually reviewed
- [ ] `npm run lint:tokens` prints nothing
- [ ] Toggling `.theme-light` flips all six screens correctly, no component edited
- [ ] Every screen has loading, ready and error states
- [ ] No horizontal scroll on any screen at 375 px
- [ ] Khmer diacritics unclipped on the longest option button, **on a real phone**
- [ ] Token → UI map written (Appendix B)

---

# Phase 4 — Backend

**Duration:** days 3–4 (or immediately after Phase 2 on the solo path).
**Goal:** every endpoint working and testable in Postman, before any UI touches it.

### 4.1 Database — three tables, seeded from `content/` on every boot

```sql
CREATE TABLE scenarios (
  id TEXT PRIMARY KEY, title_kh TEXT NOT NULL, title_en TEXT NOT NULL,
  scam_type TEXT NOT NULL, payload TEXT NOT NULL
);
CREATE TABLE sessions (
  id TEXT PRIMARY KEY, scenario_id TEXT NOT NULL REFERENCES scenarios(id),
  language TEXT NOT NULL, started_at INTEGER NOT NULL, finished_at INTEGER,
  score INTEGER NOT NULL DEFAULT 0, won INTEGER
);
CREATE TABLE decisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL REFERENCES sessions(id),
  stage_id INTEGER NOT NULL, option_id TEXT NOT NULL,
  is_correct INTEGER NOT NULL, decided_at INTEGER NOT NULL,
  UNIQUE (session_id, stage_id)
);
```

`UNIQUE (session_id, stage_id)` enforces one answer per stage at the **database** level, not just in application code. That is your second line of defence against the double-tap bug.

### 4.2 `server/lib/strip.ts` — the single most important file

One function, `StageFull → Stage`, removing `isCorrect`, `reply`, `note`. **Every response path goes through it.** One function means one place to get it wrong and one place to check.

### 4.3 Endpoints

| Endpoint | Returns | Notes |
|---|---|---|
| `GET /api/health` | `{status, uptime, scenariosLoaded}` | Wake the service before you present |
| `GET /api/scenarios` | Catalogue | No stages, no answers |
| `GET /api/scenarios/:id` | Metadata + **stage 1 only**, stripped | Later stages never sent until earned |
| `POST /api/sessions` | `{sessionId, scenario, stage}` | |
| `POST /api/sessions/:id/decisions` | `DecisionResult` | **409** on out-of-order or repeat |
| `GET /api/sessions/:id/debrief` | `SessionSummary` | **409** if unfinished |
| `GET /api/sessions/:id` | Full record | For the judge who asks if anything is stored |
| `GET /api/docs` | Swagger UI | Phase 6 |

### 4.4 Scoring — `server/lib/scoring.ts`, one place

**Decision 3, locked:**
- **100 points per correct decision, 0 per wrong, max 300**
- **Won = the final decision is correct.** A player can stumble at stage 1 and recover — that mirrors real life, where the last word before the money moves is the one that matters
- Level: `0–99 Aware · 100–199 Alert · 200–299 Defender · 300–499 Guardian · 500+ Protector`

If a judge asks what the score means in the full product: it becomes a 0–1000 Scam Resistance Score broken down by scam category, and that breakdown is what the parent dashboard reads.

### 🚪 GATE 4
- [ ] Full playthrough completable in Postman with **no UI at all**
- [ ] `isCorrect` appears nowhere in any response before a decision is submitted — verified by reading the **raw** network response
- [ ] Same stage twice → 409
- [ ] Stages out of order → 409
- [ ] Debrief mid-scenario → 409
- [ ] Service restarts cleanly and re-seeds

---

# Phase 5 — Integration

**Duration:** day 5 AM.
**Goal:** replace fixtures with the live API. Should be small, because Phase 2 froze the contract.

- `src/api/client.ts` holds **every** fetch call. No component calls `fetch` directly
- Delete `src/fixtures/scenario.ts` imports one call site at a time
- Express serves the SPA:

```ts
app.use('/api', apiRouter)
app.use(express.static('dist'))
app.get('*', (_req, res) => res.sendFile(path.resolve('dist/index.html')))
```

That last line stops `/guardian` from 404-ing when a judge refreshes or scans a QR pointing at a sub-route. **Register it after the API router** or it swallows your endpoints.

### 🚪 GATE 5
- [ ] Full playthrough against the live Render URL
- [ ] Correct path → win debrief; wrong path → consequence → lose debrief
- [ ] Refreshing on `/guardian` does not 404
- [ ] Network failure mid-game shows a readable error state, not a white screen
- [ ] No component imports the fixture file any more

---

# Phase 6 — PWA + API docs

**Duration:** day 5 PM.

- `vite-plugin-pwa` — service worker + manifest from one config block
- App shell loads offline; a playthrough still needs the network, and that is fine
- `swagger-ui-express` + static `openapi.json` at `/api/docs`, every endpoint executable from the page

The docs page is the judge-facing surface and the 2:00 mark of the demo. It is not polish.

### 🚪 GATE 6
- [ ] Installs as a PWA on a real Android phone
- [ ] App shell loads with the network **off**
- [ ] `/api/docs` loads and every endpoint executes from the page
- [ ] Khmer font still renders after install — it is self-hosted, so it should be cached ⚪ VERIFY

---

# Phase 7 — Harden + demo

**Duration:** days 6–7.

### 7.1 Day 6 — bug bash and 10 real users

Test on every available device, over the demo hotspot. Then **watch 10 people play** and write down where they hesitate.

> This is the *last* thing to cut, not the first.

### 7.2 Cleanup

- Remove `ThemeToggle` (§3.7) — one file, one import, one JSX line
- Final `npm run lint:tokens`
- Final proofread of all Khmer
- Grep the whole repo for "ScamSim" — the old name should appear nowhere

### 7.3 Render's sleeping problem

Free tier sleeps and cold-starts in ~30 seconds. That is a disaster if it happens when a judge scans your QR code.

1. Hit `/api/health` from your phone right before you present
2. UptimeRobot (free) pinging `/api/health` every 5 minutes, **starting the day before**
3. If you have a few dollars, one month of the lowest paid tier removes the single most embarrassing failure mode in this plan

### 7.4 Demo script — 2.5 minutes

```
0:00  PWA already installed, on the team hotspot. Open it.
      "This is Prayat. Three modes. Today, Guardian Mode."
0:15  Tap Guardian. Read the scammer's message aloud, in Khmer.
      "Auntie Sothea's shop closes tomorrow unless she pays $200.
       She's asking me what to do."
0:45  "Four options." Read option B aloud.
      "This sounds like the careful answer — ask him for the official
       website. It's the worst one. It invites a fake link."
1:10  Tap C. She pushes back: "But he has my shop registration number."
      "Spotting the scam is easy. Holding your position when someone
       you love argues back is the skill."
1:40  Through to the debrief.
      "Three red flags. One rule. A share button into the family chat."
2:00  "One more thing." Open /api/docs on the phone.
      "This isn't a mockup. The answer key never reaches the browser —
       the server decides. You can test the API yourself."
2:20  Stop talking.
```

Rehearse until it lands at 2:30 with no rush. **Record a screen capture as backup** and be willing to pitch over the video if the network fails.

### 🚪 GATE 7
- [ ] Runs on the actual demo phone, over the team hotspot
- [ ] Both QR codes tested from a phone that has never opened the site
- [ ] Backup video recorded
- [ ] UptimeRobot pinging since the day before
- [ ] Dev theme toggle removed
- [ ] No "ScamSim" left anywhere in the repo, the deck, or the demo script
- [ ] Script rehearsed to 2.5 minutes

---

# Appendix A — `src/styles/global.css`

The complete token file. **This is the only file in `src/` allowed to contain a raw value.**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: 'Noto Sans Khmer';
  src: url('/fonts/NotoSansKhmer-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

:root {
  /* ---- colour — channels only, no rgb() wrapper ---- */
  --color-bg:            15 23 42;
  --color-surface:       30 41 59;
  --color-surface-alt:   51 65 85;
  --color-text:          241 245 249;
  --color-text-muted:    148 163 184;
  --color-border:        51 65 85;

  --color-primary:       56 130 246;   /* ← see note 1 */
  --color-primary-text:  255 255 255;  /* ← see note 2 */
  --color-danger:        220 38 38;
  --color-safe:          22 163 74;
  --color-caution:       245 158 11;

  /* ---- chat-specific ---- */
  --color-bubble-scammer:  69 26 26;
  --color-bubble-auntie:   51 65 85;
  --color-bubble-player:   30 58 95;
  --color-zone-threat:     45 22 22;

  /* ---- radius ---- */
  --radius-card:    0.75rem;
  --radius-bubble:  1.25rem;
  --radius-button:  0.75rem;

  /* ---- spacing ---- */
  --space-screen-x: 1rem;
  --space-section:  1.5rem;
  --space-stack:    0.75rem;
  --space-tap:      2.75rem;   /* 44px minimum tap target */

  /* ---- type ---- */
  --font-kh: 'Noto Sans Khmer', sans-serif;
  --font-en: 'Inter', sans-serif;
  --text-title:  1.5rem;
  --text-body:   1rem;
  --text-small:  0.875rem;
  --text-rule:   1.25rem;      /* the debrief rule — heaviest element */
  --leading-kh:  2;            /* Khmer diacritics clip at normal line-height */
  --leading-en:  1.5;

  /* ---- Guardian zone heights ---- */
  --zone-threat-h:  30%;
  --zone-chat-h:    40%;
  --zone-options-h: 30%;

  /* ---- motion — these control the feel of the chat ---- */
  --timing-scammer-stagger: 600ms;
  --timing-typing-min:      1500ms;
  --timing-option-fade:     150ms;
  --timing-consequence:     2500ms;
  --timing-route:           200ms;
}

.theme-light {
  --color-bg:            248 250 252;
  --color-surface:       255 255 255;
  --color-surface-alt:   241 245 249;
  --color-text:          15 23 42;
  --color-text-muted:    100 116 139;
  --color-border:        226 232 240;

  --color-primary:       37 99 235;
  --color-primary-text:  255 255 255;
  --color-danger:        185 28 28;
  --color-safe:          21 128 61;
  --color-caution:       180 83 9;

  --color-bubble-scammer:  254 226 226;
  --color-bubble-auntie:   241 245 249;
  --color-bubble-player:   219 234 254;
  --color-zone-threat:     254 242 242;
}

body {
  background-color: rgb(var(--color-bg));
  color: rgb(var(--color-text));
  font-family: var(--font-en);
}
```

**Note 1 — `--color-primary` changed.** The brief set it to `15 23 42`, identical to `--color-bg`. A primary button would be invisible against the page. Changed to a blue; retune to the Prayat brand colour when there is one. It is one line.

**Note 2 — `--color-primary-text` added.** Text on a primary button cannot use `--color-text`, because that token flips in light theme while the primary button stays dark. Without this token the button label disappears in one of the two themes.

**Also added beyond the brief:** `--space-tap` (the 44 px rule needs a token), `--text-rule` (the debrief rule is specified as the heaviest element and had no size token), zone-height tokens (the 30/40/30 split is a tuning value), `--timing-route`.

### Reading motion tokens in TypeScript

Never duplicate these numbers in JS.

```ts
// src/hooks/useMotionToken.ts
export function motionToken(name: string): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  return parseFloat(raw) * (raw.endsWith('ms') ? 1 : 1000)
}
// usage: await sleep(motionToken('--timing-typing-min'))
```

---

# Appendix B — Token → UI map

**Deliverable at Gate 3.** Fill the right column as screens are built, so tokens can be tuned without reading component code.

| Token | Controls |
|---|---|
| `--color-bg` | Page background, every screen |
| `--color-surface` | Home mode cards, red flag cards, debrief panels |
| `--color-surface-alt` | Locked mode cards, option button resting state |
| `--color-text` | All primary text |
| `--color-text-muted` | Taglines, "Coming soon" labels, timestamps, score caption |
| `--color-border` | Card outlines, zone dividers, option button borders |
| `--color-primary` | Primary CTA — "Play again", share button |
| `--color-primary-text` | Label on primary buttons |
| `--color-danger` | Lose outcome banner, red flag card accent |
| `--color-safe` | Win outcome banner, correct-choice highlight |
| `--color-caution` | The "almost right" option highlight, deadline emphasis |
| `--color-bubble-scammer` | Scammer bubbles, top Guardian zone |
| `--color-bubble-auntie` | Auntie's bubbles, both zones |
| `--color-bubble-player` | The player's own bubbles |
| `--color-zone-threat` | Background tint of the read-only top zone |
| `--radius-card` | Mode cards, red flag cards |
| `--radius-bubble` | Every chat bubble |
| `--radius-button` | Option buttons, CTAs |
| `--space-screen-x` | Left/right page padding |
| `--space-section` | Gap between major blocks |
| `--space-stack` | Gap between bubbles, between options |
| `--space-tap` | Minimum height of every interactive element |
| `--text-title` | Screen headers, scam name in debrief |
| `--text-body` | Chat messages, option text |
| `--text-small` | Captions, locked labels |
| `--text-rule` | The one rule on the debrief — the anchor |
| `--leading-kh` | Line-height of every element that can hold Khmer |
| `--leading-en` | English-only elements |
| `--zone-*-h` | Guardian's 30/40/30 split |
| `--timing-scammer-stagger` | Delay between scammer messages appearing |
| `--timing-typing-min` | How long the typing indicator holds |
| `--timing-option-fade` | Option button fade-in |
| `--timing-consequence` | How long the Consequence screen holds |

---

# Appendix C — Conflicts resolved

The source documents disagreed. Recorded so nobody reopens them mid-build.

| Conflict | Resolution |
|---|---|
| Real brands (game design doc) vs fictional (v3.1 D2) | **Option B** — channels named, branding never drawn (§0.1) |
| 4 stages / 3 options (design doc) vs 3 stages / 4 options (v3.1) | **3 × 4** — decision 2; the missing stage-3 option D is written in Phase 2 |
| Levels by category (design doc) vs by cumulative score (v3.1 §7) | **100/correct, max 300** — decision 3 |
| `index.css` (v3.1) vs `global.css` (token brief) | **`global.css`** — newer instruction, and the token rule is written against that name |
| Backend-first (v3.1) vs UI-on-fixtures (token brief) | **Both** — Phase 2 freezes the contract; parallel with 2+ devs, backend-first solo |
| Consequence screen (design doc) absent from v3.1 | **Restored** — `Debrief.consequence` plus its own screen in Phase 3.5 |
| Guardian as left/right (deck) vs vertical zones (token brief) | **Vertical** — mobile-first. Redraw the deck mockup to match |
| "AI-generated" (deck slides 9, 20) vs hand-authored (design doc, v3.1) | **Authored, then varied** — fix slide 9 *and* Appendix A, which repeats the claim |
| Writer and reviewer are the same person (decision sheet items 5, 6) | **⚠️ UNRESOLVED** — see §0.2. Blocks Gate 2 |

---

# Appendix D — Definition of done

**Tokens**
- [ ] `grep -rE '#[0-9a-fA-F]{6}' src/` hits **only** `global.css`
- [ ] No Tailwind palette class anywhere in `src/`
- [ ] No hardcoded duration in any `.ts`/`.tsx`
- [ ] `.theme-light` flips the entire app with zero component changes
- [ ] Token → UI map delivered

**Frontend**
- [ ] Win path and lose path both complete
- [ ] KH/EN toggle works on every screen, mid-game included
- [ ] Double-tapping an option does not submit twice
- [ ] Refreshing `/guardian` does not 404
- [ ] Khmer diacritics unclipped on the longest option button, on a real phone
- [ ] Installs as a PWA; app shell loads with the network off
- [ ] Network failure shows a readable message, not a white screen
- [ ] No horizontal scroll at 375 px on any screen
- [ ] Every interactive element ≥ 44 px

**Backend**
- [ ] `/api/health` ok on the live Render URL
- [ ] Full playthrough in Postman, no UI
- [ ] `isCorrect` never leaks pre-decision — verified in raw devtools output
- [ ] 409 on repeat, out-of-order, and premature debrief
- [ ] `/api/docs` loads, every endpoint executes
- [ ] Restarts cleanly and re-seeds

**Content**
- [ ] Channels named, branding never drawn (§0.1)
- [ ] An outside reviewer over 45 has answered "would you believe this?"
- [ ] No English-first phrasing in the Khmer

**Demo**
- [ ] Runs on the demo phone over the team hotspot
- [ ] Both QR codes tested from a phone that has never opened the site
- [ ] Backup video recorded
- [ ] UptimeRobot running since the day before
- [ ] Dev theme toggle removed
- [ ] Nothing anywhere still says "ScamSim"

---

*Prayat — phased build plan v2.0 · decisions locked 14 September 2026*
