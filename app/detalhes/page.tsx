"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { mockData, type DataRecord } from "@/lib/mock-data"
import { X, Shield, Globe, Server, User, Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

function fmtDate(iso: string): string {
  const [datePart, timePart] = iso.split("T")
  const [y, m, day] = datePart.split("-")
  const months = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"]
  const time = (timePart || "00:00").split(".")[0].slice(0, 5)
  return `${day} ${months[parseInt(m, 10) - 1]} ${y}, ${time}`
}

const severityClass: Record<string, string> = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  High: "bg-destructive/10 text-destructive",
}

export default function DetalhesPage() {
  const [selected, setSelected] = useState<DataRecord | null>(null)

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Detalhes</h1>
          <p className="text-sm text-muted-foreground">Todos os eventos de seguranca</p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="border-border/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{mockData.length} Eventos</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs h-9">ID</TableHead>
                      <TableHead className="text-xs h-9">Data</TableHead>
                      <TableHead className="text-xs h-9">Categoria</TableHead>
                      <TableHead className="text-xs h-9">Severidade</TableHead>
                      <TableHead className="text-xs h-9">Status</TableHead>
                      <TableHead className="text-xs h-9">IP Origem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.map((row) => (
                      <TableRow
                        key={row.id}
                        className={cn("cursor-pointer border-border/30", selected?.id === row.id && "bg-accent")}
                        onClick={() => setSelected(row)}
                      >
                        <TableCell className="py-2 text-xs font-mono">{row.id}</TableCell>
                        <TableCell className="py-2 text-xs">{fmtDate(row.date)}</TableCell>
                        <TableCell className="py-2 text-xs">{row.category}</TableCell>
                        <TableCell className="py-2">
                          <Badge variant="outline" className={cn("text-[10px]", severityClass[row.severity])}>{row.severity}</Badge>
                        </TableCell>
                        <TableCell className="py-2 text-xs">{row.status}</TableCell>
                        <TableCell className="py-2 text-xs font-mono">{row.sourceIp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {selected ? (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Evento {selected.id}</CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelected(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-xs", severityClass[selected.severity])}>{selected.severity}</Badge>
                    <Badge variant="outline" className="text-xs">{selected.status}</Badge>
                    <Badge variant="outline" className="text-xs">{selected.category}</Badge>
                  </div>
                  <InfoRow icon={Clock} label="Data/Hora" value={fmtDate(selected.date)} />
                  <InfoRow icon={Shield} label="Protocolo" value={selected.protocol} />
                  <InfoRow icon={Globe} label="IP Origem" value={selected.sourceIp} mono />
                  <InfoRow icon={Server} label="IP Destino" value={selected.destIp} mono />
                  <InfoRow icon={User} label="Usuario" value={selected.user} />
                  <InfoRow icon={AlertTriangle} label="Score" value={selected.anomalyScore.toFixed(1)} />
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Segmento</p>
                    <p className="text-sm font-medium text-foreground">{selected.segment}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Geolocalizacao</p>
                    <p className="text-sm font-medium text-foreground">{selected.geoLocation || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/50 flex items-center justify-center">
              <CardContent className="py-12 text-center">
                <Shield className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Clique em um evento para ver detalhes</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}

function InfoRow({ icon: Icon, label, value, mono }: { icon: React.ElementType; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("text-sm font-medium text-foreground truncate", mono && "font-mono")}>{value}</p>
      </div>
    </div>
  )
}
