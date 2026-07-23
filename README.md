# Agentic Engineering Fieldbook website

The presentation layer for the
[Agentic Engineering Fieldbook](https://github.com/ivershuo/agentic-engineering).
The handbook repository remains the only content source.

Start with:

- [`AGENTS.md`](AGENTS.md) — repository rules and verification;
- [`docs/WEB_PRODUCT_PLAN.md`](docs/WEB_PRODUCT_PLAN.md) — product and
  architecture decisions;
- [`docs/HANDOFF.md`](docs/HANDOFF.md) — current state and exact next actions.

## Local development

```bash
npm install
npm run content:init
npm run dev
```

The development server uses the checked-out content submodule and does not fetch
from GitHub automatically.

```bash
npm run content:status
npm run content:sync
```

To edit the website and handbook together, use a normal sibling clone:

```bash
FIELDBOOK_CONTENT_DIR=../agentic-engineering npm run dev
```

To inspect a fetched release tag:

```bash
FIELDBOOK_CONTENT_REF=fieldbook-v0.1.0 npm run dev
```

## Production

Vercel imports this repository. A Deploy Hook rebuilds the site after the
handbook `main` branch or a release tag changes.

Configure `versions.json` with the release tags that should remain visible.

Set `SITE_URL` to the final production origin before publishing.
