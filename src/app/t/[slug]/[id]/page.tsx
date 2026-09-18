import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionBar } from "@/components/ActionBar";
import { AuditTimeline } from "@/components/AuditTimeline";
import { FieldValue } from "@/components/FieldValue";
import { currentUser } from "@/lib/auth";
import { getRecord, recordAudit } from "@/lib/data";
import { getTool } from "@/tools";

export default async function RecordPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const tool = getTool(slug);
  const record = tool ? getRecord(slug, id) : undefined;
  if (!tool || !record) notFound();

  const user = await currentUser();
  const events = recordAudit(id);

  return (
    <div>
      <Link href={`/t/${tool.slug}`} className="text-sm text-blue-600 hover:underline">
        ← {tool.name}
      </Link>
      <div className="mt-3 flex items-baseline justify-between">
        <h1 className="text-xl font-semibold">{String(record.data[tool.titleField])}</h1>
        {tool.statusField && (
          <FieldValue
            field={tool.fields.find((f) => f.key === tool.statusField)!}
            value={record.data[tool.statusField]}
            isStatus
          />
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-neutral-200 bg-white p-5">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {tool.fields.map((f) => (
                <div key={f.key}>
                  <dt className="text-xs uppercase tracking-wide text-neutral-500">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-sm">
                    <FieldValue
                      field={f}
                      value={record.data[f.key]}
                      isStatus={f.key === tool.statusField}
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-medium">Actions</h2>
            <ActionBar tool={tool} recordId={record.id} user={user} />
          </section>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-medium">Audit trail</h2>
          <AuditTimeline events={events} />
        </section>
      </div>
    </div>
  );
}
