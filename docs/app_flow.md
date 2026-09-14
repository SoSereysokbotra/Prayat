# ScamSim — Complete App Flow

### Every Screen, Every Interaction, Every State

---

## 1. App Entry Flow

```
User opens ScamSim (browser or PWA icon)
          │
          ▼
   First time user?
    │           │
   YES          NO
    │           │
    ▼           ▼
 Onboarding   Home Screen
 Flow         (skip onboarding)
```

---

## 2. Onboarding Flow (First Time Only)

```
Screen 1: Welcome
─────────────────
[ScamSim Logo]
"Welcome to ScamSim"
"Learn to spot scams before they cost you"
[Language: ភាសាខ្មែរ] [English]
[GET STARTED →]
          │
          ▼
Screen 2: What is ScamSim?
──────────────────────────
[Illustration: phone with chat bubbles]
"ScamSim puts you INSIDE a real scam"
"Make decisions. See what happens."
"Learn why — in Khmer or English."
[NEXT →]
          │
          ▼
Screen 3: Who is it for?
────────────────────────
[3 icons: child, adult, elderly]
"For you. For your parents."
"For anyone who uses a phone."
[NEXT →]
          │
          ▼
Screen 4: Install Prompt
────────────────────────
"Add ScamSim to your home screen"
"Works offline. No app store needed."
[INSTALL NOW] [SKIP]
          │
          ▼
     Home Screen
```

---

## 3. Home Screen

```
┌─────────────────────────────────┐
│  🛡️ ScamSim          [KH | EN]  │
│  "Learn before you lose"        │
│                                 │
│  Your Score: 0                  │
│  Level: Beginner                │
│  Daily Streak: 0 🔥             │
│                                 │
│  ┌───────────────────────────┐  │
│  │  🎭 Guardian Mode         │  │
│  │  Stop your family from    │  │
│  │  being scammed            │  │
│  │  ★★★★☆  10 min           │  │
│  │  [PLAY NOW]               │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  ⚡ Speed Triage          │  │
│  │  Real or Scam in          │  │
│  │  5 seconds                │  │
│  │  🔒 Complete Guardian     │  │
│  │     Mode to unlock        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  🔍 The Investigation     │  │
│  │  Find all red flags       │  │
│  │  before time runs out     │  │
│  │  🔒 Coming Soon           │  │
│  └───────────────────────────┘  │
│                                 │
│  [📊 My Progress] [ℹ️ About]    │
└─────────────────────────────────┘

Tapping PLAY NOW → Guardian Mode Scenario Select
Tapping locked mode → Toast: "Complete Guardian Mode first"
Tapping My Progress → Progress Screen
Tapping About → About Screen
```

---

## 4. Guardian Mode Flow

### 4.1 Scenario Selection Screen

```
┌─────────────────────────────────┐
│  ← Back    Guardian Mode        │
│                                 │
│  Choose a Scenario              │
│                                 │
│  ┌───────────────────────────┐  │
│  │  🏛️ Fake Ministry         │  │
│  │  Official                 │  │
│  │  "Stop Uncle from paying  │  │
│  │   a fake government fee"  │  │
│  │  Difficulty: ●●○○○        │  │
│  │  [PLAY]                   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  💼 Fake Job Offer        │  │
│  │  "Help your sister spot   │  │
│  │   a Telegram scam"        │  │
│  │  Difficulty: ●●●○○        │  │
│  │  🔒 Play Scenario 1 first │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📈 Fake Crypto Group     │  │
│  │  "Save your brother from  │  │
│  │   a pig butchering scam"  │  │
│  │  Difficulty: ●●●●○        │  │
│  │  🔒 Locked                │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  💕 Romance Manipulation  │  │
│  │  "Protect your daughter   │  │
│  │   from a trust scammer"   │  │
│  │  Difficulty: ●●●●●        │  │
│  │  🔒 Locked                │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

Tapping PLAY on Scenario 1 → Scenario Intro Screen
Tapping locked scenario → Toast: "Complete previous scenario first"
```

