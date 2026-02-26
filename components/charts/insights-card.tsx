"use client"

import { AlertTriangle, TrendingUp, Shield, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Insight {
  icon: React.ReactNode
  title: string
  text: string
  severity: "info" | "warning" | "critical"
}

const insights: Insight[] = [
  {
    icon: <AlertTriangle className="h-4 w-4" />,
    title: "40K Eventos",
    text: "Dataset com 40.000 eventos de seguranca de rede registrados entre 2020-2023.",
    severity: "critical",
  },
  {
    icon: <TrendingUp className="h-4 w-4" />,
    title: "Distribuicao Uniforme",
    text: "Ataques DDoS (13.4K), Malware (13.3K) e Intrusion (13.3K) distribuidos uniformemente.",
    severity: "info",
  },
  {
    icon: <Shield className="h-4 w-4" />,
    title: "Taxa de Bloqueio",
    text: "33.8% dos eventos foram bloqueados (13.529 de 40.000).",
    severity: "info",
  },
  {
    icon: <Zap className="h-4 w-4" />,
    title: "IoC Detectados",
    text: "50% dos eventos possuem indicadores de comprometimento (IoC Detected).",
    severity: "warning",
  },
]

const severityStyles = {
  info: "bg-primary/10 text-primary border-primary/20",
  warning: "bg-warning/10 text-warning-foreground border-warning/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
}

export function InsightsCard() {
  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">Insights</CardTitle>
          <Badge variant="secondary" className="text-[10px]">Auto</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-lg border p-3 ${severityStyles[insight.severity]}`}
          >
            <div className="mt-0.5 shrink-0">{insight.icon}</div>
            <div>
              <p className="text-xs font-semibold">{insight.title}</p>
              <p className="text-xs opacity-80 leading-relaxed">{insight.text}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
