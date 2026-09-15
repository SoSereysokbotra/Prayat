# ScamSim — Game Design Document
### Cybersecurity Learning Platform | Cambodia Market

---

## Design Philosophy

ScamSim is built on one core belief: **you cannot learn to resist a scam by reading about it. You have to feel it.**

Every game mode exists to recreate the emotional conditions of a real scam — the time pressure, the social trust, the sense of authority, the fear of missing out — and then teach the user what to do inside those conditions. The goal is not a high score. The goal is a behaviour change that lasts after the phone is put down.

Three principles guide every design decision:

**Realism over simplicity.** The wrong choices must feel reasonable. If the bad option is obviously stupid, no learning happens. Scammers are persuasive professionals. The game must respect that.

**Explanation over judgment.** Getting an answer wrong is the richest learning moment in the platform. Wrong answers never end with a buzzer and nothing else. They always end with a clear, specific explanation of what the player missed and why.

**Habit over marathon.** Sessions should be short — five to fifteen minutes — and daily. A player who opens the app for ten minutes every morning for thirty days learns far more than someone who plays for two hours once and never returns.

---

## The Core Learning Loop

Every mode in ScamSim follows the same four-stage loop:

```
FEEL THE PRESSURE → MAKE A DECISION → SEE THE CONSEQUENCE → UNDERSTAND WHY
```

1. **Feel the pressure** — The scenario creates genuine tension. Time is running out, the Auntie is about to pay, the screenshot looks almost real.
2. **Make a decision** — The player chooses. The options are designed so at least one wrong answer feels reasonable.
3. **See the consequence** — The story plays out. If the player was wrong, they see what would have happened.
4. **Understand why** — A focused, specific explanation of the single most important thing the player missed.

This loop is what separates ScamSim from a quiz. A quiz tells you whether you were right. This loop shows you why it mattered.

---

## Game Mode 1 — Speed Triage

### The Concept

When scams succeed, it is usually because the victim was busy, distracted, or rushed. Speed Triage trains the brain to recognise danger signals instantly, before panic or excitement overrides judgement.

This mode is a rapid-fire card game. A screenshot appears. The player judges it in seconds. Right or wrong, the next card appears almost immediately.

This is the **daily habit mode** — fast, addictive, and short. Players return to it every morning to keep their pattern recognition sharp, the same way a musician runs scales.

---

### How It Looks on Screen

**The screen layout:**
- A realistic screenshot fills most of the screen — an SMS, a Telegram message, a Facebook post, a website URL, a QR code, a Wing receipt, an email
- A countdown timer at the top: **5 seconds** per card
- Two large buttons at the bottom: **REAL** (green) and **SCAM** (red)
- A small score counter in the top corner showing the current streak

---

### The Card Sequence (Example Round)

**Card 1:**
An SMS message appears:
*"Your ACLEDA account has been locked due to suspicious activity. Verify now: acleda-security-kh.com"*
Timer: 5… 4… 3…
Player taps **SCAM**.
✓ Correct — *+10 points. Streak: 1*
**Two-second explanation flashes:** *"Official ACLEDA links never add extra words after the brand name. 'acleda-security-kh' is not a real ACLEDA domain."*

**Card 2:**
A real ABA Bank payment receipt with correct ABA logo, correct domain, and a transaction number.
Timer: 5… 4…
Player taps **REAL**.
✓ Correct — *+10 points. Streak: 2*
**Two-second explanation:** *"Real receipt. ABA receipts always show a full transaction ID and the correct aba.com.kh domain."*

**Card 3:**
A Facebook login page — but the URL bar shows **faceb00k-login.com**
Timer: 5… 4… 3… 2… 1… *Buzz.*
Time runs out. The player did not tap in time.
✗ *Streak broken. Back to 0.*
**Explanation screen (three seconds this time, because they missed it):** *"The URL used the number zero twice — 'faceb00k' — instead of the letter O. This is a classic lookalike domain. Always read the URL character by character before entering a password."*

**Card 4:**
A Wing QR code with a handwritten note underneath: *"Pay here for your order — Wing: 012 XXX XXX"*
Timer: 5… 4… 3…
Player taps **SCAM**.
✓ Correct — *+10 points. Streak: 1*
**Explanation:** *"Legitimate businesses use official Wing merchant accounts, not personal phone numbers. A personal Wing number on a payment request is always a red flag."*

The round continues until the player makes three mistakes. Game over. Their high score is displayed and they are invited to play again or switch to Guardian Mode for deeper learning.

---

### Why the Two-Second Explanation Is Non-Negotiable

