# ScamSim — Speed Triage & The Investigation
### Complete App Flow When Unlocked

---

## PART 1 — SPEED TRIAGE

---

### Unlock Condition

```
Speed Triage unlocks when:
→ User completes Guardian Mode Scenario 1 (any result)
→ Home screen updates: lock icon removed from Speed Triage card
→ Toast notification: "⚡ Speed Triage is now unlocked!"
```

---

### 1.1 Speed Triage Home Card (Unlocked State)

```
┌─────────────────────────────────┐
│  ⚡ Speed Triage                │
│  Real or Scam in 5 seconds      │
│  Daily Best: 0                  │
│  High Score: 0                  │
│  Streak: 0 🔥                   │
│  [PLAY NOW]  [HOW TO PLAY]      │
└─────────────────────────────────┘
```

---

### 1.2 How to Play Screen

```
┌─────────────────────────────────┐
│  ← Back    How to Play          │
│                                 │
│  [Illustration: phone with      │
│   timer and two buttons]        │
│                                 │
│  Step 1                         │
│  A real message appears on      │
│  screen — SMS, Telegram,        │
│  Facebook, website URL, Wing    │
│  receipt, or QR code            │
│                                 │
│  Step 2                         │
│  You have 5 seconds to decide   │
│  [██████████] 5...4...3...      │
│                                 │
│  Step 3                         │
│  Tap your answer                │
│  ┌─────────┐    ┌─────────┐     │
│  │  REAL ✓ │    │ SCAM ✗  │     │
│  │ (green) │    │  (red)  │     │
│  └─────────┘    └─────────┘     │
│                                 │
│  Step 4                         │
│  See the explanation (2 sec)    │
│  then next card appears         │
│                                 │
│  Step 5                         │
│  3 wrong answers = Game Over    │
│  Beat your high score!          │
│                                 │
│  [GOT IT — LET'S PLAY →]        │
└─────────────────────────────────┘
```

---

### 1.3 Category Select Screen

```
┌─────────────────────────────────┐
│  ← Back    Speed Triage         │
│                                 │
│  Choose Card Pack               │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📱 Mixed Pack            │  │
│  │  All scam types           │  │
│  │  50 cards  Difficulty: ●●●│  │
│  │  [PLAY]                   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  🏛️ Government Messages   │  │
│  │  Fake ministry, police,   │  │
│  │  tax officials            │  │
│  │  15 cards  Difficulty: ●●○│  │
│  │  [PLAY]                   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  💼 Job Offers            │  │
│  │  Fake recruiters,         │  │
│  │  work-from-home scams     │  │
│  │  15 cards  Difficulty: ●●○│  │
│  │  [PLAY]                   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  🌐 Websites & URLs       │  │
│  │  Fake domains, login      │  │
│  │  pages, phishing links    │  │
│  │  15 cards  Difficulty: ●●●│  │
│  │  [PLAY]                   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📈 Investment & Crypto   │  │
│  │  Fake platforms,          │  │
│  │  profit screenshots       │  │
│  │  15 cards  Difficulty: ●●●│  │
│  └───────────────────────────┘  │
│                                 │
│  ⭐ Daily Challenge             │
│  ┌───────────────────────────┐  │
│  │  Today's 5 cards          │  │
│  │  New every morning        │  │
│  │  Bonus: +100 pts          │  │
│  │  [PLAY DAILY]             │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

Tapping any PLAY → Countdown Screen
Tapping PLAY DAILY → Countdown Screen (daily set)
```

---

