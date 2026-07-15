# Wave 1 — Treatments C & D Report (4:5)

Direct-response rebuild of the 10 composites over the **approved, unchanged** portrait
plates. **No OpenAI / image-generation calls.** All exports `1080 × 1350`.

- Review board: `public/wave1-cd-review.html`
- Contact sheet: `public/exports/wave1-first-launch/contact-sheet-4x5-cd.png`
- Machine QA + sizes: `public/exports/wave1-first-launch/treatments/wave1-cd-report.json`
- Font audit: `scripts/audit-fonts.mjs`

## 1. Font bug found and fixed (root cause of the "weak" look)
The Be Vietnam TTFs all expose typographic family (name ID 16) = **"Be Vietnam"**, so
`fontdb`/resvg register every weight under the single family "Be Vietnam", selected by
numeric weight. The old code set `font-family="Be Vietnam ExtraBold"` — a family that does
**not exist** — so resvg **silently fell back to Be Vietnam Regular (400)**. That is why
Treatments A/B look thin.

**Fix:** render with `font-family="Be Vietnam"` + `font-weight="800"` (ExtraBold).
Verified with a render-diff test: weights 500/600/700/800 each produce a distinct render
(25k+ ink px at 800), while every named-family string collapses to the Regular fallback.
Treatments **C/D use the corrected pipeline**; A/B are kept as the "current" reference.

## 2. Typography (real Be Vietnam ExtraBold, weight 800)
| Element | Treatment C | Treatment D |
|--------|-------------|-------------|
| Headline | 98–116px | 98–116px |
| `$10` | 128px | 105px |
| `/HR` | 56px | 46px |
| `STARTING AT` | 40px | 38px |
| Solution line | 46px | 44px |
| Benefit blocks | — (none) | 42px |
| CTA text | 52px | 52px |

Headline auto-fit is driven by **real rendered-width measurement** (resvg render → sharp
trim), so nothing clips at these sizes. Line-height 0.94 (tight), accent word in cyan.
No text below 38px anywhere except the logo mark.

## 3. Pricing treatment
- Exact approved phrasing only: **`STARTING AT $10/HR`** (no second disclaimer, no savings %).
- `$10` is the largest offer element; housed in a bordered offer box: deep-teal `#0D546B`
  fill, **thick 9px cyan `#00B2E2` border**, offset drop-shadow layer, generous padding.
- Placed lower-left, opposite the portrait's face/eye line — never over the face.

## 4. CTA (real button)
- Treatment C: **REQUEST AN INTERVIEW** — solid cyan pill, navy text, arrow, 52px, 116px tall.
- Treatment D: **MEET YOUR NEXT HIRE** — white pill, teal text, arrow, 52px, 116px tall.
- Full-width feel, shadow, rounded, CTA text larger than any supporting copy.

## 5. Messaging structure
- **C — Maximum Direct Response:** solution kicker (`HIRE A … VIRTUAL MEDICAL ASSISTANT`) →
  huge pain/benefit headline → big `$10/HR` block → oversized CTA. No bullets, no footer.
- **D — DR + Two Benefits:** huge headline → `HIRE A … VIRTUAL MEDICAL ASSISTANT` line →
  two large benefit blocks (≥42px) → `$10/HR` block → oversized CTA. No footer microcopy.

## 6. Copy (rewritten shorter + explicit offer)
| ID | New headline | Solution line | Benefits (D) |
|----|--------------|---------------|--------------|
| VMA-33 | STOP LOSING / **SPANISH** / PATIENTS | HIRE A BILINGUAL VIRTUAL MEDICAL ASSISTANT | BILINGUAL SUPPORT · FULL-TIME STAFF |
| VMA-34 | SPEAK YOUR / PATIENTS' / **LANGUAGE** | HIRE A BILINGUAL VIRTUAL MEDICAL ASSISTANT | ENGLISH & SPANISH · DEDICATED STAFF |
| VMA-37 | TRAINED FOR / YOUR / **WORKFLOW** | HIRE A VIRTUAL MEDICAL ASSISTANT | TRAINED ON YOUR EMR · FULL-TIME STAFF |
| VMA-41 | YOUR FRONT / DESK IS / **MAXED OUT** | HIRE A VIRTUAL MEDICAL ASSISTANT | FULL-TIME STAFF · DEDICATED SUPPORT |
| VMA-43 | KEEP YOUR / SCHEDULE / **MOVING** | HIRE A VIRTUAL MEDICAL ASSISTANT | FULL-TIME STAFF · TRAINED FOR YOUR SYSTEMS |

**Removed vs A/B:** bottom disclaimer line, "Your dedicated Virtual Medical Admin" role
lockup, the small proof sentence, and the eyebrow pill — replaced by an explicit HIRE line.

## 7. QA (automated + visual)
- All 10 exports `1080 × 1350`.
- Real Be Vietnam ExtraBold (weight 800) confirmed rendering — no Arial/Regular fallback.
- No text below 38px except the logo.
- Headline, `$10/HR`, and CTA all legible at thumbnail scale (see review board mini-previews).
- No text over faces; portraits remain visible with a soft left/bottom scrim (not a heavy
  opaque block) that fades out before the face.
- Pink/magenta scan: 0–129 stray px per image (≤0.009%), all warm skin tone in the approved
  photography; zero pink in coded overlays.
- Brand: `MedVirtual` only. No call-center/managed-desk/software/AI language. No HIPAA,
  savings, or guarantee claims. Portrait source files untouched (`plates/4x5/selection.json`).

## Next
Approve C or D per concept (and any headline tweaks). Then I'll expand the winners to
1:1 / 9:16 / 1.91:1 and animation. Not started yet, per instructions.
