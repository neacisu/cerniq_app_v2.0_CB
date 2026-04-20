import './global.css';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { Providers } from './providers';

export const metadata = {
  title: 'Cerniq Cognitive Brain v2',
  description: 'Suite CRM + Brain — Nx + Next App Router',
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

const THEME_BOOT = `(function(){try{var k='cerniq-theme';var t=localStorage.getItem(k);var dark=t!=='light'&&(t==='dark'||!t&&window.matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',dark);}catch(e){}})();`;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body>
        <Script id="cerniq-theme-boot" strategy="beforeInteractive">
          {THEME_BOOT}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
