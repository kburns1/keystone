import { AuditTimeline } from "@/components/AuditTimeline";
import { recentAudit } from "@/lib/data";

export default function AuditPage() {
  const events = recentAudit(100);

  return (
    <div>
      <h1 className="text-xl font-semibold">Audit log</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Every mutation across every tool, newest first.
      </p>
      <div className="mt-6">
        <AuditTimeline events={events} showRecord />
      </div>
    </div>
  );
}
