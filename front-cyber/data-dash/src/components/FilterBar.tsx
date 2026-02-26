"use client";
"use client";
import React from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Chip, OutlinedInput, Slider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Filters } from '../types/dashboard';

interface FilterBarProps {
  filters: Filters;
  categoriasDisponiveis: string[];
  onChange: (filters: Filters) => void;
  onBuscar: () => void;
  onLimpar: () => void;
  loading: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  categoriasDisponiveis,
  onChange,
  onBuscar,
  onLimpar,
  loading,
}) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mb={3}>
      <DatePicker
        label="Data Inicial"
        value={filters.start ? dayjs(filters.start) : null}
        onChange={date => onChange({ ...filters, start: date ? dayjs(date) : null })}
        slotProps={{ textField: { size: "small" } }}
      />
      <DatePicker
        label="Data Final"
        value={filters.end ? dayjs(filters.end) : null}
        onChange={date => onChange({ ...filters, end: date ? dayjs(date) : null })}
        slotProps={{ textField: { size: "small" } }}
      />
      <FormControl size="small">
        <InputLabel>Frequência</InputLabel>
        <Select
          value={filters.freq}
          onChange={e => onChange({ ...filters, freq: e.target.value as Filters['freq'] })}
          label="Frequência"
        >
          <MenuItem value="D">Diário</MenuItem>
          <MenuItem value="W">Semanal</MenuItem>
          <MenuItem value="M">Mensal</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Categorias</InputLabel>
        <Select
          multiple
          value={filters.categorias}
          onChange={e => onChange({ ...filters, categorias: e.target.value as string[] })}
          input={<OutlinedInput label="Categorias" />}
          renderValue={selected => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map(value => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {categoriasDisponiveis.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box width={120}>
        <Slider
          value={filters.topN}
          min={5}
          max={20}
          step={1}
          marks={[{ value: 5, label: '5' }, { value: 10, label: '10' }, { value: 15, label: '15' }, { value: 20, label: '20' }]}
          onChange={(_, value) => onChange({ ...filters, topN: value as number })}
        />
      </Box>
      <Button variant="contained" color="primary" onClick={onBuscar} disabled={loading}>Buscar</Button>
      <Button variant="outlined" color="secondary" onClick={onLimpar} disabled={loading}>Limpar</Button>
    </Box>
  );
};
