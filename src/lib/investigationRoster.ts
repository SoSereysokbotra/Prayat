import type { Localized } from '../../shared/types'

/**
 * The case list for The Investigation.
 *
 * Same idea as the scenario roster: the client owns the presentation (case
 * number, artwork, briefing, difficulty) and the server owns the evidence.
 * A case whose id the API does not return is drawn locked with "coming
 * soon" — the card is a promise, not a lie about what is playable.
 *
 * Cases unlock in order: solving one opens the next.
 */
export interface CaseEntry {
  /** The investigation id the server knows. */
  id: string
  number: number
  title: Localized
  platform: Localized
  /** How many bubbles the conversation has — sets expectations for the timer. */
  messages: number
  /** 1–5 */
  difficulty: number
  image: string
  /** The briefing, shown inside the card of the case that is open now. */
  briefing: Localized
  /** Name chips on the bubbles: who is writing, and who is being written to. */
  them: Localized
  you: Localized
}

export const CASE_ROSTER: readonly CaseEntry[] = [
  {
    id: 'fake-job-offer-001',
    number: 1,
    title: { kh: 'អ្នកជ្រើសរើសការងារក្លែងក្លាយ', en: 'The Fake Job Recruiter' },
    platform: { kh: 'Telegram', en: 'Telegram' },
    messages: 10,
    difficulty: 2,
    image: '/investigation-case-job.jpg',
    them: { kh: 'អ្នកជ្រើសរើស', en: 'Recruiter' },
    you: { kh: 'សុខា', en: 'Sokha' },
    briefing: {
      kh: 'សុខា ទទួលបានការផ្តល់ការងារតាម Telegram ប្រាក់ខែ ៧០០ ដុល្លារ ដោយគ្រាន់តែចុច Like ពីផ្ទះ។ រកសញ្ញាក្រហមទាំងអស់ឱ្យឃើញ មុនពេលអស់ម៉ោង។',
      en: 'Sokha received a job offer on Telegram paying $700/month to tap Like from home. Find every red flag before time runs out.',
    },
  },
  {
    id: 'crypto-trading-group-002',
    number: 2,
    title: { kh: 'ក្រុមជួញដូរគ្រីបតូ', en: 'The Crypto Trading Group' },
    platform: { kh: 'Telegram', en: 'Telegram' },
    messages: 14,
    difficulty: 3,
    image: '/investigation-case-crypto.jpg',
    them: { kh: 'អ្នកគ្រប់គ្រងក្រុម', en: 'Group admin' },
    you: { kh: 'សុខា', en: 'Sokha' },
    briefing: {
      kh: 'ក្រុម Telegram មួយសន្យាចំណេញ ២០% ក្នុង ៧ ថ្ងៃ។ រូបថតអេក្រង់ចំណេញ និងការសរសើរគ្នា — តើមួយណាពិត?',
      en: 'A Telegram group promises 20% profit in 7 days. Profit screenshots and cheering members — which of it is real?',
    },
  },
  {
    id: 'romance-setup-003',
    number: 3,
    title: { kh: 'ការរៀបចំបោកស្នេហា', en: 'The Romance Setup' },
    platform: { kh: 'Facebook', en: 'Facebook' },
    messages: 16,
    difficulty: 4,
    image: '/investigation-case-romance.jpg',
    them: { kh: 'Michael', en: 'Michael' },
    you: { kh: 'សុខា', en: 'Sokha' },
    briefing: {
      kh: 'ជនបរទេសម្នាក់ ០ មិត្តរួម ធ្វើការនៅសមុទ្រ ហើយមានកាដូចង់ផ្ញើឱ្យ។ រកឱ្យឃើញថាការសន្ទនាប្រែទៅជាការសុំលុយនៅត្រង់ណា។',
      en: 'A stranger abroad, 0 mutual friends, working at sea, with a gift to send. Find where the conversation turns into a request for money.',
    },
  },
  {
    id: 'fake-tech-support-004',
    number: 4,
    title: { kh: 'ជំនួយបច្ចេកទេសក្លែងក្លាយ', en: 'The Fake Tech Support' },
    platform: { kh: 'ការហៅទូរស័ព្ទ', en: 'Phone call' },
    messages: 12,
    difficulty: 5,
    image: '/investigation-case-tech.jpg',
    them: { kh: '«ធនាគារ»', en: '"The bank"' },
    you: { kh: 'សុខា', en: 'Sokha' },
    briefing: {
      kh: '«ធនាគារ» ហៅមកថាគណនីអ្នកត្រូវបានវាយប្រហារ ហើយត្រូវការកូដ OTP ដើម្បីការពារវា។ រកសញ្ញាក្រហមក្នុងការហៅមួយ។',
      en: '"The bank" calls to say your account is under attack and needs your OTP to protect it. Find the red flags in one call.',
    },
  },
]
