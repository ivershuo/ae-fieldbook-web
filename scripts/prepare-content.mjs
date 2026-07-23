import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';

const siteRoot = resolve(import.meta.dirname, '..');
const docsRoot = join(siteRoot, 'src/content/docs');
const i18nRoot = join(siteRoot, 'src/content/i18n');
const generatedRoot = join(siteRoot, '.generated');
const versionsConfig = JSON.parse(readFileSync(join(siteRoot, 'versions.json'), 'utf8'));
let orderByPath = new Map([['index.md', 0]]);
let navigationData;

function runGit(args, cwd, encoding = 'utf8') {
  return execFileSync('git', args, { cwd, encoding, stdio: ['ignore', 'pipe', 'pipe'] });
}

function configureNavigation(contentRoot) {
  const contentNavigation = join(contentRoot, 'content/navigation.json');
  const navigationPath = existsSync(contentNavigation)
    ? contentNavigation
    : join(siteRoot, 'navigation.json');
  const navigation = JSON.parse(readFileSync(navigationPath, 'utf8'));
  navigationData = navigation;
  orderByPath = new Map([['index.md', 0]]);
  navigation.sections.forEach((section, sectionIndex) => {
    const sectionBase = (sectionIndex + 1) * 100;
    orderByPath.set(`${section.slug}/index.md`, sectionBase);
    section.items.forEach((item, itemIndex) => {
      orderByPath.set(`${section.slug}/${item}.md`, sectionBase + itemIndex + 1);
    });
  });
}

export function resolveContentRoot() {
  const configured = process.env.FIELDBOOK_CONTENT_DIR;
  const candidates = [
    configured ? resolve(siteRoot, configured) : undefined,
    join(siteRoot, 'vendor/agentic-engineering'),
    resolve(siteRoot, '..'),
  ].filter(Boolean);

  const found = candidates.find((candidate) => existsSync(join(candidate, 'content/en')));
  if (!found) {
    throw new Error(
      'No Fieldbook content found. Run `npm run content:init` or set FIELDBOOK_CONTENT_DIR.',
    );
  }
  return found;
}

function listMarkdownFiles(contentRoot, ref) {
  if (!ref) {
    const files = [];
    const visit = (directory) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) visit(path);
        else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(relative(contentRoot, path).split(sep).join('/'));
        }
      }
    };
    visit(join(contentRoot, 'content'));
    return files;
  }

  return runGit(['ls-tree', '-r', '--name-only', ref, '--', 'content'], contentRoot)
    .trim()
    .split('\n')
    .filter((file) => file.endsWith('.md'));
}

function readSource(contentRoot, path, ref) {
  if (ref) return runGit(['show', `${ref}:${path}`], contentRoot);
  return readFileSync(join(contentRoot, path), 'utf8');
}

function sidebarOrder(pathWithinLanguage) {
  return orderByPath.get(pathWithinLanguage) ?? 9000;
}

function removeDuplicateTitle(body) {
  return body.replace(
    /^(\s*(?:<!--[\s\S]*?-->\s*)*)#\s+[^\n]+\n+/,
    '$1',
  );
}

function buildFrontmatter(data, pathWithinLanguage, options) {
  const result = {
    title: data.title,
    description: data.description,
    lastUpdated: false,
    sidebar: {
      order: sidebarOrder(pathWithinLanguage),
      label: data.title,
    },
  };

  if (pathWithinLanguage === 'index.md' && !options.version) {
    result.template = 'splash';
    result.hero = {
      title: data.title,
      tagline: data.description,
      actions: [
        {
          text: options.lang === 'zh-cn' ? '开始阅读' : 'Start reading',
          link: `/${options.lang}/foundations/what-makes-a-system-ai-native/`,
          icon: 'right-arrow',
          variant: 'primary',
        },
      ],
    };
  }

  if (options.version) {
    result.sidebar.hidden = true;
  }

  return result;
}

function writeDocument(destination, source, pathWithinLanguage, options) {
  const parsed = matter(source);
  const frontmatter = buildFrontmatter(parsed.data, pathWithinLanguage, options);
  let body = removeDuplicateTitle(parsed.content);

  if (options.version) {
    const label = options.version.label;
    const currentPath =
      pathWithinLanguage === 'index.md'
        ? ''
        : pathWithinLanguage.replace(/\.md$/, '/');
    body = `> **Historical edition ${label}.** You are reading a frozen Fieldbook release. [Open the current page](/${options.lang}/${currentPath}).\n\n${body}`;
  }

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, matter.stringify(body.trimStart(), frontmatter));
}

function materialize(contentRoot, ref, version) {
  const files = listMarkdownFiles(contentRoot, ref);
  for (const sourcePath of files) {
    const match = sourcePath.match(/^content\/(en|zh-cn)\/(.+\.md)$/);
    if (!match) continue;
    const [, lang, pathWithinLanguage] = match;
    const destination = version
      ? join(docsRoot, lang, 'v', version.slug, pathWithinLanguage)
      : join(docsRoot, lang, pathWithinLanguage);
    writeDocument(
      destination,
      readSource(contentRoot, sourcePath, ref),
      pathWithinLanguage,
      { lang, version },
    );
  }
}

function copyAssets(contentRoot) {
  const source = join(contentRoot, 'content/assets');
  if (existsSync(source)) {
    cpSync(source, join(siteRoot, 'public/content-assets'), { recursive: true });
  }
}

export function prepareContent() {
  const contentRoot = resolveContentRoot();
  const requestedRef = process.env.FIELDBOOK_CONTENT_REF?.trim();
  configureNavigation(contentRoot);

  rmSync(docsRoot, { recursive: true, force: true });
  rmSync(i18nRoot, { recursive: true, force: true });
  rmSync(generatedRoot, { recursive: true, force: true });
  mkdirSync(docsRoot, { recursive: true });
  mkdirSync(i18nRoot, { recursive: true });
  mkdirSync(generatedRoot, { recursive: true });

  if (requestedRef) {
    runGit(['rev-parse', '--verify', requestedRef], contentRoot);
    materialize(contentRoot, requestedRef);
  } else {
    materialize(contentRoot);
  }

  for (const version of versionsConfig.versions) {
    runGit(['rev-parse', '--verify', version.ref], contentRoot);
    materialize(contentRoot, version.ref, version);
  }

  copyAssets(contentRoot);
  const contentSha = runGit(['rev-parse', 'HEAD'], contentRoot).trim();
  const websiteSha = (() => {
    try {
      return runGit(['rev-parse', 'HEAD'], siteRoot).trim();
    } catch {
      return 'uncommitted';
    }
  })();

  writeFileSync(
    join(generatedRoot, 'versions.json'),
    JSON.stringify({ versions: versionsConfig.versions }, null, 2),
  );
  writeFileSync(
    join(generatedRoot, 'navigation.json'),
    JSON.stringify(navigationData, null, 2),
  );
  writeFileSync(
    join(generatedRoot, 'build.json'),
    JSON.stringify(
      {
        websiteSha,
        contentSha,
        contentRef: requestedRef || 'working-tree',
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  console.log(`Prepared Fieldbook content from ${contentRoot}`);
  console.log(`Content revision: ${contentSha}`);
  console.log(`Website revision: ${websiteSha}`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  prepareContent();
}
