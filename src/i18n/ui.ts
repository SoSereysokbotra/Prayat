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
  startHere: { kh: 'ចាប់ផ្ដើម​ទីនេះ', en: 'Start here' },
  keepSharp: { kh: 'រក្សា​ការ​ប្រុង​ប្រយ័ត្ន​ឲ្យ​មុត​ស្រួច', en: 'Keep your instincts sharp' },
  daily: { kh: 'រៀងរាល់​ថ្ងៃ', en: 'daily' },
  weekly: { kh: 'រៀងរាល់​សប្ដាហ៍', en: 'weekly' },
  guardianTeaches: {
    kh: 'បង្រៀន​ការ​គិត​ក្រោម​សម្ពាធ — និង​ការ​រក្សា​ជំហរ​ពេល​មនុស្ស​ជាទី​ស្រឡាញ់​ជំទាស់',
    en: 'Builds reasoning under pressure — and holding your ground when someone you love argues back',
  },
  stages: { kh: 'ដំណាក់កាល', en: 'stages' },
  minutes: { kh: 'នាទី', en: 'min' },
  comingSoonBody: {
    kh: 'របៀប​នេះ​កំពុង​ត្រូវ​បាន​រៀបចំ។ ឥឡូវ​នេះ សូម​សាកល្បង​របៀប​អាណាព្យាបាល។',
    en: 'This mode is still being built. For now, try Guardian Mode.',
  },

  /* ---- guardian ---- */
  threatZoneLabel: {
    kh: 'អ្នក​បោក​បញ្ឆោត កំពុង​សរសេរ​ទៅ​មីង',
    en: 'The scammer is writing to Auntie',
  },
  watchOnly: { kh: 'មើល​បាន​តែ​ប៉ុណ្ណោះ', en: 'watch only' },
  yourChatLabel: { kh: 'អ្នក និង មីង', en: 'You and Auntie' },
  introWatchOnly: {
    kh: 'អ្នក​មើល​ឃើញ​អ្វី​ដែល​អ្នក​បោក​បញ្ឆោត​សរសេរ​ទៅ​មីង ប៉ុន្តែ​អ្នក​មិន​អាច​ឆ្លើយ​ទៅ​គាត់​បាន​ទេ។',
    en: 'You can see what the scammer writes to Auntie. You cannot reply to him.',
  },
  introYouAdvise: {
    kh: 'អ្នក​និយាយ​បាន​តែ​ជាមួយ​មីង​ប៉ុណ្ណោះ។ ជ្រើស​ពាក្យ​របស់​អ្នក​ឲ្យ​ប្រុង​ប្រយ័ត្ន។',
    en: 'You can only talk to Auntie. Choose your words carefully.',
  },
  introSheIsConvinced: {
    kh: 'ហើយ​មីង​ជឿ​គាត់​ខ្លះ​ហើយ។',
    en: 'And she already half believes him.',
  },
  introBegin: { kh: 'ចាប់ផ្ដើម', en: 'Begin' },
  waitingForAuntie: { kh: 'រង់ចាំ​មីង…', en: 'Waiting for Auntie…' },

  /* ---- speed triage ---- */
  verdictReal: { kh: 'ពិត', en: 'REAL' },
  verdictScam: { kh: 'បោក', en: 'SCAM' },
  itWasReal: { kh: 'នេះ​ជា​សារ​ពិត', en: 'That one was real' },
  itWasScam: { kh: 'នេះ​ជា​ការ​បោក', en: 'That one was a scam' },
  runOver: { kh: 'ចប់​ជុំ​ហើយ', en: 'Run over' },
  pointsEarned: { kh: 'ពិន្ទុ​ដែល​ទទួល​បាន', en: 'Points earned' },

  /* ---- investigation ---- */
  flagsFound: { kh: 'រក​ឃើញ', en: 'found' },
  timeLeft: { kh: 'ពេល​នៅ​សល់', en: 'Time left' },
  tapSuspicious: { kh: 'ចុច​លើ​អ្វី​ដែល​គួរ​ឲ្យ​សង្ស័យ', en: 'Tap anything suspicious' },
  notTheIssue: { kh: 'នេះ​មិន​មែន​ជា​បញ្ហា​ទេ', en: 'Not the issue' },
  penaltyTenSeconds: { kh: '-១០ វិនាទី', en: '-10 seconds' },
  timeUp: { kh: 'អស់​ពេល​ហើយ', en: "Time's up" },
  youFoundAll: { kh: 'អ្នក​រក​ឃើញ​ទាំងអស់', en: 'You found them all' },
  missedFlags: { kh: 'អ្វី​ដែល​អ្នក​មិន​បាន​កត់​សម្គាល់', en: 'What you missed' },

  /* ---- score ---- */
  yourScore: { kh: 'ពិន្ទុ​ការពារ​របស់​អ្នក', en: 'Your resistance score' },
  level: { kh: 'កម្រិត', en: 'Level' },
  pointsToNext: { kh: 'ពិន្ទុ​ទៀត​ដល់​កម្រិត​បន្ទាប់', en: 'points to the next level' },
  topLevel: { kh: 'កម្រិត​ខ្ពស់​បំផុត', en: 'Top level reached' },
  noPointsYet: {
    kh: 'លេង​មួយ​ជុំ ដើម្បី​ចាប់ផ្ដើម​ប្រមូល​ពិន្ទុ​ការពារ​របស់​អ្នក',
    en: 'Play a round to start building your resistance score',
  },

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

  /* ---- auth ---- */
  signIn: { kh: 'ចូល​គណនី', en: 'Sign in' },
  signingIn: { kh: 'កំពុង​ចូល…', en: 'Signing in…' },
  signUp: { kh: 'បង្កើត​គណនី', en: 'Create account' },
  signingUp: { kh: 'កំពុង​បង្កើត…', en: 'Creating…' },
  signInTitle: { kh: 'សូម​ស្វាគមន៍​ត្រឡប់​មក​វិញ', en: 'Welcome back' },
  signInSubtitle: {
    kh: 'ចូល​គណនី ដើម្បី​រក្សា​ពិន្ទុ​ការពារ​របស់​អ្នក',
    en: 'Sign in to keep your resistance score',
  },
  signUpTitle: { kh: 'បង្កើត​គណនី​របស់​អ្នក', en: 'Create your account' },
  signUpSubtitle: {
    kh: 'រក្សា​វឌ្ឍនភាព​របស់​អ្នក និង​ចែក​រំលែក​ជាមួយ​គ្រួសារ',
    en: 'Keep your progress and share it with your family',
  },

  emailLabel: { kh: 'អ៊ីមែល', en: 'Email' },
  emailPlaceholder: { kh: 'you@example.com', en: 'you@example.com' },
  passwordLabel: { kh: 'ពាក្យ​សម្ងាត់', en: 'Password' },
  newPasswordLabel: { kh: 'ពាក្យ​សម្ងាត់​ថ្មី', en: 'New password' },
  confirmPasswordLabel: { kh: 'បញ្ជាក់​ពាក្យ​សម្ងាត់​ថ្មី', en: 'Confirm new password' },
  showPassword: { kh: 'បង្ហាញ​ពាក្យ​សម្ងាត់', en: 'Show password' },
  passwordHint: {
    kh: 'យ៉ាង​ហោច​ណាស់ ៨ តួ​អក្សរ',
    en: 'At least 8 characters',
  },

  errEmailRequired: { kh: 'សូម​បញ្ចូល​អ៊ីមែល​របស់​អ្នក', en: 'Enter your email' },
  errEmailInvalid: { kh: 'អ៊ីមែល​នេះ​មើល​ទៅ​មិន​ត្រឹមត្រូវ​ទេ', en: 'That does not look like an email' },
  errPasswordRequired: { kh: 'សូម​បញ្ចូល​ពាក្យ​សម្ងាត់', en: 'Enter your password' },
  errPasswordShort: { kh: 'ពាក្យ​សម្ងាត់​ខ្លី​ពេក', en: 'That password is too short' },
  errPasswordMismatch: { kh: 'ពាក្យ​សម្ងាត់​ទាំង​ពីរ​មិន​ដូច​គ្នា​ទេ', en: 'The two passwords do not match' },
  errCodeIncomplete: { kh: 'សូម​បញ្ចូល​លេខ​ទាំង ៦ តួ', en: 'Enter all six digits' },

  forgotPassword: { kh: 'ភ្លេច​ពាក្យ​សម្ងាត់?', en: 'Forgot password?' },
  noAccountYet: { kh: 'មិន​ទាន់​មាន​គណនី?', en: 'No account yet?' },
  alreadyHaveAccount: { kh: 'មាន​គណនី​រួច​ហើយ?', en: 'Already have an account?' },
  continueWithoutAccount: { kh: 'បន្ត​ដោយ​មិន​ចាំបាច់​មាន​គណនី', en: 'Continue without an account' },

  verifyTitle: { kh: 'ពិនិត្យ​អ៊ីមែល​របស់​អ្នក', en: 'Check your email' },
  verifySubtitle: {
    kh: 'យើង​បាន​ផ្ញើ​លេខ ៦ តួ​ទៅ',
    en: 'We sent a six-digit code to',
  },
  verifyCodeLabel: { kh: 'លេខ​បញ្ជាក់', en: 'Verification code' },
  verifyAction: { kh: 'បញ្ជាក់​អ៊ីមែល', en: 'Verify email' },
  verifying: { kh: 'កំពុង​បញ្ជាក់…', en: 'Verifying…' },
  didNotGetCode: { kh: 'មិន​បាន​ទទួល​លេខ​ទេ?', en: "Didn't get the code?" },
  resendCode: { kh: 'ផ្ញើ​ម្ដង​ទៀត', en: 'Send it again' },
  codeResent: { kh: 'បាន​ផ្ញើ​ម្ដង​ទៀត​ហើយ', en: 'Sent again' },
  resendIn: { kh: 'ផ្ញើ​ម្ដង​ទៀត​ក្នុង', en: 'Resend in' },
  seconds: { kh: 'វិនាទី', en: 'seconds' },

  forgotTitle: { kh: 'កំណត់​ពាក្យ​សម្ងាត់​ឡើង​វិញ', en: 'Reset your password' },
  forgotSubtitle: {
    kh: 'បញ្ចូល​អ៊ីមែល​របស់​អ្នក រួច​យើង​នឹង​ផ្ញើ​តំណ​សម្រាប់​កំណត់​ឡើង​វិញ',
    en: 'Enter your email and we will send you a reset link',
  },
  sendResetLink: { kh: 'ផ្ញើ​តំណ​កំណត់​ឡើង​វិញ', en: 'Send reset link' },
  sending: { kh: 'កំពុង​ផ្ញើ…', en: 'Sending…' },
  resetLinkSentTitle: { kh: 'សូម​ពិនិត្យ​អ៊ីមែល​របស់​អ្នក', en: 'Check your email' },
  resetLinkSentBody: {
    kh: 'ប្រសិន​បើ​អ៊ីមែល​នោះ​មាន​គណនី យើង​បាន​ផ្ញើ​តំណ​កំណត់​ពាក្យ​សម្ងាត់​ឡើង​វិញ​ទៅ​វា​ហើយ។',
    en: 'If that address has an account, we have sent it a password reset link.',
  },
  backToSignIn: { kh: 'ត្រឡប់​ទៅ​ការ​ចូល​គណនី', en: 'Back to sign in' },

  resetTitle: { kh: 'ជ្រើស​ពាក្យ​សម្ងាត់​ថ្មី', en: 'Choose a new password' },
  resetSubtitle: {
    kh: 'ជ្រើស​ពាក្យ​សម្ងាត់​ដែល​អ្នក​មិន​ប្រើ​នៅ​កន្លែង​ផ្សេង',
    en: 'Pick one you do not use anywhere else',
  },
  resetAction: { kh: 'រក្សា​ទុក​ពាក្យ​សម្ងាត់​ថ្មី', en: 'Save new password' },
  resetting: { kh: 'កំពុង​រក្សា​ទុក…', en: 'Saving…' },
  resetDoneTitle: { kh: 'ពាក្យ​សម្ងាត់​ត្រូវ​បាន​ប្ដូរ​ហើយ', en: 'Password changed' },
  resetDoneBody: {
    kh: 'ឥឡូវ​អ្នក​អាច​ចូល​គណនី​ដោយ​ប្រើ​ពាក្យ​សម្ងាត់​ថ្មី​របស់​អ្នក។',
    en: 'You can now sign in with your new password.',
  },

  signOut: { kh: 'ចាក​ចេញ', en: 'Sign out' },
  playingAsGuest: { kh: 'កំពុង​លេង​ជា​ភ្ញៀវ — ពិន្ទុ​រក្សា​ទុក​តែ​ក្នុង​ឧបករណ៍​នេះ', en: 'Playing as a guest — score saved on this device only' },

  /* ---- language ---- */
  languageName: { kh: 'ខ្មែរ', en: 'English' },
} as const satisfies Record<string, { kh: string; en: string }>

export function t(key: UIKey, language: LanguageCode): string {
  return strings[key][language]
}

export { strings }
