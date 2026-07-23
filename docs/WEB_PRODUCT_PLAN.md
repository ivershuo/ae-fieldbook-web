# Website Product Plan

Status: revised planning draft  
Date: 2026-07-23  
Scope: presentation and discovery of the Agentic Engineering Fieldbook

This document plans the website as a delivery product for the Fieldbook. It does
not change the handbook's source-of-truth model. The GitHub documentation
repository is the canonical source; the website is a separately deployable
consumer. A website checkout must not be assumed to contain the handbook files.

## 1. Product position

The website should feel like a carefully edited technical fieldbook, not a
framework reference, blog feed, marketing site, or prompt collection.

Its primary jobs are:

1. help a new reader understand the knowledge map and choose a useful starting
   point;
2. support sustained, distraction-free chapter reading;
3. help a returning reader find and cite a specific concept quickly;
4. make English/Chinese correspondence and translation state legible; and
5. give contributors a direct route from a published page to its canonical
   source and contribution workflow.

### Non-goals for the first public release

- user accounts, comments, annotations, bookmarks, or reading-history sync;
- an embedded AI assistant or semantic-answer product;
- a CMS that becomes a second content source of truth;
- per-release snapshots of the entire handbook;
- a news feed or high-frequency blog;
- personalization that changes the canonical reading order;
- framework-specific interactive tutorials or runnable playgrounds.

## 2. Audiences and core journeys

### First-time learner

Question: “What is agent engineering, and how should I learn it?”

Desired path:

```text
Landing page → choose a guided path → section overview → chapter → next chapter
```

The landing page should explain the promise, intended reader, knowledge map, and
recommended starting points before exposing the complete table of contents.

### Practitioner solving a design problem

Question: “Where does the handbook discuss evaluation gates, memory, or human
intervention?”

Desired path:

```text
Search or section map → relevant chapter and heading → adjacent concept links
```

Search must prioritize titles, descriptions, headings, and preferred terminology.
Results should show section, excerpt, language, and the matching heading rather
than only a page title.

### Returning reader

Question: “What changed, and where was I?”

The first release should provide stable URLs, visible `lastReviewed` information
where useful, and predictable navigation. Cross-device reading state and a
changelog can wait until there is evidence of demand.

### Contributor or reviewer

Question: “How do I inspect or improve this page?”

Each page should eventually expose a restrained “View source / suggest an edit”
route to GitHub. Translation freshness and human-review status must not be
collapsed into one generic “translated” badge.

## 3. Information architecture

Keep the confirmed six-part handbook structure as the primary information
architecture:

1. Foundations
2. Architecture
3. Production Engineering
4. Product & UX
5. Patterns & Cases
6. Field Notes

Do not reorganize canonical content around vendors, frameworks, content formats,
or website components.

### Global navigation

- Brand/home
- Handbook contents
- Search
- Language switch
- GitHub/contribution entry

Avoid a large marketing-style top navigation. The section hierarchy is the
product's main navigation.

### Page types

#### Landing page

- concise product thesis;
- “start here” route for readers new to agent engineering;
- alternate entry points for architecture, production, product, and case-study
  needs;
- six-part visual knowledge map;
- project principles and evidence posture;
- current edition/maintenance statement;
- GitHub contribution entry.

#### Section overview

- the section's central question and intended reader outcome;
- chapter sequence with one-sentence outcomes;
- prerequisites or recommended prior chapters;
- explicit relationships to adjacent sections;
- maintained-date signal for Field Notes.

#### Chapter page

- breadcrumb or equivalent location cue;
- part/chapter number, title, description, and review metadata;
- local “on this page” outline generated from headings;
- readable article column;
- semantic callouts for evidence limits, trade-offs, failures, and editorial
  judgment only when the source content distinguishes them;
- previous/next navigation within the canonical order;
- related concepts selected from explicit editorial links, not opaque
  recommendation logic;
- source/contribution links.

#### Search

- keyboard-accessible search entry;
- language-scoped by default, with an explicit cross-language option later if
  evidence supports it;
- grouped title/heading matches with short excerpts;
- exact terminology matches ranked above incidental body matches;
- zero-result guidance and a link to browse the contents.

#### Project and method pages

Editorial method, evidence policy, terminology, and project status should be
available as secondary material without competing with the handbook reading
sequence.

## 4. Interaction principles

### Preserve both modes: sequence and retrieval

The sidebar and previous/next controls support continuous reading. Search,
section maps, anchored headings, and stable URLs support retrieval. Neither mode
should be hidden behind the other.

### Prefer progressive disclosure

