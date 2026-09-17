# Token → UI map

**Every visual value in the app is a token in [`src/styles/global.css`](src/styles/global.css).**
That file is the only one in `src/` allowed to contain a raw value. Edit it and the whole
app restyles — no component changes, no rebuild of anything but CSS.

```bash
npm run lint:tokens     # fails if any hardcoded value leaks into src/
```

It catches hex codes, `rgb()`, Tailwind palette classes (`bg-slate-900`, `text-red-500`),
arbitrary values (`w-[137px]`), and hardcoded durations in `.ts`/`.tsx`.

---

## Colour

Stored as **space-separated RGB channels**, not hex, so Tailwind opacity modifiers keep
working — `bg-surface/50` resolves correctly. Never wrap them in `rgb()` in the token file.

| Token | Controls |
|---|---|
| `--color-bg` | Page background on every screen |
| `--color-surface` | Mode cards, red flag cards, debrief panels, option buttons at rest |
| `--color-surface-alt` | Locked mode cards, option letter badges, progress track, hover state |
| `--color-text` | All primary text |
| `--color-text-muted` | Tagline, section headings, "Coming soon", zone labels, score caption |
| `--color-border` | Card outlines, zone dividers, option button borders, header rule |
| `--color-primary` | Guardian card border, active language pill, share button, primary CTAs |
| `--color-primary-text` | Label on anything `--color-primary` — and on `safe`/`danger`/`caution` fills |
| `--color-danger` | Lose outcome banner, red flag icon |
| `--color-safe` | Win outcome banner, score progress bar |
| `--color-caution` | The one-rule border on the debrief, placeholder-content warning |

### Chat

| Token | Controls |
|---|---|
| `--color-bubble-scammer` | Scammer messages, both typing indicators in the threat zone |
| `--color-bubble-relative` | The relative's (Uncle Chan's) messages, his typing indicator |
| `--color-bubble-player` | The player's own messages |
| `--color-zone-threat` | Background of the read-only threat zone, and the Consequence screen |

> **`--color-primary` is not `--color-bg`.** The original brief set both to `15 23 42`,
> which made primary buttons invisible against the page. `--color-primary-text` was added
> for the same reason: `--color-text` flips with the theme while a primary button does not,
> so a label using it disappears in one theme.

---

## Shape and spacing

| Token | Controls |
|---|---|
| `--radius-card` | Mode cards, red flag cards, debrief panels, icon tiles |
| `--radius-bubble` | Every chat bubble, and the typing dots |
| `--radius-button` | Option buttons, CTAs, language pills, progress bar |
| `--space-screen-x` | Left/right page padding |
| `--space-section` | Gap between major blocks, padding inside the one-rule panel |
| `--space-stack` | Gap between bubbles, between options, most internal padding |
| `--space-tap` | **44px floor on every interactive element.** Applied via `.tap-target` |
| `--space-icon` | Icon box — use `h-icon w-icon`, never a lucide `size={}` prop |
| `--space-bar` | Score strip bar thickness |

---

## Elevation

| Token | Controls |
|---|---|
| `--shadow-card` | Welcome cards — a barely-there lift off the sheet |
| `--shadow-cta` | The primary button, tinted with `--color-primary` |

Built from the colour tokens (`rgb(var(--color-text) / …)`), so they follow the theme.

---

## Brand mark

| Token | Controls |
|---|---|
| `--size-logo` | The logo in the banner lockup (`BrandMark`) |

The source image is [`public/logo.png`](public/logo.png). `node scripts/make-icons.mjs`
regenerates the favicon and PWA icons from it — re-run it after changing the logo. The
icon tiles crop the transparent margin off first, so the mark fills them; the banner keeps
the margin, which is what gives the lockup its air.

---

## Type

| Token | Controls |
|---|---|
| `--font-kh` | Khmer. Self-hosted variable woff2, Khmer unicode-range only |
| `--font-en` | English |
| `--text-display` | The Prayat wordmark — largest type in the app |
| `--text-title` | Screen headings, mode names, scam name, score figures |
| `--text-body` | Chat messages, option text, blurbs |
| `--text-small` | Section headings, captions, zone labels, meta lines |
| `--text-rule` | **The one rule on the debrief, and the Consequence message.** The heaviest thing on either screen |
| `--leading-kh` | Line-height for anything that can hold Khmer |
| `--leading-en` | Line-height for English |

> **Khmer line-height is not cosmetic.** Khmer glyphs stack above *and* below the baseline;
> at a normal line-height the diacritics clip. `--leading-kh` is applied through `:lang(km)`,
> which is why `<html lang>` tracks the selected language — see
> [`useDocumentLanguage.ts`](src/hooks/useDocumentLanguage.ts). Khmer shown while the UI is in
> English opts back in with `.font-kh`.

---

## Layout — Guardian's three zones

| Token | Controls |
|---|---|
| `--zone-threat-h` | Scammer ↔ Uncle, read-only |
| `--zone-chat-h` | You ↔ Uncle |
| `--zone-options-h` | The four replies |
| `--size-bubble-max` | How wide a bubble may get. The gutter is what makes it read as a conversation |
| `--size-chat-pane` | Pane height when no parent constrains it (dev gallery) |
| `--size-dot` | Typing indicator dot |

These are `flex-basis`, not `height`: a percentage height needs a definite parent, while a
percentage basis resolves against the flex container's main size. They are measured against
the box *below* the header, so they total 100% without overflowing.

> **Tuning note.** At 30/40/30 with long Khmer options, only two of the four options are
> visible and the player scrolls for C and D. Once the real scenario is written and the true
> option length is known, something like **25/35/40** would show all four at once. Three lines
> in `global.css`, no component changes.

---

## Motion

Read in TypeScript with `motionToken()`, never duplicated as a JS number:

```ts
import { motionToken, sleep } from './hooks/useMotionToken'
await sleep(motionToken('--timing-typing-min'))
```

| Token | Controls |
|---|---|
| `--timing-scammer-stagger` | Delay between scammer messages appearing |
| `--timing-typing-min` | How long the typing indicator holds — also the beat between stages |
| `--timing-option-fade` | Option button and colour transitions |
| `--timing-consequence` | How long the Consequence screen holds before the debrief |
| `--timing-route` | Progress bar and route transitions |
| `--timing-typing-dot` | One bounce cycle of a typing dot |
| `--timing-bubble-in` | A bubble arriving |

Animations are keyframes in `global.css` driven by these tokens, so the feel of the chat is
tunable from the token file. `prefers-reduced-motion: reduce` disables them.

---

## Theming

`.theme-light` on `<html>` overrides the same tokens. **No component knows it exists.**

Verified across all six screens in both themes: zero overflow, zero tap targets under 44px,
zero console errors.

The dev toggle (bottom-right) is **temporary**. To remove it in Phase 7: delete
`src/components/ThemeToggle.tsx`, its import, and its one `<ThemeToggle />` line in
`src/App.tsx`. Nothing else references it. The dev component gallery at `/dev/components`
goes the same way — delete `src/pages/DevComponents.tsx`, its import, and its `<Route>`.
