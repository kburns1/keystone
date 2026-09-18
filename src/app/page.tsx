import Link from "next/link";
import { toolCounts } from "@/lib/data";
import { TOOLS } from "@/tools";

export default function Home() {
  const counts = toolCounts();

  return (
    <div>
      <h1 className="text-xl font-semibold">Tools</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Each tool below is a single typed config file on the shared runtime.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <Link
            key={t.slug}
            href={`/t/${t.slug}`}
            className="rounded-lg border border-neutral-200 bg-white p-5 hover:border-neutral-400"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-medium">{t.name}</h2>
              <span className="text-xs text-neutral-400">
                {counts[t.slug] ?? 0} records
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-500">{t.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
