import './global.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Cerniq Cognitive Brain v2',
  description: 'Suite CRM + Brain — Nx + Next App Router',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
