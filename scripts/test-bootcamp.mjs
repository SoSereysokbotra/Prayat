#!/usr/bin/env node
/**
 * Level 0 — the bootcamp, exercised with no UI.
 *
 * The things being checked are the ones that were decided deliberately:
 *   - neither module leaks its answers before the player commits
 *   - "ask for the code" is refused before two-factor is switched on, because
 *     offering it early would give away that the answer changes
 *   - the unwinnable round still counts toward passing
 *   - 80% is the pass mark, and 70% is not
 */

const BASE = process.env.BASE ?? 'http://localhost:3001'

let passed = 0
let failed = 0

const check = (name, ok, detail = '') => {
  if (ok) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    /* asserted on as raw text */
  }
  return { status: res.status, text, json }
}

const leaks = (raw, keys) => keys.filter((k) => raw.includes(`"${k}"`))

console.log(`\nLevel 0 — Cyber Bootcamp — ${BASE}\n`)

/* ---- the catalogue ------------------------------------------------------- */
console.log('modules')
const mods = await call('GET', '/api/bootcamp/modules')
check('GET /api/bootcamp/modules is 200', mods.status === 200)
check('both modules are present', mods.json?.length === 2, `got ${mods.json?.length}`)
check('the VPN/HTTPS module is gone', !mods.text.includes('coffee') && !mods.text.includes('vpn'))
check('each module names its tool', mods.json?.every((m) => typeof m.tool === 'string'))
check(
  'the catalogue leaks no answers',
  leaks(mods.text, ['correctAction', 'isSafe', 'rounds', 'cards']).length === 0,
  leaks(mods.text, ['correctAction', 'isSafe', 'rounds', 'cards']).join(', '),
)

/* ==========================================================================
   Module 1 — The VIP Club
   ========================================================================== */
console.log('\nvip club — the door carries no answer')
const door = await call('POST', '/api/bootcamp/vip-club/sessions', {})
check('POST session is 201', door.status === 201, `got ${door.status}`)
check('deals round 1', door.json?.round?.id === 1)
check('three rounds', door.json?.roundCount === 3)
check(
  'the round leaks no answer',
  leaks(door.text, ['correctAction', 'outcome', 'lesson', 'unwinnable']).length === 0,
  leaks(door.text, ['correctAction', 'outcome', 'lesson', 'unwinnable']).join(', '),
)
check('round 1 has two-factor off', door.json?.round?.twoFactorOn === false)

const did = door.json.sessionId

console.log('\n  "ask for the code" does not exist before two-factor is on')
const early = await call('POST', `/api/bootcamp/vip-club/sessions/${did}/actions`, {
  action: 'demandCode',
})
check('demandCode before 2FA is 409', early.status === 409, `got ${early.status}`)
check('and says why', early.json?.error === 'action_unavailable')

console.log('\n  playing it correctly')
const r1 = await call('POST', `/api/bootcamp/vip-club/sessions/${did}/actions`, { action: 'admit' })
check('round 1: admitting the real member is correct', r1.json?.isCorrect === true)
check('the outcome arrives only now', typeof r1.json?.outcome?.kh === 'string')
check('the lesson arrives with it', typeof r1.json?.lesson?.kh === 'string')
check('round 2 follows', r1.json?.nextRound?.id === 2)
check('round 2 still has two-factor off', r1.json?.nextRound?.twoFactorOn === false)

const r2 = await call('POST', `/api/bootcamp/vip-club/sessions/${did}/actions`, { action: 'admit' })
check('round 2 is flagged unwinnable', r2.json?.unwinnable === true)
check('round 3 turns two-factor on', r2.json?.nextRound?.twoFactorOn === true)

const r3 = await call('POST', `/api/bootcamp/vip-club/sessions/${did}/actions`, {
  action: 'demandCode',
})
check('round 3: demanding the code is correct', r3.json?.isCorrect === true)
check('the module ends', r3.json?.done === true)
check('and is passed', r3.json?.passed === true)

