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

## Signature: the photo wall (Nov 2026 redesign)

Chosen by the owner after a study of ten fundraising sites (charity: water, Watsi,
GiveDirectly, Kiva, Room to Read, CRY, Goonj, Milaap, Akshaya Patra, Rang De). Taken
from them: honest photography over illustration (charity: water, Room to Read's
mosaic of faces), giving inside the hero (GiveDirectly). Not taken: carousels,
handwriting accents (CRY), generic icon grids.

- **The wall** (`components/home/PhotoWall.tsx`) — the cover photo of every past
  camp in the CMS, as tiles in a full-bleed grid with thin ink seams: 4×3 on phones,
  6×4 on tablets, 9×4 on desktop, plus one 2×2 tile (the hero image from Site
  settings). It grows as editors add camps; it only repeats photos if there are
  fewer camps than tiles. Hovering a tile shows the camp and month; clicking opens it.
  Tiles are decorative to screen readers and out of the tab order — the register
  lists the same camps as real links.
- **The hero card** sits on the wall (left on desktop, overlapping the wall's foot on
  phones): eyebrow, h1 with the crimson underline, intro, amount chips (donation
  tiers; a general gift, so no per-cause outcome line — owner's call), Donate, trust row. A caption bar
  under the wall says what the photos are: "Photos from our own camps — N on the
  register since YEAR."
- **Causes** reuse the wall's grid: four edge-to-edge photos with the same seams.
- **The closing strip** (FinalCta) brings the wall back as one row of the latest
  camps, ending in an empty dashed tile: the next camp ("Date being fixed", or the
  announced camp).

### The live band

A 48px ink band under the header, above the wall: a crimson "● Live · updated 13 Nov"
tag, then a slow ticker (≈75px/s) of running totals in marigold Playfair figures with
a small icon ("1,500+ pouches given to students", "300+ units of blood collected"),
then the latest camp, the next camp and the camp count, which keep themselves current.
TV-news vernacular, familiar to every visitor. Pauses on hover; no pause button
(owner's call); under reduced motion it stands still and scrolls sideways. Screen
readers get one plain list, not the moving copies.

### Coming up: the free-entry ticket

Upcoming camps (`UpcomingCamps.tsx`) sit right after the hero, on paper-2, only while
something is scheduled. Each is a ticket because the camps are free to attend — the
donor is who pays for the ticket:

- **Stub** (crimson, behind a dashed perforation with two paper-coloured notches):
  weekday, the day in large Playfair figures (smaller for a range, "19–20"), month
  and year, a marigold countdown chip ("In 9 days", "Tomorrow", "Today" with a pulse),
  "Entry free", Add to calendar. Phones: the stub is the ticket's header; desktop: it's
  the right-hand column.
- **Body**: cause, title, time, place + Directions, summary, the "At the camp" list,
  then one action per audience — Help fund this camp (donor), Volunteer at this camp
  (WhatsApp to the trust), and "Know someone who should come? Send them the details
  on WhatsApp" (neighbours, family groups).
- Later camps get a smaller ticket (date stub on the left; calendar, directions, share).
- The hero caption bar says "Next camp: Sun, 22 Nov · Bhandup West ↓" with a pulse.
- Shared and saved links point to `/#coming-up` until event pages ship (Phase 2).

Everything else stays quiet. The camp register is now a plain dated list (no ruled
lines). The notebook survives in two places only: the Hindi notebook line in the
Give section, and the ruled 404 page.

No handwriting or script fonts — the owner rejected them (Nov 2026).

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

Section rhythm on the homepage: **ink** (live band) → **ink** (photo wall + card) → paper-2 (coming up, only
when a camp is scheduled) → **ink** (cause photos)
→ white (register) → paper-2 (appeal) → **ink** (give) → white → paper-2 → white
→ **crimson** (photo strip + final ask) → ink footer.

## Type

| Role | Face | Notes |
|---|---|---|
| Display | **Playfair Display** (owner's choice, Nov 2026) | Headings and titles, 600. No Devanagari: `--font-display` falls back to Mukta for Hindi and ₹ |
| Body | **Mukta** (Ek Type) 400/600 | Devanagari subset also supplies ₹ |
| Labels | Mukta 600, uppercase, 0.14em tracking | `eyebrow` utility, above section titles |

Scale: hero 2.4rem → 3.7rem; section H2 2.15rem → 3rem; body 17–20px, line-height 1.6.

## Layout

- Container `max-w-7xl`, gutters 16/24/32px. Sections `py-20 lg:py-28`.
- 12-column grid on desktop; text never wider than ~65ch.
- Phones: the wall first (4×3), the hero card overlapping its foot; cause photos
  become a swipe row; sticky Donate bar after the hero, hidden near the closing CTA.
- Radius: cards 16–28px, buttons full pill.

## Motion

- Wall tiles wave in from the top left on load (700ms each, 28ms apart); the hero
  card lifts 28px into place (transform only — the h1 is never hidden); the accent
  underline fades up into place after.
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
