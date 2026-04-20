import { describe, expect, it } from '@jest/globals';
import { FLAGSHIP_WORKBENCHES, getFlagshipWorkbench } from './flagship-workbenches';

describe('flagship-workbenches (alias suite-chapter-copy)', () => {
  it('mapă extinsă față de vechiul set de 5 flagship-uri', () => {
    expect(Object.keys(FLAGSHIP_WORKBENCHES).length).toBeGreaterThan(30);
  });

  it('getFlagshipWorkbench returnează copy pentru rută suite', () => {
    expect(getFlagshipWorkbench('/ingest/connectors')).toBeDefined();
    expect(getFlagshipWorkbench('/customers/customer-360')).toBeDefined();
    expect(getFlagshipWorkbench('/unknown/route')).toBeUndefined();
  });
});