---

### 4.2 Scenario Intro Screen

```
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│  [Illustration area]            │
│  Uncle Chan icon + shop icon    │
│                                 │
│  Fake Ministry Official         │
│                                 │
│  "Your Uncle Chan owns a small  │
│   phone repair shop in          │
│   Battambang. He just received  │
│   a suspicious Facebook message │
│   and he's about to make a      │
│   very costly mistake."         │
│                                 │
│  Your mission:                  │
│  ✓ Read what the scammer        │
│    is sending him               │
│  ✓ Advise your uncle correctly  │
│  ✓ Stop him from paying         │
│                                 │
│  ⚠️ Warning: The choices        │
│     are designed to feel real.  │
│     Think carefully.            │
│                                 │
│  [START SCENARIO →]             │
└─────────────────────────────────┘

Tapping START SCENARIO → Game Screen (Stage 1)
```

---

### 4.3 Game Screen — Stage 1

```
┌─────────────────────────────────┐
│  Stage 1/3        Score: 0      │
│  [████████░░░░░░] 33%           │
├─────────────────────────────────┤
│  WHAT THE SCAMMER SENT UNCLE    │
├─────────────────────────────────┤
│  📘 Ministry of Commerce ✓      │
│                                 │
│  [Scammer bubble]               │
│  "Dear Sir, this is an urgent   │
│   notice from the Ministry of   │
│   Commerce Digital Compliance   │
│   Unit. Your shop registration  │
│   number 0045-PP has been       │
│   flagged. Pay $200 within 2    │
│   hours or face suspension."    │
│                                 │
│  [Wing QR code image]           │
│  10:32 AM ✓✓                    │
├─────────────────────────────────┤
│  YOUR CHAT WITH UNCLE CHAN      │
├─────────────────────────────────┤
│                                 │
│  [Uncle bubble]                 │
│  "Look at this! A man from      │
│   the Ministry messaged me on   │
│   Facebook. He knows my shop    │
│   number. Should I pay $200?"   │
│  10:33 AM                       │
│                                 │
│  [typing indicator ...]         │
│  (appears for 1.5 sec then      │
│   options appear)               │
├─────────────────────────────────┤
│  WHAT DO YOU REPLY?             │
│                                 │
│  [A] "Don't worry, just pay     │
│       it. $200 is not much."    │
│                                 │
│  [B] "Ask him to send you the   │
│       official Ministry URL."   │
│                                 │
│  [C] "Stop. This is a scam.     │
│       Government never uses     │
│       Facebook or Wing."        │
│                                 │
│  [D] "Send me a screenshot,     │
│       I'll look at it first."   │
└─────────────────────────────────┘

User taps Option A (wrong) →
  - Button A highlights RED briefly
  - Player message appears: "Don't worry, just pay it..."
  - Typing indicator appears
  - Uncle responds: "Oh okay, I'll pay now then. Thank you!"
  - Stage advances to Stage 2 with consequence building

User taps Option B (plausible but wrong) →
  - Button B highlights YELLOW briefly
  - Player message appears
  - Uncle responds: "Okay he sent me a link: ministry-official.com"
  - Stage advances to Stage 2

User taps Option C (correct) →
  - Button C highlights GREEN briefly
  - Player message appears
  - Typing indicator appears
  - Uncle responds: "But how does he know my shop number?
                     And he has an official logo..."
  - Stage advances to Stage 2

User taps Option D (plausible but wrong) →
  - Button D highlights YELLOW briefly
  - Player message appears
  - Uncle responds: "Okay but hurry, he says 2 hours left..."
  - Stage advances to Stage 2
```

---

### 4.4 Game Screen — Stage 2 (Uncle Pushes Back)

