# Project Vintage — Design System

This document is the single source of truth for visual design across Project Vintage. Every UI component, page, email, and exported document must follow these rules. Reference mockups at `/design/reference/` are the canonical visual implementation; this file is the written system that produced them.

When in doubt: editorial, not enterprise. Magazine, not dashboard. Considered, not generic.

---

## Design Philosophy

The product's visual language is editorial. Not enterprise SaaS. Not dashboard. Not generic startup. The reference points are high-end print magazines (Excellence, Cavallino, Robb Report), modern luxury research tools (Watchcharts), and well-designed editorial software (Linear, Stripe, Vercel).

The user should feel they are reading something considered, not navigating a tool. A 60-year-old wealthy collector should look at the page and recognize the same care they expect from a Sotheby's catalog or a Hagerty Insider feature.

If a design choice could appear unchanged in any other generic SaaS product, it is wrong for this audience.

Five principles guide every visual decision:

1. **Restraint.** White space, low color saturation, minimal ornamentation. Nothing competes with the content.
2. **Typography is the primary design tool.** Hierarchy is established with type, not color or weight.
3. **The verdict is the hero.** Whatever the user came to find should be visually first and most prominent.
4. **Data and editorial coexist.** Metric tiles next to italic prose. Numbers next to narrative. Both feel intentional.
5. **Quiet, not loud.** No animations beyond functional ones. No gradients, drop shadows, glows, or decorative effects. Restraint signals premium.

---

## Color Tokens

The palette is warm, paper-toned, and restrained. All colors used in production must come from this list. No off-palette hex values.

### Backgrounds
- `--bg-canvas`: `#FAF8F3` — the warm cream paper background. Used as the main page background.
- `--bg-surface`: `#FFFFFF` — white cards on cream. Used for content blocks and metric tiles.
- `--bg-elevated`: `#F5F2EA` — slightly darker than canvas. Used for nav bar, footer, and embedded panels (e.g., "Also in the full report" strip).

### Text
- `--text-primary`: `#2C2A24` — warm near-black. Headlines, primary content, button text on light buttons.
- `--text-secondary`: `#3D3A30` — warm dark gray. Body prose, italic editorial.
- `--text-tertiary`: `#6B6557` — warm medium gray. Subtitles, supplementary information.
- `--text-quaternary`: `#8B7D5E` — warm light gray. Field labels (small caps), metadata.
- `--text-muted`: `#B4B2A9` — warm muted. "Sign in to see" placeholder text only. Used sparingly.

### Accents
- `--accent-primary`: `#8B6914` — muted gold/bronze. Section labels, the verdict's left rule, key emphasis. The signature color.
- `--accent-secondary`: `#B4A875` — pale gold. Numbered list markers (01, 02, 03). Subtle.

### Semantic (severity)
Desaturated semantic colors that fit the warm palette. Never use bright/saturated equivalents.

- `--severity-positive`: `#1D9E75` — deep teal (not bright green). "This car" findings. Common factory color rarity. Live auction status.
- `--severity-caution`: `#BA7517` — deep amber (not yellow). "Worth asking" findings. Generation-level concerns at age threshold.
- `--severity-concern`: `#A32D2D` — deep coral (not bright red). "Watch closely" findings. Material condition concerns.

### Borders and Dividers
- `--border-default`: `#D4CFC0` — warm tan, 0.5px. Card borders, divider rules, nav bottom border. The default.
- `--border-subtle`: `#E8E2D5` — warm light tan, 0.5px. Internal dividers within cards (between rows, sections).

### Dark Mode (V1.5+)
Dark mode is required for V1.5. Cream becomes warm charcoal. Inversions:
- `--bg-canvas` → `#1A1815` (warm charcoal)
- `--bg-surface` → `#252220` (slightly lighter charcoal)
- `--text-primary` → `#F0EDE5` (warm cream)
- `--accent-primary` stays gold but at higher luminance: `#C4A04A`
- Severity colors slightly brightened for legibility.

Do not ship dark mode in V1.

---

## Typography

Three font families. Three uses. Two weights only (400 regular, 500 medium). No bold. No italic except where specified.

