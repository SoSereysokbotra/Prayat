/**
 * The answer key must never reach the browser.
 *
 * This is the claim the whole demo turns on ("the server decides"), so it is
 * checked automatically rather than by reading devtools and hoping.
 *
 * Run: npm run test:strip
 */

import { readFileSync } from 'node:fs'
import { containsAnswers, stripStage, toScenarioMeta, toScenarioSummary } from '../shared/strip'
import type { ScenarioFull } from '../shared/types'
import { OPTIONS_PER_STAGE, STAGE_COUNT } from '../shared/types'

const scenario = JSON.parse(
  readFileSync('content/scenarios/shop-payment-scam.json', 'utf8'),
) as ScenarioFull

let failed = 0

function check(name: string, condition: boolean, detail = '') {
  if (condition) {
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

console.log('\nanswer stripping\n')

/* The fixture itself must contain answers — otherwise this test proves nothing. */
check(
  'source content contains answers (control)',
  containsAnswers(scenario),
  'the scenario has no isCorrect fields, so stripping is untestable',
)

for (const stage of scenario.stages) {
  const stripped = stripStage(stage)

  check(`stage ${stage.id}: no answer fields survive`, !containsAnswers(stripped))

  check(
    `stage ${stage.id}: all ${OPTIONS_PER_STAGE} options survive`,
    stripped.options.length === stage.options.length,
    `${stripped.options.length} of ${stage.options.length}`,
  )

  check(
    `stage ${stage.id}: option text preserved`,
    stripped.options.every((o, i) => o.text === stage.options[i].text),
  )

  const serialized = JSON.stringify(stripped)
  for (const field of ['isCorrect', 'reply', 'note']) {
    check(`stage ${stage.id}: "${field}" absent from serialized payload`, !serialized.includes(`"${field}"`))
  }
}

check('scenario meta carries no stages', !('stages' in toScenarioMeta(scenario)))
check('scenario meta carries no debrief', !('debrief' in toScenarioMeta(scenario)))
check('scenario summary carries no answers', !containsAnswers(toScenarioSummary(scenario)))

/* Guards against a future field being added to OptionFull and leaking by
   default — stripOption constructs explicitly rather than using rest spread. */
const extraFieldStage = {
  ...scenario.stages[0],
  options: scenario.stages[0].options.map((o) => ({ ...o, secretHint: 'the answer is c' })),
}
check(
  'unknown future fields do not leak through stripOption',
  !JSON.stringify(stripStage(extraFieldStage as never)).includes('secretHint'),
)

check(`content has ${STAGE_COUNT} stages`, scenario.stages.length === STAGE_COUNT)

console.log('')
if (failed > 0) {
  console.error(`✗ ${failed} check(s) failed\n`)
  process.exit(1)
}
console.log('✓ no answer reaches the wire format\n')
