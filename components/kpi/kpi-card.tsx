"use client"

import { TrendingUp, TrendingDown, Info } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { formatKpiValue, formatDelta } from "@/lib/format"
import type { KpiData } from "@/lib/metrics"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  data: KpiData
  sparkline: number[]
}

export function KpiCard({ data, sparkline }: KpiCardProps) {
  const delta = formatDelta(data.value, data.previousValue)
  const chartData = sparkline.map((v, i) => ({ i, v }))

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {data.label}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button aria-label={`Info: ${data.label}`} className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                    <Info className="h-3 w-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <span>{data.description}</span>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatKpiValue(data.value, data.format)}
            </div>
            <div className="flex items-center gap-1">
              {delta.isPositive ? (
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  delta.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {delta.value}
              </span>
              <span className="text-xs text-muted-foreground">vs anterior</span>
            </div>
          </div>

          <div className="h-10 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`spark-${data.label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--color-primary)"
                  strokeWidth={1.5}
                  fill={`url(#spark-${data.label})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
