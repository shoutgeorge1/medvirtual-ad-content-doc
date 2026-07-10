/**
 * Graphic Request Brief — 4-concept production handoff only.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import {
  ARCHIVED_CONCEPTS,
  BRAND_NAME,
  CAMPAIGN_STRATEGY_NOTE,
  MESSAGING_RULES,
  PRACTICE_TYPES,
  PRODUCTION_CONCEPTS,
  ROLES,
  USE_CASES,
  buildMondayFormCopy,
} from './first-test-batch-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const CONCEPT_COUNT = PRODUCTION_CONCEPTS.length;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function li(items) {
  return `<ul class="bullets">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
}

function renderProductionCard(c) {
  return `<article class="concept-card">
    <h3 class="concept-title">${esc(c.name)}</h3>
    <dl class="concept-fields">
      <div><dt>Audience</dt><dd>${esc(c.audience)}</dd></div>
      <div class="field-headline"><dt>On-image headline</dt><dd>${esc(c.headline)}</dd></div>
      <div><dt>Supporting line</dt><dd>${esc(c.support)}</dd></div>
      <div><dt>Visual direction</dt><dd>${esc(c.visual)}</dd></div>
      <div><dt>CTA</dt><dd><span class="badge-cta">${esc(c.cta)}</span></dd></div>
      <div class="field-warn"><dt>Warning</dt><dd>${esc(c.warning)}</dd></div>
    </dl>
  </article>`;
}

function renderArchivedConcept(c) {
  return `<div class="archived-item">
    <strong>${esc(c.name)}</strong> <span class="archived-tag">Do not produce</span>
    <p>${esc(c.audience)} · ${esc(c.onImageText || c.headlines?.[0] || '')}</p>
  </div>`;
}

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.4; }
  .wrap { max-width: 920px; margin: 0 auto; padding: 1rem 1.15rem 2.5rem; }
  .produce-banner {
    background: #0d9488; color: #fff; border-radius: 10px; padding: 0.75rem 1rem;
    font-size: 0.88rem; font-weight: 700; text-align: center; margin-bottom: 0.65rem;
  }
  .strategy-note {
    background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #94a3b8;
    border-radius: 8px; padding: 0.55rem 0.75rem; margin-bottom: 0.65rem;
    font-size: 0.78rem; color: #64748b; line-height: 1.4;
  }
  .hero {
    background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.1rem 1.2rem; margin-bottom: 0.75rem;
  }
  .hero h2 { font-size: 1.1rem; margin-bottom: 0.35rem; }
  .hero p { font-size: 0.84rem; color: #94a3b8; }
  .hero-meta { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.65rem; }
  .hero-pill {
    font-size: 0.7rem; font-weight: 700; padding: 0.3rem 0.6rem; border-radius: 6px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
  }
  .section {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
    padding: 0.85rem 1rem; margin-bottom: 0.65rem;
  }
  .section h2 {
    font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
    color: #64748b; margin-bottom: 0.45rem;
  }
  .section p, .bullets li { font-size: 0.84rem; color: #334155; }
  .bullets { margin: 0; padding-left: 1rem; }
  .bullets li { margin: 0.15rem 0; }
  .deliverables { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .deliverable-item {
    font-size: 0.78rem; font-weight: 600; padding: 0.35rem 0.55rem; border-radius: 6px;
    background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4;
  }
  .concepts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
  @media (max-width: 700px) { .concepts-grid { grid-template-columns: 1fr; } }
  .concept-card {
    border: 2px solid #0d9488; border-radius: 10px; padding: 0.75rem 0.85rem; background: #fff;
  }
  .concept-title { font-size: 0.88rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; padding-bottom: 0.35rem; border-bottom: 1px solid #e2e8f0; }
  .concept-fields > div { margin-bottom: 0.4rem; }
  .concept-fields dt { font-size: 0.62rem; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 0.08rem; }
  .concept-fields dd { font-size: 0.82rem; color: #1e293b; }
  .field-headline dd { font-size: 0.95rem; font-weight: 800; color: #0f172a; }
  .field-warn dd { color: #b45309; font-size: 0.78rem; font-weight: 600; }
  .badge-cta { display: inline-block; background: #0d9488; color: #fff; font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 5px; }
  .compact-split { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.8rem; }
  @media (max-width: 560px) { .compact-split { grid-template-columns: 1fr; } }
  .use-box { background: #ecfdf5; border-radius: 6px; padding: 0.5rem 0.6rem; }
  .avoid-box { background: #fef2f2; border-radius: 6px; padding: 0.5rem 0.6rem; }
  .use-box strong, .avoid-box strong { font-size: 0.65rem; text-transform: uppercase; display: block; margin-bottom: 0.2rem; }
  .warn-section { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 0.75rem 1rem; margin-bottom: 0.65rem; }
  .warn-section h2 { color: #b91c1c; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.35rem; }
  .warn-section li { color: #7f1d1d; font-size: 0.8rem; }
  .ref-links a {
    display: block; font-size: 0.82rem; font-weight: 700; color: #0d9488; text-decoration: none;
    padding: 0.45rem 0; border-bottom: 1px solid #f1f5f9;
  }
  .ref-links a:last-child { border-bottom: none; }
  .qa-list { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem; }
  @media (max-width: 560px) { .qa-list { grid-template-columns: 1fr; } }
  .qa-list li { font-size: 0.78rem; padding: 0.3rem 0.45rem; background: #f8fafc; border-radius: 5px; border: 1px solid #e2e8f0; }
  .qa-list li::before { content: '☐ '; color: #0d9488; font-weight: 700; }
  .monday-box {
    background: #0f172a; color: #e2e8f0; border-radius: 8px; padding: 0.75rem 0.85rem;
    font-family: ui-monospace, monospace; font-size: 0.72rem; white-space: pre-wrap; line-height: 1.4;
  }
  .copy-btn {
    margin-top: 0.5rem; font-size: 0.72rem; font-weight: 650; color: #0f766e; background: #f0fdfa;
    border: 1px solid #99f6e4; border-radius: 6px; padding: 0.3rem 0.6rem; cursor: pointer;
  }
  .copy-btn:hover { background: #ccfbf1; }
  details.collapsed {
    background: #fff; border: 1px dashed #cbd5e1; border-radius: 10px; margin-top: 0.75rem;
  }
  details.collapsed summary {
    padding: 0.75rem 1rem; font-weight: 700; font-size: 0.82rem; color: #64748b; cursor: pointer; list-style: none;
  }
  details.collapsed summary::-webkit-details-marker { display: none; }
  details.collapsed[open] summary { border-bottom: 1px dashed #e2e8f0; color: #b45309; }
  .collapsed-body { padding: 0.85rem 1rem; font-size: 0.78rem; color: #64748b; }
  .archived-item { padding: 0.45rem 0; border-bottom: 1px solid #f1f5f9; }
  .archived-item:last-child { border-bottom: none; }
  .archived-tag { font-size: 0.62rem; font-weight: 700; color: #b91c1c; text-transform: uppercase; }
  .pill-row { display: flex; flex-wrap: wrap; gap: 0.25rem; margin: 0.35rem 0; }
  .pill { font-size: 0.65rem; padding: 0.12rem 0.4rem; border-radius: 999px; background: #f1f5f9; border: 1px solid #e2e8f0; }
`;

function main() {
  const mondayCopy = buildMondayFormCopy();
  const conceptsHtml = PRODUCTION_CONCEPTS.map(renderProductionCard).join('');
  const archivedHtml = ARCHIVED_CONCEPTS.map(renderArchivedConcept).join('');

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
    pageSubtitle: '4 ad concepts · first production batch · ready for designer/VA handoff',
  })}
  <div class="wrap">
    <p class="produce-banner">Produce only these 4 concepts — ignore archived reference below</p>
    <p class="strategy-note">${esc(CAMPAIGN_STRATEGY_NOTE)}</p>

    <header class="hero" id="summary">
      <h2>MedVirtual Meta Ads — First Creative Batch</h2>
      <p>Create 4 clean Meta ad concepts for full-time virtual medical and dental staff through MedVirtual.</p>
      <p style="margin-top:0.25rem"><strong>Goal:</strong> Scroll-stopping messages for practice decision-makers. <strong>CTA:</strong> Book a Demo</p>
      <div class="hero-meta">
        <span class="hero-pill">4 concepts</span>
        <span class="hero-pill">1080×1350</span>
        <span class="hero-pill">Book a Demo</span>
      </div>
    </header>

    <section class="section" id="deliverables">
      <h2>Deliverables</h2>
      <div class="deliverables">
        <span class="deliverable-item">4 static concepts</span>
        <span class="deliverable-item">1080×1350 feed</span>
        <span class="deliverable-item">1 design each</span>
        <span class="deliverable-item">1–2 variations max</span>
        <span class="deliverable-item">9:16 after approval</span>
        <span class="deliverable-item">Video optional later</span>
      </div>
    </section>

    <section class="section" id="audience">
      <h2>Audience</h2>
      ${li(['Medical practice owners', 'Dental practice owners', 'Practice managers', 'Healthcare office managers'])}
      <p style="margin-top:0.35rem;font-size:0.8rem;color:#64748b">Audience targeting stays broad (booked-demo lookalike). Creative qualifies through message — do not over-segment by specialty or facility type.</p>
    </section>

    <section class="section" id="core-message">
      <h2>Core Message</h2>
      <p>Practices hire <strong>full-time virtual staff</strong> through MedVirtual (calls, scheduling, intake, insurance, billing, pre-auth, documentation, EMR admin). <strong>Starting at $10/hour.</strong> CTA: Book a Demo.</p>
      <div class="compact-split" style="margin-top:0.5rem">
        <div class="use-box"><strong>Use</strong>full-time virtual staff · virtual staff member · part of your practice team · hire through MedVirtual · starting at $10/hour</div>
        <div class="avoid-box"><strong>Avoid</strong>managed service · outsourced front desk · front desk replacement · we handle your front desk</div>
      </div>
    </section>

    <section class="section" id="concepts">
      <h2>Four Ad Concepts — Produce These Only</h2>
      <div class="concepts-grid">${conceptsHtml}</div>
    </section>

    <section class="section" id="rules">
      <h2>Design Rules</h2>
      ${li([
        'MedVirtual only — never MedVirtual.ai',
        'One clear hook per ad · large headline · minimal support text',
        'Clean healthcare visuals · show virtual staff working',
        'Visible Book a Demo CTA · mobile-readable · no clutter',
      ])}
    </section>

    <section class="warn-section" id="avoid">
      <h2>Do Not</h2>
      ${li([
        'Look like a call center or managed service',
        'Imply MedVirtual runs the clinic front desk',
        'Use fake patient data or readable medical records',
        'Use long on-image paragraphs, handshake stock, or icon overload',
        'Create recruiting / job-seeker ads',
      ])}
    </section>

    <section class="section" id="references">
      <h2>Reference Links</h2>
      <p style="font-size:0.8rem;color:#64748b;margin-bottom:0.35rem">Brand direction only — follow this brief for production.</p>
      <div class="ref-links">
        <a href="/facebook-ad-copy.html#launch-batch">Ad copy launch batch</a>
        <a href="/template-test-board.html">Template &amp; visual reference</a>
      </div>
    </section>

    <section class="section" id="monday">
      <h2>Monday Graphic Request</h2>
      <div class="monday">${esc(mondayCopy)}</div>
      <button type="button" class="copy-btn" data-copy="${esc(mondayCopy)}">Copy Monday request</button>
    </section>

    <section class="section" id="qa">
      <h2>QA Before Submit</h2>
      <ul class="qa-list">${[
        'Correct brand name',
        'Correct audience',
        'Correct headline',
        'CTA included',
        'Mobile-readable',
        'No patient info',
        'No clutter',
        'No managed-service language',
        '1080×1350',
        'Source + PNG/JPG',
      ].map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    </section>

    <details class="collapsed">
      <summary>Additional Concepts — Do Not Produce Yet</summary>
      <div class="collapsed-body">
        <p><strong>Internal reference only.</strong> These are not part of the first production batch.</p>
        ${archivedHtml}
        <h3 style="margin:0.75rem 0 0.35rem;font-size:0.75rem;color:#334155">Roles</h3>
        <div class="pill-row">${ROLES.map((r) => `<span class="pill">${esc(r)}</span>`).join('')}</div>
        <h3 style="margin:0.75rem 0 0.35rem;font-size:0.75rem;color:#334155">Practice types</h3>
        <div class="pill-row">${PRACTICE_TYPES.map((p) => `<span class="pill">${esc(p)}</span>`).join('')}</div>
        <h3 style="margin:0.75rem 0 0.35rem;font-size:0.75rem;color:#334155">Use cases</h3>
        <div class="pill-row">${USE_CASES.map((u) => `<span class="pill">${esc(u)}</span>`).join('')}</div>
        <h3 style="margin:0.75rem 0 0.35rem;font-size:0.75rem;color:#334155">Extended positioning</h3>
        ${li(MESSAGING_RULES.positioning)}
      </div>
    </details>
  </div>
  <script>
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const t = btn.getAttribute('data-copy') || '';
        try {
          await navigator.clipboard.writeText(t);
          btn.textContent = 'Copied';
          setTimeout(() => { btn.textContent = 'Copy Monday request'; }, 1400);
        } catch (e) { btn.textContent = 'Select text'; }
      });
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PUBLIC, 'graphic-request-brief.html'), html);
  console.log(`Graphic brief: ${CONCEPT_COUNT} production concepts`);
}

main();
