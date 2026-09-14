# Bootcamp authoring

Two modules. Same rules as the scenarios: **Khmer first**, the `en` field is a
translation of it, and the brand policy from Phase 0 applies.

---

## ⛔ Before anything else: the four `REPLACE-` URLs

`url-sorter.json` contains four placeholders:

```
REPLACE-verified-bank-domain.com.kh
REPLACE-verified-bank-security-update-kh.com
REPLACE-verified-wallet-domain.com.kh
REPLACE-verified-wallet-domain-login.net
```

**Do not guess these.** Open the real institution's site — from a search result
or a printed statement, never from a link in a message — and copy the domain
exactly as the address bar shows it.

A URL sorter that teaches the *wrong* safe domain is worse than no URL sorter
at all. A player who learns "aba-something.com is the real one" when it is not
has been trained to trust a phishing domain by the app that was supposed to
protect them. This is the one place in the project where being wrong is
actively dangerous rather than merely unfinished.

The two "trash" ones should be a plausible lookalike of the verified real one —
build them *from* the real domain once you have it.

`npm run validate:bootcamp` fails while any `REPLACE-` remains.

### The rule the explanations should teach

Not *"read backwards from the .com or .kh"* — that gives the wrong answer on a
`.com.kh` domain, because `com.kh` is a registry suffix and not an owner.

The rule that works:

> Find the last part that is not a country code or a generic suffix like `com`,
> `net`, `org`. **The single label immediately before that suffix is who owns
> the site.** Everything to the left of it is just decoration the owner chose.

Worked through the cards:

| URL | Owner | Why |
|---|---|---|
| `accounts.google.com` | `google` | `accounts` is Google's own subdomain |
| `google.com.verify-login.net` | `verify-login` | `google.com` here is only a prefix someone else picked |
| `facebook.com.security-check.info` | `security-check` | same trick |
| `faceb00k.com` | `faceb00k` | two zeros, not letter o |
| `rnicrosoft.com` | `rnicrosoft` | `r` + `n` reads as `m` at small sizes |

Card `u04` is the most important one in the deck. It is the trick that catches
people who *have* learned to look for a familiar name, because the familiar
name is right there at the front.

---

## Module 1 — The VIP Club

Three rounds, and **round 2 is designed to be lost.**

| Round | At the door | 2FA | Correct | What it teaches |
|---|---|---|---|---|
| 1 | A real member with the password | off | admit | A password works when the person is genuine |
| 2 | A stranger who guessed the password | off | refuse | **You had no way to tell.** That is the point. |
| 3 | The same stranger, password again | **on** | demand the code | The code is proof; the password never was |

Round 2 carries `unwinnable: true`, so the UI presents the result as a lesson
rather than a mistake. Do not write its `outcome` as a telling-off — the player
did nothing wrong, the system did. That sentence is the argument for 2FA, and
it should read like a realisation, not a penalty.

Round 3 is the payoff: the same visitor, the same password, a different
outcome. Keep the visitor recognisably the same person so the contrast lands.

---

## Module 2 — The URL Sorter

Ten cards, six of them fake. Pass mark is 80%, so a player may miss two.

Explanations are **two sentences at most**: name the trick, then the rule. The
same discipline as a Speed Triage card.

---

## Both modules

- `title`, `blurb` and `analogy` are shown before the module starts. The
  analogy is what makes the concept stick — "the bouncer at the VIP club",
  "reading a street address, not a billboard".
- Every `kh` written before its `en`.
- `npm run validate:bootcamp` lists what is still empty.
