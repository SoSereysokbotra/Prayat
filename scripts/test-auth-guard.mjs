import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:'new', args:['--no-sandbox','--disable-gpu'] })
const errs = []
let pass=0, fail=0
const check=(n,ok,d='')=>{ if(ok){pass++;console.log(`  ✓ ${n}`)}else{fail++;console.error(`  ✗ ${n}${d?' — '+d:''}`)} }

async function fresh() {
  const p = await b.newPage()
  p.on('pageerror', e=>errs.push(e.message))
  await p.setViewport({ width:375, height:812 })
  return p
}
const where = (p) => p.evaluate(()=>location.pathname+location.search)

console.log('\nsigned out — every protected URL goes to sign-in first')
for (const path of ['/','/guardian','/triage','/investigation','/debrief','/consequence','/coming-soon/speed-triage']) {
  const p = await fresh()
  await p.goto('http://localhost:3001'+path,{waitUntil:'networkidle0'})
  await new Promise(r=>setTimeout(r,500))
  check(`${path} -> /signin`, (await where(p))==='/signin')
  await p.close()
}

console.log('\nauth screens stay reachable while signed out')
for (const path of ['/signin','/signup','/forgot-password','/reset-password']) {
  const p = await fresh()
  await p.goto('http://localhost:3001'+path,{waitUntil:'networkidle0'})
  await new Promise(r=>setTimeout(r,400))
  check(`${path} stays put`, (await where(p))===path)
  await p.close()
}

console.log('\nsigning in returns you to where you were going')
{
  const p = await fresh()
  await p.goto('http://localhost:3001/triage',{waitUntil:'networkidle0'})
  await new Promise(r=>setTimeout(r,500))
  check('bounced to /signin', (await where(p))==='/signin')
  await p.type('input[type=email]','sok@example.com')
  await p.type('input[type=password]','correcthorse')
  await p.evaluate(()=>document.querySelector('button[type=submit]').click())
  await p.waitForFunction(()=>location.pathname!=='/signin',{timeout:10000})
  await new Promise(r=>setTimeout(r,400))
  check('lands on /triage, not home', (await where(p))==='/triage')
  check('session persisted', await p.evaluate(()=>!!localStorage.getItem('prayat.session')))

  // reload must NOT bounce back to sign-in
  await p.goto('http://localhost:3001/',{waitUntil:'networkidle0'})
  await new Promise(r=>setTimeout(r,500))
  check('reload stays signed in', (await where(p))==='/')
  check('signed-in user cannot reach /signin', await (async()=>{
    await p.goto('http://localhost:3001/signin',{waitUntil:'networkidle0'})
    await new Promise(r=>setTimeout(r,400))
    return (await where(p))==='/'
  })())
  check('email shown on home', await p.evaluate(()=>document.body.innerText.includes('sok@example.com')))

  // sign out
  await p.evaluate(()=>{
    const b=[...document.querySelectorAll('button')].find(x=>/sign out|ចាកចេញ|ចាក​ចេញ/i.test(x.getAttribute('aria-label')||''))
    b.click()
  })
  await p.waitForFunction(()=>location.pathname==='/signin',{timeout:8000})
  check('sign out returns to /signin', (await where(p))==='/signin')
  check('session cleared', await p.evaluate(()=>!localStorage.getItem('prayat.session')))
  await p.close()
}

console.log('\nguest path')
{
  const p = await fresh()
  await p.goto('http://localhost:3001/guardian',{waitUntil:'networkidle0'})
  await new Promise(r=>setTimeout(r,500))
  await p.evaluate(()=>{
    const b=[...document.querySelectorAll('button')].find(x=>/without|ភ្ញៀវ|មិនចាំបាច់|មិន​ចាំបាច់/.test(x.textContent))
    b.click()
  })
  await p.waitForFunction(()=>location.pathname!=='/signin',{timeout:8000})
  await new Promise(r=>setTimeout(r,400))
  check('guest reaches the intended page', (await where(p))==='/guardian')
  await p.goto('http://localhost:3001/',{waitUntil:'networkidle0'})
  await new Promise(r=>setTimeout(r,500))
  check('guest stays signed in on reload', (await where(p))==='/')
  check('guest badge offers sign-up', await p.evaluate(()=>!!document.querySelector('a[href="/signup"]')))
  await p.close()
}

console.log(`\n${pass} passed, ${fail} failed`)
console.log('errors:', errs.length?errs.slice(0,3):'none')
await b.close()