Desktop navigation can show the current section expanded while keeping other
sections compact. Mobile should use a real drawer or dialog pattern with
intentional focus management; a very long inline disclosure before the article
would make navigation and reading compete.

### Keep location visible

Readers should be able to answer three questions without scrolling:

- Which part and chapter am I in?
- What is this page for?
- Where can I go next?

On long chapters, a right-side local outline may highlight the active heading.
It should not cause layout shifts or obscure focused elements.

### Treat bilingual switching as page correspondence

The language switch should preserve the current logical page whenever a matching
translation exists. It should use stable locale-prefixed URLs and correct
`lang`, `hreflang`, canonical, and alternate metadata.

If a translation is missing or stale, the interface should say exactly what is
available. It must not silently present English under a Chinese URL as though it
were a current reviewed translation.

### Design for reading before decoration

- comfortable line length for prose;
- type choices tested separately for Latin and Simplified Chinese;
- clear heading rhythm and link styling;
- tables and code blocks that work at narrow widths;
- no animation required to understand or navigate content;
- print styles as a later enhancement, not a substitute for a proper PDF
  product.

### Accessibility baseline

Target WCAG 2.2 AA. In particular, verify semantic landmarks and headings,
keyboard operation, visible and unobscured focus, skip navigation, reflow at 320
CSS pixels, contrast, reduced motion, descriptive link purpose, and adequate
target sizes.

## 5. Content and metadata contract

The website should derive routes and presentation metadata from a pinned revision
of the GitHub documentation repository rather than maintain a second handwritten
catalog wherever possible.

The eventual contract should distinguish:

- canonical title and description;
- section and canonical sequence;
- content status;
- English `lastReviewed`;
- Chinese translation freshness;
- Chinese human-review status;
- Field Note observation date and maintenance trigger;
- explicit related chapters;
- source repository path.

Navigation order, language correspondence, edition membership, and publication
status must live in the documentation repository as frontmatter or a small
product-independent manifest. The website must not infer editorial order
alphabetically or require an independent navigation edit for every content
change.

## 6. Repository and synchronization architecture

Use two repositories with explicit responsibilities:

```text
agentic-engineering (content)
  ├─ canonical Markdown and assets
  ├─ bilingual metadata and navigation manifest
  ├─ validation and translation checks
  ├─ release tags
  └─ Vercel Deploy Hook trigger

fieldbook-web (website)
  ├─ site application and design system
  ├─ content-fetch/build adapter
  ├─ search-index generation
  ├─ public HTTPS content submodule
  └─ visual, accessibility, and route tests
```

The content repository can be included as a Git submodule. This makes the
relationship visible in a normal website checkout and gives local development a
predictable content directory.

Vercel supports Git submodules when the submodule is publicly accessible over
HTTP. The configured submodule pointer is still a fixed commit; it does not
automatically follow the remote `main` branch.

### Recommended Vercel flow

```text
content push to main or a release tag
  → content repository calls a Vercel Deploy Hook
  → Vercel checks out the website repository and public submodule
  → prebuild fetches content main and tags
  → latest pages are built from main
  → version pages are built from configured tags
  → Vercel publishes the static site
```

website PR
  → Vercel creates a normal preview deployment
  → preview uses the content revision fetched during that build
