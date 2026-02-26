"use client"

// This file is kept as a safe stub to prevent stale cache issues.
// The actual table component is in components/events-table.tsx

export function DataTable({ data, title, onRowClick }: {
  data: Array<Record<string, unknown>>
  title?: string
  onRowClick?: (row: Record<string, unknown>) => void
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{title || "Tabela"} - {data.length} registros</p>
    </div>
  )
}
