"use client";
"use client";
"use client";
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TopCategory } from '../types/dashboard';

interface TopCategoriesChartProps {
  data: TopCategory[];
  topN: number;
}

export const TopCategoriesChart: React.FC<TopCategoriesChartProps> = ({ data, topN }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6">Top Categorias</Typography>
        <Typography variant="body2" color="text.secondary">Top {topN}</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="category" />
            <Tooltip formatter={(value: any) => value.toLocaleString('pt-BR')} />
            <Bar dataKey="value" fill="#00B8D9" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
