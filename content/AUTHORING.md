# Authoring guide — `shop-payment-scam.json`

**Writer:** So Sereysokbotra · **Reviewer:** ⚠️ still unassigned (see below)

JSON cannot hold comments, so the guidance lives here. Every field in the JSON
starts empty. Fill them in; `npm run validate:content` tells you what is missing.

---

## Rule 1 — Khmer first, always

Write the `kh` field first. Translate to `en` afterwards.

Never the other way round. A Khmer sentence translated from English keeps English
sentence rhythm, and a 54-year-old shopkeeper who has actually received one of
these messages will feel that instantly. The register matters more than the
grammar:

| Scam type | Register |
|---|---|
| Authority (this one) | Formal, official-sounding Khmer. Bureaucratic. Slightly stiff. |
| Trust | Casual, warm, familiar |
| Rushed payment demand | Urgent, clipped, slightly broken |

The `en` field exists for the language toggle and for judges. It is a
translation, not the source.

## Rule 2 — Brand policy (Phase 0, Option B)

**Named as a channel: allowed.**
"He messaged her on Facebook." · "He sent a Wing QR code." · "He asked her to pay
to a personal Wing number."

**Drawn as branding: never.**
No bank logos. No fake login screens. No fake receipts. No Ministry letterhead,
seal, or crest. The scammer's avatar is a generic photo, not a copied
institutional profile.

A real brand may be *named* as the channel a scammer abused. It may never be
*drawn*.

## Rule 3 — Every wrong option must be believable

If the wrong answer is obviously stupid, no learning happens. Scammers are
persuasive professionals and the game has to respect that.

---

## The three stages

The source design doc has four stages, the last of which has no decision. This
build has **three stages, each with a real decision**, because the final decision
determines win or lose.

| Stage | What happens | Her state of mind |
|---|---|---|
| **1 — The ask** | The threat arrives. She forwards it and asks whether to pay. | Worried, looking for permission |
| **2 — The pushback** | She counters: *"But he has my shop registration number. How would he know that?"* | Half convinced by him, arguing with you |
| **3 — The escalation** | The scammer applies final pressure — the deadline closes, he calls, he names a consequence. Your last word before the money moves. | Frightened, about to act |

Stage 3 is the one with no source material. It is also the one that decides the
outcome, so it carries the most weight.

---

## Option roles — fixed across all three stages

| id | Role | Must feel like |
|---|---|---|
| **a** | The trap | Caring reassurance. *"It's not much, just pay it."* Never stupid — kind. |
| **b** | Sounds smart | A careful-sounding step that actually helps the scammer. Asking him for "the official website" invites a fake link. |
| **c** | Correct | Requires knowing the specific rule about official channels. Not just "it's a scam" — *why*. |
| **d** | Too slow | Entirely reasonable, and two hours too late. *"Let me come to the shop after work and we'll look together."* |

**The correct option is not always `c`.** Vary which id carries the correct role
across the three stages so a player cannot pattern-match the letter instead of
the reasoning. The validator only checks that **exactly one** option per stage
has `isCorrect: true`.

### `reply` — required on every option

Her response to *that specific choice*. Twelve options, twelve different replies.
This is where the scenario earns its realism: she should not react the same way
to being reassured as to being corrected.

On a correct choice at stages 1 and 2, she does **not** simply agree — she
pushes into the next stage. Agreement only comes at the end.

### `note` — wrong options only

One line on why this option was tempting. Shown in the debrief, not during play.
The correct option does not need one.

---

## The debrief

The most important screen in the platform. Ninety seconds.

| Field | What it is |
|---|---|
| `scamName` | Name the scam. *"Government Impersonation Scam"* |
| `redFlags` | Exactly **3**. Specific and spottable, not general advice. |
| `rule` | **One** rule, carried forward into real life. The heaviest element on the screen. |
| `realLifeAction` | What to do if this happens for real — concrete steps |
| `outcomeWin` | She verifies, she doesn't pay, she thanks you |
| `outcomeLose` | She pays |
| `consequence` | **Three days later.** Page deleted. Transfer irreversible. $200 gone. Other shopkeepers on the same street hit by the same person. Shown full-screen before the lose debrief — it makes the threat concrete without shaming the player. |

**The test for `rule`:** could the player use this sentence on Tuesday, about a
message you did not write? If not, it is too specific to this scenario.

---

## Before Gate 2

- [ ] Every `kh` field filled, written in Khmer first
- [ ] Every `en` field is a translation of the Khmer, not the source
- [ ] 12 options, 12 distinct replies
- [ ] Exactly one correct option per stage, and not always the same letter
- [ ] Exactly 3 red flags
- [ ] `consequence` written
- [ ] No drawn branding anywhere
- [ ] `npm run validate:content` passes

### ⚠️ The reviewer — still open

The decision sheet lists So Sereysokbotra as both writer and reviewer. That does
not work: **the writer and the reviewer must be different people, and the
reviewer must be over 45 and not on the team.** You cannot audit your own ear for
register.

This is not a hire. It is a parent, an aunt, a neighbour who runs a shop. Ten
minutes.

Ask them exactly one question:

> **"Would you believe this message?"**

Not *"is this good Khmer?"* — you need credibility, not grammar.

**Reviewer name:** ______________________
