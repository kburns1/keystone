import Link from "next/link";
import type { AuditEvent } from "@/lib/types";

function diff(before: Record<string, unknown> | null, after: Record<string, unknown> | null) {
  if (!after) return null;
  const changed = Object.keys(after).filter(
    (k) => JSON.stringify(before?.[k]) !== JSON.stringify(after[k]),
  );
  if (changed.length === 0) return null;
  return changed.map((k) => `${k}: ${JSON.stringify(before?.[k])} → ${JSON.stringify(after[k])}`);
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
        const changes = diff(e.before, e.after);
        return (
          <li key={e.id} className="rounded-lg border border-neutral-200 bg-white p-3 text-sm">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-medium">{e.actor}</span>
              <span className="text-neutral-500">{e.action}</span>
              {showRecord && (
                <Link
                  href={`/t/${e.tool}/${e.recordId}`}
                  className="text-blue-600 hover:underline"
                >
                  {e.tool}
                </Link>
              )}
              <span className="ml-auto text-xs text-neutral-400">
                {new Date(e.createdAt).toLocaleString()}
              </span>
            </div>
            {e.note && <p className="mt-1 text-neutral-600">“{e.note}”</p>}
            {changes && (
              <p className="mt-1 font-mono text-xs text-neutral-500">{changes.join(" · ")}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