```
┌─────────────────────────────────┐
│  Stage 2/3        Score: 100    │
│  [████████████░░] 66%           │
├─────────────────────────────────┤
│  WHAT THE SCAMMER SENT UNCLE    │
├─────────────────────────────────┤
│  [Previous scammer message]     │
│  [NEW scammer bubble]           │
│  "You have 1 hour remaining.    │
│   Failure to pay will result    │
│   in shop closure and police    │
│   involvement."                 │
│  10:45 AM ✓✓                    │
├─────────────────────────────────┤
│  YOUR CHAT WITH UNCLE CHAN      │
├─────────────────────────────────┤
│  [Previous messages visible]    │
│                                 │
│  [Uncle bubble — AI generated]  │
│  "But he knows my exact shop    │
│   registration number. And the  │
│   Facebook page looks official  │
│   with a Cambodian flag. Maybe  │
│   this is real?"                │
│  10:46 AM                       │
│                                 │
├─────────────────────────────────┤
│  WHAT DO YOU REPLY?             │
│                                 │
│  [A] "If he knows your number   │
│       maybe he IS from the      │
│       Ministry. Better pay."    │
│                                 │
│  [B] "Shop numbers are public   │
│       info. Logos can be copied.│
│       The Wing QR = the proof   │
│       it's a scam."             │
│                                 │
│  [C] "Call the Ministry's       │
│       official phone number     │
│       from their real website." │
│                                 │
│  [D] "Ask him to meet you in    │
│       person at the Ministry."  │
└─────────────────────────────────┘

User taps Option A (wrong) →
  - Uncle: "Okay you're right, I'll just pay."
  - Stage 3 shows consequence building

User taps Option B (correct) →
  - Uncle: "You're right... I never thought about that.
             But I'm still scared. What do I do?"
  - Stage 3 appears

User taps Option C (also acceptable) →
  - Uncle: "Good idea. I called the number on their
             real website. They said no problem exists."
  - Skip to win consequence

User taps Option D (wrong) →
  - Uncle: "He says he can't meet and time is running out."
  - Stage 3 appears with pressure
```

---

### 4.5 Game Screen — Stage 3 (Final Decision)

```
┌─────────────────────────────────┐
│  Stage 3/3        Score: 200    │
│  [████████████████] 99%         │
│  ⚠️ Uncle is about to decide!   │
├─────────────────────────────────┤
│  [All previous messages]        │
│                                 │
│  [Uncle bubble — AI generated]  │
│  "Okay I'm scared now. 30       │
│   minutes left. Should I just   │
│   pay to be safe? Or should I   │
│   really block him?"            │
├─────────────────────────────────┤
│  FINAL DECISION                 │
│                                 │
│  [A] "Pay it. Better safe       │
│       than sorry."              │
│                                 │
│  [B] "Block him. Call the       │
│       real Ministry number.     │
│       Report the Facebook page."│
│                                 │
│  [C] "Wait until the deadline   │
│       passes and see what       │
│       happens."                 │
│                                 │
│  [D] "Ask your neighbor for     │
│       a second opinion first."  │
└─────────────────────────────────┘

User taps Option A (wrong) →
  → Consequence Screen: SCAMMED

User taps Option B (correct) →
  → Consequence Screen: SAVED

User taps Option C (wrong) →
  → Consequence Screen: partial consequence

User taps Option D (semi-correct) →
  → Consequence Screen: narrow escape
```

---

### 4.6 Consequence Screen

