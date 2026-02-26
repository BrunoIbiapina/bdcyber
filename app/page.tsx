"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TimeSeriesCard } from "@/components/charts/time-series-card"
import { StatusDonutCard } from "@/components/charts/status-donut-card"
import { TopCategoriesCard } from "@/components/charts/top-categories-card"
import { mockData } from "@/lib/mock-data"
import { getKpis } from "@/lib/kpi-utils"
import { Shield, AlertTriangle, Activity, Server, Filter, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const icons = { Activity, Shield, AlertTriangle, Server }

const kpiAccent: Record<string, { border: string; iconBg: string; iconColor: string; valueCls: string }> = {
  "Total Eventos": {
    border: "border-l-[var(--color-primary)]",
    iconBg: "bg-[color-mix(in_oklch,var(--color-primary)_12%,transparent)]",
    iconColor: "text-[var(--color-primary)]",
    valueCls: "text-foreground",
  },
  "Bloqueados": {
    border: "border-l-[var(--color-success)]",
    iconBg: "bg-[color-mix(in_oklch,var(--color-success)_12%,transparent)]",
    iconColor: "text-[var(--color-success)]",
    valueCls: "text-foreground",
  },
  "Severidade Alta": {
    border: "border-l-[var(--color-destructive)]",
    iconBg: "bg-[color-mix(in_oklch,var(--color-destructive)_12%,transparent)]",
    iconColor: "text-[var(--color-chart-4)]",
    valueCls: "text-foreground",
  },
  "Protocolos": {
    border: "border-l-[var(--color-chart-5)]",
    iconBg: "bg-[color-mix(in_oklch,var(--color-chart-5)_12%,transparent)]",
    iconColor: "text-[var(--color-chart-5)]",
    valueCls: "text-foreground",
  },
}

const attackTypes = ["Todos", "Malware", "DDoS", "Intrusion"]
const statusTypes = ["Todos", "Blocked", "Logged", "Ignored"]

export default function Page() {
  const [attack, setAttack] = useState("Todos")
  const [status, setStatus] = useState("Todos")
  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd] = useState("")

  const hasFilter = attack !== "Todos" || status !== "Todos" || dateStart !== "" || dateEnd !== ""

  const filteredData = mockData.filter((d) => {
    const matchAttack = attack === "Todos" || d.category === attack
    const matchStatus = status === "Todos" || d.status === status
    const matchStart = !dateStart || new Date(d.date) >= new Date(dateStart)
    const matchEnd = !dateEnd || new Date(d.date) <= new Date(dateEnd)
    return matchAttack && matchStatus && matchStart && matchEnd
  })

  const statusCounts = statusTypes.slice(1).map((s) => ({
    name: s,
    value: filteredData.filter((d) => d.status === s).length,
  }))
  const attackCounts = attackTypes.slice(1).map((a) => ({
    name: a,
    value: filteredData.filter((d) => d.category === a).length,
  }))
  const timeSeries = filteredData.reduce((acc, d) => {
    const month = d.date.slice(0, 7)
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const timeSeriesArr = Object.entries(timeSeries).map(([date, value]) => ({ date, value }))

  const clearFilters = () => {
    setAttack("Todos")
    setStatus("Todos")
    setDateStart("")
    setDateEnd("")
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Visão Geral</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Monitoramento de segurança em tempo real
            </p>
          </div>
          <Badge
            variant="outline"
            className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold border-primary/40 text-primary bg-primary/5"
          >
            Banco de Dados Cyber
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Filtros</span>
          </div>

          <div className="flex flex-wrap gap-2 flex-1 min-w-0">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Tipo de Ataque
              </label>
              <select
                className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 min-w-[110px]"
                value={attack}
                onChange={(e) => setAttack(e.target.value)}
              >
                {attackTypes.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </label>
              <select
                className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 min-w-[100px]"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusTypes.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Data Inicial
              </label>
              <input
                type="date"
                className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Data Final
              </label>
              <input
                type="date"
                className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
              />
            </div>
          </div>

          {hasFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="shrink-0 h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Limpar
            </Button>
          )}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {getKpis(filteredData).map((kpi) => {
            const Icon = icons[kpi.icon as keyof typeof icons]
            const accent = kpiAccent[kpi.label] ?? kpiAccent["Total Eventos"]
            return (
              <Card
                key={kpi.label}
                className={cn(
                  "border border-border border-l-4 shadow-sm hover:shadow-md transition-shadow",
                  accent.border
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {kpi.label}
                      </span>
                      <span className={cn("text-2xl font-bold tabular-nums", accent.valueCls)}>
                        {kpi.value}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        accent.iconBg
                      )}
                    >
                      <Icon className={cn("h-5 w-5", accent.iconColor)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-border shadow-sm md:col-span-1">
            <CardContent className="p-0">
              <TimeSeriesCard data={timeSeriesArr} />
            </CardContent>
          </Card>
          <StatusDonutCard data={statusCounts} />
          <TopCategoriesCard data={attackCounts} />
        </div>

      </div>
    </DashboardShell>
  )
}
