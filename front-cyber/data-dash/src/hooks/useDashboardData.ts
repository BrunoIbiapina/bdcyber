"use client";
import { useState } from 'react';
import { Filters, TimeSeriesPoint, TopCategory } from '../types/dashboard';
import { getTimeSeries, getTopCategories } from '../services/dashboard';

export function useDashboardData() {
  const [filters, setFilters] = useState<Filters | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeseries, setTimeseries] = useState<TimeSeriesPoint[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);

  const fetchAll = async (newFilters: Filters) => {
    setLoading(true);
    setError(null);
    setFilters(newFilters);
    try {
      const [ts, tc] = await Promise.all([
        getTimeSeries(newFilters),
        getTopCategories(newFilters),
      ]);
      setTimeseries(ts);
      setTopCategories(tc);
    } catch (err: any) {
      setError(err?.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters(null);
    setTimeseries([]);
    setTopCategories([]);
    setError(null);
  };

  return {
    filters,
    loading,
    error,
    timeseries,
    topCategories,
    fetchAll,
    resetFilters,
  };
}
