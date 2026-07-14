/**
 * Ideas Lab — playful experiments beyond Meet statics.
 * Remotion · Veo · human shoots · SaaS props · competitor remixes.
 * Regenerate: npm run generate:ideas
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import { GRAPHICS_REQUEST_EMAIL } from './creative-hopper-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ideaMailto = `mailto:${GRAPHICS_REQUEST_EMAIL}?subject=${encodeURIComponent(
  'Ideas Lab pitch — MedVirtual',
)}&body=${encodeURIComponent(
  'Hey George!\n\nIdeas Lab pitch:\n\nLane: (Remotion / Veo / Human shoot / SaaS / Competitor remix / Other)\nConcept:\nWhy it might help practices book:\nMock or rough notes:\n\nThanks!\n',
)}`;

const REMOTION = [
  {
    id: 'STATIC_TO_SHORT',
    title: 'Static → short motion',
    detail: 'Hold a strong still, gentle Ken Burns, text stagger, CTA pulse. 15–20s.',
  },
  {
    id: 'PROBLEM_SOLUTION',
    title: 'Problem → solution',
    detail: 'Hook the ops pain, then reveal dedicated virtual support — warm, not scary.',
  },
  {
    id: 'CHECKLIST_REVEAL',
    title: 'Checklist reveal',
    detail: '3 skills or benefits tick in over B-roll. Clean and readable on mobile.',
  },
  {
    id: 'TEXT_ON_IMAGE_NATIVE',
    title: 'Native text-on-image',
    detail: 'Big hook on frame one — feels Meta-native and scrolled-past-proof.',
  },
  {
    id: 'TALKING_HEAD_FRAME',
    title: 'Headset hold + narration',
    detail: 'Face clear, voiceover track only — keep it honest, never fake a testimonial.',
  },
  {
    id: 'DEMO_OFFER',
    title: 'Demo offer',
    detail: 'Interface or offer end-card. CTA visible early. No PHI on screen.',
  },
];

const VIDEO_HOOKS = [
  {
    title: 'Headset medical admin',
    hook: 'When patient calls keep coming in…',
    note: 'Great Veo / Remotion seed · approved still as frame 1',
  },
  {
    title: 'Busy schedule review',
    hook: 'When scheduling becomes the bottleneck…',
    note: 'Office POV · calm solution beat',
  },
  {
    title: 'Front desk ringing',
    hook: 'Your front desk is buried…',
    note: 'Scenario B-roll + friendly narrator',
  },
  {
    title: 'Remote assistant calm',
    hook: 'Remote medical support for busy practices',
    note: 'Keep claims modest · hire dedicated staff',
  },
];

const HUMAN = [
  {
    title: 'Practice staff day-in-the-life',
    detail: 'Real ops friction (phones, charts, scheduling) — then how virtual support fits. Consent + no PHI.',
  },
  {
    title: 'Talent Pool intros (approved talent only)',
    detail: 'Short, warm Meet clips when talent opts in — never invent credentials on camera.',
  },
  {
    title: 'Founder / ops truth cuts',
    detail: 'Simple human honesty over stock polish. Works as hooks above product statics.',
  },
];

const css = `
  ${HEADER_CSS}
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: ${BRAND.colors.ink};
    background:
      radial-gradient(ellipse 70% 45% at 100% 0%, rgba(39,230,250,0.12), transparent 55%),
      #f3f7fa;
    line-height: 1.5;
  }
  main { max-width: 960px; margin: 0 auto; padding: 1.4rem 1.1rem 4rem; }
  .hero h1 {
    margin: 0 0 0.45rem;
    font-size: clamp(1.75rem, 3.8vw, 2.35rem);
    letter-spacing: -0.03em;
  }
  .hero p { margin: 0 0 1.2rem; max-width: 42rem; color: #405766; font-size: 1.02rem; }
  .banner {
    background: #ecfeff;
    border: 1px solid #a5f3fc;
    color: #155e75;
    border-radius: 12px;
    padding: 0.85rem 1rem;
    margin-bottom: 1.4rem;
    font-size: 0.94rem;
  }
  section { margin-bottom: 1.75rem; }
  section > h2 { margin: 0 0 0.35rem; font-size: 1.2rem; }
  section > .lede { margin: 0 0 0.85rem; color: #64748b; font-size: 0.94rem; max-width: 44rem; }
  .cards {
    display: grid;
    gap: 0.7rem;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 700px) { .cards { grid-template-columns: 1fr; } }
  .card {
    background: #fff;
    border: 1px solid #d5e2ea;
    border-radius: 12px;
    padding: 0.9rem 1rem;
  }
  .card h3 { margin: 0 0 0.3rem; font-size: 1rem; }
  .card p { margin: 0; font-size: 0.88rem; color: #516472; }
  .card .tag {
    display: inline-block;
    margin-bottom: 0.35rem;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${BRAND.colors.main01};
  }
  .lanes {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: 1.5rem;
  }
  @media (max-width: 800px) { .lanes { grid-template-columns: 1fr; } }
  .lane {
    background: #fff;
    border: 1px solid #d5e2ea;
    border-radius: 14px;
    padding: 1rem;
    text-decoration: none;
    color: inherit;
  }
  .lane:hover { border-color: ${BRAND.colors.main02}; }
  .lane h3 { margin: 0 0 0.35rem; font-size: 1.05rem; }
  .lane p { margin: 0; font-size: 0.88rem; color: #516472; }
  .cta {
    background: linear-gradient(120deg, #0D546B, #077999);
    color: #fff;
    border-radius: 14px;
    padding: 1.15rem 1.2rem;
  }
  .cta h2 { margin: 0 0 0.35rem; font-size: 1.15rem; }
  .cta p { margin: 0 0 0.85rem; color: rgba(255,255,255,0.88); font-size: 0.94rem; }
  .btn {
    display: inline-flex;
    padding: 0.55rem 0.9rem;
    border-radius: 9px;
    background: #fff;
    color: #0D546B;
    font: inherit;
    font-size: 0.88rem;
    font-weight: 700;
    text-decoration: none;
    margin-right: 0.4rem;
  }
  .btn.ghost {
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255,255,255,0.4);
  }
  .hooks .card strong { display: block; margin-bottom: 0.25rem; color: ${BRAND.colors.main03}; font-size: 0.95rem; }
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ideas Lab · MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'ideas',
    pageTitle: 'Ideas Lab',
    pageSubtitle: 'Hey — toss ideas around, mock cool stuff, pitch George anything that sparks',
  })}
  <main>
    <header class="hero">
      <h1>Just thinking of some cool stuff…</h1>
      <p>Meet-[Name] statics are a great foundation — and there’s room to dream bigger: Remotion motion, Google Veo clips, human shoots, SaaS props, competitor remixes. If you’ve got a “what if we tried this?” energy, you’re in the right place.</p>
    </header>

    <p class="banner">Quick map: the <a href="/graphic-request-brief.html">Brief</a> is today’s assigned work. Everything here is invitation — explore, mock, and pitch.</p>

    <div class="lanes">
      <a class="lane" href="/competitors.html">
        <h3>Competitor Wall</h3>
        <p>See real ads in market, then mock your own take and email George.</p>
      </a>
      <a class="lane" href="/mockup-sandbox.html">
        <h3>Mock-up Sandbox</h3>
        <p>Three editable forks (Lookbook · Bold · SaaS). Surprise me + export PNGs.</p>
      </a>
      <a class="lane" href="/saas-prop-templates.html">
        <h3>SaaS Prop lane</h3>
        <p>Glass / software aesthetic, no faces — editable headline comps.</p>
      </a>
    </div>

    <div class="lanes" style="margin-top:-0.5rem">
      <a class="lane" href="#remotion">
        <h3>Remotion + slides</h3>
        <p>Template IDs we can build into motion once stills are strong.</p>
      </a>
      <a class="lane" href="#veo">
        <h3>Veo video concepts</h3>
        <p>Short generative-video directions seeded from approved stills.</p>
      </a>
      <a class="lane" href="#human">
        <h3>Human-shot concepts</h3>
        <p>Real cameras when we’re ready — warm, consented, no PHI.</p>
      </a>
    </div>

    <section id="remotion">
      <h2>Remotion motion templates</h2>
      <p class="lede">Planning inventory — no code to ship yet. Fun for designers who think in sequences and beats.</p>
      <div class="cards">
        ${REMOTION.map(
          (t) => `<article class="card"><span class="tag">${esc(t.id)}</span><h3>${esc(t.title)}</h3><p>${esc(t.detail)}</p></article>`,
        ).join('')}
      </div>
    </section>

    <section id="veo" class="hooks">
      <h2>Veo story hooks</h2>
      <p class="lede">Draft starting points for short Veo / motion clips. Prefer operations POV. First frame should still work as a static.</p>
      <div class="cards">
        ${VIDEO_HOOKS.map(
          (h) =>
            `<article class="card"><strong>${esc(h.hook)}</strong><h3>${esc(h.title)}</h3><p>${esc(h.note)}</p></article>`,
        ).join('')}
      </div>
    </section>

    <section id="human">
      <h2>Human-shot concepts</h2>
      <p class="lede">When we bring cameras in — consent first, keep it real, keep it kind.</p>
      <div class="cards">
        ${HUMAN.map((h) => `<article class="card"><h3>${esc(h.title)}</h3><p>${esc(h.detail)}</p></article>`).join('')}
      </div>
    </section>

    <section>
      <h2>Tools nearby</h2>
      <p class="lede">Grab masters while you sketch. Pitch George anything you love.</p>
      <div class="cards">
        <article class="card"><h3><a href="/competitors.html">Competitor Wall</a></h3><p>Live-in-market ads → mock → pitch.</p></article>
        <article class="card"><h3><a href="/mockup-sandbox.html">Mock-up Sandbox</a></h3><p>Editable forks with PNG export.</p></article>
        <article class="card"><h3><a href="/asset-hub.html">Asset Hub</a></h3><p>Logos + AI masters for stills and video seeds.</p></article>
        <article class="card"><h3><a href="/image-variation-review.html">Image board</a></h3><p>Approved crops to start motion from.</p></article>
        <article class="card"><h3><a href="/saas-prop-templates.html">SaaS Prop templates</a></h3><p>Editable no-people comps.</p></article>
        <article class="card"><h3><a href="/medvirtual-brand-guide.html">Brand Guide</a></h3><p>Color, logo, and soft claims guardrails.</p></article>
      </div>
    </section>

    <section class="cta">
      <h2>Pitch something from the lab</h2>
      <p>Hey George would love this — tell him the lane, the concept, and why a practice owner might book. Rough is perfect.</p>
      <a class="btn" href="${esc(ideaMailto)}">Email George your pitch</a>
      <a class="btn ghost" href="/studio.html">Back to Studio</a>
    </section>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'ideas.html'), html);
console.log('Ideas Lab written');
