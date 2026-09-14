import puppeteer from 'puppeteer-core'

const [,, url, outPath, mode] = process.argv

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'],
})

const page = await browser.newPage()
await page.setViewport({ width: 375, height: 900, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 800))

if (mode === 'light') {
  await page.evaluate(() => document.documentElement.classList.add('theme-light'))
  await new Promise(r => setTimeout(r, 300))
}

const report = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth
  const offenders = []
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.right > vw + 0.5 || r.left < -0.5) {
      const cls = typeof el.className === 'string' ? el.className : ''
      offenders.push({
        tag: el.tagName,
        cls: cls.slice(0, 70),
        w: Math.round(r.width),
        left: Math.round(r.left),
        right: Math.round(r.right),
        text: (el.textContent || '').trim().slice(0, 30),
      })
    }
  })
  // smallest interactive targets
  const taps = [...document.querySelectorAll('a,button')].map((el) => {
    const r = el.getBoundingClientRect()
    return { tag: el.tagName, h: Math.round(r.height), w: Math.round(r.width), text: (el.textContent||'').trim().slice(0,24) }
  })
  return {
    vw,
    docScrollW: document.documentElement.scrollWidth,
    bodyScrollW: document.body.scrollWidth,
    offenders: offenders.slice(0, 12),
    smallTaps: taps.filter((t) => t.h < 44 || t.w < 44),
  }
})

console.log(JSON.stringify(report, null, 2))
await page.screenshot({ path: outPath, fullPage: true })
await browser.close()
