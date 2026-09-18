import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditEvents, records } from "@/db/schema";
import type { AuditEvent, RecordRow } from "./types";

function toRecordRow(r: typeof records.$inferSelect): RecordRow {
  return { ...r, data: JSON.parse(r.data) };
}

function toAuditEvent(e: typeof auditEvents.$inferSelect): AuditEvent {
  return {
    ...e,
    before: e.before ? JSON.parse(e.before) : null,
    after: e.after ? JSON.parse(e.after) : null,
  };
}

export function listRecords(tool: string): RecordRow[] {
  return db
    .select()
    .from(records)
    .where(eq(records.tool, tool))
    .orderBy(desc(records.createdAt))
    .all()
    .map(toRecordRow);
}

export function getRecord(tool: string, id: string): RecordRow | undefined {
  const row = db
    .select()
    .from(records)
    .where(eq(records.id, id))
    .get();
  return row && row.tool === tool ? toRecordRow(row) : undefined;
}

export function recordAudit(recordId: string): AuditEvent[] {
  return db
    .select()
    .from(auditEvents)
    .where(eq(auditEvents.recordId, recordId))
    .orderBy(desc(auditEvents.createdAt))
    .all()
    .map(toAuditEvent);
}

export function recentAudit(limit = 100): AuditEvent[] {
  return db
    .select()
    .from(auditEvents)
    .orderBy(desc(auditEvents.createdAt))
    .limit(limit)
    .all()
    .map(toAuditEvent);
}

export function toolCounts(): Record<string, number> {
  const rows = db.select({ tool: records.tool }).from(records).all();
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.tool] = (counts[r.tool] ?? 0) + 1;
  return counts;
}
