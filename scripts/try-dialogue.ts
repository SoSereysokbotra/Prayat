/**
 * Bake-off harness for AI-varied dialogue.
 *
 *   DEEPSEEK_API_KEY=... npx tsx scripts/try-dialogue.ts [kh|en] [runs]
 *
 * Runs the real provider against a fixed sample stage (not the content
 * files, which may still be placeholders) and prints what a player would
 * see, plus whether the validator would have accepted it. Hand the output
 * to the Khmer reviewer — this is how you decide on a model, not by price.
 */
import { DeepSeekProvider, acceptable, type StageDialogueInput } from '../server/lib/dialogue'

const language = (process.argv[2] === 'en' ? 'en' : 'kh') as 'kh' | 'en'
const runs = Number(process.argv[3]) || 2
const key = process.env.DEEPSEEK_API_KEY
if (!key) {
  console.error('DEEPSEEK_API_KEY is not set')
  process.exit(1)
}

const sample: StageDialogueInput = {
  language,
  scenario: {
    title: { kh: 'មន្ត្រី​ក្រសួង​ក្លែងក្លាយ', en: 'Fake Ministry Official' },
    scamType: 'government',
    relative: { name: { kh: 'ពូ ចាន់', en: 'Uncle Chan' }, age: 54, avatar: 'uncle-chan' },
  },
  scammerMessages:
    language === 'kh'
      ? [
          'ជូនដំណឹង​ជា​បន្ទាន់​ពី​អង្គភាព​អនុលោមភាព​ឌីជីថល ក្រសួង​ពាណិជ្ជកម្ម។ លេខ​ចុះបញ្ជី​ហាង 0045-PP របស់​លោក​ត្រូវ​បាន​សម្គាល់​ថា​មាន​បញ្ហា។',
          'សូម​បង់​ប្រាក់ $200 ក្នុង​រយៈពេល 2 ម៉ោង តាម​រយៈ Wing QR ដែល​ភ្ជាប់​មក​ជាមួយ បើ​មិន​ដូច្នេះ​ទេ ហាង​នឹង​ត្រូវ​ផ្អាក។',
        ]
      : [
          'Urgent notice from the Ministry of Commerce Digital Compliance Unit. Your shop registration number 0045-PP has been flagged.',
          'Pay $200 within 2 hours via the attached Wing QR code or your shop will be suspended.',
        ],
  relativeMessage:
    language === 'kh'
      ? 'ក្មួយ​អើយ មើល​នេះ​មើល! មាន​គេ​ពី​ក្រសួង​ផ្ញើ​សារ​មក​ពូ​តាម Facebook ថា​ហាង​ពូ​មាន​បញ្ហា ត្រូវ​បង់ $200 ក្នុង 2 ម៉ោង។ គាត់​ដឹង​លេខ​ហាង​ពូ​ទៀត។ ពូ​គួរ​បង់​ទេ?'
      : 'Look at this! A man from the Ministry messaged me on Facebook. He knows my shop number. Should I pay the $200?',
  redFlags:
    language === 'kh'
      ? ['ទាក់ទង​តាម Facebook មិន​មែន​តាម​ផ្លូវការ', 'ស្នើ​បង់​តាម Wing QR', 'កំណត់​ពេល 2 ម៉ោង​ដើម្បី​កុំ​ឲ្យ​ផ្ទៀងផ្ទាត់']
      : ['Contact via personal Facebook, not an official channel', 'Payment via Wing QR', 'A 2-hour deadline to stop you verifying'],
}

const provider = new DeepSeekProvider(key, process.env.DEEPSEEK_MODEL ?? 'deepseek-v4-pro')
const script = { scammerMessages: sample.scammerMessages, relativeMessage: sample.relativeMessage }

async function main() {
for (let i = 1; i <= runs; i++) {
  const t0 = Date.now()
  try {
    const out = await provider.generate(sample, AbortSignal.timeout(20000))
    console.log(`\n=== run ${i} · ${Date.now() - t0} ms · ${acceptable(script, out) ? 'ACCEPTED' : 'REJECTED → script'} ===`)
    out.scammerMessages.forEach((m, j) => console.log(`scammer ${j + 1}: ${m}`))
    console.log(`uncle:     ${out.relativeMessage}`)
  } catch (err) {
    console.log(`\n=== run ${i} · ${Date.now() - t0} ms · FAILED → script (${err instanceof Error ? err.message : err}) ===`)
  }
}
}

void main()
