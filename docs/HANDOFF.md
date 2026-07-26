# Website handoff

Last reconciled: 2026-07-23

## Current state

- Website repository commit before this context migration:
  `d5f4f09 Build standalone Fieldbook website`.
- Content repository integration commit:
  `65b9eca Replace legacy web adapter with standalone site workflow`.
- Content submodule revision used during implementation:
  `8541ce9b6d92d9c2fe9872e4ef4e5b738524a3ad`.
- The website repository has no Git remote yet.
- The website is not connected to a Vercel project yet.
- The production domain and default `SITE_URL` are `https://ae.docode.org`.
- `versions.json` is empty because the content repository did not expose a
  release tag during implementation.

## Implemented

- Astro 7 and Starlight static site;
- public HTTPS content submodule;
- English and Simplified Chinese routes and language switching;
- generated navigation based on the handbook order;
- Pagefind search indexes for both languages;
- tag-backed historical edition generation and version switching;
- local offline startup, explicit content synchronization, sibling-clone content
  development, and production preview commands;
- Vercel static build configuration;
- website-owned scheduled and manual synchronization of the upstream content
  submodule;
- custom editorial theme and social sharing image;
- sitemap, source links, dark mode, responsive navigation, and local outline.

## Verified

At implementation handoff:

- 45 English and 45 Chinese documents validated;
- all 45 Chinese source fingerprints were current;
- the current build generated 91 pages;
- Pagefind indexed both English and Chinese;
- a temporary local `fieldbook-v0.1.0` tag generated and linked both language
  versions successfully;
- local content-change detection refreshed Starlight;
- Astro checks reported no errors or warnings;
- `npm audit --omit=dev` reported zero known vulnerabilities.

The temporary test tag was deleted and is not part of repository state.

## Manual directory move

After this handoff commit is clean, move the entire directory so its `.git`
database and submodule metadata travel together:

```bash
test ! -e /Users/shuo/code/fieldbook-web
mv /Users/shuo/code/aeh/fieldbook-web /Users/shuo/code/fieldbook-web
cd /Users/shuo/code/fieldbook-web
git status
git submodule sync --recursive
git submodule update --init --recursive
nvm use
npm install
npm run content:status
npm run build
```

The submodule's `.git` file points to a relative Git directory inside the website
repository, so moving the whole website directory preserves it.

## Exact next actions

1. Move the directory using the commands above.
2. Create a GitHub repository for the website.
3. Add that repository as `origin` and push `main`.
4. Import the website repository into Vercel.
5. Set the Vercel Node version to a release compatible with `>=22.12.0`.
6. Set `SITE_URL` to `https://ae.docode.org` in Vercel.
7. Confirm the scheduled `Sync Fieldbook content` workflow runs successfully;
   no token secret is required because GitHub provides its `GITHUB_TOKEN`.
8. Optionally run the workflow manually once to verify its automated commit
   triggers a Vercel deployment without waiting for the next schedule.
9. Create the first real `fieldbook-v*` content tag and add it to
   `versions.json` only when that edition should be publicly retained.
