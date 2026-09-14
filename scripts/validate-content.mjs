#!/usr/bin/env node
/**
 * Content validator.
 *
 * Checks every file in content/*.json against the invariants in
 * shared/types.ts, so the writer finds out what is missing while writing
 * rather than at Gate 2.
 *
 * Reports empty fields as WARNINGS (the file is being written) and structural
 * breakage as ERRORS (the file is wrong). Exits 1 on errors, or on warnings
 * when --strict is passed — which is what Gate 2 uses.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const STAGE_COUNT = 3
const OPTIONS_PER_STAGE = 4
const RED_FLAG_COUNT = 3
const OPTION_IDS = ['a', 'b', 'c', 'd']
const SCAM_TYPES = ['government', 'job', 'crypto', 'romance', 'malware']

const strict = process.argv.includes('--strict')
const dir = join(process.cwd(), 'content')

const errors = []
const warnings = []

const err = (path, msg) => errors.push(`${path}: ${msg}`)
const warn = (path, msg) => warnings.push(`${path}: ${msg}`)

/** A Localized field must exist and have both halves; empty = still being written. */
function checkLocalized(value, path, { requireEn = true } = {}) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    err(path, 'must be an object with kh and en')
    return
  }
  for (const key of ['kh', 'en']) {
    if (!(key in value)) {
      err(path, `missing "${key}"`)
      continue
    }
    if (typeof value[key] !== 'string') {
      err(`${path}.${key}`, 'must be a string')
      continue
    }
    if (value[key].trim() === '') {
      if (key === 'en' && !requireEn) continue
      warn(`${path}.${key}`, 'is empty')
    }
  }

  // Khmer-first check: an en that is filled while kh is empty is backwards.
  if (
    typeof value.kh === 'string' &&
    typeof value.en === 'string' &&
    value.kh.trim() === '' &&
    value.en.trim() !== ''
  ) {
    warn(path, 'en is written but kh is empty — Khmer is written first (see content/AUTHORING.md)')
  }

  // Khmer field that contains no Khmer characters is very likely English.
  if (typeof value.kh === 'string' && value.kh.trim() !== '' && !/[ក-៿]/.test(value.kh)) {
    warn(`${path}.kh`, 'contains no Khmer characters')
  }
}