### Fonts
- **Serif** (editorial, headlines, body editorial): production should use **Source Serif Pro** (free, Google Fonts) for V1, with the option to upgrade to **Tiempos Text** (Klim Type Foundry, ~$200) when budget allows. Tiempos is the bar; Source Serif Pro is acceptable.
- **Sans** (UI chrome, buttons, navigation, form fields): **Inter**, Google Fonts, free.
- **Mono** (VINs, prices when shown as data): **JetBrains Mono**, Google Fonts, free.

### Type Scale
- **H1 (page headline)**: 38px serif, regular weight, line-height 1.15, letter-spacing -0.01em
- **H2 (section header)**: 22px serif, regular weight, line-height 1.3
- **H3 (verdict, major content headlines)**: 22-24px serif, regular weight
- **Body editorial (italic prose, era guides, summaries)**: 14-16px serif italic, line-height 1.65
- **Body data (descriptions, findings)**: 12-13px sans, line-height 1.5-1.6
- **Field value (data displays)**: 15-17px serif, regular weight
- **Section label (small caps)**: 10-11px serif, letter-spacing 0.18em, uppercase, color = `--accent-primary`, font-weight 500
- **Field label (small caps)**: 10px sans, letter-spacing 0.06em, uppercase, color = `--text-quaternary`
- **Metadata / metaphor (live status, dates)**: 11px serif, letter-spacing 0.14-0.18em, uppercase, color = `--accent-primary`
- **Mono (VINs, codes)**: 11-13px JetBrains Mono, letter-spacing 0.04em, color = `--text-quaternary` or `--text-primary`

### Rules
- No mid-sentence bolding. Bold is for headings and labels only.
- Sentence case throughout. Never Title Case in UI. Never ALL CAPS except in small-caps section labels.
- Two weights only: 400 (regular) and 500 (medium). Never 600 or 700.
- Italic serif is for editorial voice (era guides, prose summaries, attributions). Italic sans is for placeholder text only ("Sign in to see").

---

## Layout and Spacing

### Page Container
- Max content width: 1200px on desktop, fluid below.
- Page background: `--bg-canvas`.
- Page padding (desktop): 28-32px horizontal.

### Cards
- Background: `--bg-surface` (white).
- Border: 0.5px solid `--border-default`.
- Border radius: **0** for traditional editorial cards. Pure rectangles, magazine-style. (No rounded corners on content blocks.)
- Padding: 22-26px for content cards, 14-16px for metric tiles.
- Box shadow: **none**. Borders only.

### Verdict Block (special treatment)
- Background: `--bg-surface`.
- Border: 0.5px solid `--border-default` on top, right, and bottom.
- Left edge: 3px solid `--accent-primary`. The signature gold rule.
- Border radius: 0.

### Teaser Block (full analysis)
- Background: `--bg-surface`.
- Border: 0.5px solid `--border-default`.
- Top edge: 3px solid `--accent-primary`. Differentiates from verdict (which uses left rule).
- Border radius: 0.

