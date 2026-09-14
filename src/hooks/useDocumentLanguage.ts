import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

/**
 * Keep <html lang> in sync with the selected language.
 *
 * This is not just an accessibility nicety. global.css styles `:lang(km)` with
 * the Khmer font and the taller --leading-kh, because Khmer diacritics clip at
 * a normal line-height. With a hardcoded lang="km" in index.html that rule
 * applied to ENGLISH text as well, which rendered English in the Khmer font at
 * double line spacing.
 *
 * Khmer strings shown while the UI is in English — the ខ្មែរ label on the
 * language toggle — opt back in with the .font-kh class.
 */
export function useDocumentLanguage() {
  const language = useGameStore((s) => s.language)

  useEffect(() => {
    document.documentElement.lang = language === 'kh' ? 'km' : 'en'
  }, [language])
}