Without the explanation, Speed Triage is a reflex game. The player gets faster but not smarter. With the explanation, every card teaches one specific, memorable rule — even in two seconds. After thirty cards, the player has absorbed thirty rules without sitting through a single lecture.

The explanation must follow one format to be effective:
- **What the red flag was** — name it specifically
- **The one rule it teaches** — stated as a simple principle they can carry forward

No more than two sentences. If it takes three sentences to explain, the explanation is too complicated and needs to be simplified.

---

### Scoring and Addiction Loop

- **Streak multiplier:** Correct answers in a row multiply the score. 5 in a row = 1.5x. 10 in a row = 2x. This is why players come back — they want to beat their streak.
- **Daily challenge:** Five cards every morning, curated to the current most common scam type in Cambodia. Completing the daily challenge gives a streak bonus that rolls into the monthly Scam Resistance Score.
- **Leaderboard:** Players can see how their score compares to friends or family members on the same subscription. A parent can see if their child is beating them. A son can challenge his father. This social layer drives engagement without requiring any separate social feature.

---

### Content Refresh Strategy

Speed Triage only works if the cards stay current. Scam types evolve — new platforms appear, new tactics emerge, and old cards become too familiar to be challenging.

New card packs are released monthly, tied to scam types that are currently active in Cambodia. Cards are retired after six months so returning players always face some unfamiliar content. This is a core reason subscribers renew — the content never stops being relevant.

---

## Game Mode 2 — Guardian Mode

### The Concept

In Cambodia, young people are the unofficial digital protectors of their families. When a parent receives a suspicious message, they call their child. When a grandparent nearly falls for a scam, it is a nephew or niece who intervenes. Guardian Mode turns this real-life responsibility into the game mechanic.

The player is not fighting the scammer directly. They are trying to stop someone they love from making a catastrophic mistake — in real time, through a chat window, while the scammer is still online.

This is the **core weekly learning mode** — deeper, longer, and more emotionally engaging than Speed Triage. A single Guardian scenario takes five to ten minutes and covers one complete scam from opening message to resolution.

---

### How It Looks on Screen

The entire interface is a Telegram-style chat window. There are two conversations visible:

- **Left chat (the threat):** The scammer's conversation with the relative. The player can see what the scammer is saying to their Auntie, Mother, or Father — but cannot intervene directly.
- **Right chat (your role):** The player's conversation with their relative. The relative messages the player for advice because something feels uncertain.

The player's job is to give the right advice, quickly enough, through their conversation on the right — before the relative acts on what is happening in the left conversation.

This dual-window design mirrors the real situation. The player does not have direct access to the scammer. They only have access to the relative — who is already partly convinced.

---

### The Full Scenario Structure (Example: Fake Ministry Scam)

**Stage 1 — The Setup**

The player opens a chat. Their Auntie sends a message:

> *"Look at this! A man from the Ministry of Commerce just messaged me on Facebook. He says my business registration has a problem and I need to pay a $200 tax fee right now or they will close my shop tomorrow. He sent me a Wing QR code. Should I pay?"*

On the left panel, the player can see the scammer's messages to the Auntie:

> *Scammer: "Dear Madam, this is an urgent notice from the Ministry of Commerce Digital Compliance Unit. Your shop registration number 0045-PP has been flagged for a missing fee payment. Failure to pay within 2 hours will result in immediate suspension. Please scan the attached Wing QR code to resolve this matter immediately."*

The scammer's profile photo shows a man in a suit. The Facebook page has an official-looking cover photo with the Cambodian flag.

**Stage 2 — First Decision Point**

The player must choose how to respond to the Auntie. The options are:

> **Option A:** *"Don't worry Auntie, $200 is not that much — just pay it quickly so you don't get in trouble with the government."*

> **Option B:** *"Wait, Auntie. Ask him to send you the official Ministry website address so you can verify this is real."*

> **Option C:** *"Stop. The Ministry of Commerce does not contact businesses through personal Facebook messages or collect fees through Wing QR codes. This is a scam. Do not pay anything."*

> **Option D:** *"Send me a screenshot and I will look at it for you. Don't do anything yet."*

**Why these options are designed this way:**
- Option A is the trap — it sounds like caring reassurance, not obvious stupidity
- Option B sounds smart but actually gives the scammer an opportunity to send a fake link
- Option C is correct — but only if the player understands the specific rules about government communication channels
- Option D is reasonable but dangerous if the Auntie is about to pay right now while the player is looking at screenshots

**Stage 3 — The Auntie Pushes Back**

If the player chose Option C, the Auntie does not immediately agree. She responds:

