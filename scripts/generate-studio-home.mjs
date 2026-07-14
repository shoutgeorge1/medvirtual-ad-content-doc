/**
 * Designer Studio — produce now first; lab stays secondary.
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
  .hero p { margin: 0; max-width: 40rem; color: #405766; }
  .stages {
    display: grid;
    gap: 0.65rem;
    grid-template-columns: repeat(3, 1fr);
    margin: 1.35rem 0 1.5rem;
  }
  @media (max-width: 720px) { .stages { grid-template-columns: 1fr; } }
  .stages article {
    background: #fff;
    border: 1px solid #d5e2ea;
    border-radius: 14px;
    padding: 1rem 1.05rem;
  }
  .stages h2 { margin: 0 0 0.3rem; font-size: 0.95rem; color: ${BRAND.colors.main03}; }
  .stages p { margin: 0; font-size: 0.88rem; color: #516472; }
  .stages a { color: #077999; font-weight: 700; text-decoration: none; }
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
`;

const jobList = doNow
  .map(
    (j, i) =>
      `<li><a href="/graphic-request-brief.html#${esc(j.id)}">${esc(j.assignmentType || 'Static')} · ${esc(
        j.designerTitle || j.title,
      )}</a> · due ${esc(j.dueDate)}</li>`,
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
    pageSubtitle: 'Produce now · reuse approved systems · experiment only in Creative Lab',
  })}
  <main>
    <header class="hero">
      <h1>What to produce is on the Brief.</h1>
      <p>Start with assigned work. Reuse approved examples. Record simple phone footage when the job is video. Keep experiments in Creative Lab.</p>
    </header>

    <div class="stages">
      <article>
        <h2>1. Produce Now</h2>
        <p>Open the <a href="/graphic-request-brief.html">Brief</a> — only the current assignments.</p>
      </article>
      <article>
        <h2>2. Approved Systems</h2>
        <p><a href="/template-test-board.html">Examples</a>, <a href="/real-people-creative.html">People</a>, and <a href="/video-production.html">Video</a> templates.</p>
      </article>
      <article>
        <h2>3. Creative Lab</h2>
        <p>Optional exploration: <a href="/ideas.html">competitors, concepts, sandbox</a>.</p>
      </article>
    </div>

    <div class="grid">
      <a class="tile" href="/graphic-request-brief.html">
        <span class="eyebrow">Start here</span>
        <h3>Brief</h3>
        <p>Assigned static, motion, and capture jobs with due dates and assets.</p>
      </a>
      <a class="tile" href="/video-production.html">
        <span class="eyebrow">Motion</span>
        <h3>Real People Video</h3>
        <p>Capture briefs, four video templates, consent checks, Remotion preview.</p>
      </a>
      <a class="tile" href="/template-test-board.html">
        <span class="eyebrow">Systems</span>
        <h3>Examples</h3>
        <p>Approved static layouts and Role-Offer treatments to reuse.</p>
      </a>
      <a class="tile" href="/real-people-creative.html">
        <span class="eyebrow">Talent</span>
        <h3>People</h3>
        <p>Named talent ads, public skills, and download packs.</p>
      </a>
      <a class="tile" href="/asset-hub.html">
        <span class="eyebrow">Files</span>
        <h3>Assets</h3>
        <p>Logos, approved images, and production files.</p>
      </a>
      <a class="tile" href="/ideas.html">
        <span class="eyebrow">Secondary</span>
        <h3>Creative Lab</h3>
        <p>Competitors, static/motion concept labs, sandbox, SaaS props.</p>
      </a>
    </div>

    <section class="panel">
      <h2>Open on the Brief</h2>
      <p class="lede">Current produce-now queue.</p>
      <ul class="jobs">${jobList || '<li>No open jobs — check Creative Lab only if Brief is empty.</li>'}</ul>
    </section>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'studio.html'), html);
console.log(`Studio home written · open briefs=${doNow.length}`);
