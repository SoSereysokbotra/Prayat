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
    kh: 'រៀន​ស្គាល់​ល្បិច​ឆបោក មុន​ពេល​អ្នក​រង​ការ​ខាតបង់',
    en: 'Learn to spot scams before they cost you',
  },

  /* ---- modes ---- */
  guardianMode: { kh: 'របៀប​អាណាព្យាបាល', en: 'Guardian Mode' },
  guardianModeBlurb: {
    kh: 'ជួយ​សាច់ញាតិ​របស់​អ្នក​កុំ​ឱ្យ​ខាតបង់​ប្រាក់កាស — ក្នុង​ស្ថានភាព​ជាក់ស្ដែង',
    en: 'Stop a family member from losing money — in real time',
  },
  speedTriage: { kh: 'វិនិច្ឆ័យ​រហ័ស', en: 'Speed Triage' },
  speedTriageBlurb: {
    kh: '៥ វិនាទី​ក្នុង​មួយ​សារ៖ សារ​ពិត ឬ​ជា​ការ​ឆបោក?',
    en: 'Real or Scam in 5 seconds',
  },
  investigation: { kh: 'ការ​ស៊ើប​អង្កេត', en: 'The Investigation' },
  casesSolved: { kh: 'ករណីដោះស្រាយរួច', en: 'Cases solved' },
  accuracy: { kh: 'ភាពត្រឹមត្រូវ', en: 'Accuracy' },
  caseNumber: { kh: 'ករណី #{n}', en: 'Case #{n}' },
  platform: { kh: 'វេទិកា', en: 'Platform' },
  messages: { kh: 'សារ', en: 'Messages' },
  redFlagsToFind: { kh: 'សញ្ញាក្រហមត្រូវរក', en: 'Red flags to find' },
  redFlagsCount: { kh: 'សញ្ញាក្រហម', en: 'Red flags' },
  timeLimit: { kh: 'ពេលកំណត់', en: 'Time limit' },
  difficultyLabel: { kh: 'កម្រិត', en: 'Difficulty' },
  statusUnsolved: { kh: 'ស្ថានភាព៖ មិនទាន់ដោះស្រាយ', en: 'Status: Unsolved' },
  statusSolved: { kh: 'ស្ថានភាព៖ ដោះស្រាយរួច', en: 'Status: Solved' },
  openCase: { kh: 'បើកករណី', en: 'OPEN CASE' },
  exit: { kh: 'ចេញ', en: 'Exit' },
  turnsYellowAt: { kh: 'ប្រែជាលឿងនៅ {t}', en: 'Turns yellow at {t}' },
  flashesRedAt: { kh: 'ភ្លឹបភ្លែតក្រហមនៅ {t}', en: 'Flashes red at {t}' },
  flagged: { kh: 'បានដាក់ទង់', en: 'Flagged' },
  submitFindings: { kh: 'ដាក់បញ្ជូន', en: 'SUBMIT' },
  investigationHowTo: {
    kh: 'អានការសន្ទនាទាំងមូល។ ចុចទង់ 🚩 លើសារណាដែលគួរឱ្យសង្ស័យ។ ដាក់បញ្ជូនមុនពេលអស់ម៉ោង។',
    en: 'Read the full conversation. Tap the 🚩 on any message that seems suspicious. Submit before time runs out.',
  },
  gotItStartTimer: { kh: 'យល់ហើយ — ចាប់ផ្ដើមម៉ោង', en: 'GOT IT — START TIMER' },
  scrollForMore: { kh: 'អូសចុះក្រោមដើម្បីមើលបន្ថែម', en: 'Scroll for more…' },
  result: { kh: 'លទ្ធផល', en: 'RESULT' },
  caseDebrief: { kh: 'ករណី #{n} — សេចក្តីសង្ខេប', en: 'Case #{n} — Debrief' },
  resultPerfect: { kh: 'ល្អឥតខ្ចោះ', en: 'PERFECT' },
  resultPartial: { kh: 'ដោះស្រាយបានមួយផ្នែក', en: 'PARTIALLY SOLVED' },
  resultUnsolved: { kh: 'មិនទាន់ដោះស្រាយ', en: 'UNSOLVED' },
  allFlagsFound: { kh: 'រកឃើញសញ្ញាក្រហមទាំង {n}', en: 'All {n} flags found' },
  noFalseAlarms: { kh: 'គ្មានការដាក់ទង់ខុស', en: 'No false alarms' },
  foundOfFlags: { kh: 'រកឃើញ៖ {n} ក្នុងចំណោម {total}', en: 'Found: {n} of {total} flags' },
  missedN: { kh: 'ខកខាន៖ {n}', en: 'Missed: {n}' },
  falseAlarmsN: { kh: 'ដាក់ទង់ខុស៖ {n}', en: 'False alarms: {n}' },
  scorePoints: { kh: 'ពិន្ទុ៖ {n}', en: 'Score: {n} points' },
  yourFlagsVsReal: { kh: 'ទង់របស់អ្នក ធៀបនឹងសញ្ញាក្រហមពិត', en: 'Your flags vs real flags' },
  flagN: { kh: 'ទង់ទី {n}', en: 'Flag {n}' },
  flagCorrect: { kh: 'ត្រឹមត្រូវ', en: 'CORRECT' },
  flagMissed: { kh: 'ខកខាន', en: 'MISSED' },
  falseAlarm: { kh: 'ដាក់ទង់ខុស', en: 'FALSE ALARM' },
  falseAlarmBody: {
    kh: 'មើលទៅគួរឱ្យសង្ស័យ ប៉ុន្តែមិនមែនជាសញ្ញាក្រហមដោយខ្លួនឯងទេ។ រកមើលគ្រោះថ្នាក់ជាក់ស្តែង៖ លុយ ឯកសារ កូដ ឬអត្តសញ្ញាណ។',
    en: 'Looks suspicious, but it is not a red flag on its own. Look for concrete harm: money, files, codes or your ID.',
  },
  nextCase: { kh: 'ករណីបន្ទាប់', en: 'Next case' },
  home: { kh: 'ទំព័រដើម', en: 'Home' },
  solveCaseFirst: { kh: 'ដោះស្រាយករណី #{n} សិន', en: 'Solve Case #{n} first' },
  caseLocked: { kh: 'ជាប់សោ', en: 'Locked' },
  minutesShort: { kh: '{n} នាទី', en: '{n} minutes' },
  investigationBlurb: {
    kh: 'ស្វែងរក​ចំណុច​គួរ​ឱ្យ​សង្ស័យ​ទាំងអស់ មុន​ពេល​កំណត់',
    en: 'Find all red flags before time runs out',
  },
  comingSoon: { kh: 'នឹង​ដាក់​ឱ្យ​ដំណើរការ​ឆាប់ៗ', en: 'Coming soon' },
  pullToRefresh:    { kh: 'ទាញ​ចុះ​ដើម្បី​ផ្ទុក​ឡើង​វិញ', en: 'Pull down to refresh' },
  releaseToRefresh: { kh: 'លែង​ដៃ​ដើម្បី​ផ្ទុក​ឡើង​វិញ', en: 'Release to refresh' },
  refreshing:       { kh: 'កំពុង​ផ្ទុក​ឡើង​វិញ…', en: 'Refreshing…' },
  startHere: { kh: 'ចាប់ផ្ដើម​ទីនេះ', en: 'Start here' },

  /* ---- welcome ---- */
  welcomeHeadline: { kh: 'តើ​អ្នក​អាច​សម្គាល់​ល្បិច​ឆបោក​បាន​ដែរ​ឬ​ទេ?', en: 'Would you spot the scam?' },
  welcomeBody: {
    kh: 'Prayat នាំ​អ្នក​ចូលរួម​ក្នុង​ព្រឹត្តិការណ៍​ឆបោក​ជាក់ស្ដែង។ ធ្វើការ​សម្រេច​ចិត្ត សង្កេតមើល​លទ្ធផល និង​ស្វែងយល់​ពី​មូលហេតុ — ជា​ភាសា​ខ្មែរ ឬ​អង់គ្លេស។',
    en: 'Prayat puts you inside a real scam. Make decisions. See what happens. Learn why — in Khmer or English.',
  },
  getStarted: { kh: 'ចាប់ផ្ដើម', en: 'Get started' },
  itsFree: { kh: 'ឥត​គិត​ថ្លៃ', en: "it's free" },
  sampleScamLabel: { kh: 'ឧទាហរណ៍​សារ​ឆបោក', en: 'Example of a scam message' },
  sampleScamBody: { kh: 'គណនីធនាគារ ACLEDA របស់​អ្នក​ត្រូវ​បាន​ផ្អាក​ដំណើរការ។', en: 'Your ACLEDA account has been locked.' },
  sampleScamLink: { kh: 'សូម​ផ្ទៀងផ្ទាត់​បន្ទាន់៖ acleda-security-kh.com', en: 'Verify now: acleda-security-kh.com' },
  teachesYouToCatchThis: { kh: 'Prayat បណ្តុះ​ស្មារតី​ឱ្យ​អ្នក​ដឹង​ទាន់​សារ​ឆបោក​បែប​នេះ', en: 'Prayat teaches you to catch this' },
  featScenarios: { kh: 'អនុវត្ត​ស្ថានភាព​ឆបោក​ជាក់ស្ដែង', en: 'Play real scam scenarios' },
  featScenariosBody: { kh: 'Telegram, Facebook, SMS — ដូច​ទម្រង់​ដែល​ជន​ឆបោក​ប្រើប្រាស់​ជាក់ស្ដែង', en: 'Telegram, Facebook, SMS — exactly how scammers operate' },
  featPushback: { kh: 'ការ​សន្ទនា​វែកញែក​ជាក់ស្ដែង', en: 'Conversations that push back' },
  featPushbackBody: { kh: 'តួអង្គ​ជជែក​វែកញែក​ដូច​មនុស្ស​ពិត — មិន​ងាយ​ជឿ​ការ​ព្រមាន​របស់​អ្នក​ឡើយ', en: 'Uncle argues back like a real person — he will not just take your word' },
  featFamily: { kh: 'ការពារ​ក្រុម​គ្រួសារ​របស់​អ្នក', en: 'Protect your family' },
  featFamilyBody: { kh: 'ចែករំលែក​ចំណេះដឹង​ការពារ​ខ្លួន​ជាមួយ​ឪពុកម្ដាយ និង​សាច់ញាតិ', en: 'Share what you learn with parents and siblings' },
  welcomeFeaturesHeading: { kh: 'អ្វី​ដែល​អ្នក​នឹង​ទទួល​បាន', en: 'What you get' },
  sampleScamSender: { kh: 'ACLEDA', en: 'ACLEDA' },
  trustFree: { kh: 'ឥត​គិត​ថ្លៃ', en: 'Free' },
  trustNoAccount: { kh: 'មិន​ចាំបាច់​មាន​គណនី', en: 'No account needed' },
  trustBilingual: { kh: 'ខ្មែរ និង​អង់គ្លេស', en: 'Khmer & English' },

  /* ---- welcome: how it works ---- */
  howItWorks: { kh: 'របៀប​ដំណើរការ', en: 'How it works' },
  howItWorksSub: { kh: '៣ ជំហាន​ដើម្បី​ពង្រឹង​ការ​ការពារ​ខ្លួន​ពី​ល្បិច​ឆបោក', en: 'Three steps to becoming scam-proof' },
  howStep1: { kh: 'ការ​ប្រឈម​នឹង​សារ​ឆបោក', en: 'A scam arrives' },
  howStep1Body: { kh: 'ស្ថានភាព​ជាក់ស្ដែង​លេចឡើង — ដូចជា​សារ ការផ្ដល់​ការងារ ឬ​មន្ត្រី​ក្លែងក្លាយ ដែល​ត្រូវ​បាន​រៀបចំ​ដូច​ការពិត​ទាំងស្រុង។', en: 'A realistic scenario appears — a message, a job offer, a fake official. It looks real on purpose.' },
  howStep2: { kh: 'ធ្វើការ​សម្រេច​ចិត្ត', en: 'You make a decision' },
  howStep2Body: { kh: 'ជ្រើសរើស​វិធីសាស្ត្រ​ឆ្លើយតប។ ជម្រើស​នីមួយៗ​ឆ្លុះបញ្ចាំង​ពី​ស្ថានភាព​ពិត — ដែល​ទាមទារ​ឱ្យ​មាន​ការ​ពិចារណា​យ៉ាង​ហ្មត់ចត់។', en: 'Choose how to respond. The options are designed to feel real — not obviously right or wrong.' },
  howStep3: { kh: 'សង្កេតមើល​លទ្ធផល​ដែល​កើតឡើង', en: 'You see what happens' },
  howStep3Body: { kh: 'ព្រឹត្តិការណ៍​វិវឌ្ឍ​ទៅមុខ រួច​អ្នក​នឹង​ស្វែងយល់​យ៉ាង​លម្អិត​អំពី​ចំណុច​គួរ​ឱ្យ​សង្ស័យ និង​មូលហេតុ​ច្បាស់លាស់។', en: 'The story plays out. Then you learn exactly what the red flags were and why.' },
  howQuote: { kh: 'ការ​អាន​តែ​មួយ​មុខ​មិន​គ្រប់គ្រាន់​ដើម្បី​ទប់ទល់​នឹង​ល្បិច​ឆបោក​ឡើយ។ អ្នក​ចាំបាច់​ត្រូវ​ធ្លាប់​ឆ្លងកាត់​ការ​អនុវត្ត​ផ្ទាល់។', en: "You can't learn to resist a scam by reading about it. You have to feel it." },
  next: { kh: 'បន្ទាប់', en: 'Next' },

  /* ---- welcome: who is it for ---- */
  whoIsItFor: { kh: 'សម្រាប់​អ្នក​ណា?', en: 'Who is it for?' },
  whoIsItForSub: { kh: 'សាធារណជន​ទូទៅ​ដែល​ប្រើប្រាស់​ទូរស័ព្ទ​ឆ្លាតវៃ​នៅ​កម្ពុជា', en: 'Everyone who uses a phone in Cambodia' },
  whoYou: { kh: 'សម្រាប់​អ្នក', en: 'For you' },
  whoYouBody: { kh: 'សិស្ស និស្សិត និង​យុវជន​ដែល​ស្វែងរក​ការងារ​តាម​ប្រព័ន្ធ​អនឡាញ', en: 'Students and young adults looking for work online' },
  whoParents: { kh: 'សម្រាប់​ឪពុកម្ដាយ​របស់​អ្នក', en: 'For your parents' },
  whoParentsBody: { kh: 'មនុស្ស​ពេញវ័យ និង​អាណាព្យាបាល​ដែល​ងាយ​រង​សារ​គួរ​ឱ្យ​សង្ស័យ​តាម​បណ្ដាញ​សង្គម', en: 'Adults who receive suspicious messages on Facebook' },
  whoSchools: { kh: 'សម្រាប់​សាលា និង​អាជីវកម្ម', en: 'For schools and businesses' },
  whoSchoolsBody: { kh: 'ស្ថាប័ន​អប់រំ និង​អាជីវកម្ម​ដែល​ចង់​លើកកម្ពស់​សុវត្ថិភាព​សម្រាប់​បុគ្គលិក និង​សិស្សានុសិស្ស', en: 'Institutions that want to protect staff and students' },
  builtForCambodia: { kh: 'បង្កើត​ឡើង​ជា​ពិសេស​សម្រាប់​កម្ពុជា', en: 'Built specifically for Cambodia' },
  builtForCambodiaBody: { kh: 'រាល់​ស្ថានភាព​សាកល្បង​ទាំងអស់ ត្រូវ​បាន​ដកស្រង់​ចេញ​ពី​ល្បិចកល​ជាក់ស្ដែង​ដែល​កំពុង​កើតមាន​លើ Telegram, Facebook និង Wing ក្នុង​ប្រទេស​កម្ពុជា។', en: 'every scam scenario is based on real tactics used on Telegram, Facebook and Wing in Cambodia today.' },
  thatsMeNext: { kh: 'ត្រូវនឹង​ខ្ញុំ — បន្ត​ទៅមុខ', en: "That's me — next" },

  /* ---- welcome: install ---- */
  addToHomeScreen: { kh: 'បន្ថែម​ទៅ​អេក្រង់​ដើម', en: 'Add to your home screen' },
  addToHomeScreenBody: { kh: 'ពុំចាំបាច់​ទាញយក​ពី App Store ឡើយ។ ដំណើរការ​យ៉ាង​រលូន​លើ Android និង iPhone ហើយ​អាច​បើក​ប្រើប្រាស់​បាន​ភ្លាមៗ។', en: 'No app store needed. Works on any Android or iPhone. Opens instantly like a native app.' },
  perkOffline: { kh: 'អាច​ប្រើប្រាស់​បាន​ទោះបីជា​គ្មាន​អ៊ីនធឺណិត (Offline) ក្រោយ​ពេល​បើក​ដំណើរការ​លើកដំបូង', en: 'Works offline after first visit' },
  perkFast: { kh: 'ដំណើរការ​រហ័ស​ក្នុង​រយៈពេល​មិន​ដល់ ១ វិនាទី', en: 'Loads in under 1 second' },
  perkPrivate: { kh: 'ទិន្នន័យ​ផ្ទាល់ខ្លួន​ត្រូវ​បាន​រក្សាទុក​ដោយ​សុវត្ថិភាព​នៅ​លើ​ឧបករណ៍​របស់​អ្នក', en: 'Your data stays on your device' },
  perkPlatforms: { kh: 'គាំទ្រ​ទាំង​ប្រព័ន្ធ​ប្រតិបត្តិការ Android និង iOS', en: 'Android and iOS supported' },
  forIphoneUsers: { kh: 'សម្រាប់​អ្នក​ប្រើ iPhone', en: 'For iPhone users' },
  forThisBrowser: { kh: 'ដំឡើង​ពី​កម្មវិធី​រុករក', en: 'Install from your browser' },
  shareThenAdd: { kh: 'ចុច "ចែករំលែក" (Share) → "បន្ថែម​ទៅ​អេក្រង់​ដើម" (Add to Home Screen)', en: 'Tap Share → "Add to Home Screen"' },
  installPrayat: { kh: 'ដំឡើង Prayat', en: 'Install Prayat' },
  alreadyInstalled: { kh: 'បាន​ដំឡើង​រួច​ហើយ ✓', en: 'Already installed ✓' },
  continueInBrowser: { kh: 'បន្ត​ប្រើប្រាស់​តាម​កម្មវិធី​រុករក — រំលង​ការ​ដំឡើង', en: 'Continue in browser — skip install' },
  continue: { kh: 'បន្ត', en: 'Continue' },

  /* ---- progress ---- */
  myProgress: { kh: 'វឌ្ឍនភាព​របស់​ខ្ញុំ', en: 'My progress' },
  totalScore: { kh: 'ពិន្ទុ​សរុប', en: 'Total score' },
  streak: { kh: 'ថ្ងៃ​ជាប់​គ្នា', en: 'Streak' },
  /* {n} is replaced with the day count */
  streakDays: { kh: '{n} ថ្ងៃ', en: '{n} days' },
  resistanceHeading: { kh: 'ពិន្ទុ​ប្រុងប្រយ័ត្ន​ចំពោះ​ការ​ឆបោក', en: 'Scam resistance score' },
  notTriedYet: { kh: 'មិន​ទាន់​សាកល្បង', en: 'Not tried yet' },
  completedScenarios: { kh: 'ស្ថានភាព​សាកល្បង​ដែល​បាន​បញ្ចប់', en: 'Completed scenarios' },
  shareMyScore: { kh: 'ចែករំលែក​ពិន្ទុ​របស់​ខ្ញុំ', en: 'Share my score' },
  shareScoreText: {
    kh: 'កម្រិត​ការ​ប្រុងប្រយ័ត្ន​របស់​ខ្ញុំ​នៅ​លើ Prayat ទទួល​បាន {score} ពិន្ទុ (កម្រិត {level})។ សូម​ចូលរួម​សាកល្បង​ដោយ​ឥត​គិត​ថ្លៃ៖',
    en: 'My scam resistance score on Prayat: {score} · Level {level}. Try it free:',
  },
  scamGovernment: { kh: 'ល្បិច​ឆបោក​ក្លែងបន្លំ​ជា​ស្ថាប័ន​រដ្ឋ', en: 'Government scams' },
  scamJob: { kh: 'ល្បិច​ឆបោក​ជ្រើសរើស​បុគ្គលិក', en: 'Job offer scams' },
  scamCrypto: { kh: 'ល្បិច​ឆបោក​វិនិយោគ​រូបិយប័ណ្ណ​គ្រីបតូ', en: 'Crypto scams' },
  scamRomance: { kh: 'ល្បិច​ឆបោក​បង្កើត​ទំនុកចិត្ត​ស្នេហា', en: 'Romance scams' },
  scamMalware: { kh: 'ល្បិច​ឆបោក​តាមរយៈ​កម្មវិធី​បង្ក​គ្រោះថ្នាក់ (Malware)', en: 'Malware scams' },

  /* ---- scenario picker ---- */
  chooseScenario: { kh: 'ជ្រើសរើស​ស្ថានភាព​ជាក់ស្ដែង', en: 'Choose a scenario' },
  play: { kh: 'លេង', en: 'Play' },
  locked: { kh: 'ជាប់​សោ', en: 'Locked' },
  /* {n} is replaced with the scenario number */
  playScenarioFirst: { kh: 'សូម​អនុវត្ត​ស្ថានភាព​ទី {n} ជា​មុន​សិន', en: 'Play scenario {n} first' },
  difficulty: { kh: 'កម្រិត​លំបាក', en: 'Difficulty' },
  yourMission: { kh: 'បេសកកម្ម​របស់​អ្នក', en: 'Your mission' },
  warning: { kh: 'ការ​ក្រើន​រំលឹក', en: 'Warning' },
  warningFeelsReal: {
    kh: 'រាល់​ជម្រើស​ទាំងអស់​ត្រូវ​បាន​រៀបចំ​ឡើង​យ៉ាង​ប្រហាក់ប្រហែល​នឹង​ការពិត។ សូម​ពិចារណា​ឱ្យ​បាន​ហ្មត់ចត់។',
    en: 'The choices are designed to feel real. Think carefully.',
  },
  startScenario: { kh: 'ចាប់ផ្ដើម​ការ​អនុវត្ត', en: 'Start scenario' },
  outOf: { kh: 'ក្នុង​ចំណោម', en: 'of' },
  keepSharp: { kh: 'រក្សា​ស្មារតី​ប្រុងប្រយ័ត្ន​ជានិច្ច', en: 'Keep your instincts sharp' },
  daily: { kh: 'រៀងរាល់​ថ្ងៃ', en: 'daily' },
  weekly: { kh: 'រៀងរាល់​សប្ដាហ៍', en: 'weekly' },
  guardianTeaches: {
    kh: 'បណ្ដុះ​សមត្ថភាព​វិភាគ​ក្រោម​សម្ពាធ — និង​ការ​ប្រកាន់​ជំហរ​ច្បាស់លាស់​នៅ​ពេល​មនុស្ស​ជាទី​ស្រឡាញ់​ជំទាស់',
    en: 'Builds reasoning under pressure — and holding your ground when someone you love argues back',
  },
  stages: { kh: 'ដំណាក់កាល', en: 'stages' },
  minutes: { kh: 'នាទី', en: 'min' },
  comingSoonBody: {
    kh: 'មុខងារ​នេះ​កំពុង​ស្ថិត​ក្នុង​ការ​អភិវឌ្ឍ។ នា​ពេល​បច្ចុប្បន្ន សូម​សាកល្បង​ជាមួយ "របៀប​អាណាព្យាបាល"។',
    en: 'This mode is still being built. For now, try Guardian Mode.',
  },

  /* ---- guardian ---- */
  threatZoneLabel: {
    kh: 'សារ​ដែល​ជន​ឆបោក​បាន​ផ្ញើ​មក​កាន់​ពូ',
    en: 'What the scammer sent Uncle',
  },
  watchOnly: { kh: 'សម្រាប់​មើល​តែ​ប៉ុណ្ណោះ', en: 'watch only' },
  /* {name} is replaced with the relative's name */
  yourChatWith: { kh: 'ការ​ឆ្លើយឆ្លង​របស់​អ្នក​ជាមួយ {name}', en: 'Your chat with {name}' },
  yourChatLabel: { kh: 'អ្នក និង ពូ', en: 'You and Uncle' },
  whatDoYouReply: { kh: 'តើ​អ្នក​គួរ​ឆ្លើយតប​យ៉ាង​ដូចម្ដេច?', en: 'What do you reply?' },
  stage: { kh: 'ដំណាក់កាល', en: 'Stage' },
  score: { kh: 'ពិន្ទុ', en: 'Score' },
  verified: { kh: 'បាន​ផ្ទៀងផ្ទាត់', en: 'Verified' },
  forwardedFrom: { kh: 'បញ្ជូន​បន្ត​ពី', en: 'Forwarded from' },
  today: { kh: 'ថ្ងៃនេះ', en: 'Today' },
  howItEnded: { kh: 'វាបានបញ្ចប់យ៉ាងណា', en: 'How it ended' },
  rightAfter: { kh: 'ភ្លាមៗបន្ទាប់ពីនោះ', en: 'Right after' },
  threeDaysLater: { kh: '៣ ថ្ងៃក្រោយមក', en: '3 days later' },
  seeWhatWentWrong: { kh: 'មើលថាខុសត្រង់ណា', en: 'See what went wrong' },
  waitingForRelative: { kh: 'កំពុង​រង់ចាំ​ការ​ឆ្លើយតប​ពី​ពូ…', en: 'Waiting for Uncle…' },

  /* ---- speed triage: packs ---- */
  choosePack: { kh: 'ជ្រើសរើស​កញ្ចប់​វិនិច្ឆ័យ', en: 'Choose a card pack' },
  cards: { kh: 'សន្លឹក', en: 'cards' },
  dailyChallenge: { kh: 'វិញ្ញាសា​ប្រចាំ​ថ្ងៃ', en: 'Daily challenge' },
  /* {n} = number of cards */
  todaysCards: { kh: 'កម្រង​សារ​ទាំង {n} សម្រាប់​ថ្ងៃ​នេះ', en: "Today's {n} cards" },
  newEveryMorning: { kh: 'បច្ចុប្បន្នភាព​ថ្មី​រៀងរាល់​ព្រឹក', en: 'New every morning' },
  playDaily: { kh: 'លេង​ប្រចាំ​ថ្ងៃ', en: 'Play daily' },

  /* ---- speed triage: game over ---- */
  gameOver: { kh: 'បញ្ចប់​ការ​លេង', en: 'Game over' },
  cardsSurvived: { kh: 'ចំនួន​សារ​ដែល​បាន​វិនិច្ឆ័យ​ត្រឹមត្រូវ', en: 'Cards survived' },
  scoreLabel: { kh: 'ពិន្ទុ', en: 'Score' },
  bestStreak: { kh: 'ឆ្លើយ​ត្រូវ​ជាប់​គ្នា​ច្រើន​បំផុត', en: 'Best streak' },
  yourHighScore: { kh: 'ពិន្ទុ​ខ្ពស់​បំផុត​របស់​អ្នក', en: 'Your high score' },
  newRecord: { kh: 'ថ្មី!', en: 'NEW!' },
  previousBest: { kh: 'កំណត់ត្រា​ចាស់', en: 'Previous best' },
  struggledWith: { kh: 'ចំណុច​ដែល​អ្នក​ជួប​ការ​លំបាក', en: 'You struggled with' },
  /* {n} = number wrong */
  nWrong: { kh: 'ឆ្លើយ​ខុស {n}', en: '{n} wrong' },
  allCorrect: { kh: 'ត្រឹមត្រូវ​ទាំងអស់', en: 'all correct' },
  tip: { kh: 'អនុសាសន៍', en: 'Tip' },
  /* {pack} = pack name */
  tryPackTip: { kh: 'សូម​សាកល្បង​កញ្ចប់ "{pack}" ដើម្បី​ពង្រឹង​ការ​យល់ដឹង​បន្ថែម​លើ​ចំណុច​នេះ', en: 'Try the "{pack}" pack to improve that skill' },
  changePack: { kh: 'ប្ដូរ​កញ្ចប់', en: 'Change pack' },
  shareScore: { kh: 'ចែករំលែក​ពិន្ទុ', en: 'Share score' },
  /* {n} = cards, {score} = score */
  shareTriageText: {
    kh: 'ខ្ញុំ​បាន​ឆ្លងកាត់ {n} សារ​ក្នុង​ការ​វិនិច្ឆ័យ​រហ័ស​លើ Prayat ជាមួយ​ពិន្ទុ {score}! តើ​អ្នក​អាច​យក​ឈ្នះ​ពិន្ទុ​របស់​ខ្ញុំ​បាន​ដែរ​ឬ​ទេ?',
    en: 'I survived {n} cards in Prayat Speed Triage! Score: {score} — can you beat me?',
  },
  surfaceSms: { kh: 'សារ SMS', en: 'SMS messages' },
  surfaceTelegram: { kh: 'សារ Telegram', en: 'Telegram messages' },
  surfaceFacebook: { kh: 'សារ Facebook', en: 'Facebook messages' },
  surfaceUrlBar: { kh: 'តំណភ្ជាប់​គេហទំព័រ (URL)', en: 'Website URLs' },
  surfaceQr: { kh: 'កូដ QR', en: 'QR codes' },
  surfaceReceipt: { kh: 'បង្កាន់ដៃ​ទូទាត់​ប្រាក់', en: 'Payment receipts' },

  /* ---- speed triage: answer states ---- */
  correct: { kh: 'ត្រឹមត្រូវ', en: 'Correct' },
  wrong: { kh: 'ខុស', en: 'Wrong' },
  points: { kh: 'ពិន្ទុ', en: 'points' },
  /* {n} = streak length */
  streakX: { kh: 'ជាប់​គ្នា ×{n}', en: 'Streak ×{n}' },
  /* {n} = lives left */
  livesRemaining: { kh: 'ជីវិត​នៅ​សល់: {n}', en: 'Lives remaining: {n}' },
  theAnswerWas: { kh: 'ចម្លើយ​គឺ', en: 'The answer was' },
  whyScam: { kh: 'មូលហេតុ​ដែល​ជា​ការ​ឆបោក', en: "Why it's a scam" },
  whyReal: { kh: 'មូលហេតុ​ដែល​ជា​សារ​ពិតប្រាកដ', en: "Why it's real" },
  /* {n} = streak length */
  streakMilestone: { kh: 'ត្រឹមត្រូវ​ជាប់​គ្នា {n} លើក!', en: '{n} streak!' },
  /* {m} = multiplier */
  multiplierFromNow: { kh: 'គុណ​ពិន្ទុ ×{m} ចាប់ពី​ពេល​នេះ', en: 'Score ×{m} from now' },

  /* ---- speed triage: countdown ---- */
  getReady: { kh: 'ត្រៀម​ខ្លួន', en: 'Get ready' },
  go: { kh: 'ចាប់ផ្ដើម!', en: 'GO!' },

  /* ---- speed triage: how to play ---- */
  howToPlay: { kh: 'របៀប​លេង', en: 'How to play' },
  /* {n} = step number */
  stepN: { kh: 'ជំហាន​ទី {n}', en: 'Step {n}' },
  triageStep1: {
    kh: 'សារ​ជាក់ស្ដែង​នឹង​បង្ហាញ​លើ​អេក្រង់ — SMS, Telegram, Facebook, តំណភ្ជាប់​គេហទំព័រ, បង្កាន់ដៃ Wing ឬ​កូដ QR',
    en: 'A real message appears on screen — SMS, Telegram, Facebook, a website URL, a Wing receipt, or a QR code',
  },
  triageStep2: {
    kh: 'អ្នក​មាន​ថិរវេលា {seconds} វិនាទី​ក្នុង​ការ​សម្រេច​ចិត្ត',
    en: 'You have {seconds} seconds to decide',
  },
  triageStep3: { kh: 'ជ្រើសរើស​ការ​វិនិច្ឆ័យ​របស់​អ្នក', en: 'Tap your answer' },
  triageStep4: {
    kh: 'អាន​ការ​ពន្យល់​លម្អិត ({explain} វិនាទី) មុន​ពេល​សារ​បន្ទាប់​បង្ហាញ​ឡើង',
    en: 'See the explanation ({explain} sec), then the next card appears',
  },
  triageStep5: {
    kh: 'ការ​ឆ្លើយ​ខុស {mistakes} ដង មានន័យ​ថា​បញ្ចប់​ការ​លេង។ សូម​ព្យាយាម​បំបែក​កំណត់ត្រា​ខ្ពស់​បំផុត!',
    en: '{mistakes} wrong answers = game over. Beat your high score!',
  },
  /* {n} wrong out of {max} */
  wrongCount: { kh: 'ឆ្លើយ​ខុស {n} / {max}', en: '{n} / {max} wrong' },
  gotItLetsPlay: { kh: 'យល់ព្រម — ចាប់ផ្ដើម​លេង', en: "Got it — let's play" },

  /* ---- speed triage ---- */
  verdictReal: { kh: 'សារ​ពិត', en: 'REAL' },
  verdictScam: { kh: 'សារ​ឆបោក', en: 'SCAM' },
  itWasReal: { kh: 'នេះ​ជា​សារ​ពិតប្រាកដ', en: 'That one was real' },
  itWasScam: { kh: 'នេះ​ជា​សារ​ឆបោក', en: 'That one was a scam' },
  runOver: { kh: 'បញ្ចប់​ជុំ​វិនិច្ឆ័យ', en: 'Run over' },
  pointsEarned: { kh: 'ពិន្ទុ​ដែល​ទទួល​បាន', en: 'Points earned' },

  /* ---- investigation ---- */
  flagsFound: { kh: 'រក​ឃើញ', en: 'found' },
  timeLeft: { kh: 'ពេលវេលា​នៅសល់', en: 'Time left' },
  tapSuspicious: { kh: 'ចុច​លើ​ចំណុច​ដែល​គួរ​ឱ្យ​សង្ស័យ', en: 'Tap anything suspicious' },
  notTheIssue: { kh: 'ចំណុច​នេះ​មិនមែន​ជា​ភាព​មិន​ប្រក្រតី​ឡើយ', en: 'Not the issue' },
  penaltyTenSeconds: { kh: '-១០ វិនាទី', en: '-10 seconds' },
  timeUp: { kh: 'ផុតកំណត់​ពេលវេលា', en: "Time's up" },
  youFoundAll: { kh: 'អ្នក​បាន​រក​ឃើញ​ចំណុច​សង្ស័យ​ទាំងអស់', en: 'You found them all' },
  missedFlags: { kh: 'ចំណុច​ខុស​ប្រក្រតី​ដែល​អ្នក​បាន​មើល​រំលង', en: 'What you missed' },

  /* ---- score ---- */
  yourScore: { kh: 'ពិន្ទុ​ស្មារតី​ប្រុងប្រយ័ត្ន​របស់​អ្នក', en: 'Your resistance score' },
  level: { kh: 'កម្រិត', en: 'Level' },
  pointsToNext: { kh: 'ពិន្ទុ​បន្ថែម​ទៀត ដើម្បី​ឈាន​ទៅ​កម្រិត​បន្ទាប់', en: 'points to the next level' },
  topLevel: { kh: 'កម្រិត​ខ្ពស់​បំផុត', en: 'Top level reached' },
  noPointsYet: {
    kh: 'ចូលរួម​លេង​មួយ​ជុំ ដើម្បី​ចាប់ផ្ដើម​សន្សំ​ពិន្ទុ​ប្រុងប្រយ័ត្ន​របស់​អ្នក',
    en: 'Play a round to start building your resistance score',
  },

  /* ---- levels ---- */
  levelAware: { kh: 'ដឹង​ខ្លួន', en: 'Aware' },
  levelAlert: { kh: 'ប្រុង​ប្រយ័ត្ន', en: 'Alert' },
  levelDefender: { kh: 'អ្នក​ការពារ', en: 'Defender' },
  levelGuardian: { kh: 'អាណាព្យាបាល', en: 'Guardian' },
  levelProtector: { kh: 'អ្នក​ថែរក្សា', en: 'Protector' },

  /* ---- debrief ---- */
  debriefWinTitle: { kh: 'ពូ​មិន​បាន​ចាញ់បោក និង​មិន​បាន​ផ្ទេរ​ប្រាក់​ឡើយ', en: 'He did not pay' },
  debriefLoseTitle: { kh: 'ពូ​បាន​ចាញ់បោក និង​ផ្ទេរ​ប្រាក់​ទៅ​ជនខិលខូច​រួច​ហើយ', en: 'He paid' },
  whatScamHeading: { kh: 'ប្រភេទ​នៃ​ល្បិច​ឆបោក​នេះ', en: 'What this scam was' },
  redFlagsHeading: { kh: 'សញ្ញា​គួរ​ឱ្យ​សង្ស័យ​ទាំង​បី', en: 'The three red flags' },
  ruleHeading: { kh: 'វិធាន​សំខាន់​ដែល​ត្រូវ​ចងចាំ', en: 'The one rule to remember' },
  realLifeHeading: { kh: 'ចំណាត់ការ​ជាក់ស្ដែង​ក្នុង​ជីវិត​ប្រចាំ​ថ្ងៃ', en: 'What to do in real life' },
  scoreThisRound: { kh: 'ពិន្ទុ​សម្រាប់​ជុំ​នេះ', en: 'Score this round' },
  shareCopied: { kh: 'បាន​ចម្លង​រួចរាល់', en: 'Copied' },
  shareToFamily: { kh: 'ចែករំលែក​ទៅកាន់​ក្រុម​គ្រួសារ', en: 'Share to family chat' },

  /* ---- actions ---- */
  start: { kh: 'ចាប់ផ្ដើម', en: 'Start' },
  back: { kh: 'ត្រឡប់​ក្រោយ', en: 'Back' },
  backHome: { kh: 'ត្រឡប់​ទៅ​ទំព័រ​ដើម', en: 'Back to home' },
  playAgain: { kh: 'លេង​ម្ដង​ទៀត', en: 'Play again' },
  share: { kh: 'ចែករំលែក', en: 'Share' },
  retry: { kh: 'ព្យាយាម​ម្ដង​ទៀត', en: 'Try again' },

  /* ---- states — no screen is ever blank ---- */
  loading: { kh: 'កំពុង​ផ្ទុក…', en: 'Loading…' },
  errorTitle: { kh: 'មាន​បញ្ហា​ក្នុង​ការ​តភ្ជាប់', en: 'Something went wrong' },
  errorBody: {
    kh: 'ពុំ​អាច​តភ្ជាប់​បាន​ឡើយ។ សូម​ពិនិត្យ​បណ្ដាញ​អ៊ីនធឺណិត​របស់​អ្នក រួច​ព្យាយាម​ម្ដង​ទៀត។',
    en: 'Could not connect. Check your internet and try again.',
  },

  /* ---- auth ---- */
  signIn: { kh: 'ចូល​គណនី', en: 'Sign in' },
  signingIn: { kh: 'កំពុង​ចូល…', en: 'Signing in…' },
  signUp: { kh: 'បង្កើត​គណនី', en: 'Create account' },
  signingUp: { kh: 'កំពុង​បង្កើត…', en: 'Creating…' },
  signInTitle: { kh: 'សូម​ស្វាគមន៍​ត្រឡប់​មក​វិញ', en: 'Welcome back' },
  signInSubtitle: {
    kh: 'ចូល​គណនី ដើម្បី​រក្សាទុក​ពិន្ទុ​ប្រុងប្រយ័ត្ន​របស់​អ្នក',
    en: 'Sign in to keep your resistance score',
  },
  signUpTitle: { kh: 'បង្កើត​គណនី​របស់​អ្នក', en: 'Create your account' },
  signUpSubtitle: {
    kh: 'រក្សាទុក​វឌ្ឍនភាព​របស់​អ្នក និង​ចែករំលែក​ជាមួយ​ក្រុម​គ្រួសារ',
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
  errEmailInvalid: { kh: 'ទម្រង់​អ៊ីមែល​នេះ​ពុំ​ត្រឹមត្រូវ​ឡើយ', en: 'That does not look like an email' },
  errPasswordRequired: { kh: 'សូម​បញ្ចូល​ពាក្យ​សម្ងាត់', en: 'Enter your password' },
  errPasswordShort: { kh: 'ពាក្យសម្ងាត់​ត្រូវ​មាន​យ៉ាង​តិច ៨ តួអក្សរ', en: 'That password is too short' },
  errPasswordMismatch: { kh: 'ពាក្យសម្ងាត់​ទាំង​ពីរ​មិន​ស៊ីគ្នា​ឡើយ', en: 'The two passwords do not match' },
  errCodeIncomplete: { kh: 'សូម​បញ្ចូល​លេខកូដ​ឱ្យ​គ្រប់​ទាំង ៦ ខ្ទង់', en: 'Enter all six digits' },

  forgotPassword: { kh: 'ភ្លេច​ពាក្យ​សម្ងាត់?', en: 'Forgot password?' },
  noAccountYet: { kh: 'មិន​ទាន់​មាន​គណនី?', en: 'No account yet?' },
  alreadyHaveAccount: { kh: 'មាន​គណនី​រួច​ហើយ?', en: 'Already have an account?' },
  continueWithoutAccount: { kh: 'បន្ត​ដោយ​មិន​ចាំបាច់​មាន​គណនី', en: 'Continue without an account' },
  startAsGuest: { kh: 'ចាប់ផ្ដើមលេង — គ្មានគណនី', en: 'Start playing — no account needed' },
  createAccountOptional: { kh: 'ចង់រក្សាទុកពិន្ទុលើគ្រប់ឧបករណ៍? បង្កើតគណនី', en: 'Want your score on every device? Create an account' },
  levelZeroHomeBlurb: { kh: 'ហ្គេមខ្នាតតូច ៣ · ~៤ នាទី · ទទួលឧបករណ៍ ៣', en: '3 mini-games · ~4 minutes · earn 3 tools' },

  verifyTitle: { kh: 'ពិនិត្យ​អ៊ីមែល​របស់​អ្នក', en: 'Check your email' },
  verifySubtitle: {
    kh: 'យើង​បាន​ផ្ញើ​លេខកូដ ៦ ខ្ទង់​ទៅកាន់',
    en: 'We sent a six-digit code to',
  },
  verifyCodeLabel: { kh: 'លេខកូដ​បញ្ជាក់', en: 'Verification code' },
  verifyAction: { kh: 'បញ្ជាក់​អ៊ីមែល', en: 'Verify email' },
  verifying: { kh: 'កំពុង​ផ្ទៀងផ្ទាត់…', en: 'Verifying…' },
  didNotGetCode: { kh: 'មិន​បាន​ទទួល​លេខកូដ​មែនទេ?', en: "Didn't get the code?" },
  resendCode: { kh: 'ផ្ញើ​លេខកូដ​ម្ដង​ទៀត', en: 'Send it again' },
  codeResent: { kh: 'បាន​ផ្ញើ​លេខកូដ​ជាថ្មី​រួចរាល់', en: 'Sent again' },
  resendIn: { kh: 'ផ្ញើ​ម្ដង​ទៀត​ក្នុង', en: 'Resend in' },
  seconds: { kh: 'វិនាទី', en: 'seconds' },

  forgotTitle: { kh: 'កំណត់​ពាក្យ​សម្ងាត់​ឡើង​វិញ', en: 'Reset your password' },
  forgotSubtitle: {
    kh: 'បញ្ចូល​អ៊ីមែល​របស់​អ្នក ប្រព័ន្ធ​នឹង​ផ្ញើ​តំណភ្ជាប់​សម្រាប់​កំណត់​ពាក្យសម្ងាត់​ឡើងវិញ',
    en: 'Enter your email and we will send you a reset link',
  },
  sendResetLink: { kh: 'ផ្ញើ​តំណ​កំណត់​ឡើង​វិញ', en: 'Send reset link' },
  sending: { kh: 'កំពុង​ផ្ញើ…', en: 'Sending…' },
  resetLinkSentTitle: { kh: 'សូម​ពិនិត្យ​អ៊ីមែល​របស់​អ្នក', en: 'Check your email' },
  resetLinkSentBody: {
    kh: 'ប្រសិនបើ​អាសយដ្ឋាន​អ៊ីមែល​នេះ​មាន​ក្នុង​ប្រព័ន្ធ តំណភ្ជាប់​សម្រាប់​កំណត់​ពាក្យសម្ងាត់​ត្រូវ​បាន​បញ្ជូន​រួចរាល់​ហើយ។',
    en: 'If that address has an account, we have sent it a password reset link.',
  },
  backToSignIn: { kh: 'ត្រឡប់​ទៅ​ការ​ចូល​គណនី', en: 'Back to sign in' },

  resetTitle: { kh: 'ជ្រើស​ពាក្យ​សម្ងាត់​ថ្មី', en: 'Choose a new password' },
  resetSubtitle: {
    kh: 'សូម​កំណត់​ពាក្យសម្ងាត់​ដែល​អ្នក​មិន​ធ្លាប់​ប្រើប្រាស់​នៅ​កន្លែង​ផ្សេង',
    en: 'Pick one you do not use anywhere else',
  },
  resetAction: { kh: 'រក្សាទុក​ពាក្យ​សម្ងាត់​ថ្មី', en: 'Save new password' },
  resetting: { kh: 'កំពុង​រក្សាទុក…', en: 'Saving…' },
  resetDoneTitle: { kh: 'ពាក្យសម្ងាត់​ត្រូវ​បាន​ផ្លាស់ប្ដូរ​ជោគជ័យ', en: 'Password changed' },
  resetDoneBody: {
    kh: 'បច្ចុប្បន្ន លោកអ្នក​អាច​ចូល​គណនី​ដោយ​ប្រើប្រាស់​ពាក្យសម្ងាត់​ថ្មី​បាន​ហើយ។',
    en: 'You can now sign in with your new password.',
  },

  signOut: { kh: 'ចាកចេញ', en: 'Sign out' },
  playingAsGuest: { kh: 'ដំណើរការ​សាកល្បង​ជា​ភ្ញៀវ — ពិន្ទុ​នឹង​ត្រូវ​បាន​រក្សាទុក​តែ​នៅ​លើ​ឧបករណ៍​នេះ​ប៉ុណ្ណោះ', en: 'Playing as a guest — score saved on this device only' },

  /* ---- bootcamp ---- */
  levelZero: { kh: 'កម្រិត ០', en: 'Level 0' },
  bootcampTitle: { kh: 'ការ​ហ្វឹកហាត់​សន្តិសុខ​ឌីជីថល', en: 'Cyber Bootcamp' },
  bootcampIntro: {
    kh: 'មេរៀន​ខ្លីៗ​ចំនួន ៣។ មេរៀន​នីមួយៗ​នឹង​បំពាក់បំប៉ន​នូវ​ជំនាញ និង​ឧបករណ៍​ដែល​អ្នក​ត្រូវ​ប្រើប្រាស់​ក្នុង​ការ​អនុវត្ត​ជាក់ស្ដែង។',
    en: 'Two short modules. Each one gives you a tool you will actually use in the game.',
  },
  bootcampSubtitle: {
    kh: 'មុនពេល​ទប់ទល់​នឹង​ជន​ឆបោក ចាំបាច់​ត្រូវ​យល់ដឹង​ពី​ល្បិចកល និង​របៀប​ជ្រៀតចូល​របស់​ពួកគេ​ជាមុនសិន។',
    en: 'Before you fight scammers, learn how they get in.',
  },
  bootcampMeta: {
    kh: 'លំហាត់​ហ្វឹកហ្វឺន ៣ វគ្គ · ~៤ នាទី',
    en: '3 mini-games · ~4 minutes',
  },
  bootcampEarnNotice: {
    kh: 'ឆ្លងកាត់​ការ​ហ្វឹកហាត់​ទាំង ៣ ដើម្បី​ទទួល​បាន​ឧបករណ៍​ជំនួយ​សុវត្ថិភាព​សម្រាប់​ប្រើប្រាស់​ក្នុង​ស្ថានភាព​ជាក់ស្ដែង។',
    en: 'Complete all 3 to earn these tools for the main game.',
  },
  beginTraining: { kh: 'ចាប់ផ្ដើម​ការ​ហ្វឹកហាត់', en: 'BEGIN TRAINING' },
  skip: { kh: 'រំលង', en: 'Skip' },
  skipNoTools: {
    kh: '(អ្នក​នឹង​ពុំ​ទទួល​បាន​ឧបករណ៍​ជំនួយ​សុវត្ថិភាព​ឡើយ)',
    en: '(you will not earn the tools)',
  },
  toolShieldBadge: { kh: 'ផ្លាកសញ្ញា​ការពារ​សុវត្ថិភាព', en: 'Shield Badge' },
  moduleOf: { kh: '{n} នៃ {total}', en: '{n} of {total}' },
  nextModule: { kh: 'មេរៀន​បន្ទាប់', en: 'NEXT MODULE' },
  ruleToRemember: { kh: 'វិធាន​សំខាន់​ដែល​ត្រូវ​ចងចាំ', en: 'Rule to remember' },
  toolUnlockedNamed: { kh: 'ទទួល​បាន {tool}', en: '{tool} unlocked' },

  /* ---- module 1: the network ---- */
  networkTitle: { kh: 'បណ្ដាញ', en: 'The Network' },
  networkConcept: {
    kh: 'បណ្ដាញ Wi-Fi សាធារណៈ​បញ្ជូន​ទិន្នន័យ​របស់​អ្នក​ដោយ​គ្មាន​ការ​ការពារ ដូចជា​កាតប៉ុស្តាល់​ចំហ​ដែល​អាច​ឱ្យ​ជនអនាមិក​លួច​អាន​បាន។ រីឯ​ប្រព័ន្ធ HTTPS ជួយ​បំប្លែង​ទិន្នន័យ​ទាំងនោះ​ឱ្យ​មាន​សុវត្ថិភាព​ខ្ពស់​ដូច​ប្រអប់​ដែល​ចាក់សោជិត។',
    en: 'Public Wi-Fi sends your data like an open postcard — anyone nearby can read it. HTTPS turns it into a locked box.',
  },
  coffeeShop: { kh: 'ហាងកាហ្វេ', en: 'THE COFFEE SHOP' },
  coffeeShopHint: {
    kh: 'ចុច "ការពារ" មុនពេល​ទិន្នន័យ​របស់​អ្នក​ធ្លាក់​ទៅ​ក្នុង​ដៃ​ជនចម្លែក',
    en: 'Tap SHIELD before your data reaches the stranger',
  },
  sceneYou: { kh: 'អ្នក', en: 'You' },
  sceneRouter: { kh: 'រ៉ោតទ័រ', en: 'Router' },
  sceneStranger: { kh: 'ជនចម្លែក', en: 'Stranger' },
  tapToShield: { kh: 'ចុច​ដើម្បី​ការពារ', en: 'TAP TO SHIELD' },
  secured: { kh: 'បាន​ការពារ', en: 'Secured' },
  strangerBlocked: { kh: 'រារាំង​បាន​ជោគជ័យ!', en: 'Blocked!' },
  strangerRead: { kh: 'ទិន្នន័យ​ត្រូវ​បាន​បែកធ្លាយ!', en: 'Read it!' },
  coffeeShopPassed: { kh: 'ទិន្នន័យ​ទាំងអស់​ត្រូវ​បាន​ការពារ​ប្រកប​ដោយ​សុវត្ថិភាព', en: 'All data protected' },
  coffeeShopPassedSub: {
    kh: 'បាន​រារាំង​ជនចម្លែក​ចំនួន {n} លើក ក្នុង​ចំណោម {total} លើក',
    en: 'Stranger blocked {n} of {total} times',
  },
  coffeeShopFailed: {
    kh: 'ជនចម្លែក​បាន​លួច​អាន​ទិន្នន័យ​ចំនួន {n} លើក។ អ្នក​ត្រូវ​ការពារ​ឱ្យ​បាន​យ៉ាង​តិច {pass} ក្នុង​ចំណោម {total} លើក។',
    en: 'The stranger read {n} postcards. Protect at least {pass} of {total}.',
  },
  networkRule: {
    kh: 'សូម​ពិនិត្យមើល​សញ្ញា​ចាក់សោ 🔒 ក្នុង​កម្មវិធី​រុករក​ជានិច្ច។ ជៀសវាង​ការ​ចូលប្រើ​គណនី​ធនាគារ​តាមរយៈ Wi-Fi សាធារណៈ ប្រសិនបើ​ពុំមាន​ប្រព័ន្ធ​ការពារ VPN។',
    en: 'Always check for 🔒 in your browser. Never log into your bank on public Wi-Fi without a VPN.',
  },
  shieldBadgeUnlocked: { kh: 'ទទួល​បាន​ផ្លាកសញ្ញា​ការពារ​សុវត្ថិភាព', en: 'Shield Badge unlocked' },
  learnBeforeYouLose: { kh: 'រៀន​ស្គាល់​ល្បិចកល មុន​ពេល​រង​ការ​ខាតបង់', en: 'Learn before you lose' },
  bootcampLocked: {
    kh: 'បញ្ចប់​ការ​ហ្វឹកហាត់​ជាមុន​សិន ដើម្បី​បើក​ដំណើរការ​គ្រប់​មុខងារ',
    en: 'Finish both modules to unlock the game modes',
  },
  bootcampDoneAction: { kh: 'បើក​ដំណើរការ​ហើយ — ចាប់ផ្ដើម​អនុវត្ត', en: 'Unlocked — start playing' },
  unlocks: { kh: 'នឹង​ផ្ដល់', en: 'Unlocks' },
  toolUnlocked: { kh: 'ទទួល​បាន​ឧបករណ៍', en: 'Tool unlocked' },
  toolAuthenticator: { kh: 'លេខកូដ​ផ្ទៀងផ្ទាត់​សុវត្ថិភាព', en: 'Authenticator Token' },
  toolMagnifier: { kh: 'កញ្ចក់​ពង្រីក​ពិនិត្យ', en: 'Magnifying Glass' },
  modulePassed: { kh: 'ជាប់​ការ​វាយតម្លៃ', en: 'Passed' },
  moduleFailed: { kh: 'ពុំ​ទាន់​ជាប់​នៅ​ឡើយ', en: 'Not passed yet' },
  tryModuleAgain: { kh: 'ព្យាយាម​ម្ដង​ទៀត', en: 'Try again' },
  backToBootcamp: { kh: 'ត្រឡប់​ទៅ​មេរៀន', en: 'Back to the bootcamp' },
  passMark: { kh: 'ពិន្ទុ​ជាប់​អប្បបរមា', en: 'Pass mark' },

  /* ---- vip club ---- */
  doorTitle: { kh: 'ទ្វារ​សុវត្ថិភាព', en: 'The Door' },
  doorConcept: {
    kh: 'ពាក្យសម្ងាត់​តែ​មួយ​មុខ​ពុំ​មាន​សុវត្ថិភាព​គ្រប់គ្រាន់​ឡើយ។ ប្រព័ន្ធ​ផ្ទៀងផ្ទាត់​ពីរ​ជាន់ (2FA) នឹង​បញ្ជូន​លេខកូដ​សុវត្ថិភាព​ទៅកាន់​ទូរស័ព្ទ​ផ្ទាល់​របស់​អ្នក ដែល​ជន​ឆបោក​មិន​អាច​លួច​យក​បាន​ឡើយ។',
    en: 'A password is just a word — anyone can guess it. 2FA adds a code sent only to your real phone. Scammers cannot get that code.',
  },
  vipClub: { kh: 'ក្លឹប VIP', en: 'THE VIP CLUB' },
  vipClubHint: {
    kh: 'ក្នុង​តួនាទី​ជា​អ្នក​ត្រួតពិនិត្យ​សុវត្ថិភាព សូម​អនុញ្ញាត​ឱ្យ​តែ​បុគ្គល​ដែល​មាន​សុពលភាព​ចូល និង​រារាំង​បុគ្គល​ណា​ដែល​ពុំ​មាន​លេខកូដ 2FA។',
    en: 'You are the bouncer. Let the right people in. Block anyone without the 2FA code.',
  },
  roundN: { kh: 'ជុំទី {n}', en: 'Round {n}' },
  phoneNoCode: { kh: 'គ្មាន​លេខកូដ — មាន​តែ​ពាក្យសម្ងាត់', en: 'No code — password only' },
  phoneCodeSent: { kh: 'លេខកូដ​ត្រូវ​បាន​ផ្ញើ​ទៅ​ទូរស័ព្ទ​សមាជិក​ពិត', en: 'Code sent to the member’s real phone' },
  roundRealUser: { kh: 'ជុំទី {n}៖ សមាជិក​ស្របច្បាប់', en: 'Round {n}: Real user' },
  roundScammer: { kh: 'ជុំទី {n}៖ ជន​ឆបោក', en: 'Round {n}: Scammer' },
  codeLabel: { kh: 'លេខកូដ 2FA៖', en: '2FA code:' },
  noCodeShown: { kh: 'ពុំ​មាន​លេខកូដ​បង្ហាញ', en: 'No code shown' },
  visitorForgotPhone: { kh: '«ខ្ញុំ​ភ្លេច​ទូរស័ព្ទ…»', en: '“I forgot my phone…”' },
  visitorPhoneDied: { kh: '«ទូរស័ព្ទ​ខ្ញុំ​អស់​ថ្ម — អ្នក​គ្រប់គ្រង​ស្គាល់​ខ្ញុំ លឿន​ឡើង!»', en: '“My phone died — the manager knows me, hurry up!”' },
  letIn: { kh: 'អនុញ្ញាត​ឱ្យ​ចូល', en: 'LET IN' },
  block: { kh: 'រារាំង', en: 'BLOCK' },
  doorRightIn: { kh: 'ត្រឹមត្រូវ — ការ​មាន​ទាំង​ពាក្យសម្ងាត់ និង​លេខកូដ 2FA បញ្ជាក់​ថា​ជា​សមាជិក​ស្របច្បាប់។', en: 'Right — password and code. That is a member.' },
  doorRightBlock: { kh: 'ត្រឹមត្រូវ — ពាក្យសម្ងាត់​តែ​មួយ​មុខ​ពុំ​អាច​បញ្ជាក់​ពី​អត្តសញ្ញាណ​ពិតប្រាកដ​បាន​ឡើយ។', en: 'Right — a password alone proves nothing.' },
  doorWrongIn: { kh: 'បុគ្គល​នេះ​ពុំ​មាន​លេខកូដ​ឡើយ។ ពាក្យសម្ងាត់​ដែល​ត្រូវ​បាន​គេ​លួច​មើល​ទៅ​ដូច​ពាក្យសម្ងាត់​ពិត — អ្នក​ទើបតែ​បាន​អនុញ្ញាត​ឱ្យ​ជន​ឆបោក​ចូល។', en: 'He had no code. A stolen password looks exactly like the real one — you just let a scammer in.' },
  doorWrongBlock: { kh: 'បុគ្គល​នេះ​មាន​លេខកូដ​ត្រឹមត្រូវ។ លេខកូដ​នេះ​ត្រូវ​បាន​ផ្ញើ​ផ្ដាច់មុខ​ទៅកាន់​ទូរស័ព្ទ​របស់​សមាជិក​ពិតប្រាកដ​ប៉ុណ្ណោះ។', en: 'They had the code. The code only reaches the real member’s phone — that is the proof.' },
  mistakes: { kh: 'កំហុស​ឆ្គង', en: 'Mistakes' },
  doorReset: { kh: 'ការ​សម្រេច​ចិត្ត​ខុស ២ លើក — ប្រព័ន្ធ​នឹង​ចាប់ផ្ដើម​ឡើងវិញ។', en: 'Two wrong calls — the door resets.' },
  vipClubPassed: { kh: 'ជន​ឆបោក​ត្រូវ​បាន​រារាំង​ដោយ​ជោគជ័យ', en: 'Scammer blocked' },
  vipClubPassedSub: { kh: 'ច្រក​ចូល​ត្រូវ​បាន​បិទ ដោយសារ​បុគ្គល​នោះ​ពុំ​មាន​លេខកូដ​បញ្ជាក់', en: 'The door stayed shut because he had no code' },
  vipClubFailed: { kh: 'ជន​ឆបោក​បាន​ជ្រៀតចូល​ដោយ​ជោគជ័យ។ សូម​ព្យាយាម​ម្ដង​ទៀត និង​ទាមទារ​លេខកូដ​សុវត្ថិភាព​នៅ​ពេល​ប្រព័ន្ធ 2FA ដំណើរការ។', en: 'The scammer got in. Try again, and ask for the code once 2FA is on.' },
  vipClubTimeUp: { kh: 'ផុតកំណត់​ពេលវេលា។ អ្នក​ត្រួតពិនិត្យ​ចាំបាច់​ត្រូវ​ធ្វើការ​សម្រេចចិត្ត​ឱ្យ​បាន​រហ័ស និង​ច្បាស់លាស់។', en: 'Time is up. A bouncer has to decide quickly.' },
  doorRule: {
    kh: 'សូម​បើក​មុខងារ​ផ្ទៀងផ្ទាត់​ពីរ​ជាន់ (2FA) លើ​គណនី ABA, Wing, Telegram និង Facebook។ ដាច់ខាត​កុំ​ចែករំលែក​លេខកូដ 2FA ទៅកាន់​ជន​ណា​ម្នាក់​ឱ្យ​សោះ។',
    en: 'Enable 2FA on ABA, Wing, Telegram, and Facebook. Never share your 2FA code with anyone who asks for it.',
  },
  authTokenUnlocked: { kh: 'ទទួល​បាន​លេខកូដ​ផ្ទៀងផ្ទាត់​សុវត្ថិភាព', en: 'Authenticator Token unlocked' },
  twoFactorOn: { kh: 'ការ​ផ្ទៀងផ្ទាត់​ពីរ​ជាន់ — បើក', en: 'Two-factor — ON' },
  twoFactorOff: { kh: 'ការ​ផ្ទៀងផ្ទាត់​ពីរ​ជាន់ — បិទ', en: 'Two-factor — OFF' },
  letThemIn: { kh: 'អនុញ្ញាត​ឱ្យ​ចូល', en: 'Let them in' },
  turnThemAway: { kh: 'បដិសេធ', en: 'Turn away' },
  askForCode: { kh: 'ស្នើសុំ​លេខកូដ​បញ្ជាក់', en: 'Ask for the code' },
  goodCall: { kh: 'ការ​សម្រេច​ចិត្ត​ត្រឹមត្រូវ', en: 'Good call' },
  badCall: { kh: 'ការ​សម្រេច​ចិត្ត​មិន​ត្រឹមត្រូវ', en: 'Wrong call' },
  noWayToTell: { kh: 'អ្នក​ពុំ​មាន​ភស្តុតាង​គ្រប់គ្រាន់​ដើម្បី​ដឹង​ឡើយ', en: 'You had no way to tell' },
  nextRound: { kh: 'ជុំ​បន្ទាប់', en: 'Next round' },

  /* ---- url sorter ---- */
  mapTitle: { kh: 'ផែនទី​ដែន​គេហទំព័រ', en: 'The Map' },
  mapConcept: {
    kh: 'ជន​ឆបោក​តែង​បង្កើត​អាសយដ្ឋាន​គេហទំព័រ​ក្លែងបន្លំ​ដែល​ស្រដៀង​នឹង​គេហទំព័រ​ផ្លូវការ។ សូម​ពិនិត្យ​ឈ្មោះ​ដែន (Domain Name) ពី​ចុង​បញ្ចប់​នៃ .com ឬ .kh ថយ​ក្រោយ ដើម្បី​ផ្ទៀងផ្ទាត់​ម្ចាស់​កម្មសិទ្ធិ​ពិតប្រាកដ។',
    en: 'Scammers create fake website addresses that look almost real. Read the domain name backwards from .com or .kh to see who really owns it.',
  },
  urlSorter: { kh: 'តម្រៀប​អាសយដ្ឋាន', en: 'THE URL SORTER' },
  urlSorterHint: { kh: 'អាសយដ្ឋាន​គេហទំព័រ​នឹង​ធ្លាក់​ចុះ​មក​ក្រោម។ សូម​ធ្វើការ​វិនិច្ឆ័យ និង​បែងចែក​នីមួយៗ​ឱ្យ​បាន​ទាន់​ពេលវេលា។', en: 'URLs fall from above. Sort each one before it hits the bottom.' },
  activeUrl: { kh: 'អាសយដ្ឋាន​បច្ចុប្បន្ន', en: 'Active URL' },
  ownerIs: { kh: 'ម្ចាស់​កម្មសិទ្ធិ៖ {owner}', en: 'Owner: {owner}' },
  urlMissed: { kh: 'ហួស​ពេល​កំណត់ — រាប់​ជា​ការ​វិនិច្ឆ័យ​ខុស', en: 'Hit the bottom — counts as wrong' },
  urlSorterPassed: { kh: 'បាន​វិនិច្ឆ័យ​ត្រឹមត្រូវ​ចំនួន {n} ក្នុង​ចំណោម {total}', en: '{n} of {total} sorted correctly' },
  urlSorterFailedScore: { kh: 'វិនិច្ឆ័យ​ត្រឹមត្រូវ​ត្រឹម {n} ក្នុង​ចំណោម {total}។ អ្នក​ត្រូវការ​យ៉ាង​តិច {pass}។ សូម​ព្យាយាម​ម្ដង​ទៀត។', en: 'Only {n} of {total}. You need {pass}. Try again.' },
  urlSorterReset: { kh: 'វិនិច្ឆ័យ​ខុស​ចំនួន ៣ លើក — ប្រព័ន្ធ​នឹង​ចាប់ផ្ដើម​ឡើងវិញ។', en: 'Three wrong — the sorter resets.' },
  mapRule: { kh: 'ឈ្មោះ​ដែល​ស្ថិត​នៅ​ខាងមុខ​កន្ទុយ .com ឬ .kh ផ្ទាល់ គឺជា​អត្តសញ្ញាណ​នៃ​ម្ចាស់​កម្មសិទ្ធិ​គេហទំព័រ​ពិតប្រាកដ។', en: 'The word just before .com or .kh is the real owner.' },
  magnifierUnlocked: { kh: 'ទទួល​បាន​កញ្ចក់​ពង្រីក​ពិនិត្យ', en: 'Magnifying Glass unlocked' },
  magnifierUse: { kh: 'ប្រើប្រាស់​ក្នុង​មុខងារ​ស៊ើបអង្កេត ដើម្បី​ពង្រីក​ពិនិត្យ​តួអក្សរ​នៃ​អាសយដ្ឋាន​គេហទំព័រ​ឱ្យ​បាន​ច្បាស់លាស់។', en: 'Use it in Investigation Mode to zoom in on URLs.' },
  seeYourTools: { kh: 'ពិនិត្យ​មើល​ឧបករណ៍​របស់​អ្នក', en: 'SEE YOUR TOOLS' },

  /* ---- bootcamp complete ---- */
  trainingComplete: { kh: 'ការ​ហ្វឹកហាត់​ត្រូវ​បាន​បញ្ចប់​ដោយ​ជោគជ័យ', en: 'Training complete' },
  yourToolbelt: { kh: 'ឧបករណ៍​ជំនួយ​សុវត្ថិភាព​របស់​អ្នក', en: 'Your toolbelt' },
  activeInInvestigation: { kh: 'ដំណើរការ​ក្នុង​មុខងារ​ស៊ើបអង្កេត', en: 'Active in Investigation Mode' },
  youAreReady: { kh: 'អ្នក​បាន​ត្រៀមខ្លួន​រួចរាល់​ហើយ។ ការ​អនុវត្ត​ស្ថានភាព​ជាក់ស្ដែង​នឹង​ចាប់ផ្ដើម​ពី​ពេល​នេះ។', en: 'You are ready. The real scenarios start now.' },
  enterScamSim: { kh: 'ចូលទៅកាន់​ការ​ពិសោធ​ជាក់ស្ដែង', en: 'ENTER SCAMSIM' },
  sortSafe: { kh: 'សុវត្ថិភាព', en: 'Safe' },
  sortTrash: { kh: 'ក្លែងបន្លំ', en: 'Trash' },
  thatOneWasSafe: { kh: 'នោះ​ជា​អាសយដ្ឋាន​ពិតប្រាកដ', en: 'That one was real' },
  thatOneWasFake: { kh: 'នោះ​ជា​អាសយដ្ឋាន​ក្លែងបន្លំ', en: 'That one was fake' },
  nextCard: { kh: 'បន្ទាប់', en: 'Next' },
  zoomIn: { kh: 'ពង្រីក', en: 'Zoom in' },
  magnifierHint: {
    kh: 'ប្រើប្រាស់​កញ្ចក់​ពង្រីក ដើម្បី​ពិនិត្យ​តួអក្សរ​នីមួយៗ​ឱ្យ​បាន​ម៉ត់ចត់',
    en: 'Use the magnifying glass to read it character by character',
  },

  /* ---- language ---- */
  languageName: { kh: 'ខ្មែរ', en: 'English' },
} as const satisfies Record<string, { kh: string; en: string }>

export function t(key: UIKey, language: LanguageCode): string {
  return strings[key][language]
}

export { strings }
