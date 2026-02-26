"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { TimeSeriesCard } from "@/components/charts/time-series-card"
import { StatusDonutCard } from "@/components/charts/status-donut-card"
import { TopCategoriesCard } from "@/components/charts/top-categories-card"
import { TOTAL_EVENTS, realAggregations, mockData } from "@/lib/mock-data"
import { getKpis } from "@/lib/kpi-utils"
import { Shield, AlertTriangle, Activity, Server } from "lucide-react"
import { useState } from "react"


const icons = { Activity, Shield, AlertTriangle, Server }

const attackTypes = ["Todos", "Malware", "DDoS", "Intrusion"]
const statusTypes = ["Todos", "Blocked", "Logged", "Ignored"]

export default function Page() {
  const [attack, setAttack] = useState("Todos")
  const [status, setStatus] = useState("Todos")
  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd] = useState("")

  // Filtro simples nos dados mockados
  const filteredData = mockData.filter((d) => {
    const matchAttack = attack === "Todos" || d.category === attack
    const matchStatus = status === "Todos" || d.status === status
    const matchStart = !dateStart || new Date(d.date) >= new Date(dateStart)
    const matchEnd = !dateEnd || new Date(d.date) <= new Date(dateEnd)
    return matchAttack && matchStatus && matchStart && matchEnd
  })

  // Dados para gráficos
  const statusCounts = statusTypes.slice(1).map((s) => ({ name: s, value: filteredData.filter(d => d.status === s).length }))
  const attackCounts = attackTypes.slice(1).map((a) => ({ name: a, value: filteredData.filter(d => d.category === a).length }))
  // Exemplo de timeseries: conta eventos por mês
  const timeSeries = filteredData.reduce((acc, d) => {
    const month = d.date.slice(0, 7)
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const timeSeriesArr = Object.entries(timeSeries).map(([date, value]) => ({ date, value }))

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8 px-2 md:px-0 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-1">Visão Geral</h1>
            <p className="text-base text-muted-foreground">Monitoramento de segurança em tempo real com insights visuais, filtros e gráficos profissionais.</p>
          </div>
          <Badge variant="outline" className="text-base px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md border-none">Banco de Dados Cyber</Badge>
        </div>

        {/* Filtros modernos */}
        <div className="flex flex-wrap gap-4 items-end bg-muted/40 rounded-xl p-4 shadow-sm mb-4">
          <div>
            <label className="block text-xs font-medium mb-1">Tipo de Ataque</label>
            <select className="input" value={attack} onChange={e => setAttack(e.target.value)}>
              {attackTypes.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Status</label>
            <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
              {statusTypes.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Data Inicial</label>
            <input type="date" className="input" value={dateStart} onChange={e => setDateStart(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Data Final</label>
            <input type="date" className="input" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
          </div>
          <Button variant="outline" onClick={() => { setAttack("Todos"); setStatus("Todos"); setDateStart(""); setDateEnd(""); }}>Limpar Filtros</Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          {getKpis(filteredData).map((kpi) => {
            const Icon = icons[kpi.icon as keyof typeof icons]
            // Lógica de cor dinâmica do gradiente
            let gradient = "from-white via-blue-50 to-cyan-50";
            if (typeof kpi.value === "number") {
              if (kpi.value > 20000) gradient = "from-blue-400 via-cyan-400 to-cyan-200";
              else if (kpi.value > 10000) gradient = "from-blue-200 via-cyan-200 to-cyan-100";
              else if (kpi.value > 0) gradient = "from-blue-50 via-cyan-50 to-white";
            }
            return (
              <Card key={kpi.label} className={`border-none shadow-lg bg-gradient-to-br ${gradient} dark:from-[#181c20] dark:via-[#23272e] dark:to-[#1a1d22]`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold text-muted-foreground flex items-center gap-2">
                    <span>{kpi.label}</span>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold text-foreground drop-shadow-sm">{kpi.value}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Gráficos profissionais em grid responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-md col-span-1">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">Eventos ao Longo do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] w-full">
                <TimeSeriesCard data={timeSeriesArr} />
              </div>
            </CardContent>
          </Card>
          <StatusDonutCard data={statusCounts} />
          <TopCategoriesCard data={attackCounts} />
        </div>
        {/* Os cards antigos de distribuição foram substituídos por gráficos profissionais acima */}
      </div>
    </DashboardShell>
  )
}
