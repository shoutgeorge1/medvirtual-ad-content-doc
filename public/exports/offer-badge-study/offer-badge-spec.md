# MedVirtual Offer Badge — Style Specification

**Exact wording only:** `STARTING AT` + `$10/HR` — no qualifiers, savings, guarantees, asterisks, or extra pricing language.

## Selected: #4 — Stacked dimensional badge

| Property | Value |
|---|---|
| Font family | Be Vietnam (`Be Vietnam`) |
| STARTING AT weight | 700 (Bold) |
| $10 / HR weight | 800 (ExtraBold) |
| STARTING AT size | 32px |
| $10 size | 124px |
| /HR size | 50px |
| Rotation | -2° (counterclockwise) |
| Yellow offset layer | (12, 10)px behind lower slab |
| Cream highlight border | 10px on lower slab; 6px on top slab |
| Top slab | 360×56px forest green `#075C37` |
| Lower slab | 400×130px deep green `#073F2A` |
| Padding (internal) | ~20px top slab inset; price centered in lower slab |
| Shadow style | Hard offset yellow slab only — no blur |

### Colors
| Role | Hex |
|---|---|
| Deep green (lower slab) | `#073F2A` |
| Forest green (top slab) | `#075C37` |
| Yellow offset | `#F2D72E` |
| Cream border + $10 | `#FFF4D6` |
| /HR accent | `#F2D72E` |

### Why selected
- **$10 is unmistakably dominant** on the large lower slab
- **STARTING AT reads clearly** on its own top ribbon — not a disclaimer
- **Stacked structure** scales down to feed thumbnail better than single-box treatments
- Pairs with Prompt 2 slab system (yellow offset + cream border grammar)

## All six options
- 1 · Double-border offer box → `badge-01-double-border.svg`
- 2 · Yellow promotional block → `badge-02-yellow-block.svg`
- 3 · Painted green price placard → `badge-03-painted-placard.svg`
- 4 · Stacked dimensional badge → `badge-04-stacked-dimensional.svg`
- 5 · Angled sale-tag badge → `badge-05-angled-sale-tag.svg`
- 6 · Framed price stamp → `badge-06-framed-stamp.svg`

## Forbidden
Tiny pills · thin borders · glossy app UI · glassmorphism · blurred shadows · cyan/blue · neon · savings claims

## Files
- `offer-badge-reference.png` — six-option sheet
- `offer-badge-selected.svg` — editable component (real text)
- `offer-badge-selected.png` — render preview
- `offer-badge-spec.md` — this document
