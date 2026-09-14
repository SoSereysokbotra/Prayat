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
    title: { kh: 'មន្ត្រី​ក្រសួង​ក្លែងក្លាយ', en: 'Fake Ministry Official' },
    blurb: {
      kh: 'ជួយ​ពូ​កុំ​ឲ្យ​បង់​ថ្លៃ​សេវា​រដ្ឋាភិបាល​ក្លែងក្លាយ',
      en: 'Stop Uncle from paying a fake government fee',
    },
    difficulty: 2,
    image: '/scenario-ministry.jpg',
    icon: Landmark,
    hero: '/scenario-ministry-hero.jpg',
    scammer: { name: { kh: 'ក្រសួង​ពាណិជ្ជកម្ម', en: 'Ministry of Commerce' }, icon: Landmark, verified: true },
    story: {
      kh: 'ពូ ចាន់ របស់​អ្នក​មាន​ហាង​ជួសជុល​ទូរស័ព្ទ​តូច​មួយ​នៅ​បាត់ដំបង។ គាត់​ទើប​តែ​ទទួល​បាន​សារ Facebook គួរ​ឲ្យ​សង្ស័យ ហើយ​គាត់​ជិត​នឹង​ធ្វើ​កំហុស​ដ៏​ថ្លៃ​មួយ​ហើយ។',
      en: 'Your Uncle Chan owns a small phone repair shop in Battambang. He just received a suspicious Facebook message, and he is about to make a very costly mistake.',
    },
    mission: [
      { kh: 'អាន​អ្វី​ដែល​អ្នក​បោក​បញ្ឆោត​ផ្ញើ​ទៅ​គាត់ — អ្នក​មិន​អាច​ឆ្លើយ​ទៅ​អ្នក​បោក​បាន​ទេ', en: 'Read what the scammer is sending him — you cannot reply to the scammer' },
      { kh: 'ណែនាំ​ពូ​របស់​អ្នក​ឲ្យ​បាន​ត្រឹមត្រូវ', en: 'Advise your uncle correctly' },
      { kh: 'បញ្ឈប់​គាត់​កុំ​ឲ្យ​បង់​លុយ', en: 'Stop him from paying' },
    ],
  },
  {
    scamType: 'job',
    title: { kh: 'ការ​ផ្ដល់​ការងារ​ក្លែងក្លាយ', en: 'Fake Job Offer' },
    blurb: {
      kh: 'ជួយ​បង​ស្រី​ស្គាល់​ការ​បោក​តាម Telegram',
      en: 'Help your sister spot a Telegram scam',
    },
    difficulty: 3,
    image: '/scenario-job.jpg',
    icon: Briefcase,
    scammer: { name: { kh: 'HR — ក្រុមហ៊ុន​ជ្រើសរើស​បុគ្គលិក', en: 'HR — Global Recruit Co.' }, icon: Briefcase, verified: false },
    story: {
      kh: 'បង​ស្រី​របស់​អ្នក​កំពុង​រក​ការងារ។ នៅ​លើ Telegram មាន​គេ​ផ្ដល់​ការងារ​ដែល​បើក​ប្រាក់​ខែ​ខ្ពស់​ពេក​សម្រាប់​ការងារ​ងាយ​ពេក — ហើយ​គេ​ចង់​បាន​ថ្លៃ​ចុះ​ឈ្មោះ។',
      en: 'Your sister is job hunting. On Telegram, someone is offering a salary far too high for work far too easy — and they want a registration fee.',
    },
    mission: [
      { kh: 'អាន​ការ​ផ្ដល់​ការងារ​ដែល​គេ​ផ្ញើ​មក​គាត់', en: 'Read the offer they are sending her' },
      { kh: 'ជួយ​បង​ស្រី​ឲ្យ​ឃើញ​សញ្ញា​គ្រោះថ្នាក់', en: 'Help your sister see the red flags' },
      { kh: 'បញ្ឈប់​គាត់​កុំ​ឲ្យ​បង់​ថ្លៃ​ចុះ​ឈ្មោះ', en: 'Stop her from paying the fee' },
    ],
  },
  {
    scamType: 'crypto',
    title: { kh: 'ក្រុម​គ្រីបតូ​ក្លែងក្លាយ', en: 'Fake Crypto Group' },
    blurb: {
      kh: 'ជួយ​បង​ប្រុស​ពី​ការ​បោក​វិនិយោគ​គ្រីបតូ',
      en: 'Save your brother from a pig-butchering scam',
    },
    difficulty: 4,
    image: '/scenario-crypto.jpg',
    icon: TrendingUp,
    scammer: { name: { kh: 'ក្រុម VIP វិនិយោគ​គ្រីបតូ', en: 'VIP Crypto Signals' }, icon: Coins, verified: true },
    story: {
      kh: 'បង​ប្រុស​របស់​អ្នក​ត្រូវ​បាន​គេ​បញ្ចូល​ក្នុង​ក្រុម​វិនិយោគ​គ្រីបតូ។ អ្នក​រាល់​គ្នា​ក្នុង​ក្រុម​កំពុង​ចំណេញ — ឬ​មើល​ទៅ​ដូច្នេះ។ ឥឡូវ​គេ​ចង់​ឲ្យ​គាត់​ដាក់​លុយ​ច្រើន​ជាង​មុន។',
      en: 'Your brother has been added to a crypto investment group. Everyone in it is making money — or seems to be. Now they want him to put in more.',
    },
    mission: [
      { kh: 'អាន​អ្វី​ដែល​ក្រុម​កំពុង​និយាយ​ជាមួយ​គាត់', en: 'Read what the group is telling him' },
      { kh: 'ជួយ​បង​ប្រុស​ឲ្យ​ឃើញ​ការ​បោក', en: 'Help your brother see the trap' },
      { kh: 'បញ្ឈប់​គាត់​មុន​ពេល​គាត់​ដាក់​លុយ​បន្ថែម', en: 'Stop him before he deposits more' },
    ],
  },
  {
    scamType: 'romance',
    title: { kh: 'ការ​បោក​ស្នេហា', en: 'Romance Manipulation' },
    blurb: {
      kh: 'ការពារ​កូន​ស្រី​ពី​អ្នក​បោក​ទំនុកចិត្ត',
      en: 'Protect your daughter from a trust scammer',
    },
    difficulty: 5,
    image: '/scenario-romance.jpg',
    icon: Heart,
    scammer: { name: { kh: 'David', en: 'David' }, icon: UserRound, verified: false },
    story: {
      kh: 'កូន​ស្រី​របស់​អ្នក​បាន​ស្គាល់​នរណា​ម្នាក់​តាម​អនឡាញ។ គាត់​ស្ដាប់​យល់ ធ្វើ​ឲ្យ​សប្បាយ​ចិត្ត ហើយ​ចេះ​និយាយ​គ្រប់​ពាក្យ​ត្រឹមត្រូវ។ ថ្ងៃ​នេះ​គាត់​មាន​បញ្ហា​បន្ទាន់ ហើយ​ត្រូវការ​លុយ។',
      en: 'Your daughter met someone online. He listens, he is kind, he says all the right things. Today he has an emergency, and he needs money.',
    },
    mission: [
      { kh: 'អាន​អ្វី​ដែល​គាត់​កំពុង​សរសេរ​ទៅ​កូន​ស្រី', en: 'Read what he is writing to her' },
      { kh: 'ជួយ​កូន​ស្រី​ឲ្យ​ឃើញ​គំរូ​នៃ​ការ​បោក', en: 'Help your daughter see the pattern' },
      { kh: 'បញ្ឈប់​គាត់​កុំ​ឲ្យ​ផ្ញើ​លុយ', en: 'Stop her from sending money' },
    ],
  },
]

export const MAX_DIFFICULTY = 5
