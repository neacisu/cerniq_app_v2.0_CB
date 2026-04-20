import { parseTraceparent } from './w3c-traceparent';

describe('parseTraceparent', () => {
  it('parses valid version 00', () => {
    const tp =
      '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';
    expect(parseTraceparent(tp)).toEqual({
      traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
      parentSpanId: '00f067aa0ba902b7',
    });
  });

  it('returns undefined for invalid', () => {
    expect(parseTraceparent(undefined)).toBeUndefined();
    expect(parseTraceparent('')).toBeUndefined();
    expect(parseTraceparent('01-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01')).toBeUndefined();
    expect(parseTraceparent('garbage')).toBeUndefined();
  });

  it('uses first value when array', () => {
    const tp =
      '00-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbbbbbb-00';
    expect(parseTraceparent([tp, '00-cccccccccccccccccccccccccccccccc-dddddddddddddddd-00'])).toEqual({
      traceId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      parentSpanId: 'bbbbbbbbbbbbbbbb',
    });
  });
});
