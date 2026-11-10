@AGENTS.md

# CLAUDE.md

New website for **Sarvamangal Education Trust** (sarvamangaleducationtrust.org), a
Mumbai public charitable trust (est. 2015) that runs free health camps, blood drives,
notebook distribution, coding classes and career/exam-anxiety seminars.
It replaces the old WordPress site.

**The site's two jobs:** move visitors to **donate** (or volunteer), and **rank** —
the owner runs SEO marketing on it. Every decision is judged against those two.

Design source of truth: `design-system/sarvamangal/MASTER.md`. Read it before
touching any UI.

## Status — build in phases, get approval between them

- **Phase 1 (current): landing page only.** Approved? Check with the user before
  starting Phase 2.
- Phase 2: `/events` + `/events/[slug]`, `/causes` + `/causes/[slug]`, `/about`,
  `/volunteer` (form), `/csr`, `/contact`, `/blog` + posts, legal pages
  (`/privacy-policy`, `/refund-policy`, `/terms`), legacy-URL redirects, seed → Sanity
  import script. Links to these routes already exist in the header/footer and 404
  until built (`app/not-found.tsx` handles that gracefully).

## Commands

```bash
npm run dev               # site on :3000 (seed content unless SANITY_PROJECT_ID is set)
npm run build             # production build — run before calling work done
npm run lint
npx tsc --noEmit

cd studio && npm run dev  # Sanity Studio on :3333
cd studio && npm run validate   # schema check
cd studio && npm run deploy     # host the Studio at sarvamangal.sanity.studio
```

## Skills — use them

- **ui-ux-pro-max** (installed globally, `~/.claude/skills`): run its search for any
  new page or component (`--design-system`, `--domain ux|typography|color|landing`).
  Its generic recommendations were overridden for this brand; MASTER.md records
  what was chosen and why. Teammates: `npx skills add nextlevelbuilder/ui-ux-pro-max-skill`.
- **frontend-design** (`.claude/skills/`): plan → critique → build for every new
  page; keep the one signature element per page.
- **web-design-guidelines** (`.claude/skills/`): run as the review pass before
  handing a page over.

Same set as HireHQ (`skills-lock.json`).

## Next 16 specifics (differ from training data — read AGENTS.md)

- **Cache Components is on** (`cacheComponents: true`). All CMS reads are
  `"use cache"` functions in `src/lib/cms/index.ts` with `cacheTag(<sanity _type>)`
  + `cacheLife(...)`. Do not `fetch` CMS data anywhere else.
- `new Date()` / `Date.now()` in render fails the prerender. Read the time only
  inside a `"use cache"` scope (see `getEventTimeline`, `CurrentYear` in Footer).
- `revalidateTag(tag, "max")` — the one-argument form is deprecated.
- `next/image`: `preload` replaces `priority`; every `quality` value must be in
  `images.qualities` in `next.config.ts`; remote hosts in `remotePatterns`.
- Tailwind v4 runs through `@tailwindcss/turbopack` (no PostCSS config). Tokens live
  in `@theme` in `src/app/globals.css`.
- Route protection / redirects would go in `src/proxy.ts`, not `middleware.ts`.

## Architecture

```
src/lib/cms/
  index.ts        public API: getHomePageData, getEvents, getEventTimeline, getCauses…
  types.ts        site-owned types (never leak Sanity shapes into components)
  sanity/         client, GROQ queries, mappers  ← used when SANITY_PROJECT_ID is set
  seed/           real content from the old site  ← used otherwise
studio/           Sanity Studio (separate package; schemas mirror queries.ts)
src/app/api/revalidate   Sanity webhook → revalidateTag
```

- **Events come from the CMS.** Editors add a camp in Studio → publish → webhook
  hits `/api/revalidate` → tag `event` refreshes. Future-dated events show as
  "Coming up" (pencil) on the register; the split re-evaluates daily on its own.
- `siteSettings` is a singleton; any empty field falls back to `seed/content.ts`.
- **Adding a content type**, in order: Studio schema → `queries.ts` → type in
  `types.ts` → mapper in `sanity/source.ts` + seed in `seed/` → getter in
  `cms/index.ts` (with `"use cache"` + tag) → add the tag to `CMS_TAGS`.
- Donation payments happen on the separate app at
  `donation.sarvamangaleducationtrust.org` (repo `sarvam_donation_management*`).
  We only link to it; `donateHref()` adds `?amount=&cause=`, which that app
  **does not read yet** — a small change there would pre-fill the amount.

## SEO rules (non-negotiable)

- Every page: `pageMetadata({ title, description, path })` from `src/lib/seo.ts`
  (sets canonical + full Open Graph). Descriptions ≤ 160 chars. One `<h1>`.
- JSON-LD: `NGO` + `WebSite` in the layout; `FAQPage` where FAQs render; `Event`
  for upcoming events and on event pages. Never assert what the page doesn't show.
- `sitemap.ts` lists **only routes that exist** — add each Phase 2 route as it ships.
- Keep old WordPress slugs: event slugs equal the old post slugs, so
  `/<old-slug>/` must 308 to `/events/<old-slug>` (Phase 2). Old cause URLs
  (`/health/`, `/education/`…) → `/causes/<slug>`; `/recent-events-sarvamangal-education-trust/` → `/events`.
- Server-render all content. Animations never hide content from crawlers:
  `[data-reveal]` sections are visible by default and only hidden while
  `RevealObserver` is actively watching them (`data-reveal-state="hidden"`).
  Never write CSS that hides `[data-reveal]` globally — a section React
  re-mounts (hot reload, navigation) would then stay blank.
- Images: descriptive file names and alt text; `sizes` on every `next/image`.

## Conventions

- **Tokens only** (`bg-ink`, `text-crimson`, `font-display`, `eyebrow`…) — no raw
  hex in components. `on-ink` utility for dark sections (also swaps the focus ring).
- **No handwriting or script fonts** — the owner rejected them. Two faces only:
  Eczar (headings) and Mukta (everything else). Labels above titles use the
  `eyebrow` utility (small capitals). Hero key words get the crimson
  `.accent-underline` (an underline, not a highlight — owner's call).
- Buttons are links: `ButtonLink` / `buttonClasses()`. Touch targets ≥ 44px.
- Every motion respects `prefers-reduced-motion` (`motion-safe:` or the CSS guards).
- Copy: plain, specific, sentence case, Indian English ("programme", "neighbourhood").
  **Never invent numbers, costs or claims.** If a fact isn't in the CMS/seed,
  ask the user.
- Fixed elements inside the header must be portalled to `<body>` (the header's
  `backdrop-filter` traps `position: fixed` children) — see `MobileNav`.

## Content to confirm with the trust (before launch)

- Donation tier amounts and outcomes (`seed/content.ts` → `seedDonationTiers`) — drafts.
- PIN code 400078 for the Bhandup West office.
- Supporter list (Accenture, Microsoft are carried over from the old site).
- Testimonial wording was lightly edited for grammar — get each supporter's OK.
- 80G no. ABGTS0900EF20241 (13 Sep 2024), reg. no. E-0038125 (GBR) and PAN
  ABGTS0900E were taken from the donation-receipt template.
