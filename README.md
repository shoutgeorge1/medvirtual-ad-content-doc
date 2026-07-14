# MedVirtual Creative Handoff

Live workbench for **graphics partners**, marketing, and production.

**Live:** [https://medvirtual-ad-content-doc.vercel.app](https://medvirtual-ad-content-doc.vercel.app)

## Mission

Help the graphics team quickly:

1. Understand the current creative direction
2. Generate 15–20 new ad concepts per request
3. See the four approved ads immediately
4. Understand which aspect ratios are required
5. Create original ideas without copying competitors
6. Produce static ads that can later become animated videos

## Where to start

| Page | Use |
|------|-----|
| [Dashboard](https://medvirtual-ad-content-doc.vercel.app/studio.html) | **Home** — approved ads, checklist, formats, quick links |
| [Approved Creative](https://medvirtual-ad-content-doc.vercel.app/vma-approved.html) | Four approved masters — image-first |
| [New Ad Ideas](https://medvirtual-ad-content-doc.vercel.app/ideas.html) | 15–20 concept batch builder |
| [Aspect Ratios](https://medvirtual-ad-content-doc.vercel.app/vma-static.html) | 1:1 · 4:5 · 9:16 · 1.91:1 |
| [Competitor Wall](https://medvirtual-ad-content-doc.vercel.app/competitors.html) | Image-first reference — do not copy |
| [Animated Video](https://medvirtual-ad-content-doc.vercel.app/vma-video.html) | Motion from approved statics |
| [Prompts & Copy](https://medvirtual-ad-content-doc.vercel.app/vma-chatgpt.html) | ChatGPT + EN/ES copy |
| [Production Handoff](https://medvirtual-ad-content-doc.vercel.app/vma-handoff.html) | Current request + essential QA |

Same header on every primary page. `/studio.html` is home.

## Quick start

```bash
npm install
npm run generate:vma
npm run dev
```

Open [http://localhost:5173/studio.html](http://localhost:5173/studio.html)

## Scripts

```bash
npm run generate:vma           # Primary handoff site (8 pages + redirects)
npm run generate:competitors   # Alternate live Competitor Wall (overwrites competitors.html)
npm run generate:docs          # Broader docs bundle — ends with generate:vma
```
