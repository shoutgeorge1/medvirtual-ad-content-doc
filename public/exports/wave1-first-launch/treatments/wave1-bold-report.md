# Wave 1 — Bold Treatment Report (4:5)

Approved talent plates preserved exactly. **No new image-generation API calls.** Only
the coded composites were revised. Two treatments per concept = **10 composites**, all
`1080 × 1350`.

Review board: `public/wave1-bold-review.html`
Contact sheet: `public/exports/wave1-first-launch/contact-sheet-4x5-treatments.png`
Machine QA: `public/exports/wave1-first-launch/treatments/wave1-bold-report.json`

## Typography system
- **Font:** Be Vietnam ExtraBold (heaviest weight) for headline, `$10`, and CTA.
- **Headline:** 3 short stacked lines, line-height 0.98 (tight). Auto-fit sizes:
  - VMA-33 85px · VMA-34 95px · VMA-37 85px · VMA-41 80px · VMA-43 95px (Treatment A)
  - Treatment B runs 84–88px.
- **Accent word** (SPANISH / BILINGUAL / WORKFLOW / MAXED OUT / MOVING) in cyan `#00B2E2`
  with a cyan underline bar for direct-response emphasis.
- Supporting proof line: SemiBold 30px (single line, no bullet stacks).
- Trust microline: Medium 20px (smallest text, still legible).

## Pricing treatment
- Exact approved phrasing only: **`STARTING AT $10/HR`**.
- `$10` is the largest element in the offer block — 116px (A) / 86px (B) ExtraBold.
- Housed in a high-contrast cyan `#00B2E2` badge with navy `#06333F` text, drop shadow,
  and inner highlight stroke. Placed in the left copy column, never over a face.
- No savings %, guarantees, comparisons, or extra pricing claims added.

## CTA
- **Treatment A:** `REQUEST AN INTERVIEW` — solid cyan button, navy text, arrow, 34px, ~98px tall.
- **Treatment B:** `MEET YOUR NEXT HIRE` — white button, teal text, arrow, 34px, ~98px tall.
- Strong padding, shadow, and separation. No footer-sized CTA.

## Brand / pop
- Palette limited to `#0D546B` / `#077999` / `#00B2E2` + white/cream/soft-cyan. No pink/magenta.
- Left copy column uses a dark teal scrim; A uses a heavier panel for maximum contrast,
  B uses a lighter scrim so the portrait reads more prominently.
- Depth via layered shadows, badge/CTA drop shadows, highlight strokes, accent underline.

## Copy reductions (full → bold headline)
| ID | Original headline | New stacked headline |
|----|-------------------|----------------------|
| VMA-33 | YOUR SPANISH-SPEAKING PATIENTS SHOULD NEVER FEEL LOST | DON'T LOSE / SPANISH / PATIENTS |
| VMA-34 | ADD BILINGUAL SUPPORT WITHOUT OVERLOADING YOUR FRONT DESK | ADD / BILINGUAL / SUPPORT |
| VMA-37 | TRAINED FOR THE WAY YOUR PRACTICE WORKS | TRAINED ON / YOUR / WORKFLOW |
| VMA-41 | YOUR FRONT DESK CAN'T DO EVERYTHING | YOUR FRONT / DESK IS / MAXED OUT |
| VMA-43 | KEEP THE SCHEDULE MOVING | KEEP THE / SCHEDULE / MOVING |

Full sentence is preserved as the concept name/primary text; the plate headline is the short version.

## QA (automated, in-pipeline)
- All 10 exports confirmed `1080 × 1350`.
- Pink/magenta scan: 0–115 stray pixels per image (0.0000–0.0079%), all from warm skin tones
  in the approved photography — zero pink in coded overlays.
- Logo, headline, badge, and CTA all fully inside frame; copy sits left, faces sit right (no overlap).
- No new image API calls; selected plates unchanged (`plates/4x5/selection.json`).

## Decision needed before expanding
The hierarchy calls for **"name and role."** Role is shown (`VIRTUAL MEDICAL ADMIN` eyebrow +
"Your dedicated Virtual Medical Admin" lockup in Treatment B). I intentionally did **not**
fabricate a personal name, because these are AI-generated talent plates and the brand rules
removed named "Real People / Talent Pool" profile ads — inventing a name for a synthetic
person is misleading. If you want representative first names on Treatment B, confirm and I'll
add a name+role lockup.
