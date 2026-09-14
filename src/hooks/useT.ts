/**
 * UI string lookup bound to the current language.
 *
 *   const t = useT()
 *   <span>{t('playAgain')}</span>
 */
import { useGameStore } from '../store/gameStore'
import { t as translate, type UIKey } from '../i18n/ui'

export function useT() {
  const language = useGameStore((s) => s.language)
  return (key: UIKey) => translate(key, language)
}

/** True when the UI should use Khmer type rules (taller line-height). */
export function useIsKhmer() {
  return useGameStore((s) => s.language) === 'kh'
}
