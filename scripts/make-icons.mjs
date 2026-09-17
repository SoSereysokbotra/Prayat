/**
 * Generate the favicon and PWA icons from public/logo.png.
 *
 * Rendered through headless Chrome rather than an image library, so there is
 * no build-time image dependency. Re-run after changing the source image:
 *   node scripts/make-icons.mjs
 *
 * The source PNG carries a wide transparent margin. That margin is what gives
 * the banner lockup its air, but in an icon tile it just makes the mark look
 * small, so the tiles are built from an alpha-cropped copy instead.
 *
 * icon.svg is a thin wrapper that embeds the same PNG as a data URI — the
 * source is an illustration, not a flat vector mark, so there is nothing to
 * trace. It keeps the existing <link rel="icon" type="image/svg+xml"> in
 * index.html working without touching that file or vite.config.ts.
 */
import puppeteer from 'puppeteer-core'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SOURCE = resolve('public/logo.png')
const BG = '#0f172a' // --color-text — matches the original tile background

const sourceUri = `data:image/png;base64,${readFileSync(SOURCE).toString('base64')}`

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
})

/** Trim the fully transparent margin, onto a square canvas so the mark
 *  centres cleanly in a square tile. */
const cropper = await browser.newPage()
const logoUri = await cropper.evaluate(async (uri) => {
  const img = new Image()
  img.src = uri
  await img.decode()

  const c = document.createElement('canvas')
  c.width = img.naturalWidth
  c.height = img.naturalHeight
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0)

  const d = ctx.getImageData(0, 0, c.width, c.height).data
  let minX = c.width, minY = c.height, maxX = -1, maxY = -1
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      if (d[(y * c.width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  const w = maxX - minX + 1
  const h = maxY - minY + 1
  const side = Math.max(w, h)
  const out = document.createElement('canvas')
  out.width = side
  out.height = side
  out.getContext('2d').drawImage(c, minX, minY, w, h, (side - w) / 2, (side - h) / 2, w, h)
  return out.toDataURL('image/png')
}, sourceUri)
await cropper.close()

/** One square tile: the mark centred on the brand background, with an
 *  optional safe-zone pad for maskable icons (Android crops to a circle). */
const html = (size, pad = 0) => {
  const inner = size - pad * 2
  return `<!doctype html><html><head><style>
    html,body { margin:0; padding:0; }
    .tile {
      width:${size}px; height:${size}px;
      background:${BG};
      display:flex; align-items:center; justify-content:center;
    }
    img { width:${inner}px; height:${inner}px; object-fit:contain; }
  </style></head><body>
    <div class="tile"><img src="${logoUri}"></div>
  </body></html>`
}

for (const [size, pad, name] of [
  [192, 192 * 0.08, 'icon-192.png'],
  [512, 512 * 0.08, 'icon-512.png'],
  [512, 512 * 0.2, 'icon-maskable-512.png'], // maskable: Android crops to a circle, so the mark needs a wide safe zone
  [180, 180 * 0.08, 'apple-touch-icon.png'], // iOS fills transparent pixels with black, so this needs the solid tile too
]) {
  const page = await browser.newPage()
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 })
  await page.setContent(html(size, pad))
  await page.screenshot({ path: `public/${name}` })
  await page.close()
  console.log(`  public/${name}`)
}

// Favicon: an SVG wrapper around the cropped mark, on the same tile.
writeFileSync(
  'public/icon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <image href="${logoUri}" x="41" y="41" width="430" height="430" preserveAspectRatio="xMidYMid meet"/>
</svg>`,
)
console.log('  public/icon.svg')

await browser.close()
