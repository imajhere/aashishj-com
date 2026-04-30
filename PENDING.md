# PENDING

What's left for aashishj.com. Living document — update as items complete.

> **Last reviewed:** 2026-04-30

```
[me]  = a future Claude/agent session can do this — ask
[you] = only Aashish can do this (auth, voice, decisions)

🔥    = blocking before any big share / job-hunt push
🟡    = should-do, not blocking
✨    = nice-to-have polish
📅    = recurring / scheduled
```

---

## A · Body copy (your voice)

Every paragraph wrapped in a yellow `[PLACEHOLDER]` block on the live site is currently my draft. They render fine but aren't your words. Replace them in your own voice.

### A1 · Homepage `/` — 6 blocks 🔥

| # | Where | Current draft (placeholder) |
|---|---|---|
| 1 | Hero subhead | "Aashish Jagini — engineer who became a PM. PM on an internal platform team at a large management consulting firm. I built a self-hosted AI memory I use daily, and I write a few essays a year about PM and AI tooling." |
| 2 | Section I Brain — body para 1 | "As of April 2026, Aashish runs Brain — a self-hosted memory server on a Mac Mini..." |
| 3 | Section I Brain — thesis pull-quote (italic) | "The bet: in 2026, the cheapest edge is a memory your AI tools can search. I built mine. It costs nothing." |
| 4 | Section I Brain — caption italic ("Boring on purpose…") | "Boring on purpose. The cleverness is that there is nothing clever — no agent framework, no $400/month vector DB. Just hybrid search done right." |
| 5 | Section II — post descriptions (×2) | Inherited from MDX frontmatter; rewrite when you write the posts (see C1). |
| 6 | Section IV — Reach out body | "I'm always up for conversations with PMs and operators building on top of LLMs. The best way to reach me is imajhere@gmail.com." |

