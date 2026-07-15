# MedVirtual Ad Production

Graphics handoff for scroll-stopping Meta ads that book demos.

**Live:** [https://medvirtual-ad-content-doc.vercel.app](https://medvirtual-ad-content-doc.vercel.app)

## Mission

Help the graphics team:

1. See the four approved masters immediately
2. Generate 15–20 new ad concepts
3. Rebuild winners in every Meta size
4. Steal competitor energy — never copy layouts
5. Turn winning statics into motion

## Where to start

| Page | Use |
|------|-----|
| [Dashboard](https://medvirtual-ad-content-doc.vercel.app/studio.html) | **Home** — priority, approved ads, quick links |
| [Approved Creative](https://medvirtual-ad-content-doc.vercel.app/vma-approved.html) | Four approved masters |
| [New Ad Ideas](https://medvirtual-ad-content-doc.vercel.app/ideas.html) | Spark concepts to test for demos |
| [Aspect Ratios](https://medvirtual-ad-content-doc.vercel.app/vma-static.html) | 1:1 · 4:5 · 9:16 · 1.91:1 |
| [Competitor Wall](https://medvirtual-ad-content-doc.vercel.app/competitors.html) | Steal energy — never copy |
| [Animated Video](https://medvirtual-ad-content-doc.vercel.app/vma-video.html) | Motion Lab + specs |
| [Motion Concept Lab](https://medvirtual-ad-content-doc.vercel.app/motion-concept-lab.html) | Watch Remotion concepts in-browser |
| [Prompts & Copy](https://medvirtual-ad-content-doc.vercel.app/vma-chatgpt.html) | Prompt → result + copy picks |
| [Production Handoff](https://medvirtual-ad-content-doc.vercel.app/vma-handoff.html) | Job sheet for the graphics team |

`/studio.html` is home. Old lab pages redirect here.

## Quick start

```bash
npm install
npm run generate:vma
npm run dev
```

Open [http://localhost:5173/studio.html](http://localhost:5173/studio.html)

## Scripts

```bash
npm run generate:vma           # Ad Production site (8 pages + Motion Lab + redirects)
npm run generate:motion-lab    # Motion Concept Lab only
npm run remotion:studio        # Remotion Studio for MP4 renders
```
