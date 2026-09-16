# ScamSim — The Investigation
### Simplified App Flow | 3 Screens Only

---

## Screen Count Overview

```
Current version:  10 screens
Simplified:        3 screens

How to Play      → removed (first-time tooltip overlay instead)
Case Briefing    → merged into Case Select card
Submit Dialog    → removed (submit button inline on game screen)
Results Screen   → merged into Debrief Screen (scrollable)
```

---

## Flow Summary

```
Home Screen
     │
     ▼
Screen 1: Case Select
     │
     Tap [OPEN CASE]
     │
     ▼
Screen 2: Game Screen
     │
     Tap [SUBMIT FINDINGS]
     │
     ▼
Screen 3: Result + Debrief (combined, scrollable)
     │
     ├── [TRY AGAIN]  → Screen 2 (same case)
     ├── [NEXT CASE]  → Screen 1 (next case selected)
     └── [HOME]       → Home Screen
```

---

## Screen 1 — Case Select

```
┌─────────────────────────────────┐
│  ← Back    The Investigation    │
│                                 │
│  Cases solved: 0  Accuracy: 0%  │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │  📁 Case #001             │  │
│  │  The Fake Job Recruiter   │  │
│  │                           │  │
│  │  Platform: Telegram       │  │
│  │  Messages: 12             │  │
│  │  Red flags to find: 4     │  │
│  │  Time limit: 2 minutes    │  │
│  │  Difficulty: ●●○○○        │  │
│  │                           │  │
│  │  Sokha received a job     │  │
│  │  offer on Telegram paying │  │
│  │  $700/month to type       │  │
│  │  reviews from home. Find  │  │
│  │  every red flag before    │  │
│  │  time runs out.           │  │
│  │                           │  │
│  │  Status: Unsolved         │  │
│  │  [OPEN CASE →]            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📁 Case #002             │  │
│  │  The Crypto Trading Group │  │
│  │  Red flags: 6  ●●●○○      │  │
│  │  🔒 Solve Case #001 first │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📁 Case #003             │  │
│  │  The Romance Setup        │  │
│  │  Red flags: 8  ●●●●○      │  │
│  │  🔒 Locked                │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📁 Case #004             │  │
│  │  The Fake Tech Support    │  │
│  │  Red flags: 5  ●●●●●      │  │
│  │  🔒 Locked                │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘

Notes:
→ Case summary + briefing is shown directly
   inside the card. No separate briefing screen.
→ Locked cases show name + difficulty only.
   Summary hidden until unlocked.
→ Tap OPEN CASE → Screen 2 immediately.
→ First time only: a tooltip overlay appears
   on Screen 2 before the timer starts.
```

---

## Screen 2 — Game Screen

```
┌─────────────────────────────────┐
│  ← Exit    Case #001   🚩 0/4  │
│  [████████████████░░░] 1:45     │
│  ⚠️ turns yellow at 0:30        │
│  🔴 flashes red at 0:15         │
├─────────────────────────────────┤
│                                 │
│  [Recruiter bubble]             │
│  "Hello Sokha! We are looking   │
│   for people to write product   │
│   reviews from home. Earn       │
│   $700-900/month, flexible hrs" │
│  Mon 9:01 AM ✓✓            [🚩] │
│                                 │
│  [Sokha bubble]                 │
│  "That sounds interesting!      │
│   Tell me more."                │
│  Mon 9:15 AM ✓✓                 │
│                                 │
│  [Recruiter bubble]             │
│  "To get started you need to    │
│   pay a $50 registration fee    │
│   to activate your account.     │
│   This is refunded after your   │
│   first payment."               │
│  Mon 9:22 AM ✓✓            [🚩] │
│                                 │
│  [Recruiter bubble]             │
│  "Please download this form:    │
│   Application_Form.exe"         │
│  Mon 9:25 AM ✓✓            [🚩] │
│                                 │
│  [Recruiter bubble]             │
│  "We need your Wing number,     │
│   national ID front and back,   │
│   and home address."            │
│  Mon 9:30 AM ✓✓            [🚩] │
│                                 │
│  [Sokha bubble]                 │
│  "Should I send those here      │
│   on Telegram?"                 │
│  Mon 9:32 AM ✓                  │
│                                 │
│  [scroll for more...]           │
│                                 │
├─────────────────────────────────┤
│  🚩 Flagged: 2     [SUBMIT →]   │
└─────────────────────────────────┘

Notes:
→ Each message bubble has a [🚩] tap target
   on the right side.
→ Tap [🚩] once → flag appears, red left
   border on bubble, counter updates.
→ Tap again → flag removed.
→ No limit on how many messages can be flagged.
→ No feedback on correct/wrong until submit.
→ Timer bar drains across the top.
→ At timer = 0: auto-submits, goes to Screen 3.
→ Tap [SUBMIT →] anytime → goes to Screen 3.
   No confirmation dialog. Direct submit.

FIRST TIME ONLY — Tooltip overlay:
┌───────────────────────────────┐
│  How to play                  │
│                               │
│  Read the full conversation.  │
│  Tap the 🚩 on any message    │
│  that seems suspicious.       │
│  Submit before time runs out. │
│                               │
│  [GOT IT — START TIMER]       │
└───────────────────────────────┘
Timer does not start until
user taps GOT IT.
Only shows on very first case.
Never shown again after that.
```

