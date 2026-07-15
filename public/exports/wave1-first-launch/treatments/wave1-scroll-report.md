# Wave 1 — Scroll-Stopper Report (Treatments E & F, 4:5)

Built on the approved **Treatment C** hierarchy and pushed into bold, dimensional
direct-response styling. **No OpenAI / image-generation calls.** Portrait plates unchanged.
All exports `1080 × 1350`, real Be Vietnam ExtraBold (weight 800).

- Review board: `public/wave1-scroll-review.html` (C / D / E / F side by side)
- Contact sheet: `public/exports/wave1-first-launch/contact-sheet-4x5-scroll.png`
- Machine QA + sizes: `treatments/wave1-scroll-report.json`
- Editable SVG sources: `treatments/sources/*_4x5_E.svg` / `_F.svg`

**E** evolves C (offer-first, no bullets). **F** evolves D (adds two benefit blocks).

## Effects added (all layered SVG — no blur, neon, chrome, or CSS filters)

**1. Dimensional headline**
- Dark-teal extrusion (`#0A3A4A`) stepped ~10% of font size down-right behind every line.
- Dark stroke (`#03202A`, ~5% of size) via `paint-order:stroke` for crisp edges on photo.
- White fill foreground. Line-height 1.02, tight stacked ExtraBold.

**2. Exploding focal word** (SPANISH · LANGUAGE · WORKFLOW · MAXED OUT · MOVING)
- Tilted (-2.2°) deep-teal slab with cyan border + offset shadow behind the word.
- Cyan fill + thick cream outer stroke + its own extrusion → sticker-style pop.
- Cyan underline swash beneath. One focal word per ad carries the punch.

**3. Concept stopping icon** — dimensional top-right badge (cyan disc, cream ring, shadow,
highlight arc), placed above the eye line, never over the face:
| Concept | Icon |
|--------|------|
| VMA-33 / VMA-34 (bilingual) | **EN/ES speech-bubble** (neutral — no flag/stereotype) |
| VMA-37 (workflow) | workflow arrow → **checkmark** |
| VMA-41 (capacity) | **front-desk bell** with ring arcs |
| VMA-43 (schedule) | **calendar + check** |

**4. Promo $10/HR block**
- `STARTING AT` cyan ribbon strip + huge `$10` (132px E / 106px F) white, `/HR` cyan.
- Double border (outer cyan 8px + inner cream 4px), offset drop-shadow block, -3° tilt,
  cyan/cream sparkle marks. Positioned lower-left, off the face. "STARTING AT" ≥ 38px.

**5. Physical CTA button**
- Deep-teal extrusion base + shadow beneath, cyan button, cream 5px border, inner highlight
  arc, bold navy 52px label, thick arrow. Reads as a pressable button at thumbnail size.
- E: `REQUEST AN INTERVIEW` · F: `MEET YOUR NEXT HIRE`.

**6. Motion cues** — sparkles around the offer + three graduated cyan chevrons pointing down
toward the CTA (E). Icon ring-arcs / calendar imply activity.

## Typography sizes
| Element | E | F |
|--------|----|----|
| Headline | 97–115px | 97–115px |
| Focal word | same size, cyan slab + cream outline | same |
| `$10` | 132px | 106px |
| `STARTING AT` | 40px | 38px |
| Solution line | 46px | 44px |
| Benefit blocks | — | 42px (cyan check chips) |
| CTA | 52px | 52px |

## QA
- All 10 exports `1080 × 1350`; real ExtraBold, no fallback.
- No text over faces; icons above the eye line; portraits fully visible (soft scrim only).
- No text under 38px except the logo.
- Headline, `$10/HR`, CTA, and icon all legible at feed thumbnail scale.
- Pink/magenta scan: 0–120 stray px per image (≤0.008%), warm skin tone only; none in overlays.
- Brand `MedVirtual` only; dedicated-staff framing (no call center / AI / software); no HIPAA,
  savings, or guarantee claims; bilingual emblem is neutral EN/ES (no national flag).
- Zero image-generation API calls; approved plates untouched (`plates/4x5/selection.json`).

## Next
Pick the winner per concept (**E** offer-first or **F** with benefits), plus any focal-word or
icon tweaks. Then I'll expand the winners to 1:1 / 9:16 / 1.91:1 and animation — not started yet.
