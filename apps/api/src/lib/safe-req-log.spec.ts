import { headersForLog } from './safe-req-log';

describe('headersForLog', () => {
  it('redactează authorization și cookie', () => {
    const h = headersForLog({
      authorization: 'Bearer secret',
      cookie: 'sid=abc',
      'x-request-id': 'rid-1',
    });
    expect(h.authorization).toBe('[Redacted]');
    expect(h.cookie).toBe('[Redacted]');
    expect(h['x-request-id']).toBe('rid-1');
  });
});
