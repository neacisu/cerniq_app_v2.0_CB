import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { SettingsProvider } from './state/settings';
import { LibraryProvider } from './state/library';
import { UiProvider } from './state/ui';
import './styles/tokens.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

const qc = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 5 * 60_000 } } });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <SettingsProvider><LibraryProvider><UiProvider><App /></UiProvider></LibraryProvider></SettingsProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
