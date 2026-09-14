/**
 * The Prayat shield, as an inline SVG.
 *
 * Same geometry as public/icon.svg, minus the navy square behind it — on the
 * home banner the square reads as a dark tile stamped onto the illustration,
 * where the bare shield sits on it like a badge. Colours come from tokens so
 * the mark follows the theme's primary, unlike the static .svg file.
 */
export default function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden className={className}>
      <path
        className="fill-primary"
        d="M256 51.2 435.2 122.88v143.36C435.2 368.64 358.4 435.2 256 471.04 153.6 435.2 76.8 368.64 76.8 266.24V122.88Z"
      />
      <path
        className="stroke-primary-text"
        d="M174.08 256 230.4 317.44 343.04 194.56"
        strokeWidth="38.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