### 1.4 Countdown Screen

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         Mixed Pack              │
│                                 │
│         Get Ready               │
│                                 │
│              3                  │
│                                 │
│         (1 second later)        │
│                                 │
│              2                  │
│                                 │
│         (1 second later)        │
│                                 │
│              1                  │
│                                 │
│         (1 second later)        │
│                                 │
│            GO!                  │
│                                 │
│  (auto-navigate to game)        │
│                                 │
└─────────────────────────────────┘
```

---

### 1.5 Game Screen — Card Active

```
┌─────────────────────────────────┐
│  Card 1/∞     Score: 0     ❤️❤️❤️ │
│  Streak: 0 🔥                   │
│                                 │
│  [████████████████████] 5 sec   │
│  Timer bar drains left to right │
│                                 │
├─────────────────────────────────┤
│                                 │
│  CARD TYPE: SMS Message         │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Messages                 │  │
│  │  ACLEDA Bank              │  │
│  │                           │  │
│  │  "Your ACLEDA account     │  │
│  │   has been locked due     │  │
│  │   to suspicious login.    │  │
│  │   Verify now:             │  │
│  │   acleda-security-kh.com" │  │
│  │                           │  │
│  │  Today 10:32 AM           │  │
│  └───────────────────────────┘  │
│                                 │
├─────────────────────────────────┤
│                                 │
│  ┌──────────┐  ┌──────────┐    │
│  │          │  │          │    │
│  │  ✓ REAL  │  │  ✗ SCAM  │    │
│  │          │  │          │    │
│  └──────────┘  └──────────┘    │
│                                 │
└─────────────────────────────────┘

CARD TYPES that can appear:
  - SMS message
  - Telegram chat screenshot
  - Facebook message screenshot
  - Website URL bar only
  - Wing / ABA payment receipt
  - QR code with label
  - Email preview
  - Facebook page profile

Timer behavior:
  - Starts at 5 seconds
  - Bar drains smoothly
  - At 0: auto-marked as WRONG
  - Short buzz vibration at 2 seconds remaining
```

---

### 1.6 Answer States

```
STATE A: User taps SCAM (correct answer)
─────────────────────────────────────────
┌─────────────────────────────────┐
│  Card 1     Score: 10    ❤️❤️❤️   │
│  Streak: 1 🔥                   │
│  [timer stops]                  │
│                                 │
│  [Card flashes GREEN border]    │
│                                 │
│  ✓ CORRECT                     │
│  +10 points                     │
│  Streak x1                      │
│                                 │
│  WHY IT'S A SCAM:               │
│  "ACLEDA's real domain is       │
│   acleda.com.kh — not           │
│   acleda-security-kh.com.       │
│   Banks never add extra words   │
│   after their brand name."      │
│                                 │
│  [2 second pause then next card]│
└─────────────────────────────────┘


STATE B: User taps REAL (wrong answer)
────────────────────────────────────────
┌─────────────────────────────────┐
│  Card 1     Score: 0   ❤️❤️💔   │
│  Streak: 0                      │
│  [timer stops]                  │
│                                 │
│  [Card flashes RED border]      │
│  [Phone vibrates]               │
│                                 │
│  ✗ WRONG — This was a SCAM     │
│  Lives remaining: 2             │
│                                 │
│  WHY IT'S A SCAM:               │
│  "ACLEDA's real domain is       │
│   acleda.com.kh — not           │
│   acleda-security-kh.com.       │
│   Always check the URL          │
│   character by character."      │
│                                 │
│  [3 second pause then next card]│
│  (longer pause on wrong — more  │
│   time to read explanation)     │
└─────────────────────────────────┘


STATE C: Timer runs out (wrong)
────────────────────────────────
┌─────────────────────────────────┐
│  Card 1     Score: 0   ❤️💔💔  │
│  [Buzz sound + vibration]       │
│                                 │
│  [Card flashes ORANGE border]   │
│                                 │
│  ⏱ TIME'S UP                   │
│  Lives remaining: 1             │
│                                 │
│  THE ANSWER WAS: SCAM           │
│                                 │
│  "The URL used the number       │
│   zero — 'faceb00k' — instead   │
│   of the letter O. Always read  │
│   URLs character by character." │
│                                 │
│  [3 second pause then next card]│
└─────────────────────────────────┘
```

---

### 1.7 Streak Milestones (Mid-Game)

```
After 5 correct in a row:
┌─────────────────────────────────┐
│         🔥 5 STREAK!            │
│       Score x1.5 from now       │
│    [banner fades after 1.5 sec] │
└─────────────────────────────────┘

