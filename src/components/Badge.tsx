import { humanize } from "@/lib/format";

const TONES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  denied: "bg-red-100 text-red-800",
  escalated: "bg-purple-100 text-purple-800",
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
  enabled: "bg-emerald-100 text-emerald-800",
  disabled: "bg-neutral-200 text-neutral-600",
};

export function Badge({ value }: { value: string }) {
  const tone = TONES[value] ?? "bg-neutral-200 text-neutral-700";
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${tone}`}>
      {humanize(value)}
    </span>
  );
}
