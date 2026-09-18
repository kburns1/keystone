import Link from "next/link";
import { notFound } from "next/navigation";
import { FilterBar } from "@/components/FilterBar";
import { RecordTable } from "@/components/RecordTable";
import { canCreate, currentUser } from "@/lib/auth";
import { listRecords } from "@/lib/data";
import { getTool } from "@/tools";

export default async function ToolPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const tool = getTool(slug);
  if (!tool) notFound();

  const user = await currentUser();

  const active: Record<string, string> = {};
  for (const f of tool.filters) {
    const v = sp[f.key];
    if (typeof v === "string") active[f.key] = v;
  }

  const rows = listRecords(tool.slug).filter((r) =>
    tool.filters.every((f) => {
      const want = active[f.key];
      if (want == null) return true;
      return String(r.data[f.key]) === want;
    }),
  );

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-xl font-semibold">{tool.name}</h1>
          <p className="mt-1 text-sm text-neutral-500">{tool.description}</p>
        </div>
        {canCreate(user.role) && (
          <Link
            href={`/t/${tool.slug}/new`}
            className="rounded bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700"
          >
            + New record
          </Link>
        )}
      </div>
      <div className="mt-4">
        <FilterBar tool={tool} active={active} />
      </div>
      <div className="mt-4">
        <RecordTable tool={tool} rows={rows} />
      </div>
    </div>
  );
}
