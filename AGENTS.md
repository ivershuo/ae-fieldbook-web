# Repository instructions for website agents

These instructions apply to the standalone Agentic Engineering Fieldbook
website. This repository is a presentation and publishing product. It does not
own the handbook's editorial argument or translations.

## Start every task from repository state

Before changing the website:

1. Inspect `git status` and preserve unrelated work.
2. Read `README.md`, `docs/WEB_PRODUCT_PLAN.md`, and `docs/HANDOFF.md`.
3. Inspect the content source with `npm run content:status`.
4. Inspect `versions.json`, `navigation.json`, `.gitmodules`, and the relevant
   implementation files.
5. Use current official Astro, Starlight, Vercel, and GitHub documentation when
   behavior may have changed.

The mechanically verifiable repository and submodule state wins over an earlier
chat, screenshot, generated directory, or deployment.

## Product boundaries

- The canonical handbook is
  `https://github.com/ivershuo/agentic-engineering`.
- `vendor/agentic-engineering` is the default public HTTPS Git submodule.
- English under the content repository's `content/en/` is canonical.
- Simplified Chinese under `content/zh-cn/` must retain its actual translation
  status and fingerprint state.
- The website may adapt presentation metadata but must not independently rewrite
  handbook arguments or translations.
- The website consumes the content repository's `main` branch for current pages
  and configured Git tags for historical editions.
- Generated files under `src/content/docs/`, `.generated/`, `.astro/`, and
  `dist/` are build products. Never author or commit content there.

## Local content modes

Initialize the checked-in submodule revision:

```bash
npm install
npm run content:init
npm run dev
```

Starting `npm run dev` must not silently access GitHub or advance the submodule.
Use explicit synchronization:

```bash
npm run content:status
npm run content:sync
```

For simultaneous website and handbook editing, point to a normal sibling clone
instead of editing inside a detached submodule checkout:

```bash
FIELDBOOK_CONTENT_DIR=../agentic-engineering npm run dev
```

For a fetched historical tag:

```bash
FIELDBOOK_CONTENT_REF=fieldbook-v0.1.0 npm run dev
```

## Navigation and versions

- Prefer `content/navigation.json` from the content repository.
- `navigation.json` in this repository is a transition fallback and must remain
  synchronized until the content manifest is available in the published
  submodule revision.
- `versions.json` is the explicit allowlist of historical editions built by the
  website.
- A version entry contains `label`, URL-safe `slug`, and Git `ref`.
- Use hyphenated URL slugs such as `0-1`; Starlight normalizes dots in content
  paths.
- Current routes are `/en/...` and `/zh-cn/...`.
- Historical routes are `/en/v/<slug>/...` and `/zh-cn/v/<slug>/...`.
- Never silently fall back from a requested historical route to current content.

## Design and implementation

- Preserve the fieldbook identity: editorial, calm, evidence-oriented, and made
  for sustained technical reading.
- Keep both reading modes first-class: sequential chapter reading and targeted
  retrieval through navigation, headings, and search.
- Maintain correct language switching, version switching, heading anchors,
  canonical metadata, and source links.
- Target WCAG 2.2 AA and verify keyboard behavior, focus visibility, reflow,
  contrast, landmarks, headings, and reduced motion.
- Keep the output static unless a demonstrated requirement needs runtime
  behavior.
- Avoid coupling page rendering to Vercel-specific APIs.
- Do not introduce a CMS or any second content source of truth.

## Deployment

- Vercel is the initial hosting target.
- `vercel.json` defines the static build contract.
- `SITE_URL` supplies the production origin used for canonical and social
  metadata.
- A Vercel Deploy Hook is called from the content repository after changes to
  `main` or `fieldbook-v*` tags.
- Treat Deploy Hook URLs as secrets.
- The website repository itself is not yet connected to a GitHub remote or
  Vercel project; see `docs/HANDOFF.md`.

## Required verification

Use Node 22.12 or newer. Before committing:

```bash
npm run content:status
npm run build
npm audit --omit=dev
git diff --check
git submodule status
```

For changes affecting versions, temporarily test at least one real or local tag
and confirm both English and Chinese historical routes. For changes affecting
local development, verify that content changes from a sibling clone refresh the
development server.

When handing off, report:

- branch and commit;
- website and content SHAs;
- files and behavior changed;
- commands run and results;
- versions tested;
- unresolved deployment or content questions; and
- the exact next action.

