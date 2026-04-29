# aashishj.com

Personal site for Aashish Jagini, built on Astro + Tailwind, deployed to Cloudflare Pages.

This is the **foundation pass** — five routes live, MDX-backed writing collection, design system locked. The original spec called for six routes (`/fit` was the sixth — a JD-paste UI stub for a future AI feature); on review Aashish cut it to avoid a "coming soon" credibility tax. The Brain System project page carries the AI flex on its own.

---

## Stack

| | |
|---|---|
| Framework | Astro 5 (static output) |
| Styling | Tailwind CSS 3 + custom design tokens in `src/styles/global.css` |
| Content | MDX in `src/content/writing/` via Astro Content Collections |
| Fonts | Self-hosted via `@fontsource-variable` — Source Serif 4, Inter, JetBrains Mono |
| Hosting | Cloudflare Pages (static) |
| Package manager | pnpm 9, Node 20+ |
| Future AI | Cloudflare Worker + Workers AI — `wrangler.toml` is a commented stub |

The stack is locked. Decisions documented in `docs/` if needed; don't relitigate without reason.

---

## Development

```sh
pnpm install
pnpm dev          # localhost:4321
pnpm build        # outputs to dist/
pnpm preview      # serve dist/ locally to test the production build
pnpm check        # astro check (TypeScript + content schema)
```

The build runs `astro check && astro build`, so `pnpm build` will fail on type errors.

---

## Project structure

```
.
├── astro.config.mjs              # Astro config — integrations, site URL, output
├── tailwind.config.mjs           # Tailwind v3 config — colors via CSS vars, fonts
├── tsconfig.json
├── wrangler.toml                 # commented stub for the future AI Worker
├── public/
│   ├── favicon.svg               # AJ italic monogram
│   ├── og-default.png            # 1200x630 — see "Regenerating OG images" below
│   ├── og-default.svg            # source of truth (text renders correctly in browser)
│   └── robots.txt                # AI crawlers explicitly allowed
├── src/
│   ├── content/
│   │   ├── config.ts             # writing collection schema (Zod)
│   │   └── writing/              # MDX posts
│   │       ├── pm-os.mdx         # seed post 1 (draft: true)
│   │       └── brain-system.mdx  # seed post 2 (draft: true)
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── CommandPalette.astro  # ⌘K palette (vanilla JS, no React)
│   │   ├── Placeholder.astro     # yellow-tinted [PLACEHOLDER] block
│   │   ├── BrainStatus.astro     # live status block on / and /projects
│   │   ├── PostCard.astro
│   │   ├── ChapterCard.astro     # /experience chapter card
│   │   └── ProjectCard.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro      # site shell — head, JSON-LD, theme, view transitions
│   │   └── PostLayout.astro      # /writing/[slug] reading layout
│   ├── pages/
│   │   ├── index.astro           # homepage
│   │   ├── experience.astro      # /experience
│   │   ├── projects.astro        # /projects
│   │   ├── skills.astro          # /skills (full 3-column grid)
│   │   └── writing/
│   │       ├── index.astro
│   │       └── [slug].astro
│   └── styles/
│       └── global.css
└── .github/workflows/ci.yml      # typecheck + build on PR
```

---

## Design system

Locked in by Aashish via the mockup approval. Don't drift without explicit ask.

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

Italic display headlines use `<em>` and pick up the `burnt-strong` color via `.h-display em` in `global.css`.

The placeholder treatment (yellow left-bordered block with mono `[PLACEHOLDER]` label) is applied via the `<Placeholder>` component or the `.ph` / `.ph-inline` utility classes. **Every body paragraph and italic pull-quote is wrapped in `<Placeholder>` until Aashish writes the real copy.** Headings, eyebrow labels, navigation labels, and skill list items are structural and stay clean.

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

## Deploying to Cloudflare Pages

The repo is deploy-ready. Once a Cloudflare Pages project is connected to the GitHub repo, every push to `main` deploys automatically.