After 10 correct in a row:
┌─────────────────────────────────┐
│        🔥🔥 10 STREAK!          │
│       Score x2.0 from now       │
│    [banner fades after 1.5 sec] │
└─────────────────────────────────┘

After 20 correct in a row:
┌─────────────────────────────────┐
│     🔥🔥🔥 UNSTOPPABLE! 20x     │
│       Score x3.0 from now       │
│    [confetti animation]         │
└─────────────────────────────────┘
```

---

### 1.8 Game Over Screen (3 Lives Lost)

```
┌─────────────────────────────────┐
│                                 │
│  💔 Game Over                   │
│                                 │
│  Cards Survived: 12             │
│  Score: 180                     │
│  Best Streak: 7 🔥              │
│                                 │
│  ──────────────────────────     │
│  Your High Score: 180  NEW! 🆕  │
│  Previous Best:   120           │
│  ──────────────────────────     │
│                                 │
│  You struggled with:            │
│  🔴 Website URLs (3 wrong)      │
│  🔴 Crypto screenshots (2 wrong)│
│  ✅ SMS messages (all correct)  │
│                                 │
│  Tip: Try "Websites & URLs"     │
│  pack to improve that skill     │
│                                 │
│  [🔁 PLAY AGAIN]                │
│  [📦 CHANGE PACK]               │
│  [🏠 HOME]                      │
│  [📤 SHARE SCORE]               │
└─────────────────────────────────┘

Share text:
"I survived 12 cards in ScamSim Speed Triage!
 Score: 180 — can you beat me?
 [app URL]"
```

---

### 1.9 Daily Challenge Completion

```
Triggered when user completes 5 daily cards

┌─────────────────────────────────┐
│  ⭐ Daily Challenge Complete!   │
│                                 │
│  [Confetti animation]           │
│                                 │
│  Today's Results:               │
│  Correct: 4/5                   │
│  Bonus Points: +100             │
│  Streak: 3 days 🔥              │
│                                 │
│  Come back tomorrow for         │
│  5 new cards                    │
│  [Next challenge in: 14:32:07]  │
│                                 │
│  [📤 SHARE RESULTS]             │
│  [🏠 HOME]                      │
└─────────────────────────────────┘
```

---

### 1.10 Speed Triage Full Flow Summary

```
Home Screen
    │
    ▼
Speed Triage Card [PLAY NOW]
    │
    ▼
Category Select Screen
    │
    ├── [PLAY DAILY] ──────────────────────┐
    │                                      │
    ├── [Mixed Pack]                       │
    ├── [Government Messages]              ▼
    ├── [Job Offers]              Countdown 3-2-1-GO
    ├── [Websites & URLs]                  │
    └── [Investment & Crypto]              ▼
                                  Card appears on screen
                                  (5 second timer starts)
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
                      Tap REAL       Tap SCAM        Timer = 0
                          │               │               │
                     Check answer    Check answer    Auto wrong
                          │               │               │
                   ┌──────┴──────┐ ┌──────┴──────┐       │
                  CORRECT       WRONG           WRONG     │
                   │             │               │        │
                +points     Lose 1 life     Lose 1 life  │
                Show why    Show why        Show why      │
                   │             │               │        │
                   └─────────────┴───────────────┘        │
                                 │                        │
                         Lives remaining?                  │
                          │          │                    │
                         YES         NO                   │
                          │          │                    │
                     Next card   Game Over Screen         │
                          │                               │
                          └───────────────────────────────┘