**`[you]`** · Files to edit: `src/pages/index.astro`, `src/content/writing/*.mdx` (for #5).

### A2 · `/experience` — 25 blocks 🔥

Each of 8 chapters has 3 placeholder slots: summary, pull-quote (`SHIPPED · X · LEARNED · Y`), AI Context expander (empty).

```
Chapter I    · Tech Mahindra            (3 blocks)
Chapter II   · Microsoft Student Partner (3)
Chapter III  · MBA · University of Missouri (3)
Chapter IV   · Adroit Associates / NYC Gov (3)
Chapter V    · Large management consulting firm · Platform PM (3)
Chapter VI   · 78 Labs                  (3)
Chapter VII  · Team 78                  (3)
Chapter VIII · Brain System             (3)
+ page lede paragraph                   (1)
                                        ───
                                          25 blocks
```

**`[you]`** · File: `src/pages/experience.astro`. The structure (`years`, `location`, `org`, `title`) is correct — only the slotted body content needs writing. AI Context expanders can stay empty (they're reserved for the future "Ask AI About Me" feature; only matters in pass 2).

### A3 · `/projects` — 4 blocks 🔥

| # | Where | Notes |
|---|---|---|
| 1 | Brain System body para 1 | The "what is Brain" paragraph |
| 2 | Brain System body para 2 | The "why I built it" paragraph |
| 3 | Brain System pull-quote (italic) | `SHIPPED · X · WHY · Y` style |
| 4 | "A note on this page" closing italic | Why it's intentionally one project |

**`[you]`** · File: `src/pages/projects.astro`.

### A4 · `/skills` — 2 blocks 🟡

- Page lede paragraph
- "A note on Column III" closing block

**`[you]`** · File: `src/pages/skills.astro`. The skill lists themselves (Strong / Moderate / Gaps) are real and don't need rewriting.

### A5 · `/writing` — 1 block 🟡

- Index page lede ("how often I publish, what to expect")

**`[you]`** · File: `src/pages/writing/index.astro`.

### A6 · `/decisions` — 14 blocks 🟡

- Page lede paragraph
- 4 decision entries × 3 fields each (Considered / Chose / Would revisit if) = 12 blocks
- Closing italic note ("a note on this log")

**`[you]`** · File: `src/pages/decisions.astro`. Titles + dates are real; bodies are my drafts.

> **Editorial rule already baked into the file:** never add a decision entry whose "Considered" field would name something you deliberately hide elsewhere on the site (employer, side businesses). Test before adding.

---

## B · Posts (your voice)

### B1 · `pm-os.mdx` 🔥

**`[you]`** · File: `src/content/writing/pm-os.mdx`
- Frontmatter is set: title, description, pubDate (2026-04-28), tags, `draft: true`
- Body is just `> TODO: paste full draft from personal archive.`
- Set `draft: false` after writing to publish

### B2 · `brain-system.mdx` 🔥

**`[you]`** · File: `src/content/writing/brain-system.mdx`
- Same state as B1
- pubDate: 2026-04-29
- Set `draft: false` to publish

### B3 · Tag taxonomy decision 🟡

Currently `tags: ["product-management", "ai", "tools"]` on pm-os and `["ai", "infrastructure", "mcp"]` on brain-system — sensible defaults but unconfirmed. Decide a canonical 5-8 tag system before publishing more posts so taxonomy doesn't drift.

**`[you]`** · Decision; then update both MDX files.

---

## C · Identity / metadata

### C1 · Confirm X (Twitter) handle 🟡

Currently hardcoded as `@aashishjagini` / `x.com/aashishjagini` in 3 places: `BaseLayout.astro` JSON-LD `sameAs`, `BaseLayout.astro` Twitter creator meta, `Footer.astro`, `PostLayout.astro` share-tweet URL.

If `aashishjagini` is correct → no action.
If different → tell `[me]` the right handle and I'll patch.
If you don't have an X account → tell `[me]` and I'll remove it from `sameAs` + footer + share links.

### C2 · GitHub presence ✅ DONE

Profile README, avatar, bio, pinned repos all live at github.com/imajhere.

### C3 · LinkedIn URL ✅ DONE

`linkedin.com/in/aashishjagini` confirmed correct.

---

## D · Verification (after enough placeholders are replaced)

### D1 · Lighthouse score ≥95 🟡

Original spec acceptance criterion. Run on `/` and a published post page once content is real.

**`[me]`** · Ask: "run Lighthouse on aashishj.com homepage and a writing post."

### D2 · Mobile pass 🟡

Real-device testing across all 6 routes (`/`, `/experience`, `/projects`, `/skills`, `/writing`, `/decisions`). The CSS has the right breakpoints but hasn't been touched on a real phone yet.

**`[you]`** primarily (open on phone, click around). **`[me]`** to fix anything you flag.

### D3 · Dark mode pass 🟡

Same, on desktop. Toggle theme, click through every route, confirm contrast/readability.

**`[you]`** primarily. **`[me]`** to fix.

### D4 · OG image preview 🟡

After final hero copy lands, regenerate the OG image (currently uses my draft hero) and re-check unfurl on Slack/LinkedIn/X.

**`[me]`** · Ask: "regenerate OG image with current hero copy."

---

## E · Small open decisions

### E1 · "MCP integration notes" link 🟡

Currently `href="#"` on `/` (Section I Brain) and `/projects`. Either:
- **`[you]`** write the doc and tell `[me]` where to link it
- **`[me]`** kill the button if you'd rather not have it

### E2 · 404 page polish ✨

Functional but generic. Could fit one more on-brand line ("the site has 6 routes, you found a seventh — impressive").

**`[me]`** · Ask: "polish the 404 with one dry self-aware line."

### E3 · Public README softer intro ✨

The README opens with dev-onboarding ("Install pnpm, run dev"). Now that the repo is public + pinned on GitHub, the first 2-3 paragraphs could be a softer "what is this" for non-dev visitors before the commands.

**`[me]`** · Ask: "rewrite the README intro for non-dev readers."

---

## F · Maintenance / recurring

### F1 · Monthly Brain refresh 📅 ✅ Reminder set

```
Day 1 of every month →
  cd ~/Projects/aashishj-com
  pnpm refresh:brain
  git add src/data/brain-status.json
  git commit -m "Refresh Brain status"
  git push
```

**`[you]`** · Apple Reminder is set. Takes <1 min when triggered.

### F2 · "Running since" milestone 📅

If/when Brain crosses meaningful milestones (1 year, major version, public open-source release), update `runningSince` in `src/data/brain-status.json`.

**`[you]`** · Manual edit. Currently `"2025"`.

### F3 · Role title 📅

If your role/level changes (e.g., promotion, new firm), update:
- `Day` cell in homepage hero stats strip — `src/pages/index.astro` line ~57 ("Platform PM")
- Chapter V org/title in `src/pages/experience.astro`
- JSON-LD `jobTitle` / `worksFor` in `src/layouts/BaseLayout.astro`
- LinkedIn (separately)

**`[me]`** · Ask: "update my role to X" and I'll patch all three.

---

## G · Future / deferred (not for this pass)

| | Idea | Source | When |
|---|---|---|---|
| **`[me]`** | Wire `[live]` brain pills to a true-live Cloudflare Worker proxy | reviewer panel | If/when monthly refresh feels like friction |
| **`[me]`** | Per-post OG image generation via satori + @resvg/resvg-js | original spec, deferred to "post 5+" | After ~5 published posts |
| **`[me]`** | Cloudflare Web Analytics beacon (richer client-side metrics) | nice-to-have | Anytime you want CWV / browser breakdowns |
| **`[me]`** | RSS feed at `/writing/rss.xml` | not in spec | If you want rss.aashishj.com listeners |
| **`[me]`** | "Read From My Brain" demo console on `/projects#brain` | brand strategist's #1 | If/when peer-impact justifies maintenance |
| **`[me]`** | `/llms.txt` at site root for AI crawler discovery | career strategist's #3 | Anytime — 1 hour, zero maintenance |
| **`[you]`** | AI Context expanders content (8 chapters) on `/experience` | original spec | Pass 2 (when AI features land) |
| **`[me]`** | Re-add an AI feature in a new home (chapter expanders, hero hero treatment) | reviewer convergent recs | Only if your read on the audience shifts |

---

## H · What's already done (recap, for context)

- Site live at https://aashishj.com (Cloudflare Workers Static Assets, auto-deploy on push to main)
- Repo public at github.com/imajhere/aashishj-com
- Profile public at github.com/imajhere with README + avatar + bio + pinned repos
- 6 routes: `/`, `/experience`, `/projects` (Brain only), `/skills`, `/writing`, `/decisions`
- `/fit` cut entirely
- Hero stats strip wired (BRAIN: 2,708 docs · WRITING: computed from collection)
- Brain status panel wired with real values + "Tended" date stamp
- `pnpm refresh:brain` script for monthly updates
- Email: imajhere@gmail.com everywhere
- JSON-LD entity graph (Person, ProfilePage, BlogPosting, CreativeWork)
- Sitemap + robots.txt
- Self-hosted variable fonts (Source Serif 4, Inter, JetBrains Mono)
- OG image with real site fonts
- Trailing-slash URLs (no Cloudflare 307 penalty)
- 404 page
- CI: typecheck + build on PR

---

## How `[me]` and `[you]` work together

```
You ────────────────────────────────────►  Site
      │                                    ▲
      │ paste real copy in .astro / .mdx  │
      │ git push                           │
      └───────────────────────────────────►┘
                  ~90s deploy

You ──────────►  Claude  ──────────────►  Site
      "do X"      [me]    edits + pushes
```

Most placeholder rewrites are pure text edits — open the file, replace the contents of the `<Placeholder>` block, save. If you want to delegate batches ("draft me 3 chapter summaries in my voice"), ask Claude with the spec + a sample of your voice and review the output.
