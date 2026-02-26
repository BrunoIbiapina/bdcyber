"use client";
"use client";
import React from 'react';
import { Box, Container } from '@mui/material';
import { useDashboardData } from '../src/hooks/useDashboardData';
import { FilterBar } from '../src/components/FilterBar';
import { TimeSeriesChart } from '../src/charts/TimeSeriesChart';
import { TopCategoriesChart } from '../src/charts/TopCategoriesChart';
import { DataTable } from '../src/table/DataTable';
import { PageHeader } from '../src/ui/PageHeader';
import { ErrorBanner } from '../src/ui/ErrorBanner';
import { LoadingSkeleton } from '../src/ui/LoadingSkeleton';

export default function DashboardPage() {
  const {
    filters,
    loading,
    error,
    timeseries,
    topCategories,
    fetchAll,
    resetFilters,
  } = useDashboardData();

  // Mock categorias disponíveis
  const categoriasDisponiveis = ['Categoria 1', 'Categoria 2', 'Categoria 3'];

  // Mock filtros iniciais
  const [localFilters, setLocalFilters] = React.useState({
    start: new Date(),
    end: new Date(),
    freq: 'D',
    categorias: [],
    topN: 10,
  });

  // Dark mode toggle
  const [darkMode, setDarkMode] = React.useState(true);

  return (
    <Container maxWidth="lg">
      <PageHeader darkMode={darkMode} onToggleTheme={() => setDarkMode(!darkMode)} />
      <FilterBar
        filters={localFilters}
        categoriasDisponiveis={categoriasDisponiveis}
        onChange={setLocalFilters}
        onBuscar={() => fetchAll(localFilters)}
        onLimpar={resetFilters}
        loading={loading}
      />
      {error && <ErrorBanner error={error} onRetry={() => fetchAll(localFilters)} />}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <TimeSeriesChart data={timeseries} start={localFilters.start.toISOString().slice(0, 10)} end={localFilters.end.toISOString().slice(0, 10)} />
          <TopCategoriesChart data={topCategories} topN={localFilters.topN} />
          <DataTable timeseries={timeseries} topCategories={topCategories} />
        </>
      )}
    </Container>
  );
}