> *"But he has my shop registration number. How would he know that if he was not from the Ministry? And the page has an official logo. He seems real."*

This is the critical second decision point. The player must hold their position against a convincing counter-argument — exactly as they would need to do in real life.

New options appear:

> **Option A:** *"If he knows your shop number, maybe he is from the Ministry after all. Better to be safe and pay."*

> **Option B:** *"Scammers can find business registration numbers online — it is public information. The logo can be copied from the real Ministry website in seconds. The Wing QR code is the proof it is a scam. A real government fine is paid through official bank channels, not a personal Wing account."*

> **Option C:** *"Just call the Ministry's official phone number and ask them if there is any problem with your registration. If there is a real issue, they will tell you."*

**Stage 4 — Resolution**

If the player maintained their position with the right reasoning, the Auntie responds:

> *"Okay. I called the number on the Ministry website. They said they have no record of any problem with my shop and they never use Facebook or Wing for payments. You were right. I almost paid $200. Thank you."*

The screen transitions to the debrief. If the player gave wrong advice at any decision point, the story plays out to its consequence — the Auntie pays, sends a message saying the man has blocked her, and asks what she should do now.

---

### The Debrief Screen (Critical)

After every Guardian scenario — win or lose — the player sees a debrief screen. This is the most important screen in the entire platform.

The debrief has four elements:

**1. What the scam was called**
*"This is a Government Impersonation Scam — one of the most common scam types targeting small business owners in Cambodia."*

**2. The three red flags the player should have spotted**
- *The contact came through a personal Facebook message, not an official government channel*
- *Payment was requested via Wing QR code, not through official bank transfer or government payment portal*
- *The 2-hour deadline was designed to prevent the victim from verifying the claim — legitimate government notices always give days or weeks to respond*

**3. The one rule to remember**
*"Government agencies in Cambodia do not collect fees, fines, or taxes through Facebook Messenger or personal Wing accounts. If anyone claiming to be a government official asks for money through these channels, it is always a scam."*

**4. What to do in real life**
*"If you or a family member receives a message like this: do not pay, do not call any number the scammer provides, and call the actual agency's official number found on their real website."*

The debrief takes about ninety seconds to read. It ends with a share button — players can screenshot the red flags list and send it to their family group chat directly from the app.

---

### The Consequence Screen (When the Player Fails)

If the player gave wrong advice and the Auntie paid, the consequence screen shows the full emotional and financial impact — not to shame the player, but to make the threat concrete.

> *Three days after the incident:*
> *Auntie: "I reported the Facebook page but it is already deleted. Wing said they cannot reverse the transfer because it was made to a personal account. $200 is gone. A neighbour told me the same scammer contacted five other shopkeepers on the same street this week."*

This consequence screen is followed immediately by the debrief — so the player learns from the failure rather than just feeling bad about it.

---

### Guardian Scenario Library

Each scenario covers one scam type, one relationship, and one emotional lever. Scenarios are grouped into four categories:

**Authority Scams** — fake government officials, fake police, fake ministry compliance fees. Emotional lever: fear of legal trouble.

**Opportunity Scams** — fake job offers, fake investment groups, fake lottery winnings. Emotional lever: excitement and financial hope.

**Trust Scams** — romance manipulation, fake friends, fake family emergencies. Emotional lever: loyalty and care for others.

**Technical Scams** — fake software downloads, fake tech support, fake antivirus warnings. Emotional lever: fear of losing data or access.

Each category has five scenarios at launch, ordered from most obvious to most subtle. New scenarios are added monthly. The most challenging scenarios — where the wrong option is genuinely difficult to identify — are unlocked only after the player has completed the earlier, more straightforward ones in that category.

---

## Game Mode 3 — The Investigation

### The Concept

The player is given a suspicious conversation — a full chat log, an email thread, or a screenshot sequence — and must find all the red flags before the timer runs out. There is no dialogue choice here. The player reads, analyses, and identifies.

This mode builds the skill of careful reading under pressure, which is the most transferable skill in cybersecurity awareness. Anyone who completes an Investigation scenario will spend more time reading messages carefully in real life.

---

### How It Looks on Screen

A full chat conversation is displayed on screen, styled exactly like Telegram or Facebook Messenger. The player reads through it and taps on elements they think are suspicious — a domain name, a payment request, a too-good-to-be-true promise, a deadline.

Each tap either highlights a genuine red flag or triggers a small warning that the tapped element is not the key issue. The player has two minutes to find all the red flags in the conversation.

**Example scenario — The Fake Job Offer:**

