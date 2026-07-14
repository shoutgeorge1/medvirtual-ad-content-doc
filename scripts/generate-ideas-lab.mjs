/**
 * Ideas Lab — experiments beyond commodity static Meet ads.
 * Remotion · ElevenLabs · human shoots · SaaS props.
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
  'Hi team,\n\nIdeas Lab pitch:\n\nLane: (Remotion / ElevenLabs / Human shoot / SaaS / Other)\nConcept:\nWhy it might help practices book:\nRough needs from us:\n\nThanks!',
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
    detail: 'Hook the ops pain, then reveal dedicated virtual support. No fear tactics.',
  },
  {
    id: 'CHECKLIST_REVEAL',
    title: 'Checklist reveal',
    detail: '3 skills or benefits tick in over B-roll. Clean and readable on mobile.',
  },
  {
    id: 'TEXT_ON_IMAGE_NATIVE',
    title: 'Native text-on-image',
    detail: 'Big hook on frame one — feels like Meta-native creative, not corporate.',
  },
  {
    id: 'TALKING_HEAD_FRAME',
    title: 'Headset hold + VO',
    detail: 'Face clear, voiceover only. Never fake a customer testimonial.',
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
    note: 'VO explainer · approved still as frame 1',
  },
  {
    title: 'Busy schedule review',
    hook: 'When scheduling becomes the bottleneck…',
    note: 'Office POV · calm solution beat',
  },
  {
    title: 'Front desk ringing',
    hook: 'Your front desk is buried…',
    note: 'Scenario B-roll + narrator',
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
    pageSubtitle: 'Where we evolve past commodity statics — with your creative judgment',
  })}
  <main>
    <header class="hero">
      <h1>Same mission. Fresh creative systems.</h1>
      <p>Meet-[Name] statics still matter under marketing’s current guidance — but ads that all look the same stop working. This lab is for motion, voice, human film, and software-style props that help practices actually book.</p>
    </header>

    <p class="banner">Locked lane vs experiment lane: if it’s on the <a href="/graphic-request-brief.html">Brief</a>, match the brief. If it’s here, you’re invited to explore and pitch.</p>

    <div class="lanes">
      <a class="lane" href="/competitors.html">
        <h3>Competitor Wall</h3>
        <p>Steal structures, reject commodity, remix for MedVirtual — with Ad Library links.</p>
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
      <a class="lane" href="#voice">
        <h3>ElevenLabs / VO</h3>
        <p>Practice-ops narration over approved frames — never fake testimonials.</p>
      </a>
      <a class="lane" href="#human">
        <h3>Human-shot concepts</h3>
        <p>When cameras are ready — consent, no PHI, no invented credentials.</p>
      </a>
    </div>

    <section id="remotion">
      <h2>Remotion motion templates</h2>
      <p class="lede">Planning inventory — no code to ship yet. Great for designers who think in sequences and beats.</p>
      <div class="cards">
        ${REMOTION.map(
          (t) => `<article class="card"><span class="tag">${esc(t.id)}</span><h3>${esc(t.title)}</h3><p>${esc(t.detail)}</p></article>`,
        ).join('')}
      </div>
    </section>

    <section id="voice" class="hooks">
      <h2>Video / VO story hooks</h2>
      <p class="lede">Safe drafts for short video. Prefer operations POV. First frame should still work as a static.</p>
      <div class="cards">
        ${VIDEO_HOOKS.map(
          (h) =>
            `<article class="card"><strong>${esc(h.hook)}</strong><h3>${esc(h.title)}</h3><p>${esc(h.note)}</p></article>`,
        ).join('')}
      </div>
    </section>

    <section id="human">
      <h2>Human-shot concepts</h2>
      <p class="lede">When we’re ready for real cameras — still need consent, no PHI, no invented credentials.</p>
      <div class="cards">
        ${HUMAN.map((h) => `<article class="card"><h3>${esc(h.title)}</h3><p>${esc(h.detail)}</p></article>`).join('')}
      </div>
    </section>

    <section>
      <h2>Tools you’ll want nearby</h2>
      <p class="lede">Grab masters and crops while you sketch. Producer upload packs stay optional.</p>
      <div class="cards">
        <article class="card"><h3><a href="/competitors.html">Competitor Wall</a></h3><p>Live-in-market intel + steal / reject / remix.</p></article>
        <article class="card"><h3><a href="/mockup-sandbox.html">Mock-up Sandbox</a></h3><p>Editable forks with PNG export for idea rounds.</p></article>
        <article class="card"><h3><a href="/asset-hub.html">Asset Hub</a></h3><p>Logos + AI masters for stills and video seeds.</p></article>
        <article class="card"><h3><a href="/image-variation-review.html">Image board</a></h3><p>Approved crops and families to start motion from.</p></article>
        <article class="card"><h3><a href="/saas-prop-templates.html">SaaS Prop templates</a></h3><p>Editable no-people comps — another visual system to stress-test.</p></article>
        <article class="card"><h3><a href="/medvirtual-brand-guide.html">Brand Guide</a></h3><p>Color, logo, and claims guardrails so experiments stay shippable.</p></article>
      </div>
    </section>

    <section class="cta">
      <h2>Pitch something from the lab</h2>
      <p>Tell us the lane, the concept, and why a practice owner might book. Short is fine — we’ll follow up.</p>
      <a class="btn" href="${esc(ideaMailto)}">Email your pitch</a>
      <a class="btn ghost" href="/studio.html">Back to Studio</a>
    </section>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'ideas.html'), html);
console.log('Ideas Lab written');
