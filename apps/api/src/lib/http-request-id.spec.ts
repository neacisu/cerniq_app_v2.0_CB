import { pickRequestIdHeader } from './http-request-id';

describe('pickRequestIdHeader', () => {
  it('returns undefined for missing, empty string, or whitespace-only', () => {
    expect(pickRequestIdHeader(undefined)).toBeUndefined();
    expect(pickRequestIdHeader('')).toBeUndefined();
    expect(pickRequestIdHeader('   ')).toBeUndefined();
  });

  it('returns the trimmed non-empty string', () => {
    expect(pickRequestIdHeader('  trace-1  ')).toBe('trace-1');
  });

  it('returns the first non-empty entry when header is repeated', () => {
    expect(pickRequestIdHeader(['first', 'second'])).toBe('first');
  });

  it('takes the first segment when proxies merge duplicate headers with a comma', () => {
    expect(pickRequestIdHeader('upstream-abc,downstream-xyz')).toBe('upstream-abc');
  });

  it('skips empty strings in the array', () => {
    expect(pickRequestIdHeader(['', 'valid'])).toBe('valid');
  });

  it('returns undefined when array has no usable strings', () => {
    expect(pickRequestIdHeader([])).toBeUndefined();
    expect(pickRequestIdHeader(['', ''])).toBeUndefined();
  });
});
