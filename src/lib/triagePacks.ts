import { Briefcase, Globe, Landmark, Smartphone, TrendingUp, type LucideIcon } from 'lucide-react'
import type { Localized } from '../../shared/types'

/**
 * The Speed Triage card packs, in display order.
 *
 * Like the scenario roster, this is the PICKER's view: name, hook line,
 * difficulty, artwork, and which deck it plays. The cards themselves live in
 * content/triage/<deckId>.json. A pack whose deck the server does not have
 * shows as "coming soon" — adding the pack is a content change, not a code
 * change.
 *
 * ⚠️ REVIEW NEEDED — the Khmer is a working draft, same as src/i18n/ui.ts.
 */
export interface TriagePack {
  /** Matches the `id` of a deck in content/triage/. */
  deckId: string
  title: Localized
  blurb: Localized
  /** 1–5 */
  difficulty: number
  image: string
  icon: LucideIcon
}

export const TRIAGE_PACKS: readonly TriagePack[] = [
  {
    deckId: 'pack-mixed',
    title: { kh: 'កញ្ចប់​ចម្រុះ', en: 'Mixed pack' },
    blurb: { kh: 'គ្រប់​ប្រភេទ​ការ​បោក', en: 'All scam types' },
    difficulty: 3,
    image: '/mode-triage.jpg',
    icon: Smartphone,
  },
  {
    deckId: 'pack-government',
    title: { kh: 'សារ​ពី​រដ្ឋាភិបាល', en: 'Government messages' },
    blurb: { kh: 'ក្រសួង​ក្លែងក្លាយ ប៉ូលិស មន្ត្រី​ពន្ធ', en: 'Fake ministry, police, tax officials' },
    difficulty: 2,
    image: '/scenario-ministry.jpg',
    icon: Landmark,
  },
  {
    deckId: 'pack-jobs',
    title: { kh: 'ការ​ផ្ដល់​ការងារ', en: 'Job offers' },
    blurb: { kh: 'អ្នក​ជ្រើសរើស​បុគ្គលិក​ក្លែងក្លាយ ការងារ​ពី​ផ្ទះ', en: 'Fake recruiters, work-from-home scams' },
    difficulty: 2,
    image: '/scenario-job.jpg',
    icon: Briefcase,
  },
  {
    deckId: 'pack-web',
    title: { kh: 'គេហទំព័រ និង តំណ', en: 'Websites & URLs' },
    blurb: { kh: 'ដូមែន​ក្លែងក្លាយ ទំព័រ​ចូល​គណនី តំណ​បោក', en: 'Fake domains, login pages, phishing links' },
    difficulty: 3,
    image: '/pack-web.jpg',
    icon: Globe,
  },
  {
    deckId: 'pack-crypto',
    title: { kh: 'វិនិយោគ និង គ្រីបតូ', en: 'Investment & crypto' },
    blurb: { kh: 'វេទិកា​ក្លែងក្លាយ រូបថត​ចំណេញ​ក្លែងក្លាយ', en: 'Fake platforms, profit screenshots' },
    difficulty: 3,
    image: '/scenario-crypto.jpg',
    icon: TrendingUp,
  },
]

/** The deck that changes every morning. Shown apart from the packs. */
export const DAILY_DECK_ID = 'daily-pack-001'
