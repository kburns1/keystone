import { formatCurrencyCents } from "@/lib/format";
import type { FieldDef } from "@/lib/types";
import { Badge } from "./Badge";

export function FieldValue({
  field,
  value,
  isStatus = false,
}: {
  field: FieldDef;
  value: unknown;
  isStatus?: boolean;
}) {
  if (value == null || value === "") return <span className="text-neutral-400">—</span>;

  if (field.type === "boolean") {
    return <Badge value={value === true || value === "true" ? "enabled" : "disabled"} />;
  }

  if (isStatus || field.type === "select") {
    return <Badge value={String(value)} />;
  }

  switch (field.type) {
    case "currency":
      return (
        <span className="tabular-nums">{formatCurrencyCents(Number(value))}</span>
      );
    case "number":
      return <span className="tabular-nums">{String(value)}</span>;
    case "date":
      return <span>{String(value)}</span>;
    case "textarea":
      return <span className="whitespace-pre-wrap">{String(value)}</span>;
    default:
      return <span>{String(value)}</span>;
  }
}