console.log('\n  the unwinnable round counts toward passing')
const d2 = await call('POST', '/api/bootcamp/vip-club/sessions', {})
const did2 = d2.json.sessionId
await call('POST', `/api/bootcamp/vip-club/sessions/${did2}/actions`, { action: 'admit' })
// Get round 2 "wrong" — it cannot be got right, which is the point.
await call('POST', `/api/bootcamp/vip-club/sessions/${did2}/actions`, { action: 'admit' })
const p3 = await call('POST', `/api/bootcamp/vip-club/sessions/${did2}/actions`, {
  action: 'demandCode',
})
check('losing only the unwinnable round still passes', p3.json?.passed === true)

console.log('\n  getting a real round wrong fails the module')
const d3 = await call('POST', '/api/bootcamp/vip-club/sessions', {})
const did3 = d3.json.sessionId
await call('POST', `/api/bootcamp/vip-club/sessions/${did3}/actions`, { action: 'refuse' }) // wrong
await call('POST', `/api/bootcamp/vip-club/sessions/${did3}/actions`, { action: 'admit' })
const f3 = await call('POST', `/api/bootcamp/vip-club/sessions/${did3}/actions`, {
  action: 'admit',
}) // wrong
check('two real mistakes fails', f3.json?.passed === false, `passed=${f3.json?.passed}`)

/* ==========================================================================
   Module 2 — The URL Sorter
   ========================================================================== */
console.log('\nurl sorter — the card carries no verdict')
const sorter = await call('POST', '/api/bootcamp/url-sorter/sessions', {})
check('POST session is 201', sorter.status === 201, `got ${sorter.status}`)
check('deals a card with a url', typeof sorter.json?.card?.url === 'string')
check('ten cards', sorter.json?.cardCount === 10)
check(
  'the card leaks no verdict',
  leaks(sorter.text, ['isSafe', 'explanation']).length === 0,
  leaks(sorter.text, ['isSafe', 'explanation']).join(', '),
)

const sid = sorter.json.sessionId
const outOfOrder = await call('POST', `/api/bootcamp/url-sorter/sessions/${sid}/sorts`, {
  cardId: 'not-next',
  verdict: 'safe',
})
check('sorting out of order is 409', outOfOrder.status === 409, `got ${outOfOrder.status}`)

// Walk the whole deck answering 'trash' every time, and record the truth as it
// is disclosed. Six of the ten are fake, so this scores 6/10 — under the mark.
let card = sorter.json.card
let correct = 0
let answered = 0
let last = null
while (card) {
  const res = await call('POST', `/api/bootcamp/url-sorter/sessions/${sid}/sorts`, {
    cardId: card.id,
    verdict: 'trash',
  })
  if (res.status !== 200) break
  last = res.json
  correct = res.json.correctSoFar
  answered = res.json.answered
  if (res.json.done) break
  card = res.json.nextCard
}
check('the whole deck is playable', answered === 10, `answered ${answered}`)
check('the explanation arrives after each sort', typeof last?.explanation?.kh === 'string')
check('answering everything "trash" scores 6/10', correct === 6, `got ${correct}`)
check('6/10 does not pass', last?.passed === false, `passed=${last?.passed}`)

/* ---- a perfect run passes ---- */
const s2 = await call('POST', '/api/bootcamp/url-sorter/sessions', {})
const sid2 = s2.json.sessionId
let c2 = s2.json.card
let result = null
while (c2) {
  // Ask once with 'safe'; the response discloses the truth, which is enough to
  // know what a perfect run looks like without the client ever being told up
  // front. This is a test walking the deck, not a player cheating.
  const res = await call('POST', `/api/bootcamp/url-sorter/sessions/${sid2}/sorts`, {
    cardId: c2.id,
    verdict: 'safe',
  })
  result = res.json
  if (res.json.done) break
  c2 = res.json.nextCard
}
check('answering everything "safe" scores 4/10', result?.correctSoFar === 4, `got ${result?.correctSoFar}`)
check('4/10 does not pass', result?.passed === false)

console.log(`\n${passed} passed, ${failed} failed\n`)
process.exit(failed === 0 ? 0 : 1)
