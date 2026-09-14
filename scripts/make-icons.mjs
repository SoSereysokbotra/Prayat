/**
 * Generate the PWA icons from one SVG source.
 *
 * Rendered through headless Chrome rather than an image library, so there is
 * no build-time image dependency. Re-run after changing the mark:
 *   node scripts/make-icons.mjs
 */
import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'node:fs'

// A shield, because "prayat" means to be careful. The notch reads as a chat
// bubble tail at small sizes, which is where the app actually lives.
const svg = (size, maskable) => {
  const pad = maskable ? size * 0.12 : 0   // maskable icons need a safe zone
  const s = size - pad * 2
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0f172a"/>
  <g transform="translate(${pad},${pad})">
    <path d="M ${s * 0.5} ${s * 0.1}
             L ${s * 0.85} ${s * 0.24}
             L ${s * 0.85} ${s * 0.52}
             C ${s * 0.85} ${s * 0.72}, ${s * 0.7} ${s * 0.85}, ${s * 0.5} ${s * 0.92}
             C ${s * 0.3} ${s * 0.85}, ${s * 0.15} ${s * 0.72}, ${s * 0.15} ${s * 0.52}
             L ${s * 0.15} ${s * 0.24} Z"
          fill="#3882f6"/>
    <path d="M ${s * 0.34} ${s * 0.5} L ${s * 0.45} ${s * 0.62} L ${s * 0.67} ${s * 0.38}"
          stroke="#ffffff" stroke-width="${s * 0.075}" stroke-linecap="round"
          stroke-linejoin="round" fill="none"/>
  </g>
</svg>`
}

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
})

for (const [size, maskable, name] of [
  [192, false, 'icon-192.png'],
  [512, false, 'icon-512.png'],
  [512, true, 'icon-maskable-512.png'],
  [180, false, 'apple-touch-icon.png'],
]) {
  const page = await browser.newPage()
  await page.setViewport({ width: size, height: size })
  await page.setContent(
    `<style>*{margin:0;padding:0}body{width:${size}px;height:${size}px}</style>${svg(size, maskable)}`,
  )
  await page.screenshot({ path: `public/${name}`, omitBackground: false })
  await page.close()
  console.log(`  public/${name}`)
}

writeFileSync('public/icon.svg', svg(512, false).trim())
console.log('  public/icon.svg')

await browser.close()
