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
    en: 'Real or Scam in 5 seconds',
  },
  investigation: { kh: 'ការ​ស៊ើប​អង្កេត', en: 'The Investigation' },
  investigationBlurb: {
    kh: 'រក​ឲ្យ​ឃើញ​សញ្ញា​គ្រោះថ្នាក់​ទាំងអស់ មុន​ពេល​អស់​ម៉ោង',
    en: 'Find all red flags before time runs out',
  },
  comingSoon: { kh: 'នឹង​មាន​ក្នុង​ពេល​ឆាប់ៗ', en: 'Coming soon' },
  pullToRefresh:    { kh: 'ទាញ​ចុះ​ដើម្បី​ផ្ទុក​ឡើង​វិញ', en: 'Pull down to refresh' },
  releaseToRefresh: { kh: 'លែង​ដៃ​ដើម្បី​ផ្ទុក​ឡើង​វិញ', en: 'Release to refresh' },
  refreshing:       { kh: 'កំពុង​ផ្ទុក​ឡើង​វិញ…', en: 'Refreshing…' },
  startHere: { kh: 'ចាប់ផ្ដើម​ទីនេះ', en: 'Start here' },

  /* ---- welcome ---- */
  welcomeHeadline: { kh: 'តើ​អ្នក​អាច​ស្គាល់​ការ​បោក​បាន​ទេ?', en: 'Would you spot the scam?' },
  welcomeBody: {
    kh: 'Prayat ដាក់​អ្នក​ចូល​ក្នុង​ការ​បោក​ពិត​មួយ។ សម្រេច​ចិត្ត។ មើល​អ្វី​ដែល​កើត​ឡើង។ រៀន​ពី​មូលហេតុ — ជា​ភាសា​ខ្មែរ ឬ​អង់គ្លេស។',
    en: 'Prayat puts you inside a real scam. Make decisions. See what happens. Learn why — in Khmer or English.',
  },
  getStarted: { kh: 'ចាប់ផ្ដើម', en: 'Get started' },
  threeWays: { kh: 'វិធី​ហ្វឹកហាត់​បី​យ៉ាង', en: 'Three ways to train' },
  forEveryone: { kh: 'សម្រាប់​អ្នក។ សម្រាប់​ឪពុក​ម្ដាយ​អ្នក។', en: 'For you. For your parents.' },
  forEveryoneBody: { kh: 'សម្រាប់​អ្នក​ណា​ក៏​ដោយ​ដែល​ប្រើ​ទូរស័ព្ទ។', en: 'For anyone who uses a phone.' },
  khmerAndEnglish: { kh: 'ខ្មែរ និង អង់គ្លេស', en: 'Khmer and English' },
  worksOffline: { kh: 'ដំណើរការ​ក្រៅ​បណ្ដាញ', en: 'Works offline' },
  noAppStore: { kh: 'មិន​ចាំបាច់ App Store', en: 'No app store needed' },

  /* ---- progress ---- */
  myProgress: { kh: 'វឌ្ឍនភាព​របស់​ខ្ញុំ', en: 'My progress' },
  totalScore: { kh: 'ពិន្ទុ​សរុប', en: 'Total score' },
  streak: { kh: 'ថ្ងៃ​ជាប់​គ្នា', en: 'Streak' },
  /* {n} is replaced with the day count */
  streakDays: { kh: '{n} ថ្ងៃ', en: '{n} days' },
  resistanceHeading: { kh: 'ពិន្ទុ​ការពារ​ពី​ការ​បោក', en: 'Scam resistance score' },
  notTriedYet: { kh: 'មិន​ទាន់​សាកល្បង', en: 'Not tried yet' },
  completedScenarios: { kh: 'សេណារីយ៉ូ​ដែល​បាន​បញ្ចប់', en: 'Completed scenarios' },
  shareMyScore: { kh: 'ចែក​រំលែក​ពិន្ទុ​របស់​ខ្ញុំ', en: 'Share my score' },
  shareScoreText: {
    kh: 'ពិន្ទុ​ការពារ​ពី​ការ​បោក​របស់​ខ្ញុំ​នៅ​លើ Prayat៖ {score} · កម្រិត {level}។ សាកល្បង​ដោយ​ឥត​គិត​ថ្លៃ៖',
    en: 'My scam resistance score on Prayat: {score} · Level {level}. Try it free:',
  },
  scamGovernment: { kh: 'ការ​បោក​ក្លែង​ជា​រដ្ឋាភិបាល', en: 'Government scams' },
  scamJob: { kh: 'ការ​បោក​ការងារ', en: 'Job offer scams' },
  scamCrypto: { kh: 'ការ​បោក​គ្រីបតូ', en: 'Crypto scams' },
  scamRomance: { kh: 'ការ​បោក​ស្នេហា', en: 'Romance scams' },
  scamMalware: { kh: 'ការ​បោក​តាម​កម្មវិធី​ព្យាបាទ', en: 'Malware scams' },

  /* ---- scenario picker ---- */
  chooseScenario: { kh: 'ជ្រើសរើស​សេណារីយ៉ូ', en: 'Choose a scenario' },
  play: { kh: 'លេង', en: 'Play' },
  locked: { kh: 'ជាប់​សោ', en: 'Locked' },
  /* {n} is replaced with the scenario number */
  playScenarioFirst: { kh: 'លេង​សេណារីយ៉ូ​ទី {n} មុន', en: 'Play scenario {n} first' },
  difficulty: { kh: 'កម្រិត​លំបាក', en: 'Difficulty' },
  yourMission: { kh: 'បេសកកម្ម​របស់​អ្នក', en: 'Your mission' },
  warning: { kh: 'ប្រយ័ត្ន', en: 'Warning' },
  warningFeelsReal: {
    kh: 'ជម្រើស​ទាំងអស់​ត្រូវ​បាន​រចនា​ឲ្យ​មាន​អារម្មណ៍​ដូច​ពិត។ គិត​ឲ្យ​បាន​ល្អិតល្អន់។',
    en: 'The choices are designed to feel real. Think carefully.',
  },
  startScenario: { kh: 'ចាប់ផ្ដើម​សេណារីយ៉ូ', en: 'Start scenario' },
  outOf: { kh: 'ក្នុង​ចំណោម', en: 'of' },
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
    kh: 'អ្វី​ដែល​អ្នក​បោក​បញ្ឆោត​ផ្ញើ​ទៅ​ពូ',
    en: 'What the scammer sent Uncle',
  },
  watchOnly: { kh: 'មើល​បាន​តែ​ប៉ុណ្ណោះ', en: 'watch only' },
  /* {name} is replaced with the relative's name */
  yourChatWith: { kh: 'ការ​ជជែក​របស់​អ្នក​ជាមួយ {name}', en: 'Your chat with {name}' },
  yourChatLabel: { kh: 'អ្នក និង ពូ', en: 'You and Uncle' },
  whatDoYouReply: { kh: 'អ្នក​ឆ្លើយ​ថា​ម៉េច?', en: 'What do you reply?' },
  stage: { kh: 'ដំណាក់កាល', en: 'Stage' },
  score: { kh: 'ពិន្ទុ', en: 'Score' },
  verified: { kh: 'បាន​ផ្ទៀងផ្ទាត់', en: 'Verified' },
  forwardedFrom: { kh: 'បញ្ជូន​បន្ត​ពី', en: 'Forwarded from' },
  waitingForRelative: { kh: 'រង់ចាំ​ពូ…', en: 'Waiting for Uncle…' },

  /* ---- speed triage: packs ---- */
  choosePack: { kh: 'ជ្រើសរើស​កញ្ចប់​សន្លឹក', en: 'Choose a card pack' },
  cards: { kh: 'សន្លឹក', en: 'cards' },
  dailyChallenge: { kh: 'បញ្ហា​ប្រចាំ​ថ្ងៃ', en: 'Daily challenge' },
  /* {n} = number of cards */
  todaysCards: { kh: 'សន្លឹក {n} របស់​ថ្ងៃ​នេះ', en: "Today's {n} cards" },
  newEveryMorning: { kh: 'ថ្មី​រៀងរាល់​ព្រឹក', en: 'New every morning' },
  playDaily: { kh: 'លេង​ប្រចាំ​ថ្ងៃ', en: 'Play daily' },

  /* ---- speed triage: game over ---- */
  gameOver: { kh: 'ចប់​ហ្គេម', en: 'Game over' },
  cardsSurvived: { kh: 'សន្លឹក​ដែល​បាន​ឆ្លង', en: 'Cards survived' },
  scoreLabel: { kh: 'ពិន្ទុ', en: 'Score' },
  bestStreak: { kh: 'ជាប់​គ្នា​ល្អ​បំផុត', en: 'Best streak' },
  yourHighScore: { kh: 'ពិន្ទុ​ខ្ពស់​បំផុត​របស់​អ្នក', en: 'Your high score' },
  newRecord: { kh: 'ថ្មី!', en: 'NEW!' },
  previousBest: { kh: 'ល្អ​បំផុត​ពី​មុន', en: 'Previous best' },
  struggledWith: { kh: 'អ្នក​ពិបាក​ជាមួយ', en: 'You struggled with' },
  /* {n} = number wrong */
  nWrong: { kh: 'ខុស {n}', en: '{n} wrong' },
  allCorrect: { kh: 'ត្រូវ​ទាំងអស់', en: 'all correct' },
  tip: { kh: 'គន្លឹះ', en: 'Tip' },
  /* {pack} = pack name */
  tryPackTip: { kh: 'សាកល្បង​កញ្ចប់ "{pack}" ដើម្បី​ពង្រឹង​ជំនាញ​នេះ', en: 'Try the "{pack}" pack to improve that skill' },
  changePack: { kh: 'ប្ដូរ​កញ្ចប់', en: 'Change pack' },
  home: { kh: 'ទំព័រ​ដើម', en: 'Home' },
  shareScore: { kh: 'ចែក​រំលែក​ពិន្ទុ', en: 'Share score' },
  /* {n} = cards, {score} = score */
  shareTriageText: {
    kh: 'ខ្ញុំ​បាន​ឆ្លង {n} សន្លឹក​ក្នុង Prayat វិនិច្ឆ័យ​រហ័ស! ពិន្ទុ {score} — អ្នក​ឈ្នះ​ខ្ញុំ​បាន​ទេ?',
    en: 'I survived {n} cards in Prayat Speed Triage! Score: {score} — can you beat me?',
  },
  surfaceSms: { kh: 'សារ SMS', en: 'SMS messages' },
  surfaceTelegram: { kh: 'សារ Telegram', en: 'Telegram messages' },
  surfaceFacebook: { kh: 'សារ Facebook', en: 'Facebook messages' },
  surfaceUrlBar: { kh: 'តំណ​គេហទំព័រ', en: 'Website URLs' },
  surfaceQr: { kh: 'កូដ QR', en: 'QR codes' },
  surfaceReceipt: { kh: 'វិក្កយបត្រ​ទូទាត់', en: 'Payment receipts' },

  /* ---- speed triage: answer states ---- */
  correct: { kh: 'ត្រឹមត្រូវ', en: 'Correct' },
  wrong: { kh: 'ខុស', en: 'Wrong' },
  points: { kh: 'ពិន្ទុ', en: 'points' },
  /* {n} = streak length */
  streakX: { kh: 'ជាប់​គ្នា ×{n}', en: 'Streak ×{n}' },
  /* {n} = lives left */
  livesRemaining: { kh: 'ជីវិត​នៅ​សល់: {n}', en: 'Lives remaining: {n}' },
  theAnswerWas: { kh: 'ចម្លើយ​គឺ', en: 'The answer was' },
  whyScam: { kh: 'ហេតុ​អ្វី​វា​ជា​ការ​បោក', en: "Why it's a scam" },
  whyReal: { kh: 'ហេតុ​អ្វី​វា​ពិត', en: "Why it's real" },
  /* {n} = streak length */
  streakMilestone: { kh: 'ជាប់​គ្នា {n} ដង!', en: '{n} streak!' },
  /* {m} = multiplier */
  multiplierFromNow: { kh: 'ពិន្ទុ ×{m} ចាប់​ពី​ពេល​នេះ', en: 'Score ×{m} from now' },

  /* ---- speed triage: countdown ---- */
  getReady: { kh: 'ត្រៀម​ខ្លួន', en: 'Get ready' },
  go: { kh: 'ទៅ!', en: 'GO!' },

  /* ---- speed triage: how to play ---- */
  howToPlay: { kh: 'របៀប​លេង', en: 'How to play' },
  /* {n} = step number */
  stepN: { kh: 'ជំហាន​ទី {n}', en: 'Step {n}' },
  triageStep1: {
    kh: 'សារ​ពិត​មួយ​លេច​ឡើង​លើ​អេក្រង់ — SMS, Telegram, Facebook, តំណ​គេហទំព័រ, វិក្កយបត្រ Wing ឬ​កូដ QR',
    en: 'A real message appears on screen — SMS, Telegram, Facebook, a website URL, a Wing receipt, or a QR code',
  },
  triageStep2: {
    kh: 'អ្នក​មាន​ពេល {seconds} វិនាទី​ដើម្បី​សម្រេច​ចិត្ត',
    en: 'You have {seconds} seconds to decide',
  },
  triageStep3: { kh: 'ចុច​ចម្លើយ​របស់​អ្នក', en: 'Tap your answer' },
  triageStep4: {
    kh: 'មើល​ការ​ពន្យល់ ({explain} វិនាទី) រួច​សន្លឹក​បន្ទាប់​នឹង​លេច​ឡើង',
    en: 'See the explanation ({explain} sec), then the next card appears',
  },
  triageStep5: {
    kh: 'ខុស {mistakes} ដង = ចប់​ហ្គេម។ វាយ​កំណត់ត្រា​ខ្ពស់​បំផុត​របស់​អ្នក!',
    en: '{mistakes} wrong answers = game over. Beat your high score!',
  },
  /* {n} wrong out of {max} */
  wrongCount: { kh: 'ខុស {n} / {max}', en: '{n} / {max} wrong' },
  gotItLetsPlay: { kh: 'យល់​ហើយ — លេង​តោះ', en: "Got it — let's play" },

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
  debriefWinTitle: { kh: 'ពូ​មិន​បាន​បង់​លុយ​ទេ', en: 'He did not pay' },
  debriefLoseTitle: { kh: 'ពូ​បាន​បង់​លុយ​ហើយ', en: 'He paid' },
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

  /* ---- bootcamp ---- */
  levelZero: { kh: 'កម្រិត ០', en: 'Level 0' },
  bootcampTitle: { kh: 'ការ​ហ្វឹកហាត់​សន្តិសុខ', en: 'Cyber Bootcamp' },
  bootcampIntro: {
    kh: 'ពីរ​មេរៀន​ខ្លី។ មេរៀន​នីមួយៗ​ផ្ដល់​ឧបករណ៍​មួយ​ដែល​អ្នក​នឹង​ប្រើ​ពិត​ប្រាកដ​ក្នុង​ល្បែង។',
    en: 'Two short modules. Each one gives you a tool you will actually use in the game.',
  },
  bootcampLocked: {
    kh: 'បញ្ចប់​មេរៀន​ទាំង​ពីរ​សិន ដើម្បី​បើក​ល្បែង​ទាំងអស់',
    en: 'Finish both modules to unlock the game modes',
  },
  bootcampDoneAction: { kh: 'បើក​ល្បែង​ហើយ — ចូល​លេង', en: 'Unlocked — start playing' },
  unlocks: { kh: 'នឹង​ផ្ដល់', en: 'Unlocks' },
  toolUnlocked: { kh: 'ទទួល​បាន​ឧបករណ៍', en: 'Tool unlocked' },
  toolAuthenticator: { kh: 'លេខ​សម្ងាត់​បញ្ជាក់', en: 'Authenticator Token' },
  toolMagnifier: { kh: 'កញ្ចក់​ពង្រីក', en: 'Magnifying Glass' },
  modulePassed: { kh: 'ជាប់​ហើយ', en: 'Passed' },
  moduleFailed: { kh: 'មិន​ទាន់​ជាប់​ទេ', en: 'Not passed yet' },
  tryModuleAgain: { kh: 'ព្យាយាម​ម្ដង​ទៀត', en: 'Try again' },
  backToBootcamp: { kh: 'ត្រឡប់​ទៅ​មេរៀន', en: 'Back to the bootcamp' },
  passMark: { kh: 'ត្រូវ​បាន​យ៉ាង​ហោច', en: 'Pass mark' },

  /* ---- vip club ---- */
  twoFactorOn: { kh: 'ការ​បញ្ជាក់​ពីរ​ជាន់ — បើក', en: 'Two-factor — ON' },
  twoFactorOff: { kh: 'ការ​បញ្ជាក់​ពីរ​ជាន់ — បិទ', en: 'Two-factor — OFF' },
  letThemIn: { kh: 'ឲ្យ​ចូល', en: 'Let them in' },
  turnThemAway: { kh: 'បដិសេធ', en: 'Turn away' },
  askForCode: { kh: 'សុំ​លេខ​បញ្ជាក់', en: 'Ask for the code' },
  goodCall: { kh: 'សម្រេច​ចិត្ត​ត្រឹមត្រូវ', en: 'Good call' },
  badCall: { kh: 'សម្រេច​ចិត្ត​ខុស', en: 'Wrong call' },
  noWayToTell: { kh: 'អ្នក​គ្មាន​មធ្យោបាយ​ដឹង​ទេ', en: 'You had no way to tell' },
  nextRound: { kh: 'ជុំ​បន្ទាប់', en: 'Next round' },

  /* ---- url sorter ---- */
  sortSafe: { kh: 'សុវត្ថិភាព', en: 'Safe' },
  sortTrash: { kh: 'ក្លែងក្លាយ', en: 'Trash' },
  thatOneWasSafe: { kh: 'នោះ​ជា​អាសយដ្ឋាន​ពិត', en: 'That one was real' },
  thatOneWasFake: { kh: 'នោះ​ជា​អាសយដ្ឋាន​ក្លែងក្លាយ', en: 'That one was fake' },
  nextCard: { kh: 'បន្ទាប់', en: 'Next' },
  zoomIn: { kh: 'ពង្រីក', en: 'Zoom in' },
  magnifierHint: {
    kh: 'ប្រើ​កញ្ចក់​ពង្រីក ដើម្បី​អាន​អក្សរ​ម្ដង​មួយៗ',
    en: 'Use the magnifying glass to read it character by character',
  },

  /* ---- language ---- */
  languageName: { kh: 'ខ្មែរ', en: 'English' },
} as const satisfies Record<string, { kh: string; en: string }>

export function t(key: UIKey, language: LanguageCode): string {
  return strings[key][language]
}

export { strings }
