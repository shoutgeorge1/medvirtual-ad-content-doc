# MedVirtual Facebook Ad Content Doc

Starter content doc for **national Meta static ads** — review copy, export PNGs, submit.

**Live:** [https://medvirtual-ad-content-doc.vercel.app](https://medvirtual-ad-content-doc.vercel.app)

## What's in v1

**5 starter concepts** — one per message angle:

| Angle | File name |
|-------|-----------|
| Cost / value of hiring | `MV_META_COST_01` |
| Staffing shortage | `MV_META_STAFFING_01` |
| Patient experience | `MV_META_PATIENT_01` |
| Founder / operator authority | `MV_META_OPERATOR_01` |
| Workflow transformation | `MV_META_WORKFLOW_01` |

Background images are pulled from [medvirtual.ai](https://www.medvirtual.ai) landing pages. Ad copy is HTML/CSS overlays (Meta best practice: short hook, bullets, CTA on image; primary text + headline for the ad set).

## Use it

1. **Content Doc** — review all copy and previews; print or save as PDF for approval
2. **Export PNGs** — download 1080×1350 (4:5 feed) or 1080×1080 (square)
3. **Edit** — click "Edit concept" on any block to tweak copy or swap images

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Expand later

Add more concepts in `src/utils/seedConcepts.ts` when you're ready to test more roles or angles. This repo is intentionally small first — dial in what works, then scale.
