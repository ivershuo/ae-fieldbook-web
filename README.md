# Agentic Engineering Fieldbook

The website for the
[Agentic Engineering Fieldbook](https://github.com/ivershuo/agentic-engineering):
a bilingual, evidence-oriented handbook for designing, building, evaluating,
and operating AI-native systems.

Read the published Fieldbook at [ae.docode.org](https://ae.docode.org).

## About this repository

This repository owns the Fieldbook’s presentation and publishing layer. It
provides the reading experience, navigation, search, localization, version
switching, metadata, and static deployment configuration.

The handbook repository remains the only source of editorial content:

- canonical English content lives under `content/en/`;
- Simplified Chinese translations live under `content/zh-cn/`;
- `vendor/agentic-engineering` is the checked-in Git submodule used by default;
- generated files under `src/content/docs/`, `.generated/`, `.astro/`, and
  `dist/` are build artifacts and must not be edited directly.

## Features

- English and Simplified Chinese routes with page-preserving language switching;
- structured handbook navigation and local page outlines;
- Pagefind full-text search;
- light and dark reading themes with saved preferences;
- collapsible global and page navigation on desktop;
- tag-backed historical editions configured in `versions.json`;
- canonical metadata, alternate-language links, sitemap, social metadata, and
  direct links to source files on GitHub;
- fully static output suitable for Vercel or another static host.

## Technology

- [Astro](https://astro.build/)
- [Starlight](https://starlight.astro.build/)
- [Pagefind](https://pagefind.app/)
- Node.js 22.12 or newer

## Local development

Install dependencies, initialize the content submodule, and start the
development server:

```bash
npm install
npm run content:init
npm run dev
```

The development server uses the currently checked-out content revision. It does
not fetch from GitHub or advance the submodule automatically.

Inspect or explicitly synchronize the content source with:

```bash
npm run content:status
npm run content:sync
```

To develop the website and handbook together, point the site at a normal sibling
clone:

```bash
FIELDBOOK_CONTENT_DIR=../agentic-engineering npm run dev
```

To inspect a locally available historical release:

```bash
FIELDBOOK_CONTENT_REF=fieldbook-v0.1.0 npm run dev
```

## Build and preview

```bash
npm run build
npm run preview
```

The production build materializes the selected handbook content, validates the
Astro project, generates the static site, and builds the search index.

## Configuration

### `SITE_URL`

`SITE_URL` is the public origin used at build time. It controls absolute URLs in
canonical metadata, alternate-language metadata, the sitemap, and social image
tags. It does not configure DNS or attach a domain to the hosting provider.

Preview deployments may override it with their own public origin when accurate
preview canonical metadata is required.

### Content settings

- `FIELDBOOK_CONTENT_DIR` selects a handbook checkout.
- `FIELDBOOK_CONTENT_REF` selects a locally available Git ref.
- `versions.json` lists the historical editions included in the website.
- `navigation.json` is the fallback navigation manifest until the selected
  handbook revision provides `content/navigation.json`.

## Deployment

The site builds to `dist/` and is configured for static deployment on Vercel.
Content repository updates can trigger a new website build through a Vercel
Deploy Hook, allowing handbook changes to publish without copying editorial
content into this repository.

Repository rules and architecture details are documented in
[`AGENTS.md`](AGENTS.md), [`docs/WEB_PRODUCT_PLAN.md`](docs/WEB_PRODUCT_PLAN.md),
and [`docs/HANDOFF.md`](docs/HANDOFF.md).

## License

Website code and handbook content follow the licensing terms declared in their
respective repositories.
