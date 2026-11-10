# Sarvamangal — design system (MASTER)

Global source of truth. A page-specific file in `pages/<page>.md` overrides this
for that page only.

## Brief

- **Subject:** a Mumbai volunteer trust running free camps — health check-ups, blood
  drives, notebooks for schoolchildren, coding classes, career guidance, yoga.
- **Audience:** Mumbai/Maharashtra individual donors (mostly on phones), CSR managers,
  student and young-professional volunteers.
- **Page job:** make a visitor feel the human reality of a free camp, then give.

## Where ui-ux-pro-max was overridden, and why

`search.py "nonprofit charity NGO education trust donation emotional storytelling India" --design-system`
returned a Storytelling-Driven style (kept), teal/amber colours and **Baloo 2 +
Comic Neue** (rejected: built for children's apps; wrong for a trust that runs
blood drives and orthopedic camps). Palette and type below were chosen from the
trust's own world instead: its crimson logo, the school notebooks it hands out,
and Indian-made typefaces that also set Devanagari.

## Signature: the school notebook

The trust hands out exercise books printed with
*"तुम शिक्षा को समय दो, शिक्षा तुम्हारा समय बदल देगी।"* The site borrows that object:

- **The camp register** — events from the CMS written into a ruled page: blue
  lines, red margin, the date in the margin. Past camps in ink, upcoming ones
  marked "Coming up" on a dashed row. This is the one bold element per page.
- **Crimson underline** under two words of the hero headline.

No handwriting or script fonts — the owner rejected them (Nov 2026).

Everything else stays quiet: photos, generous space, clean type.

## Colour (tokens in `src/app/globals.css`)

| Token | Hex | Use |
|---|---|---|
| ink | `#17193B` | headings, dark bands, footer (fountain-pen blue-black) |
| ink-soft | `#2B2E4A` | body text (13.2:1 on white) |
| ink-muted | `#5E6283` | secondary text (5.9:1) |
| ink-200 | `#B9BCDB` | text on ink (9.1:1) |
| crimson | `#C8103A` | Donate buttons, margin line — the logo's red (white text 5.9:1) |
| crimson-deep | `#8E0B36` | hover, gradient end (logo bottom) |
| marigold | `#F6B21B` | accents on ink, focus ring on dark (ink text 9.1:1) |
| marigold-soft | `#FDE7B0` | text selection, the “next camp” row |
| paper / paper-2 | `#FFFFFF` / `#F3F6FB` | surfaces (cool notebook white, not cream) |
| ruling | `#BBD3EE` | notebook lines, never text |

Section rhythm on the homepage: white → paper-2 → white (register) → **ink** (give)
→ white → paper-2 → white → **crimson** (final ask) → ink footer.

## Type

| Role | Face | Notes |
|---|---|---|
| Display | **Eczar** (Rosetta, Vaibhav Singh) | Latin + Devanagari; 600 for headings, tracking −0.015 to −0.022em |
| Body | **Mukta** (Ek Type) 400/600 | Devanagari subset also supplies ₹ |
| Labels | Mukta 600, uppercase, 0.14em tracking | `eyebrow` utility, above section titles |

Scale: hero 2.4rem → 3.7rem; section H2 2.15rem → 3rem; body 17–20px, line-height 1.6.

## Layout

- Container `max-w-7xl`, gutters 16/24/32px. Sections `py-20 lg:py-28`.
- 12-column grid on desktop; text never wider than ~65ch.
- Phones: hero photo first; cause cards become a swipe row; sticky Donate bar after
  the hero, hidden near the closing CTA.
- Radius: cards 16–28px, buttons full pill.

## Motion

- Hero lines rise in (700ms, staggered 140ms); the accent underline fades up into place after (700ms).
- Sections fade up once on scroll (`data-reveal`, 650ms).
- Hover: 1px lift, photo zoom 1.03–1.04, arrow nudge.
- All of it off under `prefers-reduced-motion`; content is visible without JS.

## Copy voice

Plain, specific, warm, never pitying. Name real places (Bhandup, Mulund, Pabal)
and real numbers from the CMS. No invented statistics or costs. Sentence case.

## Anti-patterns

- Stock photos — use the trust's own camp photos.
- Pity imagery or guilt copy.
- Emoji as icons (Lucide + the inline social marks only).
- More than one signature element per page.
- Showing numbers or costs that the trust's records can't back.
- Hidden financial/registration details — 80G, PAN and registration are always in the footer.
