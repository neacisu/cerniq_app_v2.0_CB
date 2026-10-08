export function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",;\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
export function toCsv(rows: unknown[][]): string {
  return '﻿' + rows.map((r) => r.map(csvCell).join(';')).join('\r\n');
}
export function download(filename: string, content: string, mime: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.append(ta); ta.select();
    try { return document.execCommand('copy'); } finally { ta.remove(); }
  }
}
