import Link from "next/link";
import type { ToolConfig } from "@/lib/types";

function optionsFor(tool: ToolConfig, key: string): string[] {
  const field = tool.fields.find((f) => f.key === key);
  if (field?.type === "boolean") return ["true", "false"];
  return field?.options ?? [];
}

export function FilterBar({
  tool,
  active,
}: {
  tool: ToolConfig;
  active: Record<string, string>;
}) {
  if (tool.filters.length === 0) return null;

  const href = (key: string, value: string | null) => {
    const params = new URLSearchParams(active);
    if (value == null) params.delete(key);
    else params.set(key, value);
    const q = params.toString();
    return `/t/${tool.slug}${q ? `?${q}` : ""}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      {tool.filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-1">
          <span className="mr-1 text-neutral-500">{filter.label}:</span>
          <Link
            href={href(filter.key, null)}
            className={
              active[filter.key] == null
                ? "rounded bg-neutral-800 px-2 py-0.5 text-white"
                : "rounded px-2 py-0.5 text-neutral-600 hover:bg-neutral-200"
            }
          >
            All
          </Link>
          {optionsFor(tool, filter.key).map((opt) => (
            <Link
              key={opt}
              href={href(filter.key, opt)}
              className={
                active[filter.key] === opt
                  ? "rounded bg-neutral-800 px-2 py-0.5 text-white"
                  : "rounded px-2 py-0.5 text-neutral-600 hover:bg-neutral-200"
              }
            >
              {opt}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
