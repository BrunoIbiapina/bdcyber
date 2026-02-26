"use client"

import { useMemo } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { mockData } from "@/lib/mock-data"
import { getDataQuality } from "@/lib/metrics"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle, XCircle, Database, TrendingUp } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"

const healthConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  Bom: { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  Alerta: { color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", icon: AlertCircle },
  Critico: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
}

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(var(--card-foreground))",
}

export default function QualidadePage() {
  const quality = useMemo(() => getDataQuality(mockData), [])

  const totalIssues = quality.reduce((sum, q) => sum + q.missing + q.duplicates + q.outliers, 0)
  const healthyCols = quality.filter((q) => q.health === "Bom").length
  const healthScore = Math.round((healthyCols / quality.length) * 100)

  const chartData = quality
    .filter((q) => q.missing + q.duplicates + q.outliers > 0)
    .map((q) => ({ column: q.column, Faltantes: q.missing, Duplicados: q.duplicates, Outliers: q.outliers }))

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Qualidade dos Dados</h1>
          <p className="text-sm text-muted-foreground">Monitoramento de integridade e consistencia</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Registros</p>
                  <p className="text-2xl font-bold text-foreground">{mockData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Score de Saude</p>
                  <p className="text-2xl font-bold text-foreground">{healthScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Problemas</p>
                  <p className="text-2xl font-bold text-foreground">{totalIssues}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Problemas por Coluna</CardTitle>
              <CardDescription className="text-xs">Dados faltantes, duplicados e outliers</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="column" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" angle={-35} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={35} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="Faltantes" fill="hsl(220,70%,55%)" radius={[2, 2, 0, 0]} barSize={14} />
                  <Bar dataKey="Duplicados" fill="hsl(160,60%,45%)" radius={[2, 2, 0, 0]} barSize={14} />
                  <Bar dataKey="Outliers" fill="hsl(350,65%,50%)" radius={[2, 2, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Saude por Coluna</CardTitle>
              <CardDescription className="text-xs">Status detalhado de cada coluna</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs h-9">Coluna</TableHead>
                      <TableHead className="text-xs h-9 text-right">Faltantes</TableHead>
                      <TableHead className="text-xs h-9 text-right">Duplicados</TableHead>
                      <TableHead className="text-xs h-9 text-right">Outliers</TableHead>
                      <TableHead className="text-xs h-9">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quality.map((q) => {
                      const cfg = healthConfig[q.health] || healthConfig.Bom
                      const Icon = cfg.icon
                      return (
                        <TableRow key={q.column} className="border-border/30">
                          <TableCell className="py-2 text-xs font-mono font-medium">{q.column}</TableCell>
                          <TableCell className="py-2 text-xs text-right tabular-nums">{q.missing}</TableCell>
                          <TableCell className="py-2 text-xs text-right tabular-nums">{q.duplicates}</TableCell>
                          <TableCell className="py-2 text-xs text-right tabular-nums">{q.outliers}</TableCell>
                          <TableCell className="py-2">
                            <Badge variant="outline" className={cn("text-[10px] gap-1", cfg.color)}>
                              <Icon className="h-3 w-3" />
                              {q.health}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
