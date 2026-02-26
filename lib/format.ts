// Pure string formatters - no Intl to avoid hydration mismatch
export function formatNumber(value: number): string {
  const rounded = Math.round(value)
  const str = Math.abs(rounded).toString()
  const parts: string[] = []
  for (let i = str.length; i > 0; i -= 3) {
    parts.unshift(str.slice(Math.max(0, i - 3), i))
  }
  return (rounded < 0 ? "-" : "") + parts.join(".")
}

export function formatCurrency(value: number): string {
  return `R$ ${formatNumber(value)}`
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatScore(value: number): string {
  return value.toFixed(1)
}

export function formatDelta(current: number, previous: number): { value: string; isPositive: boolean } {
  if (previous === 0) return { value: "+0%", isPositive: true }
  const delta = ((current - previous) / previous) * 100
  return {
    value: `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`,
    isPositive: delta >= 0,
  }
}

const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]

export function formatDate(dateStr: string): string {
  // Parse ISO string directly to avoid Date object timezone issues
  const parts = dateStr.split("T")[0].split("-")
  const year = parts[0]
  const month = months[parseInt(parts[1], 10) - 1]
  const day = parts[2]
  return `${day} ${month} ${year}`
}

export function formatDateTime(dateStr: string): string {
  const [datePart, timePart] = dateStr.split("T")
  const parts = datePart.split("-")
  const year = parts[0]
  const month = months[parseInt(parts[1], 10) - 1]
  const day = parts[2]
  const time = (timePart || "00:00").split(".")[0].slice(0, 5)
  return `${day} ${month} ${year}, ${time}`
}

export function formatKpiValue(value: number, format: "number" | "currency" | "percent" | "score"): string {
  switch (format) {
    case "number":
      return formatNumber(value)
    case "currency":
      return formatCurrency(value)
    case "percent":
      return formatPercent(value)
    case "score":
      return formatScore(value)
  }
}
