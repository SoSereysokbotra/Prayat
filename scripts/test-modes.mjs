#!/usr/bin/env node
/**
 * Speed Triage and The Investigation, exercised with no UI.
 *
 * The rules being checked are the ones that were explicitly decided, and each
 * has a reason it matters:
 *   - a timeout is a mistake, or a player who never taps cannot lose
 *   - the multiplier applies to the card, not the run total
 *   - a wrong tap costs time, not the run
 *   - a re-tap neither scores twice nor is punished twice
 *   - neither mode leaks its answers before the player commits
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

console.log(`\nSpeed Triage & The Investigation — ${BASE}\n`)

/* ==========================================================================
   Speed Triage
   ========================================================================== */
console.log('speed triage — the card carries no verdict')

const decks = await call('GET', '/api/triage/decks')
check('GET /api/triage/decks is 200', decks.status === 200)
check('at least one deck', (decks.json?.length ?? 0) > 0)
check('deck list leaks nothing', leaks(decks.text, ['isScam', 'explanation', 'cards']).length === 0)

const run = await call('POST', '/api/triage/sessions', { language: 'kh' })
check('POST /api/triage/sessions is 201', run.status === 201, `got ${run.status}`)
check('deals a card', Boolean(run.json?.card?.id))
check(
  'the card leaks no verdict',
  leaks(run.text, ['isScam', 'explanation']).length === 0,
  leaks(run.text, ['isScam', 'explanation']).join(', '),
)
check('reports the mistake allowance', run.json?.maxMistakes === 3)

const sid = run.json?.sessionId
let card = run.json?.card

/* ---- a timeout is a mistake, not merely a broken streak ---- */
console.log('\n  a timeout is a mistake')
const t = await call('POST', `/api/triage/sessions/${sid}/answers`, {
  cardId: card.id,
  verdict: 'timeout',
})
check('timeout is accepted as a verdict', t.status === 200, `got ${t.status}`)
check('timeout is scored wrong', t.json?.isCorrect === false)
check('timeout counts toward mistakes', t.json?.mistakes === 1, `mistakes=${t.json?.mistakes}`)
check('timeout awards no points', t.json?.pointsAwarded === 0)
check('the verdict is disclosed only now', typeof t.json?.wasScam === 'boolean')
check('the explanation arrives with it', typeof t.json?.explanation?.kh === 'string')

/* ---- three timeouts end the run: it must be loseable ---- */
card = t.json?.nextCard
const t2 = await call('POST', `/api/triage/sessions/${sid}/answers`, {
  cardId: card.id,
  verdict: 'timeout',
})
card = t2.json?.nextCard
const t3 = await call('POST', `/api/triage/sessions/${sid}/answers`, {
  cardId: card.id,
  verdict: 'timeout',
})
check('three timeouts end the run', t3.json?.done === true, `done=${t3.json?.done}`)
check('no card is dealt after the run ends', t3.json?.nextCard === null)

const after = await call('POST', `/api/triage/sessions/${sid}/answers`, {
  cardId: 'c01',
  verdict: 'scam',
})
check('answering a finished run is 409', after.status === 409, `got ${after.status}`)

/* ---- ordering ---- */
console.log('\n  ordering and duplicates')
const r2 = await call('POST', '/api/triage/sessions', { language: 'kh' })
const sid2 = r2.json.sessionId
const wrongCard = await call('POST', `/api/triage/sessions/${sid2}/answers`, {
  cardId: 'not-the-next-one',
  verdict: 'scam',
})
check('answering out of order is 409', wrongCard.status === 409, `got ${wrongCard.status}`)

/* ---- the multiplier applies to the card, not the run total ---- */
console.log('\n  the multiplier applies to the card, not the run total')
const fresh = await call('POST', '/api/triage/sessions', { language: 'kh' })
const sid3 = fresh.json.sessionId
let next = fresh.json.card
const awards = []

// Answer correctly every time by asking the server what it was, then agreeing
// with it on the NEXT run is impossible — so instead walk the deck and record
// what each correct answer paid.
for (let i = 0; i < 11 && next; i++) {
  // Try 'scam'; if wrong, the streak resets — which is itself worth observing.
  const res = await call('POST', `/api/triage/sessions/${sid3}/answers`, {
    cardId: next.id,
    verdict: 'scam',
  })
  if (res.status !== 200) break
  awards.push({
    correct: res.json.isCorrect,
    points: res.json.pointsAwarded,
    multiplier: res.json.multiplier,
    streak: res.json.streak,
  })
  if (res.json.done) break
  next = res.json.nextCard
}

