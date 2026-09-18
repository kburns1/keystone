import Link from "next/link";
import { booleanLabel, formatCurrencyCents, humanize } from "@/lib/format";
import type { AuditEvent, ToolConfig } from "@/lib/types";
import { getTool } from "@/tools";

function actionLabel(tool: ToolConfig | undefined, key: string): string {
  return tool?.actions.find((a) => a.key === key)?.label ?? humanize(key);
}

function fieldLabel(tool: ToolConfig | undefined, key: string): string {
  return tool?.fields.find((f) => f.key === key)?.label ?? humanize(key);
}

function fieldValue(tool: ToolConfig | undefined, key: string, value: unknown): string {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return booleanLabel(value);
  const field = tool?.fields.find((f) => f.key === key);
  if (field?.type === "currency") return formatCurrencyCents(Number(value));
  if (field?.type === "select") return humanize(String(value));
  return String(value);
}

function diff(tool: ToolConfig | undefined, event: AuditEvent) {
  const { before, after } = event;
  if (!after) return null;
  const changed = Object.keys(after).filter(
    (k) => JSON.stringify(before?.[k]) !== JSON.stringify(after[k]),
  );
  if (changed.length === 0) return null;
  return changed.map(
    (k) =>
      `${fieldLabel(tool, k)}: ${fieldValue(tool, k, before?.[k])} → ${fieldValue(tool, k, after[k])}`,
  );
}

export function AuditTimeline({
  events,
  showRecord = false,
}: {
  events: AuditEvent[];
  showRecord?: boolean;
}) {
  if (events.length === 0) {
    return <p className="text-sm text-neutral-500">No audit events yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {events.map((e) => {
        const tool = getTool(e.tool);
        const changes = diff(tool, e);
        return (
          <li key={e.id} className="rounded-lg border border-neutral-200 bg-white p-3 text-sm">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-medium">{e.actor}</span>
              <span className="text-neutral-500">{actionLabel(tool, e.action)}</span>
              {showRecord && (
                <Link
                  href={`/t/${e.tool}/${e.recordId}`}
                  className="text-blue-600 hover:underline"
                >
                  {tool?.name ?? humanize(e.tool)}
                </Link>
              )}
              <span className="ml-auto text-xs text-neutral-400">
                {new Date(e.createdAt).toLocaleString()}
              </span>
            </div>
            {e.note && <p className="mt-1 text-neutral-600">“{e.note}”</p>}
            {changes && (
              <p className="mt-1 text-xs text-neutral-500">{changes.join(" · ")}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
