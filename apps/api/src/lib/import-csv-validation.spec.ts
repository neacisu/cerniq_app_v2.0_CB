import { validateBusinessRow } from './import-csv-validation.js';

describe('validateBusinessRow', () => {
  it('raportează email invalid', () => {
    const issues = validateBusinessRow(2, { email: 'not-an-email' });
    expect(issues.some((i) => i.code === 'INVALID_EMAIL')).toBe(true);
  });

  it('acceptă email gol (mapare opțională pe rând)', () => {
    expect(validateBusinessRow(1, { email: '' })).toHaveLength(0);
  });

  it('raportează telefon prea scurt când prezent', () => {
    const issues = validateBusinessRow(3, { phone: '12' });
    expect(issues.some((i) => i.code === 'PHONE_TOO_SHORT')).toBe(true);
  });

  it('raportează company prea scurtă', () => {
    const issues = validateBusinessRow(4, { company: 'x' });
    expect(issues.some((i) => i.code === 'COMPANY_NAME_TOO_SHORT')).toBe(true);
  });
});
