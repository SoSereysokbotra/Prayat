import { Briefcase, Coins, Heart, Landmark, TrendingUp, UserRound, type LucideIcon } from 'lucide-react'
import type { Localized, ScamType } from '../../shared/types'

/**
 * The four Guardian scenarios, in the order they unlock.
 *
 * This is the PICKER's view of the catalogue, not the content. The scenario
 * JSON in content/ carries the stages and the answers; this carries what a
 * player sees before choosing — the hook line, the difficulty, the artwork —
 * and the unlock order. A roster entry whose scamType has no scenario on the
 * server shows as "coming soon" rather than disappearing, so the shape of the
 * whole programme is visible from day one.
 *
 * ⚠️ REVIEW NEEDED — the Khmer is a working draft, same as src/i18n/ui.ts.
 */
export interface RosterEntry {
  scamType: ScamType
  title: Localized
  /** One line: who you protect and from what. */
  blurb: Localized
  /** 1–5 */
  difficulty: number
  /** Round crop in the card. Falls back to `icon` if the file is missing. */
  image: string
  icon: LucideIcon
  /** Wide illustration on the intro screen. Falls back to `image`. */
  hero?: string
  /** The setup, read before the round: who the relative is and what is about to happen. */
  story: Localized
  /** Three things the player is there to do. */
  mission: [Localized, Localized, Localized]
  /**
   * How the scammer presents in the threat pane. The name and the blue tick
   * are part of the con — a "verified" badge is trivially faked and the game
   * shows one for exactly that reason.
   */
  scammer: { name: Localized; icon: LucideIcon; verified: boolean }
}