```
PATH A: Player saved Uncle (chose correctly 2+ times)
─────────────────────────────────────────────────────
┌─────────────────────────────────┐
│                                 │
│  ✅                             │
│                                 │
│  You saved Uncle Chan.          │
│                                 │
│  [Uncle message — 3 days later] │
│  "I called the real Ministry    │
│   number. They said no such     │
│   notice was ever sent. My      │
│   neighbor got the same message │
│   and paid $200. Thank you."    │
│                                 │
│  +300 points                    │
│                                 │
│  [Loading debrief...]           │
│                                 │
└─────────────────────────────────┘
(Auto-navigate to Debrief after 3 seconds)


PATH B: Player failed (chose wrong 2+ times)
─────────────────────────────────────────────
┌─────────────────────────────────┐
│                                 │
│  ❌                             │
│                                 │
│  Uncle Chan paid $200.          │
│                                 │
│  [Uncle message — 1 hour later] │
│  "The man blocked me after I    │
│   paid. Wing says they cannot   │
│   reverse a personal transfer.  │
│   The Facebook page is deleted. │
│   $200 is gone."                │
│                                 │
│  +50 points (for trying)        │
│                                 │
│  [Loading debrief...]           │
│                                 │
└─────────────────────────────────┘
(Auto-navigate to Debrief after 3 seconds)
```

---

### 4.7 Debrief Screen

```
┌─────────────────────────────────┐
│  Debrief                        │
│  Government Impersonation Scam  │
├─────────────────────────────────┤
│  [Win state]                    │
│  ✅ You protected Uncle Chan    │
│  Score this round: +300         │
│                                 │
│  OR                             │
│                                 │
│  [Fail state]                   │
│  ❌ Uncle lost $200             │
│  Score this round: +50          │
├─────────────────────────────────┤
│  3 RED FLAGS TO KNOW            │
│                                 │
│  🚩 Flag 1                      │
│  Government agencies in         │
│  Cambodia never contact         │
│  businesses through personal    │
│  Facebook messages              │
│                                 │
│  🚩 Flag 2                      │
│  Real government fines are      │
│  paid through official bank     │
│  transfers — never Wing QR      │
│  codes linked to a phone number │
│                                 │
│  🚩 Flag 3                      │
│  Deadlines of "2 hours" are     │
│  designed to stop you from      │
│  verifying. Legitimate notices  │
│  always give days or weeks.     │
├─────────────────────────────────┤
│  THE ONE RULE TO REMEMBER       │
│                                 │
│  "If a 'government official'    │
│   contacts you on Facebook and  │
│   wants money via Wing — it is  │
│   ALWAYS a scam."               │
├─────────────────────────────────┤
│  WHAT TO DO IN REAL LIFE        │
│                                 │
│  1. Do not pay anything         │
│  2. Call the real Ministry      │
│     using the number on their   │
│     official .gov.kh website    │
│  3. Report the Facebook page    │
│  4. Tell your family and        │
│     neighbors                   │
├─────────────────────────────────┤
│  Total Score: 300               │
│  Level: Alert → Defender 🆙     │
├─────────────────────────────────┤
│  [📤 Share to Family Chat]      │
│  (opens share sheet with        │
│   debrief text pre-filled)      │
│                                 │
│  [🔁 Play Again]                │
│  [🏠 Back to Home]              │
│  [▶️ Next Scenario]             │
└─────────────────────────────────┘

Tapping Share → Native share sheet opens with:
  "I just learned about government impersonation scams
   on ScamSim. 3 red flags to know: [auto-filled text]
   Try it free: [app URL]"

Tapping Play Again → Scenario Intro (same scenario)
Tapping Back to Home → Home Screen
Tapping Next Scenario → Scenario 2 Intro (if unlocked)
```

---

## 5. Speed Triage Flow (Locked in Prototype — Show UI Only)

```
┌─────────────────────────────────┐
│  ← Back    Speed Triage         │
│                                 │
│  🔒 Locked                      │
│                                 │
│  Complete Guardian Mode         │
│  Scenario 1 to unlock           │
│                                 │
│  Preview:                       │
│  ┌─────────────────────────┐    │
│  │  [Screenshot of cards]  │    │
│  │  dashed preview area    │    │
│  └─────────────────────────┘    │
│                                 │
│  "A real message appears.       │
│   You have 5 seconds.           │
│   REAL or SCAM?"                │
│                                 │
│  [GO BACK]                      │
└─────────────────────────────────┘
```

