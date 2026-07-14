# MedVirtual Creative Handoff

Live workbench for **graphics partners**, marketing, and production.

**Live:** [https://medvirtual-ad-content-doc.vercel.app](https://medvirtual-ad-content-doc.vercel.app)

## Mission

1. Help graphics ship clearly (less Slack archaeology)
2. Stimulate ideas beyond commodity statics
3. Stay organized (locked Brief vs Ideas Lab)
4. Produce ads that help practices book demos

## Where to start

| Page | Use |
|------|-----|
| [Studio](https://medvirtual-ad-content-doc.vercel.app/studio.html) | **Home** — how we work, tools, share ideas |
| [Brief](https://medvirtual-ad-content-doc.vercel.app/graphic-request-brief.html) | Current ads to design |
| [Lookbook](https://medvirtual-ad-content-doc.vercel.app/template-test-board.html) | Approved layout guides + Role-Offer board |
| [People](https://medvirtual-ad-content-doc.vercel.app/real-people-creative.html) | Named talent ads + downloads |
| [Ideas Lab](https://medvirtual-ad-content-doc.vercel.app/ideas.html) | Remotion · VO · human shoots · SaaS |
| [Competitor Wall](https://medvirtual-ad-content-doc.vercel.app/competitors.html) | Steal / reject / remix + Ad Library links |
| [Mock-up Sandbox](https://medvirtual-ad-content-doc.vercel.app/mockup-sandbox.html) | Editable three-fork mock-ups + PNG export |

Same header on every page. `/` opens Studio.

## Quick start

```bash
npm install
npm run generate:docs
npm run dev
```

Open [http://localhost:5173/studio.html](http://localhost:5173/studio.html)

## Scripts

```bash
npm run generate:studio       # Designer Studio home
npm run generate:ideas        # Ideas Lab
npm run generate:brief        # Brief jobs
npm run generate:templates    # Lookbook
npm run generate:real-people  # People page + assets
npm run generate:docs         # Full HTML handoff regen
```
