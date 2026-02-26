"use client";
"use client";
import React from 'react';
import { Alert, Collapse, Button, Box } from '@mui/material';

interface ErrorBannerProps {
  error: string | null;
  details?: string;
  onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, details, onRetry }) => {
  const [open, setOpen] = React.useState(true);
  if (!error) return null;
  return (
    <Box mb={2}>
      <Alert severity="error" action={onRetry && <Button color="inherit" size="small" onClick={onRetry}>Tentar novamente</Button>}>
        {error}
        {details && (
          <Box mt={1}>
            <Button size="small" onClick={() => setOpen(!open)}>{open ? 'Ver menos' : 'Ver mais'}</Button>
            <Collapse in={open}><Box mt={1} fontSize={12} color="text.secondary">{details}</Box></Collapse>
          </Box>
        )}
      </Alert>
    </Box>
  );
};
