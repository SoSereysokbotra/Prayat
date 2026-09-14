/**
 * UI chrome strings — buttons, labels, states.
 *
 * Scenario content does NOT live here. That is content/*.json, written in
 * Khmer first by the writer. This file is app furniture only.
 *
 * ⚠️ REVIEW NEEDED
 * The Khmer below is a working draft. It has not been through the outside
 * reviewer. Chrome is lower-stakes than scam copy — nobody is fooled by a
 * clumsy button label — but a 54-year-old should still not trip over it.
 * Hand this file to the same reviewer as the scenario, at the same time.
 */

import type { LanguageCode } from '../../shared/types'

export type UIKey = keyof typeof strings

const strings = {
  /* ---- brand ---- */
  tagline: {
    kh: 'រៀន​ស្គាល់​ការ​បោក​បញ្ឆោត មុន​ពេល​វា​ធ្វើ​ឲ្យ​អ្នក​បាត់បង់',
    en: 'Learn to spot scams before they cost you',
  },

  /* ---- modes ---- */
  guardianMode: { kh: 'របៀប​អាណាព្យាបាល', en: 'Guardian Mode' },
  guardianModeBlurb: {
    kh: 'ជួយ​សាច់ញាតិ​របស់​អ្នក​កុំ​ឲ្យ​បាត់​លុយ — ក្នុង​ពេល​ជាក់ស្ដែង',
    en: 'Stop a family member from losing money — in real time',
  },
  speedTriage: { kh: 'វិនិច្ឆ័យ​រហ័ស', en: 'Speed Triage' },
  speedTriageBlurb: {
    kh: '៥ វិនាទី​ក្នុង​មួយ​សារ។ ពិត ឬ បោក?',
    en: '5 seconds per card. REAL or SCAM?',
  },
  investigation: { kh: 'ការ​ស៊ើប​អង្កេត', en: 'The Investigation' },
  investigationBlurb: {
    kh: 'រក​ឲ្យ​ឃើញ​សញ្ញា​គ្រោះថ្នាក់​ទាំងអស់ មុន​ពេល​អស់​ម៉ោង',
    en: 'Find every red flag before the timer ends',
  },
  comingSoon: { kh: 'នឹង​មាន​ក្នុង​ពេល​ឆាប់ៗ', en: 'Coming soon' },
  stages: { kh: 'ដំណាក់កាល', en: 'stages' },
  minutes: { kh: 'នាទី', en: 'min' },
  comingSoonBody: {
    kh: 'របៀប​នេះ​កំពុង​ត្រូវ​បាន​រៀបចំ។ ឥឡូវ​នេះ សូម​សាកល្បង​របៀប​អាណាព្យាបាល។',
    en: 'This mode is still being built. For now, try Guardian Mode.',
  },

  /* ---- guardian ---- */
  threatZoneLabel: {
    kh: 'អ្នក​បោក​បញ្ឆោត ↔ មីង (អ្នក​មើល​បាន​តែ​ប៉ុណ្ណោះ)',
    en: 'Scammer ↔ Auntie (you can only watch)',
  },
  yourChatLabel: { kh: 'អ្នក ↔ មីង', en: 'You ↔ Auntie' },
  waitingForAuntie: { kh: 'រង់ចាំ​មីង…', en: 'Waiting for Auntie…' },

  /* ---- score ---- */
  yourScore: { kh: 'ពិន្ទុ​ការពារ​របស់​អ្នក', en: 'Your resistance score' },
  level: { kh: 'កម្រិត', en: 'Level' },
  pointsToNext: { kh: 'ពិន្ទុ​ទៀត​ដល់​កម្រិត​បន្ទាប់', en: 'points to the next level' },
  topLevel: { kh: 'កម្រិត​ខ្ពស់​បំផុត', en: 'Top level reached' },

  /* ---- levels ---- */
  levelAware: { kh: 'ដឹង​ខ្លួន', en: 'Aware' },
  levelAlert: { kh: 'ប្រុង​ប្រយ័ត្ន', en: 'Alert' },
  levelDefender: { kh: 'អ្នក​ការពារ', en: 'Defender' },
  levelGuardian: { kh: 'អាណាព្យាបាល', en: 'Guardian' },
  levelProtector: { kh: 'អ្នក​ថែរក្សា', en: 'Protector' },

  /* ---- debrief ---- */
  debriefWinTitle: { kh: 'មីង​មិន​បាន​បង់​លុយ​ទេ', en: 'She did not pay' },
  debriefLoseTitle: { kh: 'មីង​បាន​បង់​លុយ​ហើយ', en: 'She paid' },
  whatScamHeading: { kh: 'នេះ​ជា​ការ​បោក​បញ្ឆោត​ប្រភេទ​ណា', en: 'What this scam was' },
  redFlagsHeading: { kh: 'សញ្ញា​គ្រោះថ្នាក់​ទាំង​បី', en: 'The three red flags' },
  ruleHeading: { kh: 'ច្បាប់​តែ​មួយ​ត្រូវ​ចាំ', en: 'The one rule to remember' },
  realLifeHeading: { kh: 'ត្រូវ​ធ្វើ​យ៉ាង​ណា​ក្នុង​ជីវិត​ពិត', en: 'What to do in real life' },
  scoreThisRound: { kh: 'ពិន្ទុ​ជុំ​នេះ', en: 'Score this round' },
  shareCopied: { kh: 'បាន​ចម្លង​ហើយ', en: 'Copied' },
  shareToFamily: { kh: 'ចែក​រំលែក​ទៅ​ក្រុម​គ្រួសារ', en: 'Share to family chat' },

  /* ---- actions ---- */
  start: { kh: 'ចាប់ផ្ដើម', en: 'Start' },
  back: { kh: 'ត្រឡប់​ក្រោយ', en: 'Back' },
  backHome: { kh: 'ត្រឡប់​ទៅ​ទំព័រ​ដើម', en: 'Back to home' },
  playAgain: { kh: 'លេង​ម្ដង​ទៀត', en: 'Play again' },
  share: { kh: 'ចែក​រំលែក', en: 'Share' },
  retry: { kh: 'ព្យាយាម​ម្ដង​ទៀត', en: 'Try again' },

  /* ---- states — no screen is ever blank ---- */
  loading: { kh: 'កំពុង​ផ្ទុក…', en: 'Loading…' },
  errorTitle: { kh: 'មាន​បញ្ហា​ក្នុង​ការ​ភ្ជាប់', en: 'Something went wrong' },
  errorBody: {
    kh: 'មិន​អាច​ភ្ជាប់​បាន​ទេ។ សូម​ពិនិត្យ​អ៊ីនធឺណិត​របស់​អ្នក រួច​ព្យាយាម​ម្ដង​ទៀត។',
    en: 'Could not connect. Check your internet and try again.',
  },

  /* ---- language ---- */
  languageName: { kh: 'ខ្មែរ', en: 'English' },
} as const satisfies Record<string, { kh: string; en: string }>

export function t(key: UIKey, language: LanguageCode): string {
  return strings[key][language]
}

export { strings }
