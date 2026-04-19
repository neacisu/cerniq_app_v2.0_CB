/// <reference types="node" />
import { describe, expect, it } from '@jest/globals';
import { createRequire } from 'node:module';

/** Necesar pentru încărcarea modulului `.cjs` din același pachet (interoperabilitate CJS/ESM în Jest). */
const require = createRequire(import.meta.url);

type StripFn = (config: unknown) => unknown;
const { stripEslintKeyFromNxNextConfig } = require(
  '../lib/strip-eslint-from-next-config.cjs'
) as { stripEslintKeyFromNxNextConfig: StripFn };

describe('stripEslintKeyFromNxNextConfig', () => {
  it('returnează undefined/null nemodificate', () => {
    expect(stripEslintKeyFromNxNextConfig(undefined)).toBeUndefined();
    expect(stripEslintKeyFromNxNextConfig(null)).toBeNull();
  });

  it('returnează neschimbat dacă nu există cheia eslint', () => {
    const cfg = { reactStrictMode: true };
    expect(stripEslintKeyFromNxNextConfig(cfg)).toBe(cfg);
  });

  it('elimină doar eslint și păstrează celelalte chei (Next 16 + @nx/next)', () => {
    const cfg = {
      eslint: { ignoreDuringBuilds: true },
      nx: {},
      distDir: '.next',
    };
    const out = stripEslintKeyFromNxNextConfig(cfg);
    expect(out).toMatchObject({ nx: {}, distDir: '.next' });
    expect(out).not.toHaveProperty('eslint');
  });

  it('nu mută obiectul original (copie superficială)', () => {
    const cfg = { eslint: { x: 1 }, other: 2 };
    const out = stripEslintKeyFromNxNextConfig(cfg);
    expect(cfg).toHaveProperty('eslint');
    expect(out).toEqual({ other: 2 });
  });

  it('lasă neschimbate valorile non-obiect (edge case)', () => {
    expect(stripEslintKeyFromNxNextConfig('x' as unknown)).toBe('x');
    expect(stripEslintKeyFromNxNextConfig([1] as unknown)).toEqual([1]);
  });

  it('funcționează pe obiecte cu prototip null (fără Object.prototype.hasOwnProperty)', () => {
    const cfg = Object.create(null) as Record<string, unknown>;
    cfg.eslint = { ignoreDuringBuilds: true };
    cfg.distDir = '.next';
    const out = stripEslintKeyFromNxNextConfig(cfg) as Record<string, unknown>;
    expect(out).toEqual({ distDir: '.next' });
    expect('eslint' in out).toBe(false);
  });
});