export const SCENARIO_ROSTER: readonly RosterEntry[] = [
  {
    scamType: 'government',
    title: { kh: 'ការ​ក្លែងបន្លំ​ជា​មន្ត្រី​ក្រសួង', en: 'Fake Ministry Official' },
    blurb: {
      kh: 'ជួយ​ការពារ​ពូ​កុំ​ឱ្យ​ចាញ់បោក​ការ​ទារ​ថ្លៃ​សេវា​រដ្ឋ​ក្លែងបន្លំ',
      en: 'Stop Uncle from paying a fake government fee',
    },
    difficulty: 2,
    image: '/scenario-ministry.jpg',
    icon: Landmark,
    hero: '/scenario-ministry-hero.jpg',
    scammer: { name: { kh: 'ក្រសួង​ពាណិជ្ជកម្ម', en: 'Ministry of Commerce' }, icon: Landmark, verified: true },
    story: {
      kh: 'ពូ ចាន់ ជា​ម្ចាស់​ហាង​ជួសជុល​ទូរស័ព្ទ​ខ្នាត​តូច​មួយ​នៅ​ខេត្ត​បាត់ដំបង។ គាត់​ទើប​តែ​ទទួល​បាន​សារ​គួរ​ឱ្យ​សង្ស័យ​មួយ​តាមរយៈ Facebook ហើយ​កំពុង​ប្រឈម​នឹង​ការ​សម្រេច​ចិត្ត​ខុស​ដែល​អាច​បណ្ដាល​ឱ្យ​ខាតបង់​ប្រាក់កាស​យ៉ាង​ច្រើន។',
      en: 'Your Uncle Chan owns a small phone repair shop in Battambang. He just received a suspicious Facebook message, and he is about to make a very costly mistake.',
    },
    mission: [
      { kh: 'ពិនិត្យ​សារ​ដែល​ជន​ឆបោក​បាន​ផ្ញើ​មក​គាត់ — អ្នក​មិន​អាច​ឆ្លើយតប​ទៅ​កាន់​ជន​ឆបោក​ដោយ​ផ្ទាល់​ឡើយ', en: 'Read what the scammer is sending him — you cannot reply to the scammer' },
      { kh: 'ផ្ដល់​ការ​ណែនាំ និង​ពន្យល់​ដល់​ពូ​ឱ្យ​បាន​ត្រឹមត្រូវ', en: 'Advise your uncle correctly' },
      { kh: 'ទប់ស្កាត់​គាត់​កុំ​ឱ្យ​ផ្ទេរ​ប្រាក់​ទៅ​ជន​ខិលខូច', en: 'Stop him from paying' },
    ],
  },
  {
    scamType: 'job',
    title: { kh: 'ការ​ផ្ដល់​ឱកាស​ការងារ​ក្លែងបន្លំ', en: 'Fake Job Offer' },
    blurb: {
      kh: 'ជួយ​បងស្រី​ឱ្យ​ដឹង​ទាន់​ល្បិច​ឆបោក​តាម Telegram',
      en: 'Help your sister spot a Telegram scam',
    },
    difficulty: 3,
    image: '/scenario-job.jpg',
    icon: Briefcase,
    scammer: { name: { kh: 'HR — ក្រុមហ៊ុន​ជ្រើសរើស​បុគ្គលិក', en: 'HR — Global Recruit Co.' }, icon: Briefcase, verified: false },
    story: {
      kh: 'បងស្រី​របស់​អ្នក​កំពុង​ស្វែងរក​ការងារ​ធ្វើ។ នៅ​លើ Telegram មាន​គណនី​មួយ​បាន​ផ្ដល់​ការងារ​ដែល​មាន​ប្រាក់​បៀវត្សរ៍​ខ្ពស់​ខុស​ពី​ធម្មតា​សម្រាប់​កិច្ចការ​ងាយស្រួល ប៉ុន្តែ​ទាមទារ​ឱ្យ​បង់ប្រាក់​ថ្លៃ​ចុះឈ្មោះ​ជាមុន។',
      en: 'Your sister is job hunting. On Telegram, someone is offering a salary far too high for work far too easy — and they want a registration fee.',
    },
    mission: [
      { kh: 'ពិនិត្យ​សារ​ផ្ដល់​ការងារ​ដែល​ជន​អនាមិក​បាន​ផ្ញើ​មក​គាត់', en: 'Read the offer they are sending her' },
      { kh: 'ជួយ​បងស្រី​ឱ្យ​មើលឃើញ​ពី​ចំណុច​មិន​ប្រក្រតី និង​សញ្ញា​គួរ​ឱ្យ​សង្ស័យ', en: 'Help your sister see the red flags' },
      { kh: 'ទប់ស្កាត់​គាត់​កុំ​ឱ្យ​បង់ប្រាក់​ថ្លៃ​ចុះឈ្មោះ​ជាដាច់ខាត', en: 'Stop her from paying the fee' },
    ],
  },
  {
    scamType: 'crypto',
    title: { kh: 'ក្រុម​បោកបញ្ឆោត​វិនិយោគ​គ្រីបតូ', en: 'Fake Crypto Group' },
    blurb: {
      kh: 'ជួយ​សង្គ្រោះ​បងប្រុស​ពី​អន្ទាក់​ឆបោក​វិនិយោគ​គ្រីបតូ',
      en: 'Save your brother from a pig-butchering scam',
    },
    difficulty: 4,
    image: '/scenario-crypto.jpg',
    icon: TrendingUp,
    scammer: { name: { kh: 'ក្រុម VIP វិនិយោគ​គ្រីបតូ', en: 'VIP Crypto Signals' }, icon: Coins, verified: true },
    story: {
      kh: 'បងប្រុស​របស់​អ្នក​ត្រូវ​បាន​គេ​ទាញ​បញ្ចូល​ទៅ​ក្នុង​ក្រុម​វិនិយោគ​គ្រីបតូ​មួយ។ សមាជិក​ក្នុង​ក្រុម​ហាក់ដូចជា​ទទួល​បាន​ប្រាក់ចំណេញ​គ្រប់ៗ​គ្នា ប៉ុន្តែ​ធាតុពិត​ជា​ការ​រៀបចំ​ទុកជាមុន។ ឥឡូវ​នេះ ពួកគេ​កំពុង​បញ្ចុះបញ្ចូល​ឱ្យ​គាត់​ដាក់​ប្រាក់​បន្ថែម​ទៀត។',
      en: 'Your brother has been added to a crypto investment group. Everyone in it is making money — or seems to be. Now they want him to put in more.',
    },
    mission: [
      { kh: 'ពិនិត្យមើល​សារ និង​ល្បិច​បញ្ចុះបញ្ចូល​ដែល​ក្រុម​នោះ​កំពុង​ប្រើប្រាស់​លើ​គាត់', en: 'Read what the group is telling him' },
      { kh: 'ជួយ​បងប្រុស​ឱ្យ​ដឹង​ខ្លួន និង​មើលឃើញ​ពី​អន្ទាក់​ឆបោក', en: 'Help your brother see the trap' },
      { kh: 'ទប់ស្កាត់​គាត់​មុន​ពេល​គាត់​សម្រេចចិត្ត​ដាក់​ប្រាក់​បន្ថែម', en: 'Stop him before he deposits more' },
    ],
  },
  {
    scamType: 'romance',
    title: { kh: 'ល្បិច​ឆបោក​បង្កើត​ទំនុកចិត្ត​ស្នេហា', en: 'Romance Manipulation' },
    blurb: {
      kh: 'ការពារ​កូនស្រី​ពី​ជន​ឆបោក​តាមរយៈ​ការ​លួងលោម​យក​ទំនុកចិត្ត',
      en: 'Protect your daughter from a trust scammer',
    },
    difficulty: 5,
    image: '/scenario-romance.jpg',
    icon: Heart,
    scammer: { name: { kh: 'David', en: 'David' }, icon: UserRound, verified: false },
    story: {
      kh: 'កូនស្រី​របស់​អ្នក​បាន​ស្គាល់​បុគ្គល​ម្នាក់​តាមរយៈ​បណ្ដាញ​អនឡាញ។ បុគ្គល​នោះ​ចេះ​យល់ចិត្ត ចេះ​លួងលោម និង​ប្រើ​ពាក្យសម្ដី​គួរ​ឱ្យ​ទុកចិត្ត។ នៅ​ថ្ងៃ​នេះ គាត់​បាន​ប្រឌិត​រឿង​ថា​មាន​គ្រោះអាសន្ន​បន្ទាន់ ហើយ​ស្នើសុំ​ឱ្យ​នាង​ជួយ​ផ្ញើ​ប្រាក់​ឱ្យ។',
      en: 'Your daughter met someone online. He listens, he is kind, he says all the right things. Today he has an emergency, and he needs money.',
    },
    mission: [
      { kh: 'ពិនិត្យ​សារ​លួងលោម​ដែល​បុគ្គល​នោះ​កំពុង​ផ្ញើ​មកកាន់​កូនស្រី', en: 'Read what he is writing to her' },
      { kh: 'ជួយ​កូនស្រី​ឱ្យ​មើលឃើញ​ពី​ទម្រង់​នៃ​ល្បិច​ឆបោក​បែប​នេះ', en: 'Help your daughter see the pattern' },
      { kh: 'ទប់ស្កាត់​នាង​កុំ​ឱ្យ​ផ្ទេរ​ប្រាក់​ទៅ​ឱ្យ​ជន​នោះ​ជាដាច់ខាត', en: 'Stop her from sending money' },
    ],
  },
]

export const MAX_DIFFICULTY = 5
