/**
 * Designer Studio — home for graphics partners.
 * Regenerate: npm run generate:studio
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import { GRAPHICS_REQUEST_EMAIL, hopperByStatus } from './creative-hopper-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const doNow = hopperByStatus('do_now');
const ideaMailto = `mailto:${GRAPHICS_REQUEST_EMAIL}?subject=${encodeURIComponent(
  'Creative idea — MedVirtual',
)}&body=${encodeURIComponent(
  'Hi team,\n\nHere is a creative idea / direction I would love to try:\n\n1. What the ad is\n2. Why it might help practices book\n3. Style notes or rough sketch link\n\nThanks!',
)}`;

const css = `
  ${HEADER_CSS}
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: ${BRAND.colors.ink};
    background:
      radial-gradient(ellipse 90% 50% at 10% -10%, rgba(0,178,226,0.18), transparent 55%),
      radial-gradient(ellipse 60% 40% at 100% 0%, rgba(7,121,153,0.12), transparent 50%),
      #f3f7fa;
    line-height: 1.5;
  }
  main { max-width: 980px; margin: 0 auto; padding: 1.5rem 1.15rem 4rem; }
  .hero {
    margin-bottom: 1.5rem;
  }
  .hero h1 {
    margin: 0 0 0.5rem;
    font-size: clamp(1.85rem, 4vw, 2.55rem);
    letter-spacing: -0.03em;
    line-height: 1.15;
  }
  .hero p {
    margin: 0;
    max-width: 40rem;
    font-size: 1.05rem;
    color: #405766;
  }
  .mission {
    display: grid;
    gap: 0.65rem;
    grid-template-columns: repeat(3, 1fr);
    margin: 1.35rem 0 1.75rem;
  }
  @media (max-width: 720px) { .mission { grid-template-columns: 1fr; } }
  .mission article {
    background: #fff;
    border: 1px solid #d5e2ea;
    border-radius: 14px;
    padding: 1rem 1.05rem;
  }
  .mission h2 {
    margin: 0 0 0.35rem;
    font-size: 0.95rem;
    color: ${BRAND.colors.main03};
  }
  .mission p { margin: 0; font-size: 0.9rem; color: #516472; }
  .grid {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: 1.75rem;
  }
  @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
  .tile {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    background: #fff;
    border: 1px solid #d5e2ea;
    border-radius: 14px;
    padding: 1.05rem 1.1rem;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.15s, transform 0.15s;
  }
  .tile:hover { border-color: ${BRAND.colors.main02}; transform: translateY(-1px); }
  .tile.featured {
    border-color: ${BRAND.colors.main01};
    box-shadow: 0 0 0 1px rgba(7,121,153,0.12);
    background: linear-gradient(165deg, #fff 0%, #f0f9fc 100%);
  }
  .tile .eyebrow {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${BRAND.colors.main01};
  }
  .tile h3 { margin: 0; font-size: 1.15rem; }
  .tile p { margin: 0; font-size: 0.9rem; color: #516472; flex: 1; }
  .tile .meta { font-size: 0.8rem; font-weight: 700; color: ${BRAND.colors.main03}; }
  .panel {
    background: #fff;
    border: 1px solid #d5e2ea;
    border-radius: 14px;
    padding: 1.15rem 1.2rem;
    margin-bottom: 1rem;
  }
  .panel h2 { margin: 0 0 0.4rem; font-size: 1.15rem; }
  .panel .lede { margin: 0 0 0.85rem; color: #516472; font-size: 0.94rem; }
  .steps { margin: 0; padding-left: 1.15rem; color: #334155; }
  .steps li { margin-bottom: 0.4rem; }
  .ideas {
    background: linear-gradient(120deg, #0D546B 0%, #077999 55%, #00B2E2 100%);
    color: #fff;
    border: none;
  }
  .ideas h2 { color: #fff; }
  .ideas .lede { color: rgba(255,255,255,0.88); }
  .ideas .actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0.55rem 0.9rem; border-radius: 9px; font: inherit; font-size: 0.88rem; font-weight: 700;
    text-decoration: none; border: 1px solid transparent; cursor: pointer;
  }
  .btn.light { background: #fff; color: #0D546B; }
  .btn.ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,0.4); }
  .jobs { display: grid; gap: 0.45rem; margin: 0; padding: 0; list-style: none; }
  .jobs li {
    display: flex; justify-content: space-between; gap: 0.75rem; align-items: baseline;
    padding: 0.55rem 0.7rem; background: #f7fafc; border-radius: 9px; font-size: 0.9rem;
  }
  .jobs a { color: ${BRAND.colors.main01}; font-weight: 700; text-decoration: none; }
  .jobs span { color: #64748b; font-size: 0.8rem; }
`;

const jobList = doNow
  .map(
    (j, i) =>
      `<li><a href="/graphic-request-brief.html#${esc(j.id)}">${esc(j.designerTitle || j.title)}</a><span>Ad ${i + 1} · ${esc(j.resolution)}</span></li>`,
  )
  .join('');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Studio · MedVirtual Creative Handoff</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'studio',
    pageTitle: 'Studio',
    pageSubtitle: 'Welcome — this site is for you. Clear asks, good references, room for your ideas.',
  })}
  <main>
    <header class="hero">
      <h1>You’re part of how MedVirtual grows.</h1>
      <p>Static Meet ads got us here. They also got crowded. We need great craft, fresh ideas, and less Slack back-and-forth — this Studio is meant to make your work clearer and give your voice a seat.</p>
    </header>

    <div class="mission">
      <article>
        <h2>Help you ship</h2>
        <p>Files, sizes, examples, and brand rules in one place — so you’re not chasing answers in chat.</p>
      </article>
      <article>
        <h2>Stay organized</h2>
        <p>Brief = what’s needed now. Lookbook = layout guides. People = talent ads. Ideas = where we experiment next.</p>
      </article>
      <article>
        <h2>Win customers</h2>
        <p>Everything here exists so practices book demos. Beautiful work that feels human and trustworthy.</p>
      </article>
    </div>

    <div class="grid">
      <a class="tile featured" href="/graphic-request-brief.html">
        <span class="eyebrow">Start here</span>
        <h3>Brief — ads we need</h3>
        <p>Four clear requests with photos, logos, and examples. Pick one up whenever you’re ready.</p>
        <span class="meta">${esc(String(doNow.length))} open right now →</span>
      </a>
      <a class="tile" href="/template-test-board.html">
        <span class="eyebrow">Guides</span>
        <h3>Lookbook</h3>
        <p>Approved layout language for today’s static Real People ads. Use as a guide — your polish still matters.</p>
        <span class="meta">Layout guides + Role-Offer board →</span>
      </a>
      <a class="tile" href="/real-people-creative.html">
        <span class="eyebrow">Talent</span>
        <h3>People</h3>
        <p>Named team members, finished comps, downloads, and Meta copy packages.</p>
        <span class="meta">Ready ads + source photos →</span>
      </a>
      <a class="tile" href="/ideas.html">
        <span class="eyebrow">Next</span>
        <h3>Ideas Lab</h3>
        <p>Remotion motion, ElevenLabs VO, slide stories, SaaS props, and human-shot concepts — where we evolve past commodity statics.</p>
        <span class="meta">Explore experiments →</span>
      </a>
    </div>

    <section class="panel">
      <h2>Open on the Brief</h2>
      <p class="lede">Quick list of what’s currently requested. Full details live on the Brief page.</p>
      <ul class="jobs">${jobList || '<li>Nothing open — check with your MedVirtual contact.</li>'}</ul>
    </section>

    <section class="panel">
      <h2>How we like to work together</h2>
      <ol class="steps">
        <li><strong>Brief first</strong> for assigned static ads — keeps quality consistent while we still learn what converts.</li>
        <li><strong>Lookbook</strong> shows the layout DNA that marketing trusts right now. It’s guidance, not a cage — if something’s unclear, ask.</li>
        <li><strong>Ideas Lab</strong> is where you help us get unstuck: motion, voice, human film, new visual systems.</li>
        <li><strong>Share ideas anytime</strong> — we want your instinct. Better one thoughtful note than 20 Slack threads.</li>
      </ol>
    </section>

    <section class="panel ideas">
      <h2>Got a direction you want to try?</h2>
      <p class="lede">Sketch, spark, or “what if we…” notes are welcome. Send a short idea — we’ll review with marketing and get back to you.</p>
      <div class="actions">
        <a class="btn light" href="${esc(ideaMailto)}">Share an idea by email</a>
        <a class="btn ghost" href="/ideas.html">Browse Ideas Lab</a>
        <a class="btn ghost" href="/asset-hub.html">Grab logos &amp; image masters</a>
      </div>
    </section>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'studio.html'), html);
console.log(`Studio home written · open briefs=${doNow.length}`);
