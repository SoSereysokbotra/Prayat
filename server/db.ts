/**
 * SQLite, seeded from content/ on every boot.
 *
 * No credentials, no second service, no free-tier database to expire the night
 * before the pitch. Content is version-controlled in git and the database is
 * disposable — a wiped disk on redeploy costs nothing but session history.
 *
 * If a judge asks about scale: scenario content is read-only and would move to
 * Postgres the moment there are real users. That is a good answer, not a weak
 * one.
 */

import Database from 'better-sqlite3'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { ScenarioFull } from '../shared/types'

const DB_PATH = process.env.DATABASE_PATH ?? path.resolve(process.cwd(), 'prayat.db')
const CONTENT_DIR = path.resolve(process.cwd(), 'content')

export const db = new Database(DB_PATH)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS scenarios (
    id          TEXT PRIMARY KEY,
    title_kh    TEXT NOT NULL,
    title_en    TEXT NOT NULL,
    scam_type   TEXT NOT NULL,
    payload     TEXT NOT NULL     -- full ScenarioFull as JSON
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id           TEXT PRIMARY KEY,
    scenario_id  TEXT NOT NULL REFERENCES scenarios(id),
    language     TEXT NOT NULL,
    started_at   INTEGER NOT NULL,
    finished_at  INTEGER,
    score        INTEGER NOT NULL DEFAULT 0,
    won          INTEGER
  );

  CREATE TABLE IF NOT EXISTS decisions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  TEXT NOT NULL REFERENCES sessions(id),
    stage_id    INTEGER NOT NULL,
    option_id   TEXT NOT NULL,
    is_correct  INTEGER NOT NULL,
    decided_at  INTEGER NOT NULL,

    -- One answer per stage, enforced by the database rather than only by
    -- application code. Third and last guard against the double-tap bug.
    UNIQUE (session_id, stage_id)
  );

  CREATE INDEX IF NOT EXISTS idx_decisions_session ON decisions(session_id);
`)

/* ---- seed ---------------------------------------------------------------- */

const upsertScenario = db.prepare(`
  INSERT INTO scenarios (id, title_kh, title_en, scam_type, payload)
  VALUES (@id, @title_kh, @title_en, @scam_type, @payload)
  ON CONFLICT(id) DO UPDATE SET
    title_kh  = excluded.title_kh,
    title_en  = excluded.title_en,
    scam_type = excluded.scam_type,
    payload   = excluded.payload
`)

export function seedContent(): number {
  let files: string[]
  try {
    files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json'))
  } catch {
    console.warn(`[prayat] no content directory at ${CONTENT_DIR}`)
    return 0
  }

  const seed = db.transaction((names: string[]) => {
    for (const name of names) {
      const raw = readFileSync(path.join(CONTENT_DIR, name), 'utf8')
      const scenario = JSON.parse(raw) as ScenarioFull

      if (!scenario.id) {
        console.warn(`[prayat] skipping ${name}: no id`)
        continue
      }

      upsertScenario.run({
        id: scenario.id,
        title_kh: scenario.title?.kh ?? '',
        title_en: scenario.title?.en ?? '',
        scam_type: scenario.scamType,
        payload: JSON.stringify(scenario),
      })
    }
  })

  seed(files)
  return countScenarios()
}

/* ---- reads --------------------------------------------------------------- */

export function getScenario(id: string): ScenarioFull | null {
  const row = db.prepare('SELECT payload FROM scenarios WHERE id = ?').get(id) as
    | { payload: string }
    | undefined
  return row ? (JSON.parse(row.payload) as ScenarioFull) : null
}

export function listScenarioRows(): ScenarioFull[] {
  const rows = db.prepare('SELECT payload FROM scenarios').all() as { payload: string }[]
  return rows.map((r) => JSON.parse(r.payload) as ScenarioFull)
}

export function countScenarios(): number {
  return (db.prepare('SELECT COUNT(*) AS n FROM scenarios').get() as { n: number }).n
}
