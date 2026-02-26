import type { DataRecord } from "./mock-data"
import { TOTAL_EVENTS, realAggregations } from "./mock-data"

export function getKpis(filtered: DataRecord[]) {
  return [
    {
      label: "Total Eventos",
      value: filtered.length,
      icon: "Activity",
      color: "text-primary",
    },
    {
      label: "Bloqueados",
      value: filtered.filter((d) => d.status === "Blocked").length,
      icon: "Shield",
      color: "text-success",
    },
    {
      label: "Severidade Alta",
      value: filtered.filter((d) => d.severity === "High").length,
      icon: "AlertTriangle",
      color: "text-destructive",
    },
    {
      label: "Protocolos",
      value: "TCP/UDP/ICMP",
      icon: "Server",
      color: "text-chart-2",
    },
  ]
}
