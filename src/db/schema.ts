import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Every tool stores its records here. `data` is a JSON document whose shape is
// declared by the tool's ToolConfig — the runtime stays tool-agnostic, which is
// what makes a new tool a config file rather than a migration.
export const records = sqliteTable("records", {
  id: text("id").primaryKey(),
  tool: text("tool").notNull(),
  data: text("data").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const auditEvents = sqliteTable("audit_events", {
  id: text("id").primaryKey(),
  tool: text("tool").notNull(),
  recordId: text("record_id").notNull(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  note: text("note"),
  before: text("before"),
  after: text("after"),
  createdAt: integer("created_at").notNull(),
});
