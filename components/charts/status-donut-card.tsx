"use client"

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatusCount } from "@/lib/metrics"

interface StatusDonutCardProps {
  data: StatusCount[]
}

// Semantic: green=Blocked, amber=Logged, gray=Ignored
const STATUS_COLORS: Record<string, string> = {
  Blocked: "var(--color-success)",
  Logged:  "var(--color-warning)",
  Ignored: "var(--color-muted-foreground)",
}

const FALLBACK_COLORS = [
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-muted-foreground)",
]

export function StatusDonutCard({ data }: StatusDonutCardProps) {
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <Card className="border border-border shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: "100ms" }}>
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-semibold text-foreground">Distribuição por Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-5 pb-5">
        <div className="flex items-center gap-4">
          <div className="h-[180px] w-[180px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                  isAnimationActive={true}
                  animationBegin={150}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {data.map((item, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[item.name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--color-popover-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {data.map((item, i) => {
              const color = STATUS_COLORS[item.name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : "0"
              return (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-foreground tabular-nums">{pct}%</span>
                    <p className="text-[10px] text-muted-foreground tabular-nums">{item.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
