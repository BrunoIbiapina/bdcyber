"use client"

import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CategoryCount } from "@/lib/metrics"

interface TopCategoriesCardProps {
  data: CategoryCount[]
}

// Semantic: Malware=red (via destructive), DDoS=blue, Intrusion=amber
const CATEGORY_COLORS: Record<string, string> = {
  Malware:   "var(--color-destructive)",
  DDoS:      "var(--color-chart-1)",
  Intrusion: "var(--color-chart-3)",
}

export function TopCategoriesCard({ data }: TopCategoriesCardProps) {
  return (
    <Card className="border border-border shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-semibold text-foreground">Top Categorias</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-5 pb-5">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.4} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--color-foreground)" }}
                tickLine={false}
                axisLine={false}
                width={75}
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
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                maxBarSize={28}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {data.map((item, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[item.name] ?? "var(--color-chart-1)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