const firstCorrect = awards.find((a) => a.correct)
check('a correct card at streak 0 pays 10', firstCorrect ? firstCorrect.points === 10 : false,
  firstCorrect ? `paid ${firstCorrect.points}` : 'no correct answer in this deck order')
check('a wrong card pays 0', awards.filter((a) => !a.correct).every((a) => a.points === 0))
// The multiplier is computed from the streak BEFORE this card. On a correct
// answer the reported streak is that number plus one.
const expected = (streakBefore) => (streakBefore >= 10 ? 2 : streakBefore >= 5 ? 1.5 : 1)
check(
  'the multiplier matches the streak the card was answered at',
  awards.filter((a) => a.correct).every((a) => a.multiplier === expected(a.streak - 1)),
  awards.filter((a) => a.correct).map((a) => `streak${a.streak - 1}->x${a.multiplier}`).join(' '),
)

/* ==========================================================================
   The Investigation
   ========================================================================== */
console.log('\nthe investigation — the conversation without the answers')

const list = await call('GET', '/api/investigations')
check('GET /api/investigations is 200', list.status === 200)
check('list leaks no flags', leaks(list.text, ['flags', 'explanation']).length === 0)
check('but does say how many there are', typeof list.json?.[0]?.flagCount === 'number')

const inv = await call('POST', '/api/investigations/sessions', { language: 'kh' })
check('POST /api/investigations/sessions is 201', inv.status === 201, `got ${inv.status}`)
check(
  'the conversation leaks no flags',
  leaks(inv.text, ['flags', 'explanation']).length === 0,
  leaks(inv.text, ['flags', 'explanation']).join(', '),
)
check('elements are delivered', (inv.json?.investigation?.elements?.length ?? 0) > 0)
check('the flag count is delivered', inv.json?.investigation?.flagCount === 4)
check('the duration is delivered', inv.json?.investigation?.durationSeconds === 180)

const isid = inv.json.sessionId
const elements = inv.json.investigation.elements.map((e) => e.id)

/* ---- a wrong tap costs time, not the run ---- */
console.log('\n  a wrong tap costs time, not the run')
const miss = await call('POST', `/api/investigations/sessions/${isid}/taps`, {
  elementId: 'e05',
})
check('a miss is 200, not an error', miss.status === 200, `got ${miss.status}`)
check('a miss reports hit: false', miss.json?.hit === false)
check('a miss costs 10 seconds', miss.json?.penaltySeconds === 10)
check('a miss gives no explanation', miss.json?.explanation === null)
check('a miss does not end the run', miss.json?.done === false)

const reTap = await call('POST', `/api/investigations/sessions/${isid}/taps`, {
  elementId: 'e05',
})
check('re-tapping the same element is 409', reTap.status === 409, `got ${reTap.status}`)

const bogus = await call('POST', `/api/investigations/sessions/${isid}/taps`, {
  elementId: 'nope',
})
check('tapping an element that does not exist is 404', bogus.status === 404)

/* ---- hits ---- */
console.log('\n  finding every flag')
let found = 0
for (const id of elements) {
  const res = await call('POST', `/api/investigations/sessions/${isid}/taps`, { elementId: id })
  if (res.status !== 200) continue
  if (res.json.hit) {
    found = res.json.found
    if (res.json.explanation === null) check('a hit carries its explanation', false)
  }
  if (res.json.done) break
}
check('all four flags are findable', found === 4, `found ${found}`)

const summary = await call('POST', `/api/investigations/sessions/${isid}/finish`)
check('finish is 200', summary.status === 200)
check('four flags score 100', summary.json?.score === 100, `got ${summary.json?.score}`)
check('complete run reports complete', summary.json?.complete === true)
check('nothing missed when all were found', summary.json?.missed?.length === 0)

/* ---- a partial run names what was missed ---- */
console.log('\n  a partial run names what was missed')
const partial = await call('POST', '/api/investigations/sessions', { language: 'kh' })
const pid = partial.json.sessionId
await call('POST', `/api/investigations/sessions/${pid}/taps`, { elementId: 'e01' })
const partialSummary = await call('POST', `/api/investigations/sessions/${pid}/finish`)
check('one flag scores 25', partialSummary.json?.score === 25, `got ${partialSummary.json?.score}`)
check('reports three missed', partialSummary.json?.missed?.length === 3)
check('missed flags come with their explanations',
  partialSummary.json?.missed?.every((m) => m.explanation !== undefined))
check('incomplete run reports incomplete', partialSummary.json?.complete === false)

const again = await call('POST', `/api/investigations/sessions/${pid}/finish`)
check('finish is idempotent', again.status === 200 && again.json?.score === 25)

console.log(`\n${passed} passed, ${failed} failed\n`)
process.exit(failed === 0 ? 0 : 1)
