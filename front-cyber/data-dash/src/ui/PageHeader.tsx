"use client";
"use client";
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Sun, Moon } from 'lucide-react';

interface PageHeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ darkMode, onToggleTheme }) => (
  <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4 }}>
    <Toolbar>
      <Typography variant="h5" fontWeight={700} sx={{ flexGrow: 1 }}>
        DataDash
      </Typography>
      <Box>
        <IconButton onClick={onToggleTheme} color="inherit">
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </IconButton>
      </Box>
    </Toolbar>
  </AppBar>
);
