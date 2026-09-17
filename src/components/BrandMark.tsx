/**
 * The Prayat logo — the shield illustration in public/logo.png.
 *
 * A transparent PNG, so it sits straight on the home banner with no tile
 * behind it. Decorative: the wordmark beside it carries the name.
 */
export default function BrandMark({ className = '' }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt=""
      aria-hidden
      draggable={false}
      className={`select-none object-contain ${className}`}
    />
  )
}
