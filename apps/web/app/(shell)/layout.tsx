import type { ReactNode } from 'react';
import { AppShell } from '../../components/shell/app-shell';
import { getShellVisibleChapterIds } from '../../lib/chapter-permissions-server';

export default function ShellLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const visible = getShellVisibleChapterIds();
  return <AppShell visibleChapterIds={visible}>{children}</AppShell>;
}
