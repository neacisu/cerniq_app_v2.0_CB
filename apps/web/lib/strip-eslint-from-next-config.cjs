'use strict';

/**
 * Next.js 16+ nu acceptă cheia `eslint` în `next.config`; pluginul `@nx/next` o injectează încă
 * pentru compatibilitate cu versiuni anterioare. Eliminăm doar această cheie, păstrând restul
 * config-ului (webpack, nx, experimental, etc.) neatinse.
 *
 * @param {import('next').NextConfig | undefined | null} config
 * @returns {import('next').NextConfig | undefined | null}
 */
function stripEslintKeyFromNxNextConfig(config) {
  if (config === undefined || config === null) {
    return config;
  }
  if (typeof config !== 'object' || Array.isArray(config)) {
    return config;
  }
  // Object.hasOwn (ES2022): evită apelul pe obiecte fără prototip (Object.create(null)) și respectă Sonar S6653.
  if (!Object.hasOwn(config, 'eslint')) {
    return config;
  }
  const next = { ...config };
  delete next.eslint;
  return next;
}

module.exports = { stripEslintKeyFromNxNextConfig };