```

---
---

## PART 2 — THE INVESTIGATION

---

### Unlock Condition

```
The Investigation unlocks when:
→ User completes ALL Guardian Mode scenarios (all 4)
→ OR reaches "Defender" level (score 500+)
→ Home screen updates: lock icon removed
→ Toast: "🔍 The Investigation is now unlocked!"
```

---

### 2.1 The Investigation Home Card (Unlocked)

```
┌─────────────────────────────────┐
│  🔍 The Investigation           │
│  Find every red flag before     │
│  time runs out                  │
│  Cases solved: 0                │
│  Best accuracy: 0%              │
│  [OPEN CASE FILE]               │
└─────────────────────────────────┘
```

---

### 2.2 How to Play Screen

```
┌─────────────────────────────────┐
│  ← Back    How to Play          │
│                                 │
│  [Illustration: magnifying      │
│   glass over a chat conversation│
│   with highlighted sections]   │
│                                 │
│  You are the detective.         │
│                                 │
│  Step 1                         │
│  A full conversation appears    │
│  — an entire scam from first    │
│  message to payment request     │
│                                 │
│  Step 2                         │
│  Read carefully                 │
│  Tap anything that looks        │
│  suspicious to flag it          │
│                                 │
│  Step 3                         │
│  [Timer: 2:00 ██████████]       │
│  Find all red flags before      │
│  time runs out                  │
│                                 │
│  Step 4                         │
│  Submit your findings           │
│  See how many you caught        │
│  and which ones you missed      │
│                                 │
│  ⭐ Find all flags = Perfect     │
│  ★ Miss some = Partial score    │
│  ✗ Miss more than half = Failed │
│                                 │
│  [GOT IT — OPEN CASE FILE →]    │
└─────────────────────────────────┘
```

---

### 2.3 Case File Select Screen

```
┌─────────────────────────────────┐
│  ← Back    The Investigation    │
│                                 │
│  Select a Case File             │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📁 Case #001             │  │
│  │  The Fake Job Recruiter   │  │
│  │  A 12-message Telegram    │  │
│  │  conversation             │  │
│  │  Red flags hidden: 4      │  │
│  │  Difficulty: ●●○○○        │  │
│  │  Status: Unsolved         │  │
│  │  [OPEN CASE]              │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📁 Case #002             │  │
│  │  The Crypto Trading Group │  │
│  │  A Telegram group chat    │  │
│  │  + private messages       │  │
│  │  Red flags hidden: 6      │  │
│  │  Difficulty: ●●●○○        │  │
│  │  Status: 🔒 Solve Case    │  │
│  │  #001 first               │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📁 Case #003             │  │
│  │  The Romance Setup        │  │
│  │  A Facebook + Telegram    │  │
│  │  conversation over 3 days │  │
│  │  Red flags hidden: 8      │  │
│  │  Difficulty: ●●●●○        │  │
│  │  Status: 🔒 Locked        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📁 Case #004             │  │
│  │  The Fake Tech Support    │  │
│  │  An email thread + EXE    │  │
│  │  file download request    │  │
│  │  Red flags hidden: 5      │  │
│  │  Difficulty: ●●●●●        │  │
│  │  Status: 🔒 Locked        │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

### 2.4 Case Briefing Screen

```
┌─────────────────────────────────┐
│  ← Back    Case #001            │
│                                 │
│  🗂️ CASE FILE                   │
│  ─────────────────────────────  │
│  Case: The Fake Job Recruiter   │
│  Platform: Telegram             │
│  Messages: 12                   │
│  Victim: Sokha, 22 (job seeker) │
│  Red Flags to Find: 4           │
│  Time Limit: 2 minutes          │
│  ─────────────────────────────  │
│                                 │
│  CASE SUMMARY                   │
│  Sokha received a Telegram      │
│  message from a recruiter       │
│  offering $700/month to type    │
│  product reviews from home.     │
│  Somewhere in this conversation │
│  are 4 red flags that reveal    │
│  this is a scam.                │
│                                 │
│  Your job: find them all.       │
│                                 │
│  HOW TO FLAG                    │
│  Tap any part of any message    │
│  that you think is suspicious   │
│  A flag marker appears          │
│  Tap again to remove a flag     │
│                                 │
│  [BEGIN INVESTIGATION →]        │
└─────────────────────────────────┘
```

---

