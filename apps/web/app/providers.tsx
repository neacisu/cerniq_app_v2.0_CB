'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { initOtelRum } from '../lib/otel-rum';

export function Providers({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [client] = useState(() => new QueryClient());
  useEffect(() => {
    initOtelRum();
  }, []);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
