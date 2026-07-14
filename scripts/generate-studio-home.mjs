/**
 * Studio home — graphics path first; Producer Lab secondary; tomorrow review (local).
 * Regenerate: npm run generate:studio
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import { hopperByStatus } from './creative-hopper-data.mjs';

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

const css = `
  ${HEADER_CSS}
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: ${BRAND.colors.ink};
    background:
      radial-gradient(ellipse 90% 50% at 10% -10%, rgba(0,178,226,0.14), transparent 55%),
      #f3f7fa;
    line-height: 1.5;
  }
  main { max-width: 980px; margin: 0 auto; padding: 1.5rem 1.15rem 4rem; }
  .hero h1 {
    margin: 0 0 0.45rem;
    font-size: clamp(1.75rem, 4vw, 2.35rem);
    letter-spacing: -0.03em;
  }
  .hero p { margin: 0; max-width: 42rem; color: #405766; }
  .steps {
    margin: 1.35rem 0 1.5rem;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.55rem;
  }
  .steps li {
    background: #fff;
    border: 1px solid #d5e2ea;
    border-radius: 12px;
    padding: 0.85rem 1rem;
    display: grid;
    grid-template-columns: 2rem 1fr;
    gap: 0.65rem;
    align-items: start;
  }
  .steps strong { color: ${BRAND.colors.main03}; }
  .steps span { color: #516472; font-size: 0.92rem; }
  .grid {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
  .tile {
    background: #fff;
    border: 1px solid #d5e2ea;
    border-radius: 14px;
    padding: 1rem 1.05rem;
    text-decoration: none;
    color: inherit;
  }
  .tile:hover { border-color: ${BRAND.colors.main02}; }
  .tile .eyebrow {
    display: block;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${BRAND.colors.main01};
    margin-bottom: 0.3rem;
  }
  .tile h3 { margin: 0 0 0.3rem; font-size: 1.05rem; }
  .tile p { margin: 0; font-size: 0.88rem; color: #516472; }
  .panel {
    margin-top: 1.35rem;
    background: #fff;
    border: 1px solid #d5e2ea;
    border-radius: 14px;
    padding: 1.05rem 1.1rem;
  }
  .panel h2 { margin: 0 0 0.4rem; font-size: 1.1rem; }
  .panel .lede { margin: 0 0 0.7rem; color: #64748b; font-size: 0.92rem; }
  .jobs { margin: 0; padding-left: 1.1rem; color: #405766; }
  .jobs a { color: #077999; font-weight: 700; }
  .dr-banner {
    margin: 0 0 1.25rem;
    padding: 0.9rem 1rem;
    border-radius: 14px;
    background: linear-gradient(120deg, #ecfdf5, #eff6ff);
    border: 1px solid #86efac;
  }
  .dr-banner strong { color: #14532d; }
  .dr-banner a { color: #077999; font-weight: 700; }
  .producer {
    margin-top: 1.5rem;
    border: 1px dashed #94a3b8;
    border-radius: 14px;
    padding: 1rem 1.05rem;
    background: #f8fafc;
  }
  .producer summary {
    cursor: pointer;
    font-weight: 700;
    color: ${BRAND.colors.main03};
  }
  .review-row {
    display: grid;
    gap: 0.45rem;
    margin: 0.75rem 0;
    padding: 0.65rem 0;
    border-top: 1px solid #e2e8f0;
  }
  .review-row label { font-size: 0.86rem; font-weight: 600; }
  .review-row select {
    font: inherit;
    max-width: 16rem;
    border: 1px solid #d5e2ea;
    border-radius: 8px;
    padding: 0.35rem 0.5rem;
  }
  .note { font-size: 0.8rem; color: #64748b; margin: 0.5rem 0 0; }
`;

const jobList = doNow
  .map(
    (j) =>
      `<li><a href="/graphic-request-brief.html#${esc(j.id)}">${esc(j.assignmentType || 'Static')} · ${esc(
        j.designerTitle || j.title,
      )}</a> · due ${esc(j.dueDate)}</li>`,
  )
  .join('');

const reviewAreas = [
  ['brief', 'Current Brief'],
  ['raw', 'Raw Assets library'],
  ['foundry', 'AI Asset Foundry'],
  ['static-ref', 'Static reference mockups'],
  ['motion-ref', 'Motion / video references'],
  ['nav', 'Graphics-facing navigation'],
  ['build', 'Overall build health'],
];

const reviewRows = reviewAreas
  .map(
    ([id, label]) => `
    <div class="review-row">
      <label for="rev-${id}">${esc(label)}</label>
      <select id="rev-${id}" data-review="${esc(id)}" aria-label="${esc(label)} assessment">
        <option value="">— choose —</option>
        <option value="useful">Useful</option>
        <option value="too-complicated">Too complicated</option>
        <option value="producer-only">Keep producer-only</option>
        <option value="simplify">Simplify</option>
        <option value="remove-nav">Remove from navigation</option>
        <option value="broken">Broken</option>
      </select>
    </div>`,
  )
  .join('');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Studio · MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'studio',
    pageTitle: 'Studio',
    pageSubtitle: 'Generate the parts. Show the intended result. Designers assemble the finals.',
  })}
  <main>
    <header class="hero">
      <h1>Start with the Brief.</h1>
      <p>MedVirtual supplies raw images, logos, separate copy, and a reference composition. Build the finished ad in your normal design or video tools — this site is not a Photoshop or CapCut replacement.</p>
    </header>

    <p class="dr-banner"><strong>CURRENT DIRECTION — HIGH-CONTRAST DIRECT-RESPONSE META CREATIVE.</strong> Human-led, offer-first, mobile-readable — Hire a Virtual Medical Admin · color tests · no pink. <a href="/direct-response.html">Open Direct Response →</a></p>

    <ol class="steps" aria-label="Handoff path">
      <li><strong>1</strong><span>Open the <a href="/graphic-request-brief.html">Brief</a> — only the current assignments.</span></li>
      <li><strong>2</strong><span>Download the listed raw images, logos, and copy from each card.</span></li>
      <li><strong>3</strong><span>View one reference mockup or capture brief — treat it as art direction, not mandatory HTML editing.</span></li>
      <li><strong>4</strong><span>Build the final asset in your usual tools (Illustrator, Canva, Premiere, CapCut, etc.).</span></li>
      <li><strong>5</strong><span>Submit via the destination on the Brief (email George).</span></li>
    </ol>

    <div class="grid">
      <a class="tile" href="/graphic-request-brief.html">
        <span class="eyebrow">Production</span>
        <h3>Brief</h3>
        <p>Assigned jobs with dimensions, assets, copy, and due dates.</p>
      </a>
      <a class="tile" href="/direct-response.html">
        <span class="eyebrow">Current Meta</span>
        <h3>Direct Response</h3>
        <p>Strategy, creative board, color tests, form, and launch QA.</p>
      </a>
      <a class="tile" href="/raw-assets.html">
        <span class="eyebrow">Files</span>
        <h3>Raw Assets</h3>
        <p>Photos, logos, props, backgrounds — components, not finished ads.</p>
      </a>
      <a class="tile" href="/template-test-board.html">
        <span class="eyebrow">Direction</span>
        <h3>Examples</h3>
        <p>Approved layouts Hailey is likely to accept.</p>
      </a>
      <a class="tile" href="/real-people-creative.html">
        <span class="eyebrow">Talent</span>
        <h3>People</h3>
        <p>Named talent treatments and public-safe downloads.</p>
      </a>
      <a class="tile" href="/video-production.html">
        <span class="eyebrow">Capture</span>
        <h3>Video Capture</h3>
        <p>Shot list, lines, framing — Remotion is reference only.</p>
      </a>
      <a class="tile" href="/ideas.html">
        <span class="eyebrow">Producers</span>
        <h3>Producer Lab</h3>
        <p>Foundry, competitors, static/motion references — optional for designers.</p>
      </a>
    </div>

    <section class="panel">
      <h2>Open on the Brief</h2>
      <p class="lede">Current produce-now queue (${doNow.length}).</p>
      <ul class="jobs">${jobList || '<li>No open jobs.</li>'}</ul>
    </section>

    <details class="producer">
      <summary>Producer only — tomorrow review (not for graphics team)</summary>
      <p class="note">Scores stay in this browser (localStorage). Mark each area after you walk the site.</p>
      ${reviewRows}
      <p class="note"><a href="/ai-asset-foundry.html">Foundry</a> · <a href="/creative-concept-lab.html">Static refs</a> · <a href="/motion-concept-lab.html">Motion refs</a> · Audit doc lives in repo root as <code>PROJECT-AUDIT-RAW-MATERIALS.md</code></p>
    </details>
  </main>
  <script>
  (function () {
    const KEY = 'mv-studio-review-v1';
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
    document.querySelectorAll('[data-review]').forEach((sel) => {
      const id = sel.getAttribute('data-review');
      if (saved[id]) sel.value = saved[id];
      sel.addEventListener('change', () => {
        saved[id] = sel.value;
        localStorage.setItem(KEY, JSON.stringify(saved));
      });
    });
  })();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'studio.html'), html);
console.log(`Studio home written · open briefs=${doNow.length}`);
