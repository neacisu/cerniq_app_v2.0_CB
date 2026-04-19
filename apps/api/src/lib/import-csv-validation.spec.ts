import { validateBusinessRow } from './import-csv-validation.js';

describe('validateBusinessRow', () => {
  it('raportează email invalid', () => {
    const issues = validateBusinessRow(2, { email: 'not-an-email' });
    expect(issues.some((i) => i.code === 'INVALID_EMAIL')).toBe(true);
  });
});
