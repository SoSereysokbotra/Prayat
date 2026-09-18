/** How many screens the signed-out walkthrough has. Welcome is 1. */
export const ONBOARDING_STEPS = 3

/**
 * "Where am I in the walkthrough" — the row of dots under an onboarding
 * screen. Purely informative; the buttons do the navigating.
 */
export default function OnboardingDots({ current }: { current: number }) {
  return (
    <ol aria-label={`${current} / ${ONBOARDING_STEPS}`} className="flex justify-center gap-stack">
      {Array.from({ length: ONBOARDING_STEPS }, (_, i) => (
        <li
          key={i}
          aria-current={i + 1 === current ? 'step' : undefined}
          className={`h-bar w-bar rounded-full ${i + 1 === current ? 'bg-primary' : 'bg-surface-alt'}`}
        />
      ))}
    </ol>
  )
}