---

## Screen 3 — Result + Debrief (Combined, Scrollable)

```
┌─────────────────────────────────┐
│  ← Back    Case #001 — Debrief  │
├─────────────────────────────────┤
│                                 │
│  ── RESULT ─────────────────    │
│                                 │
│  PATH A (all correct):          │
│  🏆 PERFECT                     │
│  All 4 flags found              │
│  No false alarms                │
│  Score: 400 + 52 time bonus     │
│  Total: 452 points              │
│                                 │
│  PATH B (some correct):         │
│  🔍 PARTIALLY SOLVED            │
│  Found: 2 of 4 flags            │
│  Missed: 2  False alarms: 1     │
│  Score: 150 points              │
│                                 │
│  PATH C (most missed):          │
│  ❌ UNSOLVED                    │
│  Found: 1 of 4 flags            │
│  Missed: 3                      │
│  Score: 50 points               │
│                                 │
├─────────────────────────────────┤
│                                 │
│  ── YOUR FLAGS vs REAL FLAGS ── │
│                                 │
│  ✅ Flag 1 — CORRECT            │
│  "Pay $50 registration fee"     │
│  Employers never ask you to     │
│  pay before you start work.     │
│  This is advance fee fraud.     │
│                                 │
│  ✅ Flag 2 — CORRECT            │
│  "Application_Form.exe"         │
│  A form is never a .exe file.   │
│  This installs malware.         │
│                                 │
│  ❌ Flag 3 — MISSED             │
│  "$700-900/month, no            │
│   experience needed"            │
│  Too high for zero-skill work.  │
│  Real typing jobs pay $3-5/hr.  │
│                                 │
│  ❌ Flag 4 — MISSED             │
│  "Send national ID front,       │
│   back, and home address"       │
│  No employer needs this before  │
│  you have signed a contract.    │
│  This is identity theft setup.  │
│                                 │
│  ⚠️ FALSE ALARM                 │
│  "200+ companies worldwide"     │
│  Vague claim — suspicious but   │
│  not a definitive red flag.     │
│  Look for concrete harm.        │
│                                 │
├─────────────────────────────────┤
│                                 │
│  ── ONE RULE TO REMEMBER ─────  │
│                                 │
│  Any job that asks you to PAY   │
│  before you EARN, download an   │
│  EXE file, or send your ID      │
│  before signing a contract —    │
│  is always a scam.              │
│                                 │
├─────────────────────────────────┤
│                                 │
│  [📤 Share]  [🔁 Try Again]     │
│  [📁 Next Case]  [🏠 Home]      │
│                                 │
└─────────────────────────────────┘

Notes:
→ Only one result state shows at top
   based on actual player performance.
→ All flags shown below regardless of
   path — player always sees the full
   debrief even if they failed.
→ Screen is scrollable. Result at top,
   debrief below, buttons at very bottom.
→ [Try Again] reloads Screen 2 same case.
→ [Next Case] goes to Screen 1, next case
   automatically highlighted.
→ [Share] opens native share sheet with
   debrief rule pre-filled as text.
```

---

## Before vs After

```
BEFORE (10 screens):            AFTER (3 screens):
────────────────────────────    ──────────────────────────────
1. Investigation Home Card  →   merged into Home Screen card
2. How to Play Screen       →   first-time tooltip on Screen 2
3. Case File Select         →   Screen 1 (briefing inside card)
4. Case Briefing Screen     →   removed (info in Screen 1 card)
5. Game Screen              →   Screen 2
6. Flag Interaction Detail  →   part of Screen 2 notes
7. Timer Warning States     →   part of Screen 2 timer bar
8. Submit Confirmation      →   removed (direct submit button)
9. Results Screen           →   top section of Screen 3
10. Debrief Screen          →   Screen 3 (scrolled below result)
```

---

*ScamSim — The Investigation | 3 screens, simplified flow*