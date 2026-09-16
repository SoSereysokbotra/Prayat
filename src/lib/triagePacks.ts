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
    blurb: { kh: 'បណ្តុំ​ល្បិច​ឆបោក​គ្រប់​ទម្រង់', en: 'All scam types' },
    difficulty: 3,
    image: '/mode-triage.jpg',
    icon: Smartphone,
  },
  {
    deckId: 'pack-government',
    title: { kh: 'សារ​ក្លែងបន្លំ​ស្ថាប័ន​រដ្ឋ', en: 'Government messages' },
    blurb: { kh: 'ការ​ក្លែងបន្លំ​ជា​មន្ត្រី​ក្រសួង សមត្ថកិច្ច និង​ភ្នាក់ងារ​ពន្ធដារ', en: 'Fake ministry, police, tax officials' },
    difficulty: 2,
    image: '/scenario-ministry.jpg',
    icon: Landmark,
  },
  {
    deckId: 'pack-jobs',
    title: { kh: 'ការ​ផ្ដល់​ការងារ​ក្លែងបន្លំ', en: 'Job offers' },
    blurb: { kh: 'ការ​ជ្រើសរើស​បុគ្គលិក​ក្លែងក្លាយ និង​ការងារ​បោកបញ្ឆោត​តាម​ផ្ទះ', en: 'Fake recruiters, work-from-home scams' },
    difficulty: 2,
    image: '/scenario-job.jpg',
    icon: Briefcase,
  },
  {
    deckId: 'pack-web',
    title: { kh: 'គេហទំព័រ និង​តំណភ្ជាប់', en: 'Websites & URLs' },
    blurb: { kh: 'ឈ្មោះ​ដែន​ក្លែងបន្លំ ទំព័រ​ចូល​គណនី និង​តំណភ្ជាប់​លួច​ទិន្នន័យ (Phishing)', en: 'Fake domains, login pages, phishing links' },
    difficulty: 3,
    image: '/pack-web.jpg',
    icon: Globe,
  },
  {
    deckId: 'pack-crypto',
    title: { kh: 'ការ​វិនិយោគ និង​រូបិយប័ណ្ណ​គ្រីបតូ', en: 'Investment & crypto' },
    blurb: { kh: 'វេទិកា​វិនិយោគ​ក្លែងក្លាយ និង​រូបភាព​ប្រាក់ចំណេញ​បោកបញ្ឆោត', en: 'Fake platforms, profit screenshots' },
    difficulty: 3,
    image: '/scenario-crypto.jpg',
    icon: TrendingUp,
  },
]

/** The deck that changes every morning. Shown apart from the packs. */
export const DAILY_DECK_ID = 'daily-pack-001'
