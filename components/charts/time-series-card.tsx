"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TimeSeriesPoint } from "@/lib/metrics"

interface TimeSeriesCardProps {
  data: TimeSeriesPoint[]
}

const seriesConfig = [
  { key: "Malware", color: "var(--color-chart-1)" },
  { key: "DDoS", color: "var(--color-chart-2)" },
  { key: "Intrusion", color: "var(--color-chart-3)" },
]

export function TimeSeriesCard({ data }: TimeSeriesCardProps) {
  return (
    <Card className="border border-border shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-semibold text-foreground">Eventos ao Longo do Tempo</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-5 pb-5">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                {seriesConfig.map((s) => (
                  <linearGradient key={s.key} id={`gradient-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) => {
                  const [y, m] = v.split("-")
                  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
                  const month = months[parseInt(m) - 1] || ""
                  return parseInt(m) === 1 ? `${month} ${y.slice(2)}` : month
                }}
                interval={5}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                width={35}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--color-popover-foreground)",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", color: "var(--color-muted-foreground)" }}
              />
              {seriesConfig.map((s, i) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  strokeWidth={2}
                  fill={`url(#gradient-${s.key})`}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationBegin={i * 150}
                  animationEasing="ease-out"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
