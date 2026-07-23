import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readFileSync } from 'node:fs';

const versions = JSON.parse(
  readFileSync(new URL('./.generated/versions.json', import.meta.url), 'utf8'),
);
const siteUrl = process.env.SITE_URL || 'https://agentic-engineering.vercel.app';

const versionLinks = versions.versions.map((version) => ({
  label: version.label,
  link: `/en/v/${version.slug}/`,
}));

export default defineConfig({
  site: siteUrl,
  output: 'static',
  integrations: [
    starlight({
      title: 'Agentic Engineering Fieldbook',
      description: 'Principles, patterns, and practices for AI-native systems.',
      defaultLocale: 'en',
      locales: {
        en: { label: 'English', lang: 'en' },
        'zh-cn': { label: '简体中文', lang: 'zh-CN' },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/ivershuo/agentic-engineering',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/ivershuo/agentic-engineering/edit/main/content/',
      },
      customCss: ['./src/styles/custom.css'],
      components: {
        SocialIcons: './src/components/SocialIcons.astro',
      },
      sidebar: [
        { label: 'Start here', link: '/en/' },
        {
          label: 'Handbook',
          items: [{ autogenerate: { directory: 'en', collapsed: false } }],
        },
        ...(versionLinks.length
          ? [{ label: 'Editions', collapsed: true, items: versionLinks }]
          : []),
      ],
      pagefind: true,
      lastUpdated: true,
      head: [
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#173f35' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: `${siteUrl}/og.png` },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:image', content: `${siteUrl}/og.png` },
        },
      ],
    }),
  ],
});
