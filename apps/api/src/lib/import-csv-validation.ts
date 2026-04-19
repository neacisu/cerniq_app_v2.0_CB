/** Validare business rând import CSV (Batch / Ingest). */

export interface CsvRowIssue {
  readonly row: number;
  readonly field: string;
  readonly code: string;
  readonly message: string;
}

export function validateBusinessRow(
  rowIndex: number,
  row: Record<string, string>
): CsvRowIssue[] {
  const issues: CsvRowIssue[] = [];
  const email = row.email?.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    issues.push({
      row: rowIndex,
      field: 'email',
      code: 'INVALID_EMAIL',
      message: 'Format email invalid',
    });
  }
  const phone = row.phone?.trim();
  if (phone && phone.length < 6) {
    issues.push({
      row: rowIndex,
      field: 'phone',
      code: 'PHONE_TOO_SHORT',
      message: 'Telefon prea scurt',
    });
  }
  return issues;
}
