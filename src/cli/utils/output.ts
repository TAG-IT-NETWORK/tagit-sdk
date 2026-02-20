export function formatTable(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "(no data)";

  const keys = Object.keys(rows[0]!);
  const widths = keys.map((k) =>
    Math.max(k.length, ...rows.map((r) => String(r[k] ?? "").length)),
  );

  const header = keys.map((k, i) => k.padEnd(widths[i]!)).join("  ");
  const separator = widths.map((w) => "-".repeat(w)).join("  ");
  const body = rows
    .map((r) => keys.map((k, i) => String(r[k] ?? "").padEnd(widths[i]!)).join("  "))
    .join("\n");

  return `${header}\n${separator}\n${body}`;
}

export function formatJson(data: unknown): string {
  return JSON.stringify(data, replacer, 2);
}

function replacer(_key: string, value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  return value;
}
