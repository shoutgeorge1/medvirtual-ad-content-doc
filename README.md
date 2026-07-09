# MedVirtual Meta Content Doc

Internal content document and static image export tool for MedVirtual Meta ads. Create, preview, edit, and export 25 static Facebook/Instagram ad concepts (5 roles × 5 message angles).

All ad copy is rendered as editable HTML/CSS overlays on clean background images — no text baked into AI-generated images.

## Features

- **Dashboard** — Browse 25 concept cards with filters by role, angle, status, and search
- **Content Doc** — Manager-facing review layout with print/PDF support
- **Creative Editor** — Edit copy, swap images, live preview, duplicate concepts
- **Export** — Download PNGs at 1080×1350 (4:5) or 1080×1080 (square), single or batch

## Quick Start

```bash
cd medvirtual-meta-content-doc
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/     # UI components (ConceptCard, AdPreview, etc.)
  context/        # React context for concept state
  data/           # concepts.json seed data (25 concepts)
  templates/      # Ad template CSS
  utils/          # Constants, export, persistence helpers
  views/          # Route views (Dashboard, ContentDoc, Editor, Export)
public/
  assets/         # Placeholder background images
  exports/        # Local export destination (optional)
```

## Data Persistence

Edits are saved to `localStorage`. Use **Reset to seed data** on the Dashboard to restore the original 25 concepts from `src/data/concepts.json`.

## Export Sizes

| Size | Dimensions | Use |
|------|------------|-----|
| 4:5 Vertical | 1080 × 1350 | Feed creative |
| Square | 1080 × 1080 | Feed creative |

## File Naming

Concepts use the pattern `MV_META_[ROLE]_[ANGLE]_[NN]`, e.g. `MV_META_GENERAL_COST_01`.

## Roles & Landing Pages

| Role | Landing Page |
|------|-------------|
| General MedVirtual | medvirtual.ai/explore-medical-virtual-assistants |
| Medical Assistant | medvirtual.ai/hire-virtual-medical-assistants |
| Medical Nurse | medvirtual.ai/hire-virtual-medical-nurse-now |
| Medical Biller | medvirtual.ai/hire-virtual-medical-biller-now |
| Medical Case Coordinator | medvirtual.ai/hire-virtual-medical-case-coordinator-now |