```

The Deploy Hook URL is a secret and should be stored as a GitHub Actions secret
in the content repository. No Vercel CLI, cross-repository commit bot, or
`repository_dispatch` flow is required for the first version.

The build should print and expose the resolved website and content SHAs. This is
enough traceability for the initial product without making SHA orchestration a
separate system.

For local work, the checked-in submodule pointer provides a known baseline.
Developers can explicitly update it when they want new content. Vercel production
builds may advance the submodule to remote `main` in the build workspace without
committing that pointer back to the website repository.

## 7. Documentation version model

The Fieldbook is a maintained body of knowledge, not an API tied to every patch
release. Version only editorial editions that readers may need to cite or revisit.

### Source of truth

- The content repository's `main` branch represents the current handbook shown
  at the normal locale routes.
- A Git tag and GitHub Release, such as `fieldbook-v0.2.0`, freezes an edition.
- A small version manifest lists the tags included in the website and their
  labels.
- Historical files are not copied into the website repository.

### URL model

```text
/en/...                 latest released English edition
/zh-cn/...              latest released Chinese edition
/v/0.1/en/...           frozen English edition 0.1
/v/0.1/zh-cn/...        frozen Chinese edition 0.1
```

The root locale routes follow content `main`. Tag routes remain frozen. This
keeps the mental model simple: `main` is current, tags are historical versions.

Each released version page should be self-canonical and state its edition.
Language variants should use `hreflang`. Unreleased and deployment-preview URLs
should be excluded from indexing. Old versions should show an unobtrusive
“historical edition” banner and link to the corresponding page in the latest
edition when one exists.

### Retention

Build `main` and only the tags named in the version manifest. Version
availability must be explicit; never fall back to another edition under the
requested version URL.

Field Notes retain their own observation dates inside every edition. A new
Field Note observation is not by itself a reason to create a whole handbook
edition.

## 8. Site framework options

The site can be implemented in a new repository; reuse of the current prototype
is not a requirement. Every option still needs a build-time adapter that fetches
the pinned content revision.

| Option | Strengths | Main risks | Fit |
| --- | --- | --- | --- |
| Astro + Starlight | Static-first; built-in documentation navigation, local outline, search, i18n, SEO, typography, and accessibility-oriented defaults; design remains customizable | Edition routing and remote multi-revision loading require a deliberate adapter; heavy theme overrides can become fragile | Recommended baseline |
| Docusaurus | Strongest built-in documentation version selector and version-aware navigation; mature i18n and ecosystem | Its native version workflow copies docs into website-owned directories; an adapter must materialize Git tags during build without committing copies; React and theme conventions add weight | Best alternative if rich version UI dominates |
| Custom Astro | Maximum fieldbook identity and direct control; static output with little client JavaScript | Team owns all search, navigation, i18n, edition routing, accessibility, and regressions | Use only if Starlight theming is demonstrably too restrictive |
| VitePress | Good documentation defaults and multilingual local search | Remote revision ingestion and edition management remain custom; Vue-specific theming adds no clear advantage here | Viable but weaker fit |
| Next.js | Flexible remote data fetching and a strong Vercel path; useful if the product becomes dynamic | Server/runtime complexity is unnecessary for a static handbook; encourages coupling hosting and application architecture | Defer unless dynamic requirements emerge |
| Hosted documentation SaaS | Fast operational start and managed features | content/control coupling, branding limits, cost, and possible second source of truth | Not recommended |

### Framework recommendation

Start a clean Astro + Starlight proof of architecture in a separate website
repository. Test the hard requirements before visual polish:

1. update the public content submodule to `main` and fetch one historical tag;
2. generate both languages without copying them into Git history;
3. preserve version-aware internal links and heading anchors;
4. generate separate language/version search indexes;
5. customize the landing and chapter templates enough to preserve the fieldbook
   identity; and
6. produce a fully static artifact deployable to either provider.

Do not run a multi-framework bake-off before this proof. Reconsider Docusaurus
only if Starlight's version routing proves materially difficult.

## 9. Hosting options

The application should produce portable static output. Hosting must not become
the content synchronization mechanism or the only place version history exists.

| Area | Vercel | GitHub Pages | Cloudflare Pages |
| --- | --- | --- | --- |
| Setup | Import website repo and configure build | Write and maintain a Pages Actions workflow | Import website repo and configure build |
| Public HTTP submodule | Explicitly supported | Supported through `actions/checkout` with submodules enabled | Should be verified in the spike |
| Website PR previews | Automatic for every push/PR | No equivalent hosted PR-preview workflow by default | Automatic branch/PR previews |
| Content update trigger | Vercel Deploy Hook | Cross-repository dispatch or scheduled Actions workflow | Pages Deploy Hook |
| Custom static site | Supported | Supported through Pages artifacts | Supported |

### Hosting recommendation

Prefer **Vercel** for the first release. For this deliberately simple
architecture it removes the most plumbing:

- direct GitHub import of the website repository;
- automatic website PR previews;
- explicit support for public HTTP Git submodules;
- one Deploy Hook call when content `main` or a tag changes;
- no custom deployment action or provider CLI required.

GitHub Pages plus a submodule is technically sound and has the attraction of
keeping source, CI, and hosting in GitHub. A custom Actions workflow can check out
submodules, build any static generator, upload the Pages artifact, and deploy it.
It is the best zero-additional-platform alternative.

It is not the convenience winner because content-repository updates still need
to trigger the website workflow, and GitHub Pages does not provide Vercel-style
hosted PR previews by default. Choose it if minimizing external services matters
more than deployment and review ergonomics.

Cloudflare Pages remains viable but no longer needs to be part of the initial
spike. Revisit it if Cloudflare-native edge services become a real requirement.

Do not select based only on nominal bandwidth or build-minute limits before
measuring the generated artifact and expected update frequency; those limits and
prices change.

## 10. Local development and debugging

Local development should work without network access after initial setup.
Starting the development server must not silently fetch or change the content
submodule.

### Directory contract

```text
fieldbook-web/
  ├─ src/                         website source
  ├─ vendor/agentic-engineering/ content Git submodule
  ├─ .generated/content/         ignored build-time materialization
  ├─ public/
  └─ package.json
