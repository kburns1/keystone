import { performAction } from "@/lib/actions";
import type { SessionUser } from "@/lib/auth";
import { humanize } from "@/lib/format";
import type { ToolConfig } from "@/lib/types";

export function ActionBar({
  tool,
  recordId,
  user,
}: {
  tool: ToolConfig;
  recordId: string;
  user: SessionUser;
}) {
  const visible = tool.actions.filter((a) => a.roles.includes(user.role));

  if (visible.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        Your role ({humanize(user.role)}) has no actions on this record.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {visible.map((a) => (
        <form
          key={a.key}
          action={performAction.bind(null, tool.slug, recordId, a.key)}
          className="flex items-center gap-2"
        >
          {a.requiresNote && (
            <input
              name="note"
              required
              placeholder="note (required)"
              className="rounded border border-neutral-300 px-2 py-1.5 text-sm"
            />
          )}
          <button
            type="submit"
            className={
              a.destructive
                ? "rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                : "rounded bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700"
            }
          >
            {a.label}
          </button>
        </form>
      ))}
    </div>
  );
}
