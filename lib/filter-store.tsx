"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Filters, AttackType, Status, Severity } from "./mock-data"

interface FilterState extends Filters {
  setDateRange: (from: Date, to: Date) => void
  setCategories: (categories: AttackType[]) => void
  setStatuses: (statuses: Status[]) => void
  setSeverities: (severities: Severity[]) => void
  setSearch: (search: string) => void
  resetFilters: () => void
}

const defaultFilters: Filters = {
  dateRange: { from: new Date("2020-01-01"), to: new Date("2023-12-31") },
  categories: [],
  statuses: [],
  severities: [],
  search: "",
}

const FilterContext = createContext<FilterState | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters)

  const setDateRange = useCallback((from: Date, to: Date) => {
    setFilters((prev) => ({ ...prev, dateRange: { from, to } }))
  }, [])

  const setCategories = useCallback((categories: AttackType[]) => {
    setFilters((prev) => ({ ...prev, categories }))
  }, [])

  const setStatuses = useCallback((statuses: Status[]) => {
    setFilters((prev) => ({ ...prev, statuses }))
  }, [])

  const setSeverities = useCallback((severities: Severity[]) => {
    setFilters((prev) => ({ ...prev, severities }))
  }, [])

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  return (
    <FilterContext.Provider
      value={{
        ...filters,
        setDateRange,
        setCategories,
        setStatuses,
        setSeverities,
        setSearch,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters(): FilterState {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error("useFilters must be used within FilterProvider")
  return ctx
}
