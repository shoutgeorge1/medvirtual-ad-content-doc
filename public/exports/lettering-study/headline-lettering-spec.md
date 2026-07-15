# MedVirtual Headline Lettering — Style Specification

Sample headline: **HIRE A / VIRTUAL / MEDICAL ASSISTANT**
Base font: **Be Vietnam ExtraBold** (`font-family="Be Vietnam"`, `font-weight="800"`) — no outside font.

## Selected treatment: #6 — Yellow focal (+18%) + underline swash

| Property | Value |
|---|---|
| Font weight | 800 (ExtraBold) |
| Horizontal compression | `scale(0.78, 1)` → ~22% condensed |
| Letter spacing | -0.5px (tight) |
| Line height | 0.90 × cap size (tight) |
| Lines | 3 |
| Case | UPPERCASE |
| Face color | Cream `#FAF1D2` |
| Focal word ("VIRTUAL") | Bright yellow `#FFD400`, ~118% size |
| Outer stroke | Deep forest green `#14532D`, ~7px (rendered stroke-width 14, paint-order behind fill) |
| Secondary outline | Yellow-green `#9DCB3B`, ~4px beyond the forest stroke |
| Extrusion | Dark green `#0A3A1E`, 12 stacked hard copies at ~(0.011, 0.013)×size per step |
| Highlight edge | Pale yellow `#FFF7CE`, hard sliver offset (-3, -3) |
| Underline swash | Yellow `#FFD400` rounded bar beneath VIRTUAL |
| Shadow style | Hard-edged only — NO blur/glow/chrome/metallic/gradient |

## All six treatments on the reference sheet
- 1 · Cream + forest outline + hard shadow
- 2 · Forward-slant + yellow focal word
- 3 · Extra-condensed + deep block extrusion
- 4 · Rough hand-painted edge, clean interior
- 5 · Cream over tilted dark-green slab
- 6 · Yellow focal +18% + underline swash

## Layer order (back → front)
1. Hard offset shadow (treatments that use one)
2. Dark-green block extrusion (stacked hard copies)
3. Yellow-green secondary outline (widest stroke)
4. Forest-green outer stroke
5. Pale-yellow highlight sliver (offset up-left)
6. Cream / yellow face
7. Underline swash

## Files
- `headline-lettering-reference.png` — six-option sheet
- `headline-lettering-selected.svg` — editable layered SVG (real text)
- `headline-lettering-spec.md` — this file