### Buttons
- Border radius: 2px. Slight, almost square. Never pill-shaped.
- Primary: background `--text-primary` (#2C2A24), text `--bg-canvas` (#FAF8F3). Used for the single most important action on a page.
- Secondary (outlined): transparent background, 0.5px solid `--text-primary`, text `--text-primary`.
- Padding: 10-12px vertical, 20-24px horizontal.
- Font: Inter sans, 13px, font-weight 500, letter-spacing 0.02em.

### Whitespace
- Generous. The page should feel quiet. Crowded layouts read as enterprise; sparse layouts read as editorial.
- Vertical spacing between major sections: 20-28px.
- Internal section padding: 22-26px.
- Default margin between paragraphs: 14px.

### Grid
- Two-column blocks (e.g., About this car / About the era): equal weight, 16px gap.
- Four-column metric tiles: 10px gap.
- Six-column specs grid: 14-16px gap.
- Above 768px breakpoint: multi-column. Below: stack to single column.

---

## Component Patterns

### Persistent Top Navigation
Appears on every authenticated page. Layout: logo (serif) on left, URL paste field (sans) center-wide, user avatar (28px circle) on right. Background `--bg-elevated`, 0.5px bottom border `--border-default`. Padding 14px vertical, 28px horizontal.

The URL field is the magic moment shortcut. Pressing Enter routes to a new analysis. Always present. Never collapsed behind an icon.

### Section Label
Small caps, 11px serif, 0.18em letter-spacing, color `--accent-primary`, weight 500. Always uppercase. Used at the top of every content card. The signature pattern.

Examples: "THE VERDICT", "CHASSIS IDENTITY", "THE 993 ERA", "ABOUT THIS CAR", "PERIOD REVIEWS".

### Field Label + Value Pattern
Used in data displays (Chassis Identity, Vehicle, etc.).

- Label: 10px sans, 0.06em letter-spacing, uppercase, color `--text-quaternary`, margin-bottom 4px.
- Value: 15-17px serif, regular weight, color `--text-primary`.

Vertically stacked. Never inline.

### Numbered Editorial List
Used for findings, watch-outs, period reviews. Each item:
- Number marker (01, 02, 03): 18px serif, color `--accent-secondary` (pale gold), min-width 22px, line-height 1.
- Severity dot: 5-6px circle in `--severity-*` color.
- Title: 14-15px serif, color `--text-primary`.
- Optional qualifier: 11px serif italic, color `--text-tertiary`.
- Body: 12-13px sans, color `--text-tertiary`, line-height 1.5-1.55.
- Divider: 0.5px solid `--border-subtle` between items.

### Metric Tile
- Card: white surface, 0.5px border `--border-default`, padding 14px 16px.
- Label: small caps section label (10px serif, gold).
- Value: 18-22px serif, color `--text-primary`.
- For gated values (anonymous user): "Sign in to see" in 16px serif italic, color `--text-muted`. Never the word "Locked".

### Status Indicator
A small dot (5-6px circle) + descriptor. Used for live auction state, severity, color rarity, source attribution.
- Dot color: `--severity-*` based on state.
- Text: 11-12px serif italic for descriptive ("Common factory color"), 11px serif uppercase 0.18em for status ("LIVE · ENDS [date]").

### Action Button Row
Bottom of every analysis page. Three buttons:
- "View on Bring a Trailer ↗" — primary (dark filled). Reflects the brand principle: drive traffic to source platforms.
- "Watch this car" — secondary outlined.
- "Save analysis" — secondary outlined.
- Gap between: 10px.
- Top border above: 0.5px solid `--border-default`, padding-top 20px.

---

## Iconography and Visual Elements

### Dots and Markers
- Severity dots: 5-6px solid circles. No outline, no animation.
- Live auction dot: 5px green dot, may pulse subtly (only animation allowed on the page; respects prefers-reduced-motion).

### Lines and Rules
- Card borders: 0.5px solid `--border-default`.
- Internal dividers: 0.5px solid `--border-subtle`.
- Verdict accent: 3px solid `--accent-primary` on left edge only.
- Teaser accent: 3px solid `--accent-primary` on top edge only.

### Photos and Imagery
- Era hero photos: duotone treatment (cream + warm dark) so they integrate with brand palette.
- Always captioned with source attribution: "Representative [Generation] · Photo: [Source/License]".
- Never AI-generated. Never scraped from auction listings (those are seller copyright).
- Source: Wikimedia Commons (CC-licensed) primarily. Manufacturer press kits if license allows.
- Size: 110-160px height when used as section header image. Never larger than the editorial content alongside it.

### Animations
Restraint is the brand. Animations are functional only.

Permitted:
- Live auction dot: subtle 2-second pulse loop. Respects prefers-reduced-motion.
- Page load: metric tiles fade in sequentially over 600ms, one-time only on initial paint. No loop, no scroll trigger.
- Multi-step loading state on analyze submission: each step ticks visibly with a checkmark on completion.

Prohibited:
- Bouncing icons, sliding panels, scroll-triggered animations, animated gradients, particle effects, parallax, anything decorative.
- "Reveal on scroll" patterns. Content is visible immediately or it isn't there.

---

## Voice and Tone in Copy

Copy is part of design. The voice is:

- **Considered, not casual.** "We found 3 things you should ask the seller" is right. "Hey, check out these 3 things!" is wrong.
- **Direct, not promotional.** "Priced at fair value" is right. "Great deal on this car!" is wrong.
- **Confident, not hedging.** "Mileage well below average" is right. "This might be lower mileage than typical" is wrong.
- **Specific, not generic.** "47,000 miles vs. 65,000-mile median" is right. "Low mileage" is wrong.
- **Editorial, not engineering.** "The last of the air-cooled" is right. "This is a 993 generation Porsche" is wrong.

The reference voice is Excellence magazine, Cavallino, the Hagerty Insider editorial team. Read those publications to calibrate.

---

## Page Architecture Patterns

### Initial Report (single page)
1. Persistent top nav
2. Live status indicator
3. Headline + VIN
4. Italic subtitle (color, transmission, generation, mileage)
5. Verdict block (gated for anonymous)
6. Four metric tiles
7. Two-column: Chassis Identity + Era Guide
8. Color Rarity bar
9. Full Analysis teaser block (severity-color findings preview, "Also in the full report" strip, primary CTA)
10. Action button row (View on BaT primary)

### Full Report (separate route, deeper analysis)
1. Persistent top nav
2. Live status indicator
3. Headline + VIN
4. Italic subtitle
5. Verdict block (unlocked, with methodology and confidence)
6. Four metric tiles (all populated)
7. Two-column: About this car + About the era (with hero image, expanded watch-outs)
8. Period Reviews section
9. Vehicle full data section (6-column)
10. Color Rarity (enriched with paint code and context)
11. Action button row (View on BaT primary)

Both pages share the same top section (1-6). The full report extends with deeper editorial sections (7-10).

---

## Constraints and Anti-Patterns

These are the things that, if a future build chat suggests them, you push back on:

- **No rounded card corners.** Pure rectangles only. Rounded corners read as generic SaaS.
- **No drop shadows.** Borders only. Shadows read as enterprise dashboard.
- **No gradient backgrounds.** Solid colors only. (One exception: era hero photo placeholders may use a gradient for visual interest pre-image-load, but the production version uses an actual photo.)
- **No bright/saturated colors.** Desaturated palette only. Bright green/yellow/red read as alert dashboard.
- **No emoji in UI.** Editorial voice does not use emoji.
- **No icon-heavy navigation.** Icons should be minimal; the magic moment is the URL field, not iconography.
- **No "Locked" copy on gated content.** Use "Sign in to see" or "Pro feature" framing.
- **No card grids of equal-weight features.** Editorial hierarchy means some content is bigger than others. Never default to "3 equal cards in a row" when one of them is more important.
- **No carousel/slideshow patterns.** All content visible at once or it isn't there.
- **No marketing speak in copy.** "Unlock unlimited insights!" is wrong. "Read the full analysis" is right.
- **No sans-serif headlines.** Headlines are always serif. The serif-headline / sans-UI distinction is the visual signature.

---

## How to Use This Document

When proposing UI work:

1. Read this document fully before writing any component code.
2. Reference the mockups at `/design/reference/` as the canonical visual implementation.
3. When in doubt, choose the option that better matches Excellence magazine, not the option that better matches a typical SaaS dashboard.
4. If a design decision feels novel (not covered here), pause and ask in the chat before implementing. Adding novel patterns without alignment leads to drift.
5. After implementing, validate against the reference mockups. The pages should feel like they were designed by the same person.

When reviewing UI work:

1. Compare against the mockups visually.
2. Check that all colors come from the token list above.
3. Check that typography uses serif for editorial moments and sans for UI chrome.
4. Check that severity colors are correctly applied (deep teal/amber/coral, not bright variants).
5. Check that the verdict is hero-treatment, the section labels are small caps gold, and there are no rounded corners on cards.
6. Reject anything that reads as generic SaaS regardless of how functional it is.

---

## When to Update This Document

This is a living document. Update it when:

- A new component pattern is introduced and approved.
- A token value changes.
- A constraint is loosened or tightened.
- A new page architecture is added.

Do not update it casually. Each update should be reviewed at the strategy level (this chat or its successor) before being committed.

---

End of design system.
