#!/usr/bin/env node
/**
 * Token linter — enforces the hard rule from the build plan:
 *
 *   No hardcoded colours, spacing, radius, font size, or animation duration
 *   anywhere in src/ except src/styles/global.css.
 *
 * The build plan specified a `grep` one-liner. This is the same check written
 * in Node instead, because npm scripts run through cmd.exe on Windows, where
 * `! grep -rEn ...` is not valid syntax and would silently pass.
 *
 * Exits 1 with a file:line report on any violation.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')
const ALLOWED = join('src', 'styles', 'global.css')

const RULES = [
  {
    name: 'hex colour',
    re: /#[0-9a-fA-F]{3,8}\b/g,
    hint: 'use a colour token — bg-surface, text-muted, border-border',
  },
  {
    name: 'rgb()/rgba()/hsl() literal',
    re: /\b(?:rgba?|hsla?)\s*\(/g,
    hint: 'colours live in global.css as RGB channels',
  },
  {
    name: 'Tailwind palette class',
    re: /\b(?:bg|text|border|ring|fill|stroke|from|via|to|divide|outline|shadow|accent|caret|decoration|placeholder)-(?:slate|gray|grey|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|\d{3})\b/g,
    hint: 'use a semantic token class instead',
  },
  {
    name: 'hardcoded duration',
    re: /\b\d+(?:\.\d+)?m?s\b(?!["'`]?\s*\))/g,
    hint: "read motion tokens with motionToken('--timing-…')",
    // only meaningful in TS/TSX — CSS durations belong in global.css
    files: /\.tsx?$/,
  },
  {
    name: 'arbitrary Tailwind value',
    re: /\b(?:w|h|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|text|rounded|leading|duration|delay|min-h|max-h|min-w|max-w)-\[[^\]]+\]/g,
    hint: 'add a token to global.css, map it in tailwind.config.ts, then use it',
  },
]

/** Strip comments so a token reference inside an explanatory note is not a hit. */
function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + ' '.repeat(m.length - p1.length))
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(tsx?|css)$/.test(entry)) out.push(full)
  }
  return out
}

const violations = []

for (const file of walk(SRC)) {
  const rel = relative(ROOT, file)
  if (rel === ALLOWED || rel === ALLOWED.split(sep).join('/')) continue

  const raw = readFileSync(file, 'utf8')
  const source = stripComments(raw)
  const lines = raw.split('\n')

  for (const rule of RULES) {
    if (rule.files && !rule.files.test(file)) continue
    rule.re.lastIndex = 0
    let match
    while ((match = rule.re.exec(source)) !== null) {
      const lineNo = source.slice(0, match.index).split('\n').length
      violations.push({
        file: rel.split(sep).join('/'),
        line: lineNo,
        rule: rule.name,
        text: lines[lineNo - 1]?.trim() ?? '',
        hint: rule.hint,
      })
    }
  }
}

/* ==========================================================================
   Unmapped token check.
   --------------------------------------------------------------------------
   A colour token defined in global.css but never mapped in tailwind.config.ts
   produces a class that does not exist. Tailwind drops unknown classes
   SILENTLY — no warning, no build failure — so the element renders with no
   background and the bug is visible only on screen.

   This shipped once, on the Speed Triage REAL/SCAM buttons. Once is enough.
   ========================================================================== */

const unmapped = []

try {
  const css = readFileSync(join(ROOT, 'src', 'styles', 'global.css'), 'utf8')
  const tw = readFileSync(join(ROOT, 'tailwind.config.ts'), 'utf8')

  // :root only — the .theme-light block redefines the same names.
  const rootBlock = css.slice(css.indexOf(':root'), css.indexOf('.theme-light'))
  const defined = [...rootBlock.matchAll(/--color-([a-z0-9-]+)\s*:/g)].map((m) => m[1])

  unmapped.push(...defined.filter((name) => !tw.includes(`--color-${name})`)))
} catch (e) {
  console.error(`could not run the unmapped-token check: ${e.message}`)
  process.exit(1)
}

/* ---- report -------------------------------------------------------------- */

if (violations.length === 0 && unmapped.length === 0) {
  console.log('✓ tokens clean — no hardcoded values, every colour token mapped')
  process.exit(0)
}

if (violations.length > 0) {
  console.error(`\n✗ ${violations.length} token violation(s):\n`)
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  [${v.rule}]`)
    console.error(`    ${v.text}`)
    console.error(`    → ${v.hint}\n`)
  }
  console.error('Add the token to src/styles/global.css first, then use it.')
}

if (unmapped.length > 0) {
  console.error(`\n✗ ${unmapped.length} colour token(s) defined but never mapped in tailwind.config.ts:\n`)
  for (const name of unmapped) console.error(`  --color-${name}`)
  console.error('\nTailwind drops unknown classes silently, so these render as nothing.')
}

console.error('')
process.exit(1)
