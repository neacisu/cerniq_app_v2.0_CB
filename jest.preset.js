/**
 * Jest + Node 25+: Web Storage e activ implicit; orice cod care atinge `globalThis.localStorage` emite
 * avertismentul „`--localstorage-file` was provided without a valid path” în **fiecare** proces worker.
 * Adăugăm `--no-webstorage` în `NODE_OPTIONS` (moștenit la fork), doar pe Node ≥ 25.
 *
 * În plus: unele IDE-uri injectează `--localstorage-file` invalid în `execArgv` / `NODE_OPTIONS` — le curățăm.
 */
(function sanitizeExecArgvForJestWorkers() {
  const a = process.execArgv;
  for (let i = a.length - 1; i >= 0; i--) {
    const x = a[i];
    if (x === '--localstorage-file') {
      const next = a[i + 1];
      if (next !== undefined && !next.startsWith('-')) {
        a.splice(i, 2);
      } else {
        a.splice(i, 1);
      }
    } else if (typeof x === 'string' && x.startsWith('--localstorage-file=')) {
      const p = x.slice('--localstorage-file='.length);
      if (!p) {
        a.splice(i, 1);
      }
    }
  }
})();

(function sanitizeNodeOptionsLocalStorage() {
  let raw = process.env.NODE_OPTIONS;
  if (raw == null || typeof raw !== 'string' || raw === '') {
    return;
  }
  raw = raw.replace(/\s*--localstorage-file=\S*/g, '');
  raw = raw.replace(/\s*--localstorage-file(?:\s+[^\s-][^\s]*)?/g, '');
  raw = raw.replace(/\s+/g, ' ').trim();
  if (raw) {
    process.env.NODE_OPTIONS = raw;
  } else {
    delete process.env.NODE_OPTIONS;
  }
})();

(function disableWebStorageForJestWorkers() {
  const major = parseInt(process.version.slice(1).split('.')[0], 10);
  if (major < 25 || process.env.NODE_OPTIONS?.includes('--no-webstorage')) {
    return;
  }
  const cur = process.env.NODE_OPTIONS || '';
  process.env.NODE_OPTIONS = `${cur} --no-webstorage`.trim();
})();

const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
};