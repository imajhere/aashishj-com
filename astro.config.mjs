// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://aashishj.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    sitemap(),
    tailwind({
      // We import the Tailwind base in src/styles/global.css ourselves
      // so we get control over @layer ordering with custom CSS.
      applyBaseStyles: false,
    }),
  ],
  vite: {
    ssr: {
      noExternal: [
        '@fontsource-variable/inter',
        '@fontsource-variable/source-serif-4',
        '@fontsource-variable/jetbrains-mono',
      ],
    },
  },
});
