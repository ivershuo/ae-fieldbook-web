import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { existsSync, readFileSync } from 'node:fs';

const versions = JSON.parse(
  readFileSync(new URL('./.generated/versions.json', import.meta.url), 'utf8'),
);
const navigation = JSON.parse(
  readFileSync(new URL('./.generated/navigation.json', import.meta.url), 'utf8'),
);
const siteUrl = process.env.SITE_URL || 'https://agentic-engineering.vercel.app';

const versionLinks = versions.versions.map((version) => ({
  label: version.label,
  link: `/en/v/${version.slug}/`,
}));
const sectionLabels = {
  foundations: ['Foundations', '基础'],
  architecture: ['Architecture', '架构'],
  'production-engineering': ['Production Engineering', '生产工程'],
  'product-and-ux': ['Product & UX', '产品与用户体验'],
  'patterns-and-cases': ['Patterns & Cases', '模式与案例'],
  'field-notes': ['Field Notes', '领域笔记'],
  project: ['Project', '项目'],
};
const handbookNavigation = navigation.sections.map((section) => {
  const [label, chineseLabel] = sectionLabels[section.slug] ?? [section.slug, section.slug];
  const hasOverview = existsSync(
    new URL(`./src/content/docs/en/${section.slug}/index.md`, import.meta.url),
  );
  return {
    label,
    translations: {
      'zh-CN': chineseLabel,
    },
    items: [
      ...(hasOverview ? [{ slug: section.slug }] : []),
      ...section.items.map((item) => ({ slug: `${section.slug}/${item}` })),
    ],
  };
});

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
      customCss: ['./src/styles/custom.css'],
      components: {
        SocialIcons: './src/components/SocialIcons.astro',
        ThemeSelect: './src/components/ThemeToggle.astro',
        LanguageSelect: './src/components/LanguagePreference.astro',
        EditLink: './src/components/SourceLink.astro',
      },
      sidebar: [
        {
          label: 'Start here',
          translations: {
            'zh-CN': '从这里开始',
          },
          slug: 'index',
        },
        {
          label: 'Handbook',
          translations: {
            'zh-CN': '知识手册',
          },
          items: handbookNavigation,
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
