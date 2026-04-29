/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme tokens — kept in CSS variables for runtime theme switch.
        // These names mirror --tokens in src/styles/global.css.
        paper: 'rgb(var(--rgb-paper) / <alpha-value>)',
        ink: 'rgb(var(--rgb-ink) / <alpha-value>)',
        cream: 'rgb(var(--rgb-cream) / <alpha-value>)',
        burnt: 'rgb(var(--rgb-burnt) / <alpha-value>)',
        burntdk: 'rgb(var(--rgb-burnt-strong) / <alpha-value>)',
        line: 'rgb(var(--rgb-line) / <alpha-value>)',
        muted: 'rgb(var(--rgb-muted) / <alpha-value>)',
      },
      fontFamily: {
        serif: [
          '"Source Serif 4 Variable"',
          '"Source Serif 4"',
          'ui-serif',
          'Georgia',
          'serif',
        ],
        sans: [
          '"Inter Variable"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono Variable"',
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'monospace',
        ],
      },
      maxWidth: {
        '8xl': '88rem',
        prose: '40rem',
      },
    },
  },
  plugins: [],
};
