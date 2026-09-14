#!/usr/bin/env node
/**
 * Gate 4 — the API, exercised with no UI at all.
 *
 * The important assertions are the ones about what does NOT come back: the
 * answer key must never reach the browser before a decision is committed, and
 * a stage must never be answerable twice or out of order. Those three rules
 * are what make the score mean anything.
 *
 * Run:  npm run test:api          (server must be running)
 *       BASE=https://… npm run test:api
 */

const BASE = process.env.BASE ?? 'http://localhost:3001'

let passed = 0
let failed = 0

function check(name, ok, detail = '') {
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
    /* non-JSON response — the raw text is what we assert on */
  }
  return { status: res.status, text, json }
}

/** Raw-text assertion: these substrings must not appear anywhere in a payload. */
function leaks(raw) {
  return ['"isCorrect"', '"reply"', '"note"'].filter((k) => raw.includes(k))
}

console.log(`\nPrayat API — ${BASE}\n`)

/* ---- health -------------------------------------------------------------- */
console.log('health')
const health = await call('GET', '/api/health')
check('GET /api/health is 200', health.status === 200, `got ${health.status}`)
check('reports status ok', health.json?.status === 'ok')
check('reports a scenario count', typeof health.json?.scenariosLoaded === 'number')
check('seeded at least one scenario', (health.json?.scenariosLoaded ?? 0) > 0,
  'content/ did not seed — the rest of this run is meaningless')

/* ---- catalogue ----------------------------------------------------------- */
console.log('\ncatalogue')
const list = await call('GET', '/api/scenarios')
check('GET /api/scenarios is 200', list.status === 200)
check('returns an array', Array.isArray(list.json))
check('catalogue carries no stages', !list.text.includes('"stages"'))
check('catalogue leaks no answers', leaks(list.text).length === 0, leaks(list.text).join(', '))

const scenarioId = list.json?.[0]?.id
check('catalogue has an id to play', Boolean(scenarioId))

const detail = await call('GET', `/api/scenarios/${scenarioId}`)
check('GET /api/scenarios/:id is 200', detail.status === 200)
check('detail leaks no answers', leaks(detail.text).length === 0, leaks(detail.text).join(', '))
check('detail sends stage 1 only', detail.json?.stage?.id === 1)
check('unknown scenario is 404', (await call('GET', '/api/scenarios/nope')).status === 404)

/* ---- a full playthrough -------------------------------------------------- */
console.log('\nplaythrough — no UI')
const created = await call('POST', '/api/sessions', { scenarioId, language: 'kh' })
check('POST /api/sessions is 201', created.status === 201, `got ${created.status}`)
check('returns a session id', typeof created.json?.sessionId === 'string')
check('session payload leaks no answers', leaks(created.text).length === 0, leaks(created.text).join(', '))
check('stage 1 has four options', created.json?.stage?.options?.length === 4)

const sid = created.json?.sessionId

check('invalid body is 400', (await call('POST', '/api/sessions', { nope: 1 })).status === 400)
check(
  'unknown scenario is 404',
  (await call('POST', '/api/sessions', { scenarioId: 'nope', language: 'kh' })).status === 404,
)

/* ---- ordering rules ------------------------------------------------------ */
console.log('\nordering')
const skip = await call('POST', `/api/sessions/${sid}/decisions`, { stageId: 3, optionId: 'a' })
check('answering out of order is 409', skip.status === 409, `got ${skip.status}`)
check('out-of-order names the reason', skip.json?.error === 'stage_out_of_order')

const early = await call('GET', `/api/sessions/${sid}/debrief`)
check('debrief before finishing is 409', early.status === 409, `got ${early.status}`)

const s1 = await call('POST', `/api/sessions/${sid}/decisions`, { stageId: 1, optionId: 'c' })
check('stage 1 answered, 200', s1.status === 200)
check('result declares correctness AFTER committing', typeof s1.json?.isCorrect === 'boolean')
check('result carries her reply', typeof s1.json?.relativeReply?.kh === 'string')
check('next stage carries no answers', leaks(JSON.stringify(s1.json?.nextStage ?? {})).length === 0)

