import { spawn } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { prepareContent, resolveContentRoot } from './prepare-content.mjs';

prepareContent();

const astro = spawn('npx', ['astro', 'dev'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

const contentRoot = join(resolveContentRoot(), 'content');
let snapshot = '';
let preparing = false;

function fingerprint(directory) {
  const rows = [];
  const visit = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const child = join(path, entry.name);
      if (entry.isDirectory()) visit(child);
      else if (entry.isFile() && /\.(md|mdx|json|ya?ml|png|jpe?g|webp)$/i.test(entry.name)) {
        const stat = statSync(child);
        rows.push(`${child}:${stat.size}:${stat.mtimeMs}`);
      }
    }
  };
  visit(directory);
  return rows.sort().join('|');
}

snapshot = fingerprint(contentRoot);
const timer = setInterval(() => {
  const next = fingerprint(contentRoot);
  if (next === snapshot || preparing) return;
  snapshot = next;
  preparing = true;
  try {
    prepareContent();
    console.log('Fieldbook content refreshed.');
  } catch (error) {
    console.error(error);
  } finally {
    preparing = false;
  }
}, 800);

function shutdown(signal) {
  clearInterval(timer);
  astro.kill(signal);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
astro.on('exit', (code) => {
  clearInterval(timer);
  process.exit(code ?? 0);
});