### 2.5 Investigation Game Screen

```
┌─────────────────────────────────┐
│  Case #001          🚩 0/4      │
│  [██████████████░░░] 1:45       │
│                                 │
│  The Fake Job Recruiter         │
├─────────────────────────────────┤
│  Full scrollable conversation:  │
│                                 │
│  [Recruiter bubble]             │
│  "Hello Sokha! I found your     │
│   profile and we are looking    │
│   for people to write product   │
│   reviews from home. Earn       │
│   $700-900/month, flexible hrs" │
│  Mon 9:01 AM ✓✓                 │
│                              ▲  │
│  [Sokha bubble]             tap │
│  "Hello, that sounds            │
│   interesting! Tell me more"    │
│  Mon 9:15 AM ✓✓                │
│                                 │
│  [Recruiter bubble]             │
│  "We work with 200+ companies   │
│   worldwide. Our company is     │
│   Global Review Partners Ltd.   │
│   We are very professional."    │
│  Mon 9:20 AM ✓✓             ▲  │
│                              tap│
│  [Recruiter bubble]             │
│  "To get started you need to    │
│   pay a $50 registration fee    │
│   to activate your account.     │
│   This is refunded after your   │
│   first payment."               │
│  Mon 9:22 AM ✓✓                 │
│                              ▲  │
│                              tap│
│  [Recruiter bubble]             │
│  "Please download this form:    │
│   Application_Form.exe"         │
│  Mon 9:25 AM ✓✓             ▲  │
│                              tap│
│  [Recruiter bubble]             │
│  "We need your Wing number,     │
│   national ID photo front and   │
│   back, and home address for    │
│   delivery of your work kit."   │
│  Mon 9:30 AM ✓✓                 │
│                              ▲  │
│                              tap│
│                                 │
│  [Sokha bubble]                 │
│  "Okay, should I send those     │
│   to you here on Telegram?"     │
│  Mon 9:32 AM ✓                 │
│                                 │
│  [Continue scrolling...]        │
│                                 │
├─────────────────────────────────┤
│  🚩 Flags placed: 0             │
│  [SUBMIT FINDINGS]              │
└─────────────────────────────────┘

When user taps a message bubble:
→ A 🚩 flag icon appears on that message
→ Counter updates: 🚩 1/4
→ Tapping same message again removes the flag
→ User can flag as many messages as they want
→ No immediate feedback on whether flag is correct
   (revealed only at submit)
```

---

### 2.6 Flag Interaction Detail

```
BEFORE TAP:
───────────
│  [Recruiter bubble]             │
│  "Pay a $50 registration fee    │
│   to activate your account."   │
│  Mon 9:22 AM ✓✓                │

AFTER TAP:
──────────
│  🚩 [Recruiter bubble]          │
│  "Pay a $50 registration fee    │
│   to activate your account."   │
│  Mon 9:22 AM ✓✓                │
│  [Red left border on bubble]   │

Counter updates:
│  🚩 Flags placed: 1             │

Second tap on same bubble:
→ Flag removed, red border gone
→ Counter: 🚩 Flags placed: 0
```

---

### 2.7 Timer Warning States

```
Timer > 60 seconds:  [████████████████░░░░] Normal color
Timer 30-60 seconds: [████████░░░░░░░░░░░░] Yellow color
Timer < 30 seconds:  [████░░░░░░░░░░░░░░░░] Red + flashing
Timer = 0:           Auto-submit with whatever flags placed
                     Toast: "Time's up! Submitting findings..."
```

---

### 2.8 Submit Confirmation Dialog

```
┌─────────────────────────────────┐
│  Submit Your Findings?          │
│                                 │
│  You flagged: 3 messages        │
│  Required: 4 red flags          │
│  Time remaining: 0:45           │
│                                 │
│  [YES, SUBMIT]  [KEEP LOOKING]  │
└─────────────────────────────────┘
```

---

### 2.9 Results Screen