---

## 6. Progress Screen

```
┌─────────────────────────────────┐
│  ← Back    My Progress          │
│                                 │
│  [Avatar placeholder]           │
│  Total Score: 300               │
│  Level: Defender                │
│  Streak: 2 days 🔥              │
│                                 │
│  SCAM RESISTANCE SCORE          │
│  ┌─────────────────────────┐   │
│  │ Government Scams  ████░ │   │
│  │                   720   │   │
│  │ Job Offer Scams   ░░░░░ │   │
│  │                   0     │   │
│  │ Crypto Scams      ░░░░░ │   │
│  │                   0     │   │
│  │ Romance Scams     ░░░░░ │   │
│  │                   0     │   │
│  │ Malware Scams     ░░░░░ │   │
│  │                   0     │   │
│  └─────────────────────────┘   │
│                                 │
│  BADGES EARNED                  │
│  ┌─────────────────────────┐   │
│  │  🛡️ First Defender       │   │
│  │  Completed first scenario│   │
│  │                         │   │
│  │  🔒 Guardian Badge       │   │
│  │  Complete all Guardian   │   │
│  │  scenarios to unlock     │   │
│  └─────────────────────────┘   │
│                                 │
│  COMPLETED SCENARIOS            │
│  ✅ Fake Ministry Official      │
│  🔒 Fake Job Offer              │
│  🔒 Fake Crypto Group           │
│  🔒 Romance Manipulation        │
│                                 │
│  [📤 Share My Score]            │
└─────────────────────────────────┘
```

---

## 7. Settings / About Screen

```
┌─────────────────────────────────┐
│  ← Back    Settings             │
│                                 │
│  LANGUAGE                       │
│  [🇰🇭 ភាសាខ្មែរ] [🇺🇸 English]   │
│                                 │
│  NOTIFICATIONS                  │
│  Daily challenge reminder       │
│  [Toggle ON/OFF]                │
│                                 │
│  ABOUT                          │
│  ScamSim v1.0.0                 │
│  Built for Cambodians           │
│  by [Team Name]                 │
│                                 │
│  INSTALL APP                    │
│  [Add to Home Screen]           │
│  Works offline on Android       │
│                                 │
│  RESET PROGRESS                 │
│  [Reset] (with confirm dialog)  │
│                                 │
│  SHARE SCAMSIM                  │
│  [📤 Tell a Friend]             │
└─────────────────────────────────┘
```

---

## 8. Error States and Edge Cases

### 8.1 No Internet Connection

```
┌─────────────────────────────────┐
│  [Wifi icon with X]             │
│                                 │
│  No Internet Connection         │
│                                 │
│  ScamSim needs internet         │
│  to generate AI conversations.  │
│                                 │
│  ✓ Home screen: works offline   │
│  ✓ Your score: saved locally    │
│  ✗ Game scenarios: need online  │
│                                 │
│  [Retry]                        │
└─────────────────────────────────┘
```

### 8.2 AI Response Timeout (> 8 seconds)

```
Fallback behavior:
→ Show pre-written fallback response for that stage
→ Toast notification: "Using saved response (AI slow)"
→ Game continues normally
→ Log error silently for debugging
```

### 8.3 Mid-Game App Close / Refresh

```
On app close:
→ Save to localStorage:
   { scenarioId, currentStage, decisions, messages, score }

On app reopen:
→ Detect saved game in localStorage
→ Show resume dialog:

┌─────────────────────────────────┐
│  Resume your game?              │
│                                 │
│  You were playing:              │
│  "Fake Ministry Official"       │
│  Stage 2 of 3                   │
│                                 │
│  [RESUME]   [START OVER]        │
└─────────────────────────────────┘
```

### 8.4 PWA Install Prompt

