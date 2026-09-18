import Link from "next/link";
import type { RecordRow, ToolConfig } from "@/lib/types";
import { FieldValue } from "./FieldValue";

export function RecordTable({
  tool,
  rows,
}: {
  tool: ToolConfig;
  rows: RecordRow[];
}) {
  const cols = tool.fields.filter((f) => f.showInList);

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">
        No records match.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
            {cols.map((f) => (
              <th key={f.key} className="px-4 py-3 font-medium">
                {f.label}
              </th>
            ))}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
              {cols.map((f) => (
                <td key={f.key} className="px-4 py-3">
                  <FieldValue
                    field={f}
                    value={r.data[f.key]}
                    isStatus={f.key === tool.statusField}
                  />
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/t/${tool.slug}/${r.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
