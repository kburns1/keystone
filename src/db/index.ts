import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { seed } from "./seed";

const dir = path.join(process.cwd(), "data");
fs.mkdirSync(dir, { recursive: true });

export const sqlite = new Database(path.join(dir, "keystone.db"));

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    tool TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_records_tool ON records(tool);

  CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY,
    tool TEXT NOT NULL,
    record_id TEXT NOT NULL,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    note TEXT,
    before TEXT,
    after TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_audit_record ON audit_events(record_id);
  CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_events(created_at);
`);

export const db = drizzle(sqlite);

const { c } = sqlite.prepare("SELECT COUNT(*) AS c FROM records").get() as {
  c: number;
};
if (c === 0) seed(db);
