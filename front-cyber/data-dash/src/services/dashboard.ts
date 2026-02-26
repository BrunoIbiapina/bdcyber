import api from '../lib/api';
import { Filters, TimeSeriesPoint, TopCategory } from '../types/dashboard';

export async function getTimeSeries(filters: Filters): Promise<TimeSeriesPoint[]> {
  const params: any = {
    start: filters.start.toISOString().slice(0, 10),
    end: filters.end.toISOString().slice(0, 10),
    freq: filters.freq,
  };
  if (filters.categorias && filters.categorias.length > 0) {
    // categorias como string separada por vírgula
    params.categorias = filters.categorias.join(',');
  }
  const { data } = await api.get('/timeseries', { params });
  return data;
}

export async function getTopCategories(filters: Filters): Promise<TopCategory[]> {
  const params: any = {
    start: filters.start.toISOString().slice(0, 10),
    end: filters.end.toISOString().slice(0, 10),
    n: filters.topN,
  };
  if (filters.categorias && filters.categorias.length > 0) {
    params.categorias = filters.categorias.join(',');
  }
  const { data } = await api.get('/top-categories', { params });
  return data;
}
