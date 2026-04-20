import { describe, expect, it, jest } from '@jest/globals';
import {
  deliverCerniqWebhook,
  signCerniqWebhookBody,
} from './webhook-outbound.js';

describe('webhook-outbound', () => {
  it('signCerniqWebhookBody — același secret + corp → aceeași semnătură', () => {
    const s = signCerniqWebhookBody('secret', '{"a":1}');
    expect(s).toHaveLength(64);
    expect(signCerniqWebhookBody('secret', '{"a":1}')).toBe(s);
  });

  it('deliverCerniqWebhook — trimite antetele așteptate', async () => {
    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 202 }));
    await deliverCerniqWebhook(
      'https://partner.example/hook',
      { x: 1 },
      {
        secret: 's'.repeat(32),
        idempotencyKey: 'idem-key-123456',
      },
    );
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://partner.example/hook',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Idempotency-Key': 'idem-key-123456',
          'X-Cerniq-Signature': signCerniqWebhookBody(
            's'.repeat(32),
            '{"x":1}',
          ),
        }),
      }),
    );
    fetchSpy.mockRestore();
  });

  it('respinge idempotency key prea scurt', async () => {
    await expect(
      deliverCerniqWebhook(
        'https://partner.example/hook',
        {},
        { secret: 'x', idempotencyKey: 'short' },
      ),
    ).rejects.toThrow(/8 characters/);
  });
});
