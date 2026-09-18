// Display helpers: stored values are machine-readable (snake_case option
// keys, camelCase field keys, integer cents); the UI never shows them raw.

export function humanize(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatCurrencyCents(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
}

export function booleanLabel(value: boolean): string {
  return value ? "Enabled" : "Disabled";
}
