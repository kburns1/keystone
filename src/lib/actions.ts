"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { auditEvents, records } from "@/db/schema";
import { getTool } from "@/tools";
import { currentUser } from "./auth";

export async function setUser(formData: FormData) {
  const id = String(formData.get("user") ?? "");
  (await cookies()).set("keystone_user", id, { path: "/" });
  revalidatePath("/", "layout");
}

export async function createRecord(toolSlug: string, formData: FormData) {
  const tool = getTool(toolSlug);
  if (!tool) throw new Error(`Unknown tool: ${toolSlug}`);

  const user = await currentUser();
  if (user.role === "viewer") throw new Error("Viewers cannot create records");

  const data: Record<string, unknown> = {};
  for (const f of tool.fields) {
    const raw = formData.get(f.key);
    const empty = raw == null || raw === "";
    switch (f.type) {
      case "boolean":
        data[f.key] = raw === "on" || raw === "true";
        break;
      case "number":
        data[f.key] = empty ? null : Number(raw);
        break;
      case "currency":
        // stored as integer cents; the form collects dollars
        data[f.key] = empty ? null : Math.round(Number(raw) * 100);
        break;
      default:
        data[f.key] = empty ? null : String(raw);
    }
    if (f.required && (data[f.key] == null || data[f.key] === "")) {
      throw new Error(`${f.label} is required`);
    }
    if (f.type === "select" && data[f.key] != null && f.options && !f.options.includes(String(data[f.key]))) {
      throw new Error(`${f.label}: invalid option`);
    }
  }

  // Default the status field to its first option on create.
  if (tool.statusField && data[tool.statusField] == null) {
    const sf = tool.fields.find((f) => f.key === tool.statusField);
    if (sf?.type === "select") data[tool.statusField] = sf.options?.[0];
  }

  const id = crypto.randomUUID();
  const t = Date.now();
  db.insert(records)
    .values({ id, tool: tool.slug, data: JSON.stringify(data), createdAt: t, updatedAt: t })
    .run();
  db.insert(auditEvents)
    .values({
      id: crypto.randomUUID(),
      tool: tool.slug,
      recordId: id,
      actor: user.name,
      action: "create",
      note: null,
      before: null,
      after: JSON.stringify(data),
      createdAt: t,
    })
    .run();

  redirect(`/t/${tool.slug}/${id}`);
}

export async function performAction(
  toolSlug: string,
  recordId: string,
  actionKey: string,
  formData: FormData,
) {
  const tool = getTool(toolSlug);
  if (!tool) throw new Error(`Unknown tool: ${toolSlug}`);
  const action = tool.actions.find((a) => a.key === actionKey);
  if (!action) throw new Error(`Unknown action: ${actionKey}`);

  const user = await currentUser();
  if (!action.roles.includes(user.role)) {
    throw new Error(`${user.role}s cannot run ${action.label}`);
  }

  const note = String(formData.get("note") ?? "").trim();
  if (action.requiresNote && !note) {
    throw new Error(`${action.label} requires a note`);
  }

  const row = db.select().from(records).where(eq(records.id, recordId)).get();
  if (!row || row.tool !== tool.slug) throw new Error("Record not found");

  const before = JSON.parse(row.data) as Record<string, unknown>;
  const after = { ...before, ...action.set };
  const t = Date.now();

  db.update(records)
    .set({ data: JSON.stringify(after), updatedAt: t })
    .where(eq(records.id, recordId))
    .run();
  db.insert(auditEvents)
    .values({
      id: crypto.randomUUID(),
      tool: tool.slug,
      recordId,
      actor: user.name,
      action: action.key,
      note: note || null,
      before: row.data,
      after: JSON.stringify(after),
      createdAt: t,
    })
    .run();

  revalidatePath(`/t/${tool.slug}`);
  revalidatePath(`/t/${tool.slug}/${recordId}`);
  revalidatePath("/audit");
}
