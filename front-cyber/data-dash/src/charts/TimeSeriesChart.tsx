"use client";
"use client";
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Brush, Area, AreaChart } from 'recharts';
import { TimeSeriesPoint } from '../types/dashboard';

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  start: string;
  end: string;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, start, end }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6">Série Temporal</Typography>
        <Typography variant="body2" color="text.secondary">Período: {start} a {end}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B8D9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00B8D9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip formatter={(value: any) => value.toLocaleString('pt-BR')} />
            <Area type="monotone" dataKey="value" stroke="#00B8D9" fillOpacity={1} fill="url(#colorValue)" />
            <Brush dataKey="date" height={30} stroke="#00B8D9" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
