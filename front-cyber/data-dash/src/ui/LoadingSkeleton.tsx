"use client";
"use client";
import React from 'react';
import { Skeleton, Card, CardContent, Box } from '@mui/material';

export const LoadingSkeleton: React.FC = () => (
  <Box>
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Skeleton variant="text" width={120} height={32} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </CardContent>
    </Card>
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Skeleton variant="text" width={120} height={32} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </CardContent>
    </Card>
    <Card>
      <CardContent>
        <Skeleton variant="text" width={120} height={32} />
        <Skeleton variant="rectangular" width="100%" height={200} />
      </CardContent>
    </Card>
  </Box>
);