```
PATH A: Perfect Score (All 4 flags found, no wrong flags)
──────────────────────────────────────────────────────────
┌─────────────────────────────────┐
│                                 │
│  🏆 PERFECT INVESTIGATION       │
│                                 │
│  You found all 4 red flags      │
│  No false alarms                │
│  Time remaining: 0:52           │
│                                 │
│  Score: 400 points              │
│  Accuracy: 100%                 │
│  Time bonus: +52 points         │
│  Total: 452 points              │
│                                 │
│  [VIEW FULL DEBRIEF ↓]          │
└─────────────────────────────────┘


PATH B: Partial Score (Some flags correct, some missed)
────────────────────────────────────────────────────────
┌─────────────────────────────────┐
│                                 │
│  🔍 CASE PARTIALLY SOLVED       │
│                                 │
│  You found: 2 of 4 red flags    │
│  Missed: 2 red flags            │
│  False alarms: 1                │
│                                 │
│  Score: 150 points              │
│  Accuracy: 50%                  │
│                                 │
│  [VIEW FULL DEBRIEF ↓]          │
└─────────────────────────────────┘


PATH C: Failed (Missed more than half)
───────────────────────────────────────
┌─────────────────────────────────┐
│                                 │
│  ❌ CASE UNSOLVED               │
│                                 │
│  You found: 1 of 4 red flags    │
│  Missed: 3 red flags            │
│                                 │
│  Score: 50 points               │
│                                 │
│  This case is still open.       │
│  Try again.                     │
│                                 │
│  [VIEW FULL DEBRIEF ↓]          │
└─────────────────────────────────┘
```

---

### 2.10 Investigation Debrief Screen

```
┌─────────────────────────────────┐
│  Case #001 — Full Debrief       │
│  The Fake Job Recruiter         │
├─────────────────────────────────┤
│  YOUR FLAGS vs REAL FLAGS       │
│                                 │
│  ✅ Flag 1 — CORRECT            │
│  🚩 Message: "Pay $50           │
│     registration fee"           │
│  WHY: Legitimate employers      │
│  NEVER ask applicants to pay    │
│  any fee before starting work.  │
│  This is called "advance fee    │
│  fraud."                        │
│                                 │
│  ✅ Flag 2 — CORRECT            │
│  🚩 Message: "Application_      │
│     Form.exe"                   │
│  WHY: A job application form    │
│  is never a .exe file. EXE      │
│  files are programs. This one   │
│  installs malware on your       │
│  device when opened.            │
│                                 │
│  ❌ Flag 3 — YOU MISSED THIS    │
│  🚩 Message: "$700-900/month    │
│     flexible hours, no          │
│     experience needed"          │
│  WHY: Unusually high salary     │
│  for zero-skill work is a       │
│  classic scam signal. Real      │
│  remote typing jobs pay $3-5/hr.│
│                                 │
│  ❌ Flag 4 — YOU MISSED THIS    │
│  🚩 Message: "Send your Wing    │
│     number, national ID front   │
│     and back, home address"     │
│  WHY: No employer needs your    │
│  national ID and home address   │
│  before you have even signed    │
│  a contract. This is identity   │
│  theft preparation.             │
│                                 │
│  ⚠️ FALSE ALARM — This was NOT  │
│  a red flag:                    │
│  🚩 Message: "We work with      │
│     200+ companies worldwide"   │
│  WHY: Vague claims are          │
│  suspicious but not a           │
│  definitive red flag on their   │
│  own. Look for concrete proof   │
│  of harm instead.               │
├─────────────────────────────────┤
│  THE PATTERN IN THIS SCAM       │
│                                 │
│  This is an Advance Fee +       │
│  Malware + Identity Theft scam  │
│  combined. Scammers layer        │
│  multiple attacks to maximize   │
│  damage.                        │
├─────────────────────────────────┤
│  ONE RULE TO REMEMBER           │
│                                 │
│  "Any job that asks you to      │
│   PAY before you EARN, or       │
│   download an .EXE file, or     │
│   send your national ID photo   │
│   before signing a contract —   │
│   is always a scam."            │
├─────────────────────────────────┤
│  Final Score: 150 points        │
│  Case Status: Partially Solved  │
│                                 │
│  [📤 Share Findings]            │
│  [🔁 Try Again]                 │
│  [📁 Next Case]                 │
│  [🏠 Home]                      │
└─────────────────────────────────┘
```

