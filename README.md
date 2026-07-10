# MedVirtual Facebook Ad Content Doc

Lead with **Facebook primary text**, then lock templates. Scale image variations after. Then Remotion / human clips.

**Live:** [https://medvirtual-ad-content-doc.vercel.app](https://medvirtual-ad-content-doc.vercel.app)

## Where to work

| Page | Use |
|------|-----|
| [Ad Copy](http://localhost:5173/facebook-ad-copy.html) | **Lead** — Facebook primary text · 5 angles × 25 · FB best practices |
| [Template Tests](http://localhost:5173/template-test-board.html) | On-image layouts on Meta ratios |
| [Image Review](http://localhost:5173/image-variation-review.html) | Approved crops · video editor right-click downloads |
| [Raw Assets](http://localhost:5173/asset-hub.html) | Full-res AI masters for video |

Same header on every page. `/` redirects to Ad Copy. Old React Content Doc / Export PNG flow is parked.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173/facebook-ad-copy.html](http://localhost:5173/facebook-ad-copy.html)

## Scripts

```bash
npm run generate:templates   # template board (+ refreshes Raw Assets)
npm run generate:copy        # Facebook primary-text variations
npm run generate:images      # crops + image review boards
npm run generate:hub         # Raw Assets page only
npm run generate:handoff     # markdown handoffs for editors
```

## Assets

```
public/assets/ai-images/            RAW masters for video
public/exports/image-tests/         Approved crops (4:5 · 1:1 · 9:16)
public/assets/logo/                 Official logo
```
