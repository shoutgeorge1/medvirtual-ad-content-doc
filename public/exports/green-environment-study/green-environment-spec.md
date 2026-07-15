# MedVirtual Green Background + Slab System — Specification

Measured from running winners (VMA-01 SpanishGreen / VMA-04 HIPAAGreen):
- Dominant field in source ads is near-black (`#030606` / `#0E1011`, 38–59% of canvas)
- Performance lime sampled `#55C63A`–`#67B146`
- This study pushes a **forceful green environment** for new composites while keeping contrast for cream (`#FFF4D6`) and yellow (`#F2D72E`) lettering from Prompt 1.

## Palette (refined)

| Token | Hex | Role |
|---|---|---|
| g1 | `#073F2A` | Deep forest edge / slab dark |
| g2 | `#075C37` | Mid forest |
| g3 | `#087A43` | Saturated field |
| g4 | `#0B8F4D` | Bright headline-zone green |
| g5 | `#B8D833` | Yellow-green accent / halftone |
| g6 | `#F2D72E` | Yellow offset / accent marks |
| cream | `#FFF4D6` | Lettering face / borders |

**Forbidden in this system:** cyan, blue SaaS gradients, glassmorphism, frosted cards, blurry glow, pink/magenta/rose.

---

## Six background treatments (4:5 · 1080×1350)

### 1 · Deep green radial spotlight
- File: `bg-01-radial-spotlight.svg`
- Params: {"vignette":0.42,"textureOpacity":0.07,"spotlight":"cx 38% cy 32% r 72%","center":"#0B8F4D","edge":"#073F2A"}

### 2 · Painted green poster texture
- File: `bg-02-painted-poster.svg`
- Params: {"textureOpacity":0.11,"verticalCenter":"#087A43","rollerOpacity":0.35}

### 3 · Green halftone commercial print
- File: `bg-03-halftone-print.svg`
- Params: {"halftoneOpacity":0.14,"dotRadius":"2.2–3.0px","vignette":0.38}

### 4 · Layered geometric green panels
- File: `bg-04-geometric-panels.svg`
- Params: {"panels":["#075C37","#087A43","#0B8F4D"],"seamStroke":"#041A12","seamWidth":"5–6px"}

### 5 · Green burst behind headline
- File: `bg-05-green-burst.svg`
- Params: {"burstCenter":"36% x · 28% y","burstRadius":"58%","outerVignette":0.48,"rayOpacity":0.18}

### 6 · Green chalkboard-sign surface
- File: `bg-06-chalkboard-sign.svg`
- Params: {"field":"#087A43","overlay":"#075C37","accentMarks":["#FFF4D6","#F2D72E"],"textureOpacity":0.09}

### **SELECTED PRIMARY: 5 · Green burst behind headline**
- **Why:** Directional brighter burst behind the headline zone without comic-book explosion language; dark outer green preserves DR contrast; works with cream/yellow lettering at thumbnail scale.
- **Editable component:** `green-background-selected.svg`
- Burst center: 36% x · 28% y
- Burst radius: 58%
- Outer vignette opacity: 0.48
- Subtle ray wedge opacity: 0.18
- Base edge color: `#073F2A` · burst core: `#0B8F4D`

---

## Four headline slabs

### 1 · Tilted dark-green + yellow offset
- File: `slab-01-tilted-yellow-offset.svg`
- Params: {"tilt":-4,"yellowOffset":[14,12],"fill":"#073F2A","offsetFill":"#F2D72E","radius":14}

### 2 · Forest-green slab + thick cream border
- File: `slab-02-cream-border.svg`
- Params: {"fill":"#075C37","border":"#FFF4D6","borderWidth":10,"innerRadius":8}

### 3 · Yellow-green slab + dark extrusion
- File: `slab-03-ygreen-extrusion.svg`
- Params: {"fill":"#B8D833","extrusionSteps":10,"extrusionColor":"#052818","step":[1.1,1.3]}

### 4 · Irregular painted rectangle + hard shadow
- File: `slab-04-irregular-painted.svg`
- Params: {"fill":"#075C37","shadowOffset":[16,16],"shadowColor":"#052818","irregularEdge":"hand-cut path"}

### **SELECTED PRIMARY: 1 · Tilted dark-green + yellow offset**
- **Why:** Matches retail signage grammar (tilted slab + yellow offset); reads instantly behind a focal word at feed thumbnail size; pairs with Prompt 1 treatment #6 yellow focal + underline.
- **Editable component:** `green-slab-selected.svg`
- Slab size: 520×118px
- Tilt: -4°
- Yellow offset layer: (14, 12)px
- Slab fill: `#073F2A` · offset: `#F2D72E`
- Corner radius: 14px

---

## Files

| File | Description |
|---|---|
| `green-background-reference.png` | Six-option background sheet |
| `green-slab-reference.png` | Four-option slab sheet |
| `green-background-selected.svg` | Primary background (editable) |
| `green-slab-selected.svg` | Primary focal slab (editable) |
| `green-environment-spec.md` | This document |

Stop point: background + slab system complete. No full ad built.
