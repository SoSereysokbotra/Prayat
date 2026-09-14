#!/usr/bin/env node
/**
 * Pre-flight — run this before you present.
 *
 * Checks a live deployment the way a judge would meet it: cold, from outside,
 * with no knowledge of the code. Every failure here is something that would
 * have happened on stage instead.
 *
 *   npm run preflight                                  (local)
 *   BASE=https://prayat.onrender.com npm run preflight (the real one)
 *
 * The single most useful thing this does is wake a sleeping free-tier service
 * and tell you how long the cold start took.
 */

const BASE = (process.env.BASE ?? 'http://localhost:3001').replace(/\/$/, '')

let failed = 0
let warned = 0

const ok = (name, detail = '') => console.log(`  ✓ ${name}${detail ? `  ${detail}` : ''}`)
const bad = (name, detail = '') => {
  failed++
  console.error(`  ✗ ${name}${detail ? `  — ${detail}` : ''}`)
}
const warn = (name, detail = '') => {
  warned++
  console.warn(`  ! ${name}${detail ? `  — ${detail}` : ''}`)
}

async function get(path) {
  const started = Date.now()
  try {
    const res = await fetch(BASE + path, { redirect: 'follow' })
    const text = await res.text()
    return { status: res.status, text, ms: Date.now() - started, headers: res.headers }
  } catch (e) {
    return { status: 0, text: '', ms: Date.now() - started, error: e.message }
  }
}

console.log(`\nPre-flight — ${BASE}\n`)

/* ---- 1. is it awake -------------------------------------------------------- */
console.log('waking the service')
const health = await get('/api/health')

if (health.status === 0) {
  bad('unreachable', health.error)
  console.error('\nThe service is not responding. Nothing below will pass.\n')
  process.exit(1)
}

if (health.ms > 10000) {
  warn(`cold start took ${(health.ms / 1000).toFixed(1)}s`, 'a judge scanning your QR would wait this long — hit this endpoint before you walk on')
} else if (health.ms > 2000) {
  warn(`responded in ${(health.ms / 1000).toFixed(1)}s`, 'slower than it should be')
} else {
  ok('awake', `${health.ms}ms`)
}

let parsed = null
try {
  parsed = JSON.parse(health.text)
} catch {
  /* handled below */
}

if (parsed?.status === 'ok') ok('health reports ok')
else bad('health did not report ok', health.text.slice(0, 80))

if ((parsed?.scenariosLoaded ?? 0) > 0) ok('content seeded', `${parsed.scenariosLoaded} scenario(s)`)
else bad('no scenarios seeded', 'the app will have nothing to play')

/* ---- 2. https, required for PWA install ------------------------------------ */
console.log('\ninstallability')
if (BASE.startsWith('https://')) ok('served over HTTPS')
else if (BASE.includes('localhost')) warn('not HTTPS', 'fine locally; the real deploy must be HTTPS or Android will not offer Install')
else bad('not HTTPS', 'Android will not offer to install this')

const manifest = await get('/manifest.webmanifest')
if (manifest.status === 200) {
  ok('manifest served')
  try {
    const m = JSON.parse(manifest.text)
    if (m.icons?.some((i) => i.sizes === '512x512')) ok('512px icon declared')
    else bad('no 512px icon', 'Android needs one to install')
    if (m.icons?.some((i) => i.purpose === 'maskable')) ok('maskable icon declared')
    else warn('no maskable icon', 'the launcher will crop your mark')
    if (m.display === 'standalone') ok('display is standalone')
    else warn(`display is "${m.display}"`, 'expected standalone')
  } catch {
    bad('manifest is not valid JSON')
  }
} else bad('manifest missing', `got ${manifest.status}`)

const sw = await get('/sw.js')
if (sw.status === 200) ok('service worker served', `${sw.text.length} bytes`)
else bad('service worker missing', `got ${sw.status}`)

const font = await get('/fonts/NotoSansKhmer-Variable.woff2')
if (font.status === 200) ok('Khmer font served', `${font.text.length} bytes`)
else bad('Khmer font missing', 'every Khmer glyph will fall back and the diacritics will break')

/* ---- 3. the routes a QR code might point at -------------------------------- */
console.log('\nQR targets')
for (const path of ['/', '/guardian', '/debrief', '/api/docs/']) {
  const r = await get(path)
  if (r.status === 200) ok(`${path} is 200`)
  else bad(`${path} returned ${r.status}`, 'a scanned QR would land on this')
}

/* ---- 4. the claim the demo rests on ---------------------------------------- */
console.log('\nthe answer key never reaches the browser')
const catalogue = await get('/api/scenarios')
let scenarioId = null
try {
  scenarioId = JSON.parse(catalogue.text)?.[0]?.id
} catch {
  /* reported below */
}

if (!scenarioId) {
  bad('could not read the catalogue', catalogue.text.slice(0, 80))
} else {
  const res = await fetch(`${BASE}/api/sessions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ scenarioId, language: 'kh' }),
  })
  const raw = await res.text()
  const leaks = ['"isCorrect"', '"reply"', '"note"'].filter((k) => raw.includes(k))

  if (leaks.length === 0) ok('a new session leaks no answers', `${raw.length} bytes`)
  else bad('THE ANSWER KEY LEAKED', leaks.join(', '))

  const stages = (raw.match(/"scammerMessages"/g) ?? []).length
  if (stages === 1) ok('only stage 1 is sent')
  else bad(`${stages} stages sent`, 'later stages must not ship before they are earned')
}

/* ---- 5. content readiness --------------------------------------------------- */
console.log('\ncontent')
const detail = scenarioId ? await get(`/api/scenarios/${scenarioId}`) : { text: '' }
if (detail.text.includes('អត្ថបទ​គំរូ') || detail.text.includes('Placeholder')) {
  warn('placeholder content is live', 'the scenario is still unwritten — run npm run validate:content')
} else if (/"kh"\s*:\s*""/.test(detail.text)) {
  bad('empty Khmer fields are being served', 'run npm run validate:content')
} else {
  ok('no placeholder text detected')
}

/* ---- result ----------------------------------------------------------------- */
console.log('')
if (failed > 0) {
  console.error(`${failed} failure(s), ${warned} warning(s). Fix the failures before presenting.\n`)
  process.exit(1)
}
if (warned > 0) {
  console.warn(`No failures, ${warned} warning(s). Read them — most are demo-day risks.\n`)
  process.exit(0)
}
console.log('All clear. Hit /api/health once more right before you walk on.\n')
