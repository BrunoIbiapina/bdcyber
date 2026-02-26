"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFilters } from "@/lib/filter-store"
import type { AttackType, Status } from "@/lib/mock-data"

const attackTypes: AttackType[] = ["Malware", "DDoS", "Intrusion"]
const statuses: Status[] = ["Blocked", "Logged", "Ignored"]

const periods = [
  { label: "Todos (2020-2023)", from: "2020-01-01", to: "2023-12-31" },
  { label: "2023", from: "2023-01-01", to: "2023-12-31" },
  { label: "2022", from: "2022-01-01", to: "2022-12-31" },
  { label: "2021", from: "2021-01-01", to: "2021-12-31" },
  { label: "2020", from: "2020-01-01", to: "2020-12-31" },
  { label: "2022-2023", from: "2022-01-01", to: "2023-12-31" },
  { label: "2020-2021", from: "2020-01-01", to: "2021-12-31" },
]

export function GlobalFilters() {
  const filters = useFilters()

  const activeCount =
    (filters.categories?.length || 0) +
    (filters.statuses?.length || 0) +
    (filters.search ? 1 : 0)

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Periodo */}
      <Select
        defaultValue="Todos (2020-2023)"
        onValueChange={(v) => {
          const p = periods.find((p) => p.label === v)
          if (p) filters.setDateRange(new Date(p.from), new Date(p.to))
        }}
      >
        <SelectTrigger className="h-8 w-[160px] text-xs">
          <SelectValue placeholder="Periodo" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((p) => (
            <SelectItem key={p.label} value={p.label} className="text-xs">
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Categoria */}
      <Select
        onValueChange={(v) => {
          if (v === "all") {
            filters.setCategories([])
          } else {
            filters.setCategories([v as AttackType])
          }
        }}
      >
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">Todas</SelectItem>
          {attackTypes.map((t) => (
            <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        onValueChange={(v) => {
          if (v === "all") {
            filters.setStatuses([])
          } else {
            filters.setStatuses([v as Status])
          }
        }}
      >
        <SelectTrigger className="h-8 w-[130px] text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">Todos</SelectItem>
          {statuses.map((s) => (
            <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground"
          onClick={filters.resetFilters}
        >
          <X className="mr-1 h-3 w-3" />
          Limpar ({activeCount})
        </Button>
      )}
    </div>
  )
}
