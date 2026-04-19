const { composePlugins, withNx } = require('@nx/next');
const {
  stripEslintKeyFromNxNextConfig,
} = require('./lib/strip-eslint-from-next-config.cjs');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

const combined = composePlugins(...plugins)(nextConfig);

// Next.js 16 nu mai acceptă cheia `eslint`; `composePlugins` returnează o funcție async (phase, context).
/**
 * @param {string} phase
 * @param {{ defaultConfig: Record<string, unknown> }} context
 */
module.exports = async function nextConfigAsync(phase, context) {
  const cfg = await combined(phase, context);
  return stripEslintKeyFromNxNextConfig(cfg);
};