**Pages project settings:**

| Setting | Value |
|---|---|
| Framework preset | None (or "Astro" if it offers it) |
| Build command | `pnpm install --frozen-lockfile && pnpm build` |
| Build output directory | `dist` |
| Node version | `20` (set `NODE_VERSION=20` env var) |
| Root directory | `/` |

**Connecting the apex domain `aashishj.com`:**

The domain is on Porkbun with nameservers on Cloudflare.

1. In Cloudflare Pages → your project → **Custom domains**, add `aashishj.com`.
2. Cloudflare will create the apex `A`/`CNAME` records automatically (since the zone is on Cloudflare).
3. **Don't touch `brain.aashishj.com`** — that subdomain is in use for a separate self-hosted server via Cloudflare Tunnel. The Pages project should only own the apex (and optionally `www`).
4. Verify `https://aashishj.com/` resolves to the new site.

**Cloudflare Web Analytics:** Add the script tag in `BaseLayout.astro` once you have the token. Recommended over GA4 for a personal site (cookie-free, real Core Web Vitals, no consent UX).

---

## Regenerating OG images

The shipped `public/og-default.png` is a **geometric placeholder** — 1200x630, brand-colored, no text. The text version of the source lives at `public/og-default.svg` and renders correctly in browsers (which have the fonts) but the PNG could not be rendered with text on the build machine because ImageMagick had no font config.

To regenerate the PNG with proper text:

**Option 1 — Figma / design tool:** Open `public/og-default.svg`, copy the layout, export 1200×630 PNG.

**Option 2 — Headless Chrome (recommended for per-post OG):**

```sh
# pnpm dlx playwright screenshot --viewport-size=1200,630 \
#   "https://aashishj.com/og-preview/<slug>" public/og/<slug>.png
```

**Option 3 — Build-time via `satori` + `@resvg/resvg-js`:** install both, write a small Astro endpoint at `src/pages/og/[slug].png.ts` that takes the post's frontmatter and renders an OG image at build time. Future-pass work; not in scope for the foundation.

The site references `/og-default.png` from `BaseLayout.astro` for any page without a per-page `ogImage` override. Replace the file at any time.

---

## Future work (deferred to pass 2)

The AI features are intentionally NOT in this build:

- **AI features (chat, JD-fit, etc.).** Cut from this pass entirely. No `/fit` route, no chatbot widget. The brand strategist's read prevailed — both are 2026 clichés that would dilute the "builder with taste" signal. The Brain System project page carries the AI flex on its own with real specifics (dated artifact, running tunnel, $0/mo cost). If a real AI feature lands later, it gets a new home — likely an "Ask AI about this chapter" expander on `/experience` or a homepage hero treatment — not a reserved-for-later route.
- **Brain System live data.** The status block currently shows `[live]` placeholders. When ready, replace with a `fetch()` call to a public read-only endpoint on `brain.aashishj.com` (or pass through a Pages Function for header rewrites). The component (`<BrainStatus />`) is set up for this — just wire fetch + replace `<span class="ph-inline">[live]</span>` with the real values.
- **Per-post OG image generation.** See "Regenerating OG images" above.
- **Search across writing.** Skipped. When the post count crosses ~20, add Pagefind via `pnpm pagefind` post-build step.

---

## Voice and content guardrails

(Baked into the placeholder copy; live here for future contributors / the next round of edits.)

- Frame all consulting-firm references as "a large management consulting firm." The site never names the firm. The LinkedIn link in the footer can.
- The `Gaps` column on `/skills` is a feature. Specificity > self-deprecation. Don't soften individual entries.
- No "passionate," "synergy," "10x," "leveraged."
- No generic openers ("welcome to my corner of the internet"). Start in the middle of a sentence if you have to.
- Specific numbers and proper nouns carry weight.
- One moment of dry self-awareness on the homepage is allowed and earned.

---

## License

All rights reserved. The content is Aashish's; the code structure can be referenced freely but please don't clone the design wholesale.