const repeat = await call('POST', `/api/sessions/${sid}/decisions`, { stageId: 1, optionId: 'a' })
check('answering the same stage twice is 409', repeat.status === 409, `got ${repeat.status}`)
check('repeat names the reason', repeat.json?.error === 'stage_already_answered')

await call('POST', `/api/sessions/${sid}/decisions`, { stageId: 2, optionId: 'b' })
const s3 = await call('POST', `/api/sessions/${sid}/decisions`, { stageId: 3, optionId: 'c' })
check('final stage reports done', s3.json?.done === true)
check('final stage has no next stage', s3.json?.nextStage === null)

const after = await call('POST', `/api/sessions/${sid}/decisions`, { stageId: 4, optionId: 'a' })
check('answering a finished session is 409', after.status === 409, `got ${after.status}`)

/* ---- debrief ------------------------------------------------------------- */
console.log('\ndebrief')
const debrief = await call('GET', `/api/sessions/${sid}/debrief`)
check('GET debrief is 200 once finished', debrief.status === 200)
check('scores 300 for three correct', debrief.json?.score === 300, `got ${debrief.json?.score}`)
check('max score is 300', debrief.json?.maxScore === 300)
check('won is true', debrief.json?.won === true)
check('level reflects the score', debrief.json?.level === 'Guardian', `got ${debrief.json?.level}`)
check('three red flags', debrief.json?.debrief?.redFlags?.length === 3)
check('records three decisions', debrief.json?.decisions?.length === 3)

/* ---- the recovery rule --------------------------------------------------- */
console.log('\nrecovery rule — the last word is the one that counts')
const r = await call('POST', '/api/sessions', { scenarioId, language: 'kh' })
const rid = r.json.sessionId
await call('POST', `/api/sessions/${rid}/decisions`, { stageId: 1, optionId: 'a' })
await call('POST', `/api/sessions/${rid}/decisions`, { stageId: 2, optionId: 'a' })
await call('POST', `/api/sessions/${rid}/decisions`, { stageId: 3, optionId: 'c' })
const recovered = await call('GET', `/api/sessions/${rid}/debrief`)
check('stumbled twice, correct last -> won', recovered.json?.won === true)
check('stumbled twice scores 100', recovered.json?.score === 100, `got ${recovered.json?.score}`)

const l = await call('POST', '/api/sessions', { scenarioId, language: 'kh' })
const lid = l.json.sessionId
await call('POST', `/api/sessions/${lid}/decisions`, { stageId: 1, optionId: 'c' })
await call('POST', `/api/sessions/${lid}/decisions`, { stageId: 2, optionId: 'b' })
await call('POST', `/api/sessions/${lid}/decisions`, { stageId: 3, optionId: 'a' })
const lost = await call('GET', `/api/sessions/${lid}/debrief`)
check('correct twice, wrong last -> lost', lost.json?.won === false)
check('correct twice scores 200', lost.json?.score === 200, `got ${lost.json?.score}`)

/* ---- the stored record --------------------------------------------------- */
console.log('\nstored record — for the judge who asks if anything is saved')
const record = await call('GET', `/api/sessions/${sid}`)
check('GET /api/sessions/:id is 200', record.status === 200)
check('has timestamps', typeof record.json?.startedAt === 'number' && record.json?.finishedAt)
check('every decision is timestamped', record.json?.decisions?.every((d) => d.decidedAt > 0))
check('unknown session is 404', (await call('GET', '/api/sessions/nope')).status === 404)

/* ---- unknown endpoints --------------------------------------------------- */
console.log('\nrouting')
const bogus = await call('GET', '/api/does-not-exist')
check('unknown /api path is 404 JSON, not the SPA', bogus.status === 404 && bogus.json !== null,
  `got ${bogus.status} ${bogus.text.slice(0, 40)}`)
const spa = await call('GET', '/guardian')
check('a client route serves the SPA, not a 404', spa.status === 200)

/* ---- result -------------------------------------------------------------- */
console.log(`\n${passed} passed, ${failed} failed\n`)
process.exit(failed === 0 ? 0 : 1)
