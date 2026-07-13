/**
 * Graphic Request Brief — single handoff for designers + Meta paste.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import {
  BRAND_NAME,
  PRODUCTION_CONCEPTS,
  buildMondayFormCopy,
} from './first-test-batch-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showAudience(c) {
  return c.id === '1' || c.id === '2';
}

function packageText(c) {
  return [
    `ON-IMAGE HEADLINE: ${c.headline}`,
    `SUPPORT: ${c.support}`,
    '',
    `PRIMARY TEXT:`,
    c.primaryText,
    '',
    `META HEADLINE: ${c.metaHeadline}`,
    `DESCRIPTION: ${c.description}`,
    `CTA: ${c.cta}`,
  ].join('\n');
}

function renderPrimary(text) {
  return text
    .split(/\n\n+/)
    .map((p) => `<p class="primary-p">${esc(p)}</p>`)
    .join('');
}

function renderConceptCard(c, index) {
  const audience = showAudience(c)
    ? `<p class="card-audience">${esc(c.audience)}</p>`
    : '';
  const pkg = packageText(c);
  return `<article class="card">
    <div class="card-num">${index + 1}</div>
    <div class="card-body">
      <div class="card-top">
        <div>
          <p class="field-label">On-image headline</p>
          <h3 class="card-headline">${esc(c.headline)}</h3>
          ${audience}
          <p class="field-label">Support</p>
          <p class="card-support">${esc(c.support)}</p>
        </div>
        <button type="button" class="copy-btn card-copy" data-copy="${esc(pkg)}">Copy Meta package</button>
      </div>
      <p class="card-visual"><span>Visual</span>${esc(c.visual)}</p>
      <div class="meta-block">
        <p class="field-label">Primary text</p>
        <div class="primary">${renderPrimary(c.primaryText)}</div>
        <div class="meta-row">
          <div>
            <p class="field-label">Meta headline</p>
            <p class="meta-val">${esc(c.metaHeadline)}</p>
          </div>
          <div>
            <p class="field-label">Description</p>
            <p class="meta-val">${esc(c.description)}</p>
          </div>
          <div>
            <p class="field-label">CTA</p>
            <span class="cta">${esc(c.cta)}</span>
          </div>
        </div>
      </div>
      <p class="card-warn">${esc(c.warning)}</p>
    </div>
  </article>`;
}

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--mv-font); background: #f1f5f9; color: #0f172a; line-height: 1.45; }
  .wrap { max-width: 720px; margin: 0 auto; padding: 1rem 1.15rem 2.75rem; }
  .banner {
    background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 0.95rem 1.1rem; margin-bottom: 0.85rem;
  }
  .banner h2 { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.3rem; }
  .banner p { font-size: 0.88rem; color: #cbd5e1; }
  .banner-meta { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.65rem; }
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
    width: 2.1rem; height: 2.1rem; border-radius: 8px; background: var(--mv-primary); color: #fff;
    font-weight: 800; font-size: 0.95rem; display: grid; place-items: center;
  }
  .card-top {
    display: flex; flex-wrap: wrap; gap: 0.65rem; justify-content: space-between; align-items: flex-start;
  }
  .field-label {
    font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
    color: var(--mv-primary); margin-top: 0.45rem; margin-bottom: 0.12rem;
  }
  .card-top .field-label:first-child { margin-top: 0; }
  .card-headline { font-size: 1.15rem; font-weight: 800; color: #0f172a; line-height: 1.25; }
  .card-audience { margin-top: 0.3rem; font-size: 0.78rem; font-weight: 700; color: var(--mv-primary); }
  .card-support { font-size: 0.95rem; color: #334155; font-weight: 600; }
  .card-visual {
    margin-top: 0.55rem; font-size: 0.86rem; color: #475569; line-height: 1.4;
  }
  .card-visual span {
    display: block; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.04em; color: #94a3b8; margin-bottom: 0.15rem;
  }
  .meta-block {
    margin-top: 0.7rem; padding-top: 0.65rem; border-top: 1px solid #e2e8f0;
  }
  .primary-p { font-size: 0.88rem; color: #1e293b; margin: 0 0 0.35rem; white-space: pre-wrap; }
  .primary-p:last-child { margin-bottom: 0; }
  .meta-row {
    display: grid; grid-template-columns: 1fr 1fr auto; gap: 0.55rem; margin-top: 0.55rem;
  }
  @media (max-width: 640px) { .meta-row { grid-template-columns: 1fr; } }
  .meta-val { font-size: 0.88rem; color: #0f172a; font-weight: 650; }
  .cta {
    display: inline-block; background: var(--mv-primary); color: #fff; font-size: 0.75rem; font-weight: 800;
    padding: 0.28rem 0.6rem; border-radius: 6px;
  }
  .card-warn {
    margin-top: 0.55rem; font-size: 0.8rem; color: #b45309; font-weight: 650;
  }
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
  .send-box {
    background: #0f172a; color: #e2e8f0; border-radius: 8px; padding: 0.75rem 0.85rem;
    font-family: ui-monospace, monospace; font-size: 0.72rem; white-space: pre-wrap; line-height: 1.45;
  }
  .copy-btn {
    font-size: 0.74rem; font-weight: 700; color: #fff; background: var(--mv-primary);
    border: 0; border-radius: 7px; padding: 0.4rem 0.7rem; cursor: pointer; white-space: nowrap;
  }
  .copy-btn:hover { background: var(--mv-primary); }
  .card-copy { margin-top: 0; }
  .send .copy-btn { margin-top: 0.5rem; }
`;

function main() {
  const cards = PRODUCTION_CONCEPTS.map((c, i) => renderConceptCard(c, i)).join('');
  const mondayCopy = buildMondayFormCopy();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Creative Brief — ${esc(BRAND_NAME)}</title>
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'brief',
    pageTitle: 'Creative Brief',
    pageSubtitle: '4 static ads · art + Meta copy · one page',
  })}
  <div class="wrap">
    <header class="banner">
      <h2>4 ads — design + Meta copy</h2>
      <p>One page for graphics and Ads Manager. 1080×1350 · one design each · no variations yet.</p>
      <div class="banner-meta">
        <span>On-image</span>
        <span>Primary text</span>
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

    <section class="panel send" id="send">
      <h2>Send this</h2>
      <p style="font-size:0.84rem;color:#64748b;margin-bottom:0.5rem">One link for Slack / Monday.</p>
      <div class="send-box">${esc(mondayCopy)}</div>
      <button type="button" class="copy-btn" data-copy="${esc(mondayCopy)}" data-label="Copy handoff">Copy handoff</button>
    </section>
  </div>
  <script>
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      const label = btn.getAttribute('data-label') || 'Copy Meta package';
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.getAttribute('data-copy') || '');
          btn.textContent = 'Copied';
          setTimeout(() => { btn.textContent = label; }, 1400);
        } catch (e) {}
      });
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PUBLIC, 'graphic-request-brief.html'), html);
  console.log(`Creative brief: ${PRODUCTION_CONCEPTS.length} concepts (art + Meta)`);
}

main();