```

The content adapter should accept:

```text
FIELDBOOK_CONTENT_DIR
FIELDBOOK_CONTENT_REF
```

- `FIELDBOOK_CONTENT_DIR` defaults to the submodule directory.
- `FIELDBOOK_CONTENT_REF` defaults to the currently checked-out content revision.
- Vercel production sets the effective ref to `main`.
- A tag such as `fieldbook-v0.1.0` selects that frozen version for focused local
  inspection.

The generated directory must be ignored by Git. It may contain normalized
content, route metadata, and search input, but it must never become a second
authoring location.

### Proposed commands

```bash
npm install
npm run content:init
npm run dev
```

| Command | Purpose | Network or mutation |
| --- | --- | --- |
| `npm run content:init` | Initialize the configured submodule revision after cloning the website | Network on first run |
| `npm run content:status` | Print content path, resolved SHA, selected ref, configured tags, and dirty state | Read-only |
| `npm run content:sync` | Explicitly fetch content `main` and tags, then update the local baseline | Network and submodule checkout |
| `npm run dev` | Materialize the current content selection and start Starlight's development server | No implicit network |
| `npm run build` | Generate the same static artifact expected by Vercel | No implicit network |
| `npm run preview` | Serve the production build locally | No implicit network |

Astro/Starlight conventionally uses `npm run dev` for the development server,
`npm run build` for output under `dist/`, and `npm run preview` for a local
production preview.

Do not make `npm run dev` automatically call `content:sync`. A developer should
not receive different content merely because they restarted the server.

### Development modes

#### Website-only development

Use the checked-in submodule revision:

```bash
npm run content:init
npm run dev
```

This is the default mode for layout, navigation, accessibility, responsive
behavior, and search-interface work.

#### Latest content verification

Explicitly update before starting:

```bash
npm run content:sync
npm run dev
```

The resolved content SHA should be visible in the terminal and, in development
mode, in a small diagnostics panel or debug route.

#### Website and content development together

Do not author substantial documentation inside a detached submodule checkout.
Use a normal sibling clone of the content repository:

```bash
FIELDBOOK_CONTENT_DIR=../agentic-engineering npm run dev
```

The local adapter should watch Markdown, assets, navigation metadata, and
translation metadata in that directory and refresh affected pages. This permits
content and presentation changes to be reviewed together without committing a
submodule pointer.

#### Historical tag inspection

```bash
FIELDBOOK_CONTENT_REF=fieldbook-v0.1.0 npm run dev
```

The adapter should materialize a tag into `.generated/content/` without changing
the submodule working tree. Fetching missing tags remains an explicit
`content:sync` operation.

#### Production-parity check

```bash
npm run build
npm run preview
```

Before merging website changes, verify representative English and Chinese pages,
one historical version, navigation, internal links, search, the 404 page, and
the version/language switchers against this preview.

### Toolchain reproducibility

- pin the supported Node major version;
- commit the package-manager lockfile and declare the package manager;
- use the same install and build commands locally and on Vercel;
- avoid requiring Vercel credentials for normal local development;
- keep Vercel-specific behavior out of page rendering;
- display resolved website and content SHAs in build logs.

`vercel dev` is unnecessary for the initial static site. Add it only if the
product later introduces Vercel Functions or other runtime-specific behavior.

### Common failure diagnostics

The content adapter should fail early with a clear action when:

- the submodule has not been initialized;
- the requested tag is not available locally;
- required English/Chinese paths or navigation metadata are missing;
- an internal link crosses into a version where the target does not exist;
- generated content is stale relative to the selected ref;
- the content working tree is dirty during a production-parity build.

## 11. Release slices

### Phase 0 — product definition

Deliverables:

- approve audiences, core journeys, non-goals, and information architecture;
- inventory actual Markdown constructs and metadata;
- define the bilingual URL and fallback policy;
- define the tag naming and version-manifest policy;
- produce low-fidelity layouts for landing, section, chapter, mobile
  navigation, and search;
- create one clean Starlight architecture proof;
- validate Vercel checkout of the public content submodule, build-time `main`
  update, tag fetching, and Deploy Hook rebuild;
- validate offline startup, sibling-content live reload, tag inspection, and a
  local production preview;
- define launch acceptance criteria.

Exit condition: the team can explain why every persistent interface element
exists and which reader journey it serves.

### Phase 1 — readable public fieldbook

Scope:

- automatic rebuilds for content `main` and tag changes;
- tag-backed historical version routes;
- all completed bilingual pages;
- responsive global/section/chapter navigation;
- local chapter outline;
- language-preserving routes;
- metadata, sitemap, social preview defaults, and not-found handling;
- source/contribution link;
- WCAG 2.2 AA-oriented keyboard and reflow checks;
- deploy previews for pull requests.

Search may be included here if the content corpus already makes browse-only
navigation insufficient; otherwise it is the first Phase 2 item.

### Phase 2 — findability and maintenance

Scope:

- high-quality local full-text search;
- language- and version-scoped indexes with terminology-aware ranking;
- visible review/observation metadata;
- link checking and generated navigation validation;
- selected historical edition routes and banners;
- privacy-respecting aggregate analytics;
- measured improvements to landing-page paths and zero-result search.

### Phase 3 — evidence-led enhancements

Candidates only after usage evidence:

- reading progress stored locally;
- citation/export affordances;
- visual concept maps;
- release notes or change history;
- offline/PWA support;
- semantic discovery or an AI assistant with citations.

## 12. Validation and success measures

### Pre-launch task tests

Test in both English and Chinese, on desktop and mobile:

1. A new reader finds the recommended starting chapter.
2. A practitioner finds the evaluation quality-gates section from the homepage.
3. A reader switches language without losing page context.
4. A keyboard-only reader opens navigation, moves through it, reaches the local
   outline, and returns to content.
5. A contributor reaches the correct source file.
6. A reader can distinguish a maintained Field Note from a durable core chapter.

### Quality gates

- no missing canonical chapters or locale mismatches;
- deployed build metadata records the resolved website and content SHAs;
- a content-only merge triggers a Vercel deployment;
- a historical edition remains byte-for-byte reproducible from its tag;
- no stale translation represented as reviewed;
- valid heading hierarchy and stable heading anchors;
- WCAG 2.2 AA audit of templates, including manual keyboard checks;
- acceptable Core Web Vitals on representative long chapters;
- search relevance checks against a fixed bilingual query set;
- no product code writing back into `content/`.

### Early outcome signals

Use aggregate, privacy-respecting measurements:

- landing page to first chapter continuation;
- section overview to chapter continuation;
- search success proxy: result click without immediate repeat query;
- zero-result query rate;
- next-chapter continuation;
- language-switch success and fallback frequency;
- broken-link and not-found rates.

Do not optimize for raw page views or time on page. A short visit can be a
successful lookup.

## 13. Decisions needed before implementation

1. Is the primary launch experience “read the book in order,” “solve a current
   engineering question,” or an explicitly equal blend? The current
   recommendation is an equal blend with a guided first-time path.
2. Should Chinese pages with `translationStatus: generated` be publicly
   available with an honest badge, or should launch wait for human review?
3. Should project/editorial pages appear inside the same navigation shell or in
   a secondary project area?
4. What constitutes a Fieldbook edition, and which existing Git tag should
   become the first frozen public version?
5. Is dark mode a launch requirement or a post-launch preference?
6. Does the team accept Vercel as the initial host, with GitHub Pages as the
   fallback?
7. Which analytics policy meets the project's ownership and privacy
   expectations?

## 14. Research references

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Markdown content](https://docs.astro.build/en/guides/markdown-content/)
- [Starlight](https://starlight.astro.build/)
- [Starlight configuration](https://starlight.astro.build/reference/configuration/)
- [Starlight getting started](https://starlight.astro.build/getting-started/)
- [VitePress local and multilingual search](https://vitepress.dev/reference/default-theme-search)
- [VitePress internationalization](https://vitepress.dev/guide/i18n)
- [Docusaurus versioning guidance](https://docusaurus.io/docs/versioning)
- [GitHub Actions checkout of multiple repositories](https://github.com/actions/checkout)
- [GitHub Pages custom Actions workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Actions workflows and external events](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare Pages preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Cloudflare Pages Deploy Hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/)
- [Vercel Git deployments](https://vercel.com/docs/git)
- [Vercel Deploy Hooks](https://vercel.com/docs/deploy-hooks)
- [Vercel Git submodules](https://vercel.com/docs/builds/build-features#git-submodules)
- [GitHub Docs documentation philosophy](https://docs.github.com/en/contributing/writing-for-github-docs/about-githubs-documentation-philosophy)
- [GitHub Docs content best practices](https://docs.github.com/en/contributing/writing-for-github-docs/best-practices-for-github-docs)
- [Diátaxis documentation framework](https://diataxis.fr/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Google Search canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