```
Trigger: After user completes first scenario

┌─────────────────────────────────┐
│  Install ScamSim                │
│                                 │
│  Add to your home screen for    │
│  faster access and offline use  │
│                                 │
│  [INSTALL]   [NOT NOW]          │
└─────────────────────────────────┘

iOS: Show manual instruction
  "Tap [Share] → Add to Home Screen"
```

---

## 9. Complete Screen Map

```
ScamSim PWA
│
├── Onboarding (first time only)
│   ├── Welcome Screen
│   ├── What is ScamSim Screen
│   ├── Who is it for Screen
│   └── Install Prompt Screen
│
├── Home Screen
│   ├── Mode Cards (Guardian / Speed Triage / Investigation)
│   ├── Score Display
│   └── Navigation Bar
│
├── Guardian Mode
│   ├── Scenario Selection Screen
│   │   └── [Scenario Card × 4]
│   │
│   ├── Scenario Intro Screen
│   │
│   ├── Game Screen
│   │   ├── Stage 1 (Scammer panel + Player chat + Options)
│   │   ├── Stage 2 (Uncle pushback + New options)
│   │   └── Stage 3 (Final decision + Options)
│   │
│   ├── Consequence Screen
│   │   ├── Win Consequence
│   │   └── Fail Consequence
│   │
│   └── Debrief Screen
│       ├── Red Flags (3 items)
│       ├── The Rule
│       ├── Real Life Action
│       ├── Score Update
│       └── Share / Next / Home buttons
│
├── Speed Triage (locked in prototype)
│   └── Locked Placeholder Screen
│
├── Investigation (locked in prototype)
│   └── Locked Placeholder Screen
│
├── Progress Screen
│   ├── Scam Resistance Score (by category)
│   ├── Badges
│   └── Completed Scenarios
│
└── Settings Screen
    ├── Language Toggle
    ├── Notifications
    ├── Install App
    └── Reset Progress
```

---

## 10. State Flow Summary

```
App State:
─────────
language: 'kh' | 'en'
user: { score, level, streak, completedScenarios[], badges[] }

Game State (active during play):
─────────────────────────────────
phase: 'idle' | 'intro' | 'playing' | 'consequence' | 'debrief'
scenario: Scenario | null
currentStage: 1 | 2 | 3
messages: Message[]
decisions: Decision[]
roundScore: number
isAITyping: boolean

Persisted to localStorage:
──────────────────────────
totalScore
level
streak
lastPlayedDate
completedScenarios[]
savedGame (for resume on refresh)
language preference
onboardingComplete
```

---

## 11. Navigation Rules

| From                | Action              | To                         |
| ------------------- | ------------------- | -------------------------- |
| Onboarding Screen 3 | Tap GET STARTED     | Home Screen                |
| Home Screen         | Tap Guardian Mode   | Scenario Selection         |
| Home Screen         | Tap locked mode     | Toast only (no navigate)   |
| Home Screen         | Tap My Progress     | Progress Screen            |
| Scenario Selection  | Tap PLAY            | Scenario Intro             |
| Scenario Selection  | Tap locked scenario | Toast only                 |
| Scenario Intro      | Tap START           | Game Screen Stage 1        |
| Game Screen         | Tap option          | Same screen, next stage    |
| Game Screen Stage 3 | Tap final option    | Consequence Screen         |
| Consequence Screen  | Auto after 3 sec    | Debrief Screen             |
| Debrief             | Tap Share           | Native share sheet         |
| Debrief             | Tap Play Again      | Scenario Intro             |
| Debrief             | Tap Next Scenario   | Next Scenario Intro        |
| Debrief             | Tap Home            | Home Screen                |
| Any screen          | Tap ← Back          | Previous screen            |
| Any screen          | Close app           | Save state to localStorage |
| Reopen app          | Saved game exists   | Resume dialog              |

---

_ScamSim App Flow — Complete Reference Document_
_Version 1.0 | Hackathon Prototype Scope_
