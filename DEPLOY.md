# Deploying Prayat

One Node service serves both the API and the built frontend. One deploy, one URL,
no CORS to explain on stage.

---

## 1. Render

**HTTPS is not optional.** Android will not offer to install a PWA over plain HTTP,
so without it there is no installable app and no QR demo. Render gives it free.

### From the blueprint

The repo contains [`render.yaml`](render.yaml). In Render: **New → Blueprint**, point it
at this repository, deploy.

### By hand

**New → Web Service**, connect the repo, then:

| Field | Value |
|---|---|
| Runtime | Node |
| Build command | `npm ci && npm run build` |
| Start command | `npm start` |
| Health check path | `/api/health` |
| Region | Singapore — closest to Cambodia |
| Plan | Free |

Environment variables:

| Key | Value | Why |
|---|---|---|
| `NODE_VERSION` | `22` | |
| `DATABASE_PATH` | `/tmp/prayat.db` | The free tier has no persistent disk |

**Do not set `PORT`.** Render assigns it and the server reads `process.env.PORT`.
Hardcoding 3001 fails in production.

### The database is meant to be disposable

Content is version-controlled in git and re-seeded from `content/` on every boot.
A wiped disk costs you nothing but session history. If a judge asks about scale:
scenario content is read-only and would move to Postgres the moment there are real
users. That is a good answer, not a weak one.

---

## 2. Verify the deployment

```bash
BASE=https://your-service.onrender.com npm run preflight
```

This checks the deployment the way a judge meets it — cold, from outside. It verifies
HTTPS, the manifest, the service worker, the Khmer font, every route a QR code might
point at, and that the answer key does not leak. It also tells you **how long the cold
start took**, which is the number that matters most on demo day.

Then run the full API suite against production:

```bash
BASE=https://your-service.onrender.com npm run test:api
```

48 checks, no UI required.

---

## 3. The sleeping problem

**Render's free tier sleeps after inactivity and cold-starts in roughly 30 seconds.**
That is a disaster if it happens when a judge scans your QR code.

In order of reliability:

1. **Hit `/api/health` from your phone right before you present.** Takes five seconds,
   and it is the one you must not skip.
2. **UptimeRobot**, free, pinging `https://your-service.onrender.com/api/health` every
   5 minutes. Start it **the day before**, not the morning of.
3. **Pay for one month of the lowest paid tier** if you can. It removes the single most
   embarrassing failure mode in this whole project.

### UptimeRobot setup

1. uptimerobot.com → free account
2. **Add New Monitor** → HTTP(s)
3. URL: `https://your-service.onrender.com/api/health`
4. Interval: 5 minutes
5. Save, and confirm it reports Up before you stop looking at it

---

## 4. Install it on the demo phone

1. Open the Render URL in **Chrome on Android**
2. Menu → **Install app** / **Add to Home screen**
3. Open it from the home screen — it should launch with no browser chrome
4. Turn the network off and open it again: the shell must still load

If Install is not offered, the cause is almost always one of: not HTTPS, manifest not
served, or no 512px icon. `npm run preflight` checks all three.

---

## 5. Demo day

Two QR codes on the slide:

| Points at | What it is |
|---|---|
| `https://your-service.onrender.com` | The app |
| `https://your-service.onrender.com/api/docs` | The API a judge can test themselves |

Generate them from the final URL, and **test both from a phone that has never opened
the site** — a cached page on your own phone proves nothing.

### The morning checklist

- [ ] `BASE=… npm run preflight` — all clear
- [ ] UptimeRobot has been running since yesterday
- [ ] PWA installed on the demo phone, launched once
- [ ] Demo phone on the **team hotspot**, never venue wifi
- [ ] Backup hotspot tested on a second phone
- [ ] Backup video recorded and on the phone, not in the cloud
- [ ] Both QR codes scanned from a fresh device
- [ ] `/api/health` hit from the demo phone in the last two minutes

---

## Local production build

To run exactly what Render runs:

```bash
npm ci
npm run build
npm start           # http://localhost:3001
```

`npm run dev` is different in one way that matters: the service worker is disabled and
the development aids exist. `npm run build` strips both — the theme toggle and
`/dev/components` are behind `import.meta.env.DEV` and are not in the production bundle
at all, so there is nothing to remember to delete.