---

### 2.11 Investigation Full Flow Summary

```
Home Screen
    │
    ▼
Investigation Card [OPEN CASE FILE]
    │
    ▼
How to Play Screen
    │
    ▼
Case File Select Screen
    │
    ▼
Case Briefing Screen
    │
    ▼
Investigation Game Screen
(Scrollable conversation — tap to flag)
    │
    ├── Timer runs out (auto-submit)
    │       │
    └── User taps [SUBMIT FINDINGS]
            │
            ▼
    Submit Confirmation Dialog
      │              │
    [YES]          [KEEP LOOKING]
      │              │
      │         Back to game screen
      ▼
    Results Screen
    (Perfect / Partial / Failed)
            │
            ▼
    Investigation Debrief Screen
    (Correct flags / Missed flags / False alarms)
    (Rule / Pattern / Score)
            │
    ┌───────┼──────────┬──────────┐
    │       │          │          │
  Share   Retry    Next Case    Home
```

---

## Combined Navigation Map (All 3 Modes Unlocked)

```
ScamSim PWA
│
├── Onboarding (first time)
│
├── Home Screen
│   ├── Guardian Mode ──────────────────────────────────┐
│   │                                                   │
│   ├── Speed Triage ─────────────────────────────┐    │
│   │   (unlocks after Guardian Scenario 1)        │    │
│   │                                              │    │
│   └── The Investigation ───────────────────┐    │    │
│       (unlocks after all Guardian or Lv3)  │    │    │
│                                            │    │    │
│                                            ▼    ▼    ▼
├── Guardian Mode                         Investigation Speed Triage
│   ├── Scenario Select                   │             │
│   ├── Scenario Intro                    │             │
│   ├── Game Screen (Stage 1-3)           │             │
│   ├── Consequence Screen                │             │
│   └── Debrief Screen                   │             │
│                                         │             │
├── Speed Triage ◄────────────────────────┘             │
│   ├── How to Play                                     │
│   ├── Category Select                                 │
│   ├── Countdown                                       │
│   ├── Game Screen (cards)             ◄───────────────┘
│   └── Game Over Screen
│
├── The Investigation
│   ├── How to Play
│   ├── Case File Select
│   ├── Case Briefing
│   ├── Game Screen (flag conversation)
│   ├── Results Screen
│   └── Debrief Screen
│
├── Progress Screen
│   ├── Overall Score + Level
│   ├── Scam Resistance by Category
│   ├── Badges
│   └── Case Files Solved
│
└── Settings Screen
    ├── Language (KH / EN)
    ├── Notifications
    ├── Install App
    └── Reset Progress
```

---

## Score Contribution Per Mode

| Mode | Per Correct Action | Bonus | Max per Session |
|---|---|---|---|
| Guardian Mode | +100 per correct decision | +200 win bonus | +500 |
| Speed Triage | +10 per card (x streak multiplier) | +100 daily bonus | Unlimited |
| The Investigation | +100 per correct flag | +time bonus | +600 |

---

## Level Thresholds (Unlocked by Total Score)

| Level | Name | Score Required | What Unlocks |
|---|---|---|---|
| 1 | Aware | 0 | Guardian Mode Scenario 1 |
| 2 | Alert | 200 | Speed Triage + Guardian Scenario 2 |
| 3 | Defender | 500 | The Investigation + Guardian Scenario 3 |
| 4 | Guardian | 1000 | Guardian Scenario 4 + advanced card packs |
| 5 | Protector | 2000 | All content + Protector badge |

---

*ScamSim — Speed Triage & Investigation App Flow*
*Complete Reference Document | All Modes Unlocked*