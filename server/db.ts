/**
 * SQLite, seeded from content/ on every boot.
 *
 * No credentials, no second service, no free-tier database to expire the night
 * before the pitch. Content is version-controlled in git and the database is
 * disposable — a wiped disk on redeploy costs nothing but session history.
 *
 * If a judge asks about scale: content is read-only and would move to Postgres
 * the moment there are real users. That is a good answer, not a weak one.
 */

import Database from 'better-sqlite3'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import type { InvestigationFull, ScenarioFull, TriageDeck } from '../shared/types'

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
    payload     TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS triage_decks (
    id       TEXT PRIMARY KEY,
    payload  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS investigations (
    id       TEXT PRIMARY KEY,
    payload  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id           TEXT PRIMARY KEY,
    mode         TEXT NOT NULL DEFAULT 'guardian',
    scenario_id  TEXT,
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

  -- Speed Triage: one row per card answered.
  CREATE TABLE IF NOT EXISTS triage_answers (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  TEXT NOT NULL REFERENCES sessions(id),
    card_id     TEXT NOT NULL,
    verdict     TEXT NOT NULL,          -- 'real' | 'scam' | 'timeout'
    is_correct  INTEGER NOT NULL,
    points      INTEGER NOT NULL,
    multiplier  REAL NOT NULL,
    category    TEXT NOT NULL,
    answered_at INTEGER NOT NULL,

    -- A card is answered once per run, same reasoning as a Guardian stage.
    UNIQUE (session_id, card_id)
  );

  -- The Investigation: one row per tap, hit or miss.
  CREATE TABLE IF NOT EXISTS investigation_taps (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  TEXT NOT NULL REFERENCES sessions(id),
    element_id  TEXT NOT NULL,
    hit         INTEGER NOT NULL,
    tapped_at   INTEGER NOT NULL,

    -- Tapping the same element twice must not score twice, and must not be
    -- punished twice either.
    UNIQUE (session_id, element_id)
  );

  CREATE INDEX IF NOT EXISTS idx_decisions_session ON decisions(session_id);
  CREATE INDEX IF NOT EXISTS idx_triage_session ON triage_answers(session_id);
  CREATE INDEX IF NOT EXISTS idx_taps_session ON investigation_taps(session_id);
`)

/* A database created before Speed Triage existed has no `mode` column.
   CREATE TABLE IF NOT EXISTS will not add one, so add it here. */
const sessionColumns = (db.pragma('table_info(sessions)') as { name: string }[]).map((c) => c.name)
if (!sessionColumns.includes('mode')) {
  db.exec(`ALTER TABLE sessions ADD COLUMN mode TEXT NOT NULL DEFAULT 'guardian'`)
}

/* ---- seed ---------------------------------------------------------------- */

const upsertScenario = db.prepare(`
  INSERT INTO scenarios (id, title_kh, title_en, scam_type, payload)
  VALUES (@id, @title_kh, @title_en, @scam_type, @payload)
  ON CONFLICT(id) DO UPDATE SET
    title_kh = excluded.title_kh, title_en = excluded.title_en,
    scam_type = excluded.scam_type, payload = excluded.payload
`)

const upsertDeck = db.prepare(`
  INSERT INTO triage_decks (id, payload) VALUES (?, ?)
  ON CONFLICT(id) DO UPDATE SET payload = excluded.payload
`)

const upsertInvestigation = db.prepare(`
  INSERT INTO investigations (id, payload) VALUES (?, ?)
  ON CONFLICT(id) DO UPDATE SET payload = excluded.payload
`)

function readJsonDir<T>(dir: string): { name: string; data: T }[] {
  const full = path.join(CONTENT_DIR, dir)
  if (!existsSync(full)) return []
  return readdirSync(full)
    .filter((f) => f.endsWith('.json'))
    .map((name) => ({ name, data: JSON.parse(readFileSync(path.join(full, name), 'utf8')) as T }))
}

export interface SeedCounts {
  scenarios: number
  decks: number
  investigations: number
}

export function seedContent(): SeedCounts {
  const seed = db.transaction(() => {
    for (const { name, data } of readJsonDir<ScenarioFull>('scenarios')) {
      if (!data.id) {
        console.warn(`[prayat] skipping scenarios/${name}: no id`)
        continue
      }
      upsertScenario.run({
        id: data.id,
        title_kh: data.title?.kh ?? '',
        title_en: data.title?.en ?? '',
        scam_type: data.scamType,
        payload: JSON.stringify(data),
      })
    }

    for (const { name, data } of readJsonDir<TriageDeck>('triage')) {
      if (!data.id) {
        console.warn(`[prayat] skipping triage/${name}: no id`)
        continue
      }
      upsertDeck.run(data.id, JSON.stringify(data))
    }

    for (const { name, data } of readJsonDir<InvestigationFull>('investigations')) {
      if (!data.id) {
        console.warn(`[prayat] skipping investigations/${name}: no id`)
        continue
      }
      upsertInvestigation.run(data.id, JSON.stringify(data))
    }
  })

  seed()
  return counts()
}

function one(sql: string): number {
  return (db.prepare(sql).get() as { n: number }).n
}

export function counts(): SeedCounts {
  return {
    scenarios: one('SELECT COUNT(*) AS n FROM scenarios'),
    decks: one('SELECT COUNT(*) AS n FROM triage_decks'),
    investigations: one('SELECT COUNT(*) AS n FROM investigations'),
  }
}

export function countScenarios(): number {
  return one('SELECT COUNT(*) AS n FROM scenarios')
}

/* ---- reads --------------------------------------------------------------- */

function payloadOf<T>(table: string, id: string): T | null {
  const row = db.prepare(`SELECT payload FROM ${table} WHERE id = ?`).get(id) as
    | { payload: string }
    | undefined
  return row ? (JSON.parse(row.payload) as T) : null
}

function allPayloads<T>(table: string): T[] {
  const rows = db.prepare(`SELECT payload FROM ${table}`).all() as { payload: string }[]
  return rows.map((r) => JSON.parse(r.payload) as T)
}

export const getScenario = (id: string) => payloadOf<ScenarioFull>('scenarios', id)
export const listScenarioRows = () => allPayloads<ScenarioFull>('scenarios')

export const getDeck = (id: string) => payloadOf<TriageDeck>('triage_decks', id)
export const listDecks = () => allPayloads<TriageDeck>('triage_decks')

export const getInvestigation = (id: string) => payloadOf<InvestigationFull>('investigations', id)
export const listInvestigations = () => allPayloads<InvestigationFull>('investigations')
