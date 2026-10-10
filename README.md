# aashishj.com

Personal site for Aashish Jagini — engineer turned PM, still building the tools he uses. Built on Astro + Tailwind. Deployed to Cloudflare (Workers Static Assets).

Four routes: `/`, `/experience`, `/skills`, `/writing` (plus one page per post). Also `/rss.xml` and `/llms.txt`. The homepage Brain section and the [Brain write-up](https://aashishj.com/writing/brain-system/) carry the AI story. No chatbot, no AI fit-checker — both were cut on purpose.

---

## Stack

| | |
|---|---|
| Framework | Astro 5 (static output) |
| Styling | Tailwind CSS 3 + custom design tokens in `src/styles/global.css` |
| Content | MDX in `src/content/writing/` via Astro Content Collections |
| Fonts | Self-hosted via `@fontsource-variable` — Source Serif 4, Inter, JetBrains Mono |
| Hosting | Cloudflare Workers Static Assets (`wrangler.toml`, no Worker script) |
| Package manager | pnpm 9 (pinned in `package.json`), Node 20 |

---

## Development

```sh
pnpm install
pnpm dev            # localhost:4321
pnpm build          # astro check + astro build → dist/
pnpm preview        # serve dist/ locally
pnpm check          # astro check (TypeScript + content schema)
pnpm refresh:brain  # pull fresh Brain numbers (see below)
```

`pnpm build` fails on type errors, because it runs `astro check` first.

---

## Project structure

```
.
├── astro.config.mjs              # integrations, site URL, trailingSlash: 'always'
├── tailwind.config.mjs           # colors via CSS vars, fonts
├── wrangler.toml                 # Workers Static Assets config (serves dist/)
├── public/
│   ├── favicon.svg               # AJ italic monogram
│   ├── og-default.png            # 1200x630 social share image
│   ├── llms.txt                  # plain-text summary for AI crawlers
│   └── robots.txt                # AI crawlers explicitly allowed
├── scripts/
│   └── refresh-brain.sh          # pulls Brain stats from the home server → JSON
├── src/
│   ├── content/
│   │   ├── config.ts             # writing collection schema (Zod)
│   │   └── writing/              # MDX posts
│   ├── components/               # Header, Footer, CommandPalette (⌘K, vanilla JS),
│   │                             # BrainStatus, PostCard, ChapterCard, Placeholder
│   ├── data/
│   │   └── brain-status.json     # Brain numbers, baked in at build time
│   ├── layouts/
│   │   ├── BaseLayout.astro      # site shell — head, JSON-LD, theme, view transitions
│   │   └── PostLayout.astro      # /writing/[slug] reading layout
│   ├── pages/                    # index, experience, skills, writing/, rss.xml.js, 404
│   └── styles/global.css
└── .github/workflows/
    ├── ci.yml                    # typecheck + build
    └── purge-cache.yml           # purge Cloudflare cache after each deploy
```

---

## Design system

Locked. Don't drift without an explicit ask.

| Token | Light | Dark |
|---|---|---|
| `paper` (page bg) | `#FAF7F0` | `#16181C` |
| `ink` (body text) | `#16181C` | `#F0EDE5` |
| `cream` (section bg) | `#F0EDE5` | `#1F2127` |
| `line` (hairlines) | `#E8E2D5` | `#2A2D33` |
| `muted` (secondary text) | `#5A5247` *(AA on cream)* | `#A6ABB4` |
| `burnt` (body accent) | `#B23B0A` *(AA on paper)* | `#EA580C` |
| `burnt-strong` (display italic) | `#C2410C` | `#F97316` |

Fonts:
- **Source Serif 4 Variable** — body, headlines (display).
- **Inter Variable** — UI chrome, navigation, buttons, labels.
- **JetBrains Mono Variable** — kickers, dates, status tables, mono pull-quotes.

Italic display headlines use `<em>` and pick up `burnt-strong` via `.h-display em` in `global.css`.

---

## Adding a new post

1. Create `src/content/writing/<slug>.mdx`:

   ```mdx
   ---
   title: "Your title here"
   description: "One-sentence description, 140-160 chars."
   pubDate: 2026-05-15
   tags: ["product-management", "ai"]
   draft: false
   ---

   Body in MDX. Use `**bold**`, regular paragraphs, `code`, fenced code blocks,
   and any imported components if needed.
   ```

2. Frontmatter schema (Zod-validated at build time, see `src/content/config.ts`):

   | Field | Type | Required | Notes |
   |---|---|---|---|
   | `title` | string | ✓ | |
   | `description` | string | ✓ | |
   | `pubDate` | date (`YYYY-MM-DD`) | ✓ | Coerced to `Date`. |
   | `updatedDate` | date | | Shown on the post page if present. |
   | `tags` | string[] | | Defaults to `[]`. |
   | `draft` | boolean | | Defaults to `false`. `true` hides from `/writing` index but the post is still reachable at `/writing/<slug>` for preview. |
   | `canonicalUrl` | URL string | | If cross-posting elsewhere; sets `<link rel="canonical">`. |
   | `ogImage` | string | | Per-post OG image override; falls back to `/og-default.png`. |

3. Set `draft: false` to publish. The `/writing` index will pick it up automatically — no manual indexing.

4. Reading time auto-calculates from word count at build time (`words / 200`, rounded, min 1 minute).

---

## Brain numbers

The homepage Brain section shows real numbers (doc count, last capture, a "Tended" date). They are not live. They are baked in at build time from `src/data/brain-status.json`.

To refresh (monthly):

```sh
pnpm refresh:brain
git add src/data/brain-status.json
git commit -m "Refresh Brain status"
git push
```

`refresh:brain` needs SSH access to the home server, so only the owner can run it.

---

## Deploying

Push to `main`. Cloudflare builds and deploys in about 90 seconds.

| Setting | Value |
|---|---|
| Build command | `pnpm install --frozen-lockfile && pnpm build` |
| Output directory | `dist` (served via the `[assets]` block in `wrangler.toml`) |
| Node version | `NODE_VERSION=20` |

After each push, `purge-cache.yml` waits 2 minutes and then clears the Cloudflare cache. It needs two repo secrets: `CLOUDFLARE_ZONE_ID` and `CLOUDFLARE_CACHE_PURGE_TOKEN`.

**Don't touch `brain.aashishj.com`.** That subdomain belongs to a separate self-hosted server behind a Cloudflare Tunnel. This site owns only the apex domain (`www` redirects to it).

---

## Future work

- **Per-post OG images.** Build-time with `satori` + `@resvg/resvg-js` at `src/pages/og/[slug].png.ts`. Deferred.
- **Search across writing.** When posts pass ~20, add Pagefind as a post-build step.
- **AI features.** Cut on purpose (2026 clichés). If one comes back, it gets a real home — not a "coming soon" route. Adding a Worker means adding `main = "src/worker/..."` to `wrangler.toml`.

---

## Voice and content guardrails

- The employer is named: McKinsey (since 2026-07-16).
- The `Gaps` column on `/skills` is a feature. Specificity beats self-deprecation. Don't soften entries.
- No "passionate," "synergy," "10x," "leveraged."
- No generic openers. Start in the middle of a sentence if you have to.
- Specific numbers and proper nouns carry weight.
- One moment of dry self-awareness on the homepage is allowed and earned.

---

## License

All rights reserved. The content is Aashish's; the code structure can be referenced freely but please don't clone the design wholesale.