A full Telegram conversation is shown between a recruiter and a job applicant (the player's role is the observer, not the applicant). The recruiter has sent:
- A professional introduction with a real-looking company name
- A job offer promising $700/month for part-time social media work
- A request to download a file called "Application_Form.exe"
- A request to pay a $50 "registration fee" to receive the first task

The player must tap the red flags. In this scenario there are four:
1. The company name has no verifiable online presence
2. The file extension is .exe — not a form format
3. The salary is unusually high for part-time work with no experience required
4. Legitimate employers never ask applicants to pay fees before starting work

Finding all four within two minutes completes the scenario. Finding fewer shows which ones were missed and why they matter.

---

## Progression System

### Scam Resistance Score

Every player has a Scam Resistance Score — a single number from 0 to 1000 that reflects their overall skill across all modes and all scam categories.

The score is broken down by category so players can see exactly where they are strong and where they need more practice:

| Category | Score |
|---|---|
| Authority Scams | 840 / 1000 |
| Opportunity Scams | 610 / 1000 |
| Trust Scams | 720 / 1000 |
| Technical Scams | 390 / 1000 |

A low score in Technical Scams tells a parent that their child needs more practice with malware and fake download scenarios. A low score in Opportunity Scams tells an adult learner that they are still vulnerable to investment and job offer fraud. The score makes the skill gap visible and specific — not just "needs improvement."

---

### Levels and Unlocks

Players progress through five levels, each named after a role that reflects growing competence:

| Level | Name | Requirement |
|---|---|---|
| 1 | Aware | Complete first scenario in any mode |
| 2 | Alert | Complete one scenario in each category |
| 3 | Defender | Reach 500+ Scam Resistance Score |
| 4 | Guardian | Complete all scenarios in one full category |
| 5 | Protector | Reach 800+ Scam Resistance Score across all categories |

The level names are deliberately chosen to feel like roles rather than ranks. A "Protector" is someone who can keep others safe — which is the actual goal of the platform.

---

### Daily Habit Loop

The habit loop that drives monthly retention:

**Morning (2 minutes):** Five Speed Triage cards. This takes the same amount of time as checking the news. A daily streak badge is earned for completing this every day.

**Weekly (10 minutes):** One new Guardian Mode scenario. This is where the real learning happens. New scenarios drop every Monday.

**Monthly:** A new scenario pack drops for the current most common scam type in Cambodia. Players who complete the monthly pack earn a monthly badge visible on their profile and shareable to family.

The daily streak is the most important retention mechanic. Losing a streak feels bad enough to log in and maintain it. Parents can see whether their child's streak is active. Adult children can see whether their parent has been engaging. This creates gentle social accountability without requiring any explicit reminder system.

---

## UI and Feel Principles

**Everything looks like the real thing.** Telegram chats look like Telegram. Facebook profiles look like Facebook. SMS messages look like the phone's native SMS app. Wing QR codes look like real Wing QR codes. The moment the interface starts looking like a game or an educational app, the learning drops because the player no longer feels like they are in a real situation.

**Khmer first.** All scam messages, all dialogue, all explanations are written in Khmer first and then translated to English for the secondary option. The scam language must sound like how scammers in Cambodia actually write — formal Khmer for authority scams, casual friendly Khmer for trust scams, urgent broken Khmer for rushed payment demands. A translation that was written in English first will never feel authentic enough to train real recognition.

**No red flashing warnings.** The interface does not signal which messages are scams before the player decides. Real life does not come with warning colours. The game should not either.

**Short sessions, complete loops.** Every session — even a two-minute Speed Triage session — must complete the full learning loop: feel the pressure, make a decision, see the consequence, understand why. A session that ends mid-scenario is a session that taught nothing. Scenarios are designed to fit completely within a single sitting.

---

## Summary: The Three Modes and What They Teach

| Mode | Session Length | Core Skill | Frequency |
|---|---|---|---|
| Speed Triage | 2–3 minutes | Instant pattern recognition — spotting danger before it registers consciously | Daily |
| Guardian Mode | 5–10 minutes | Reasoning and response — understanding why something is a scam and communicating that clearly under pressure | Weekly |
| The Investigation | 5–7 minutes | Careful reading — finding multiple red flags in a realistic message or conversation | Weekly |

Together these three modes cover the complete skill set a person needs to protect themselves and their family from online scams in Cambodia.

Speed Triage makes the first instinct sharp. Guardian Mode makes the reasoning solid. The Investigation makes the careful reading habitual. No single mode teaches all three. All three together create genuine, lasting protection.

---

*Document prepared for ScamSim hackathon pitch — Game Design, Cambodia market*