function validateScenario(data, file) {
  const seenReplies = new Map()

  if (typeof data.id !== 'string' || !data.id.trim()) err(file, 'id is required')
  if (!SCAM_TYPES.includes(data.scamType)) {
    err(file, `scamType must be one of ${SCAM_TYPES.join(', ')}`)
  }

  checkLocalized(data.title, `${file}.title`)

  if (!data.relative || typeof data.relative !== 'object') {
    err(file, 'relative is required')
  } else {
    checkLocalized(data.relative.name, `${file}.relative.name`)
    if (typeof data.relative.age !== 'number') err(`${file}.relative.age`, 'must be a number')
    if (typeof data.relative.avatar !== 'string') err(`${file}.relative.avatar`, 'must be a string')
  }

  /* ---- stages ---------------------------------------------------------- */
  if (!Array.isArray(data.stages)) {
    err(file, 'stages must be an array')
  } else {
    if (data.stages.length !== STAGE_COUNT) {
      err(file, `must have exactly ${STAGE_COUNT} stages, found ${data.stages.length}`)
    }

    data.stages.forEach((stage, i) => {
      const sp = `${file}.stages[${i}]`

      if (stage.id !== i + 1) err(sp, `id must be ${i + 1}, found ${stage.id}`)

      if (!Array.isArray(stage.scammerMessages) || stage.scammerMessages.length === 0) {
        err(sp, 'scammerMessages must be a non-empty array')
      } else {
        stage.scammerMessages.forEach((m, j) =>
          checkLocalized(m, `${sp}.scammerMessages[${j}]`),
        )
      }

      checkLocalized(stage.relativeMessage, `${sp}.relativeMessage`)

      if (!Array.isArray(stage.options)) {
        err(sp, 'options must be an array')
        return
      }
      if (stage.options.length !== OPTIONS_PER_STAGE) {
        err(sp, `must have exactly ${OPTIONS_PER_STAGE} options, found ${stage.options.length}`)
      }

      const ids = stage.options.map((o) => o.id)
      for (const id of OPTION_IDS) {
        if (!ids.includes(id)) err(sp, `missing option "${id}"`)
      }
      if (new Set(ids).size !== ids.length) err(sp, 'duplicate option ids')

      const correct = stage.options.filter((o) => o.isCorrect === true)
      if (correct.length !== 1) {
        err(sp, `exactly one option must have isCorrect: true, found ${correct.length}`)
      }

      stage.options.forEach((opt, j) => {
        const op = `${sp}.options[${j}]`
        if (typeof opt.isCorrect !== 'boolean') err(op, 'isCorrect must be a boolean')
        checkLocalized(opt.text, `${op}.text`)
        checkLocalized(opt.reply, `${op}.reply`)

        // Every option needs its own reply — she should not react the same way
        // to being reassured as to being corrected.
        const kh = opt.reply?.kh?.trim()
        if (kh) {
          if (seenReplies.has(kh)) {
            err(op, `reply.kh duplicates ${seenReplies.get(kh)} — each option needs its own reply`)
          } else {
            seenReplies.set(kh, op)
          }
        }

        if (opt.isCorrect === false && !opt.note) {
          warn(op, 'wrong options should have a note explaining why they were tempting')
        } else if (opt.note) {
          checkLocalized(opt.note, `${op}.note`)
        }
      })
    })

    // Pattern-matching guard: if the correct letter never changes, a player can
    // learn the letter instead of the reasoning.
    const correctIds = data.stages
      .map((s) => s.options?.find((o) => o.isCorrect)?.id)
      .filter(Boolean)
    if (correctIds.length === STAGE_COUNT && new Set(correctIds).size === 1) {
      warn(file, `the correct option is "${correctIds[0]}" in all ${STAGE_COUNT} stages — vary it so players cannot pattern-match the letter`)
    }
  }

  /* ---- debrief --------------------------------------------------------- */
  if (!data.debrief || typeof data.debrief !== 'object') {
    err(file, 'debrief is required')
  } else {
    const d = data.debrief
    const dp = `${file}.debrief`

    for (const field of [
      'scamName',
      'rule',
      'realLifeAction',
      'outcomeWin',
      'outcomeLose',
      'consequence',
    ]) {
      if (!(field in d)) err(dp, `missing "${field}"`)
      else checkLocalized(d[field], `${dp}.${field}`)
    }

    if (!Array.isArray(d.redFlags)) {
      err(dp, 'redFlags must be an array')
    } else {
      if (d.redFlags.length !== RED_FLAG_COUNT) {
        err(dp, `must have exactly ${RED_FLAG_COUNT} red flags, found ${d.redFlags.length}`)
      }
      d.redFlags.forEach((f, i) => checkLocalized(f, `${dp}.redFlags[${i}]`))
    }
  }
}

/* ---- run ---------------------------------------------------------------- */

let files
try {
  files = readdirSync(dir).filter((f) => f.endsWith('.json'))
} catch {
  console.error('✗ no content/ directory')
  process.exit(1)
}

if (files.length === 0) {
  console.error('✗ no scenario files in content/')
  process.exit(1)
}

for (const file of files) {
  let data
  try {
    data = JSON.parse(readFileSync(join(dir, file), 'utf8'))
  } catch (e) {
    err(file, `invalid JSON — ${e.message}`)
    continue
  }
  validateScenario(data, file)
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} error(s):\n`)
  for (const e of errors) console.error(`  ${e}`)
}

if (warnings.length) {
  console.error(`\n⚠ ${warnings.length} warning(s) — unwritten content:\n`)
  const shown = warnings.slice(0, 25)
  for (const w of shown) console.error(`  ${w}`)
  if (warnings.length > shown.length) {
    console.error(`  … and ${warnings.length - shown.length} more`)
  }
}

if (!errors.length && !warnings.length) {
  console.log(`✓ content valid — ${files.length} scenario(s), structure and text complete`)
  process.exit(0)
}

if (errors.length || (strict && warnings.length)) {
  console.error(
    strict
      ? '\nGate 2 requires zero errors and zero warnings.\n'
      : '\nStructure must be fixed. Empty fields are expected while writing.\n',
  )
  process.exit(1)
}

console.log(`\n✓ structure valid — ${warnings.length} field(s) still to write\n`)
process.exit(0)
