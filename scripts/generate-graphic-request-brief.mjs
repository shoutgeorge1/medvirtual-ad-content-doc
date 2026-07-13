/**
 * Graphic Request Brief — slim designer handoff.
 * 4 concepts · size/CTA · short rules. No strategy dump.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND_NAME, PRODUCTION_CONCEPTS } from './first-test-batch-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Audience only when it changes the visual (medical vs dental callouts). */
function showAudience(c) {
  return c.id === '1' || c.id === '2';
}

function renderConceptCard(c, index) {
  const audience = showAudience(c)
    ? `<p class="card-audience">${esc(c.audience)}</p>`
    : '';
  return `<article class="card">
    <div class="card-num">${index + 1}</div>
    <div class="card-body">
      <h3 class="card-headline">${esc(c.headline)}</h3>
      ${audience}
      <p class="card-support">${esc(c.support)}</p>
      <p class="card-visual"><span>Visual</span>${esc(c.visual)}</p>
      <div class="card-foot">
        <span class="cta">${esc(c.cta)}</span>
        <p class="card-warn">${esc(c.warning)}</p>
      </div>
    </div>
  </article>`;
}

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.45; }
  .wrap { max-width: 720px; margin: 0 auto; padding: 1rem 1.15rem 2.75rem; }
  .banner {
    background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 0.95rem 1.1rem; margin-bottom: 0.85rem;
  }
  .banner h2 { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.3rem; }
  .banner p { font-size: 0.88rem; color: #cbd5e1; }
  .banner-meta {
    display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.65rem;
  }
  .banner-meta span {
    font-size: 0.72rem; font-weight: 750; padding: 0.28rem 0.55rem; border-radius: 6px;
    background: rgba(13,148,136,0.25); border: 1px solid rgba(94,234,212,0.35); color: #99f6e4;
  }
  .cards { display: grid; gap: 0.75rem; margin-bottom: 0.85rem; }
  .card {
    display: grid; grid-template-columns: 2.25rem 1fr; gap: 0.65rem;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.9rem 1rem;
  }
  .card-num {
    width: 2.1rem; height: 2.1rem; border-radius: 8px; background: #0d9488; color: #fff;
    font-weight: 800; font-size: 0.95rem; display: grid; place-items: center;
  }
  .card-headline { font-size: 1.15rem; font-weight: 800; color: #0f172a; line-height: 1.25; }
  .card-audience {
    margin-top: 0.35rem; font-size: 0.78rem; font-weight: 700; color: #0f766e;
  }
  .card-support { margin-top: 0.4rem; font-size: 0.95rem; color: #334155; font-weight: 600; }
  .card-visual {
    margin-top: 0.55rem; font-size: 0.86rem; color: #475569; line-height: 1.4;
  }
  .card-visual span {
    display: block; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.04em; color: #94a3b8; margin-bottom: 0.15rem;
  }
  .card-foot { margin-top: 0.65rem; display: flex; flex-wrap: wrap; gap: 0.45rem 0.75rem; align-items: center; }
  .cta {
    display: inline-block; background: #0d9488; color: #fff; font-size: 0.75rem; font-weight: 800;
    padding: 0.28rem 0.6rem; border-radius: 6px;
  }
  .card-warn { font-size: 0.8rem; color: #b45309; font-weight: 650; flex: 1 1 12rem; }
  .panel {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
    padding: 0.85rem 1rem; margin-bottom: 0.65rem;
  }
  .panel h2 {
    font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
    color: #0f172a; margin-bottom: 0.4rem;
  }
  .panel ul { padding-left: 1.05rem; }
  .panel li { font-size: 0.88rem; color: #334155; margin: 0.22rem 0; }
  .panel.do-not { background: #fff7ed; border-color: #fed7aa; }
  .panel.do-not h2 { color: #c2410c; }
  .panel.do-not li { color: #9a3412; }
`;

function main() {
  const cards = PRODUCTION_CONCEPTS.map((c, i) => renderConceptCard(c, i)).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Graphic Request Brief — ${esc(BRAND_NAME)}</title>
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'brief',
    pageTitle: 'Graphic Request Brief',
    pageSubtitle: '4 static ads · 1080×1350 · designer handoff',
  })}
  <div class="wrap">
    <header class="banner">
      <h2>Produce these 4 static ads</h2>
      <p>Full-time virtual staff through MedVirtual — part of the practice team. One design per concept.</p>
      <div class="banner-meta">
        <span>4 static</span>
        <span>1080×1350</span>
        <span>CTA: Book a Demo</span>
        <span>No variations yet</span>
      </div>
    </header>

    <div class="cards">${cards}</div>

    <section class="panel">
      <h2>Design rules</h2>
      <ul>
        <li>MedVirtual only — never MedVirtual.ai on the ad</li>
        <li>One clear hook · large headline · minimal support text</li>
        <li>Clean healthcare visuals · show virtual staff working</li>
        <li>Visible Book a Demo CTA · mobile-readable · no clutter</li>
        <li>1080×1350 static feed only for this batch</li>
      </ul>
    </section>

    <section class="panel do-not">
      <h2>Do not</h2>
      <ul>
        <li>Look like a call center or managed service</li>
        <li>Imply MedVirtual runs the clinic front desk</li>
        <li>Use fake patient data or readable medical records</li>
        <li>Use long on-image paragraphs, handshake stock, or icon overload</li>
        <li>Create recruiting / job-seeker ads</li>
      </ul>
    </section>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(PUBLIC, 'graphic-request-brief.html'), html);
  console.log(`Graphic brief: ${PRODUCTION_CONCEPTS.length} production concepts (slim)`);
}

main();
