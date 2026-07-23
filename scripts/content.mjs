import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const root = resolve(import.meta.dirname, '..');
const submodule = resolve(root, 'vendor/agentic-engineering');
const command = process.argv[2] ?? 'status';

function git(args, cwd = root, stdio = 'inherit') {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio });
}

function ensureSubmodule() {
  if (!existsSync(resolve(submodule, 'content/en'))) {
    throw new Error('Content submodule is not initialized. Run: npm run content:init');
  }
}

if (command === 'init') {
  git(['submodule', 'update', '--init', '--recursive']);
} else if (command === 'sync') {
  ensureSubmodule();
  git(['fetch', 'origin', 'main', '--tags'], submodule);
  git(['checkout', '--detach', 'origin/main'], submodule);
  console.log(`Content updated to ${git(['rev-parse', '--short', 'HEAD'], submodule, 'pipe').trim()}`);
} else if (command === 'status') {
  ensureSubmodule();
  const sha = git(['rev-parse', 'HEAD'], submodule, 'pipe').trim();
  const branch = git(['branch', '--show-current'], submodule, 'pipe').trim() || '(detached)';
  const dirty = git(['status', '--short'], submodule, 'pipe').trim();
  const tags = git(['tag', '--points-at', 'HEAD'], submodule, 'pipe').trim();
  console.log(`Content directory: ${submodule}`);
  console.log(`Content revision:  ${sha}`);
  console.log(`Content branch:    ${branch}`);
  console.log(`Release tags:      ${tags || '(none)'}`);
  console.log(`Working tree:      ${dirty ? 'dirty' : 'clean'}`);
} else {
  throw new Error(`Unknown content command: ${command}`);
}

