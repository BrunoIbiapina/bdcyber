"use client";
"use client";
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Card, CardContent, Typography, Button, Tabs, Tab } from '@mui/material';
import { TimeSeriesPoint, TopCategory } from '../types/dashboard';
import { exportToCsv, exportToXlsx } from '../utils/export';

interface DataTableProps {
  timeseries: TimeSeriesPoint[];
  topCategories: TopCategory[];
}

export const DataTable: React.FC<DataTableProps> = ({ timeseries, topCategories }) => {
  const [tab, setTab] = React.useState(0);

  const tsCols: GridColDef[] = [
    { field: 'date', headerName: 'Data', flex: 1 },
    { field: 'value', headerName: 'Valor', flex: 1, type: 'number' },
  ];
  const tcCols: GridColDef[] = [
    { field: 'category', headerName: 'Categoria', flex: 1 },
    { field: 'value', headerName: 'Valor', flex: 1, type: 'number' },
  ];

  const handleExportCsv = () => {
    if (tab === 0) exportToCsv('timeseries.csv', timeseries);
    else exportToCsv('topcategories.csv', topCategories);
  };
  const handleExportXlsx = () => {
    if (tab === 0) exportToXlsx('timeseries.xlsx', 'TimeSeries', timeseries);
    else exportToXlsx('topcategories.xlsx', 'TopCategories', topCategories);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Dados Brutos</Typography>
          <Box>
            <Button onClick={handleExportCsv} variant="outlined" sx={{ mr: 1 }}>Exportar CSV</Button>
            <Button onClick={handleExportXlsx} variant="outlined">Exportar Excel</Button>
          </Box>
        </Box>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Timeseries" />
          <Tab label="Top Categorias" />
        </Tabs>
        <Box mt={2}>
          {tab === 0 ? (
            <DataGrid
              rows={timeseries.map((row, idx) => ({ id: idx, ...row }))}
              columns={tsCols}
              autoHeight
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              disableSelectionOnClick
            />
          ) : (
            <DataGrid
              rows={topCategories.map((row, idx) => ({ id: idx, ...row }))}
              columns={tcCols}
              autoHeight
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              disableSelectionOnClick
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
