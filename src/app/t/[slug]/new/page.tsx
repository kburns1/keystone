import Link from "next/link";
import { notFound } from "next/navigation";
import { createRecord } from "@/lib/actions";
import { canCreate, currentUser } from "@/lib/auth";
import { humanize } from "@/lib/format";
import { getTool } from "@/tools";

export default async function NewRecordPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const user = await currentUser();
  const action = createRecord.bind(null, tool.slug);
  const editable = tool.fields.filter((f) => f.key !== tool.statusField);

  if (!canCreate(user.role)) {
    return (
      <div className="max-w-2xl">
        <Link href={`/t/${tool.slug}`} className="text-sm text-blue-600 hover:underline">
          ← {tool.name}
        </Link>
        <h1 className="mt-3 text-xl font-semibold">New record — {tool.name}</h1>
        <p className="mt-6 rounded-lg border border-neutral-200 bg-white p-5 text-sm text-neutral-500">
          Your role ({humanize(user.role)}) cannot create records in {tool.name}.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link href={`/t/${tool.slug}`} className="text-sm text-blue-600 hover:underline">
        ← {tool.name}
      </Link>
      <h1 className="mt-3 text-xl font-semibold">New record — {tool.name}</h1>

      <form action={action} className="mt-6 space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
        {editable.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-neutral-700">
              {f.label}
              {f.required && <span className="text-red-500"> *</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea name={f.key} rows={3} className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm" />
            ) : f.type === "select" ? (
              <select name={f.key} className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm">
                <option value="">—</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>{humanize(o)}</option>
                ))}
              </select>
            ) : f.type === "boolean" ? (
              <input name={f.key} type="checkbox" className="mt-2" />
            ) : (
              <input
                name={f.key}
                type={f.type === "number" || f.type === "currency" ? "number" : f.type === "date" ? "date" : "text"}
                step={f.type === "currency" ? "0.01" : undefined}
                className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Create
        </button>
      </form>
    </div>
  );
}
