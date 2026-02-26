"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowUpDown, Download, ChevronLeft, ChevronRight, Search } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DataRecord } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// Pure string date format - NEVER uses new Date()
function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("T")[0].split("-")
  const mo = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"]
  return `${d} ${mo[parseInt(m, 10) - 1]} ${y}`
}

const statusColors: Record<string, string> = {
  Blocked: "bg-primary/10 text-primary border-primary/20",
  Logged: "bg-chart-2/10 text-foreground border-chart-2/20",
  Ignored: "bg-muted text-muted-foreground border-border",
}

const severityColors: Record<string, string> = {
  Low: "bg-muted text-muted-foreground border-border",
  Medium: "bg-warning/10 text-warning-foreground border-warning/20",
  High: "bg-destructive/10 text-destructive border-destructive/20",
}

const columns: ColumnDef<DataRecord>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" className="h-8 -ml-3 text-xs" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" className="h-8 -ml-3 text-xs" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Data <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const v = row.getValue("date") as string
      return <span className="text-xs">{fmtDate(v)}</span>
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => <span className="text-xs font-medium">{row.getValue("category")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.getValue("status") as string
      return <Badge variant="outline" className={cn("text-[10px] font-medium", statusColors[s])}>{s}</Badge>
    },
  },
  {
    accessorKey: "severity",
    header: "Severidade",
    cell: ({ row }) => {
      const s = row.getValue("severity") as string
      return <Badge variant="outline" className={cn("text-[10px] font-medium", severityColors[s])}>{s}</Badge>
    },
  },
  {
    accessorKey: "anomalyScore",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" className="h-8 -ml-3 text-xs" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Score <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const score = row.getValue("anomalyScore") as number
      return <span className={cn("text-xs tabular-nums font-medium", score > 70 ? "text-destructive" : score > 40 ? "text-warning-foreground" : "text-muted-foreground")}>{score.toFixed(1)}</span>
    },
  },
  {
    accessorKey: "sourceIp",
    header: "IP Origem",
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.getValue("sourceIp")}</span>,
  },
]

function exportCsv(data: DataRecord[]) {
  const header = "ID,Data,Categoria,Status,Severidade,Score,IP Origem\n"
  const rows = data.map((d) => [d.id, d.date, d.category, d.status, d.severity, d.anomalyScore, d.sourceIp].join(",")).join("\n")
  const blob = new Blob([header + rows], { type: "text/csv" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = "datadash-export.csv"
  a.click()
}

interface EventsTableProps {
  data: DataRecord[]
  title?: string
  onRowClick?: (record: DataRecord) => void
}

export function EventsTable({ data, title = "Ultimos Registros", onRowClick }: EventsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Filtrar..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="h-8 w-[180px] pl-8 text-xs" />
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => exportCsv(data)}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-border/50 hover:bg-transparent">
                  {hg.headers.map((h) => (
                    <TableHead key={h.id} className="text-xs text-muted-foreground h-9">
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className={cn("border-border/30 transition-colors", onRowClick && "cursor-pointer hover:bg-accent/50")} onClick={() => onRowClick?.(row.original)}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">Nenhum registro encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-muted-foreground">{table.getFilteredRowModel().rows.length} registro(s)</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Pagina anterior">
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2 text-xs tabular-nums text-muted-foreground">{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Proxima pagina">
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
