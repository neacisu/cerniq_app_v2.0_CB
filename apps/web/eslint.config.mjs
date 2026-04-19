import nx from '@nx/eslint-plugin';
import eslintConfigNext from 'eslint-config-next/core-web-vitals';
import baseConfig from '../../eslint.config.mjs';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...eslintConfigNext,
  ...baseConfig,
  ...nx.configs['flat/react-typescript'],
  {
    ignores: ['.next/**/*'],
  },
];

export default config;
