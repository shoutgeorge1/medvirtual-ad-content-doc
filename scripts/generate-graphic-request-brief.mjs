/**
 * Graphic Request Brief — production handoff for designer/VA (Monday form ready).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import {
  ALL_CONCEPTS,
  BRAND_NAME,
  DELIVERABLES,
  FIRST_BATCH_COUNT,
  MESSAGING_RULES,
  PRACTICE_TYPES,
  ROLES,
  TEST_BUCKETS,
  USE_CASES,
  buildMondayFormCopy,
} from './first-test-batch-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.5; }
  .wrap { max-width: 960px; margin: 0 auto; padding: 1.25rem 1.25rem 3rem; }
  .section {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
    padding: 1.15rem 1.3rem; margin-bottom: 1rem;
  }
  .section h2 {
    font-size: 1rem; color: #0f172a; margin-bottom: 0.6rem;
    padding-bottom: 0.45rem; border-bottom: 2px solid #0d9488;
  }
  .section h3 { font-size: 0.88rem; color: #334155; margin: 0.85rem 0 0.4rem; }
  .section p, .section li { font-size: 0.88rem; color: #475569; }
  .section ul { margin: 0.35rem 0 0; padding-left: 1.15rem; }
  .section li { margin: 0.2rem 0; }
  .pill-row { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.5rem; }
  .pill {
    font-size: 0.72rem; font-weight: 600; padding: 0.2rem 0.55rem;
    border-radius: 999px; background: #ecfdf5; color: #0f766e; border: 1px solid #99f6e4;
  }
  .rules-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 0.5rem; }
  @media (max-width: 700px) { .rules-grid { grid-template-columns: 1fr; } }
  .rules-box {
    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.65rem 0.75rem;
  }
  .rules-box h4 { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: #64748b; margin-bottom: 0.35rem; }
  .rules-box.use h4 { color: #047857; }
  .rules-box.avoid h4 { color: #b91c1c; }
  .rules-box ul { padding-left: 1rem; margin: 0; }
  .rules-box li { font-size: 0.8rem; color: #334155; }
  .bucket {
    border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 1rem; overflow: hidden;
  }
  .bucket-head {
    background: #0f172a; color: #f8fafc; padding: 0.75rem 1rem;
  }
  .bucket-head h3 { margin: 0; font-size: 0.95rem; color: #f8fafc; }
  .bucket-head p { margin: 0.3rem 0 0; font-size: 0.8rem; color: #94a3b8; }
  .concept { padding: 1rem; border-top: 1px solid #e2e8f0; }
  .concept:first-of-type { border-top: none; }
  .concept-top { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; margin-bottom: 0.55rem; }
  .concept-id {
    font-family: ui-monospace, monospace; font-size: 0.7rem; font-weight: 700;
    color: #0d9488; background: #ecfdf5; padding: 0.15rem 0.45rem; border-radius: 4px;
  }
  .fmt {
    font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em;
    padding: 0.15rem 0.45rem; border-radius: 4px;
  }
  .fmt.static { background: #dbeafe; color: #1d4ed8; }
  .fmt.video { background: #ffedd5; color: #c2410c; }
  .field { margin: 0.45rem 0; font-size: 0.84rem; }
  .field strong { color: #0f172a; display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 0.15rem; }
  .field .val { color: #334155; white-space: pre-wrap; }
  .copy-block {
    background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px;
    padding: 0.55rem 0.7rem; margin: 0.35rem 0; font-size: 0.82rem; white-space: pre-wrap;
  }
  .copy-btn {
    font-size: 0.72rem; font-weight: 650; color: #0f766e; background: #f0fdfa;
    border: 1px solid #99f6e4; border-radius: 6px; padding: 0.25rem 0.55rem; cursor: pointer;
  }
  .copy-btn:hover { background: #ccfbf1; }
  .copy-btn.done { background: #0d9488; color: #fff; border-color: #0d9488; }
  .deliverables { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.6rem; }
  .deliverables .item {
    background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 0.6rem 0.75rem;
    font-size: 0.82rem;
  }
  .deliverables .item strong { display: block; color: #0f766e; font-size: 0.75rem; margin-bottom: 0.2rem; }
  .monday {
    background: #0f172a; color: #e2e8f0; border-radius: 10px; padding: 1rem 1.15rem;
    font-family: ui-monospace, 'Cascadia Code', monospace; font-size: 0.78rem;
    white-space: pre-wrap; line-height: 1.45; max-height: 480px; overflow-y: auto;
  }
  .nav-anchors { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
  .nav-anchors a {
    font-size: 0.75rem; font-weight: 600; padding: 0.35rem 0.65rem; border-radius: 8px;
    background: #0f172a; color: #fff; text-decoration: none;
  }
  .avoid-note { color: #b91c1c; font-size: 0.8rem; }
  .links a { color: #0d9488; font-weight: 650; }
`;

function renderConcept(c) {
  const texts = c.primaryTexts
    .map(
      (t, i) => `<div class="field"><strong>Primary text option ${i + 1}</strong>
        <div class="copy-block">${esc(t)}</div>
        <button type="button" class="copy-btn" data-copy="${esc(t)}">Copy</button>
      </div>`,
    )
    .join('');

  return `<article class="concept" id="${esc(c.id)}">
    <div class="concept-top">
      <span class="concept-id">${esc(c.id)} · ${esc(c.name)}</span>
      <span class="fmt ${esc(c.format)}">${esc(c.format)}</span>
      <span class="fmt static">${esc(c.ratio)}</span>
      ${c.templateRefs?.length ? `<span class="pill">Refs: ${c.templateRefs.map(esc).join(', ')}</span>` : ''}
    </div>
    <div class="field"><strong>Audience / use case</strong><div class="val">${esc(c.audience)}</div></div>
    <div class="field"><strong>Primary message</strong><div class="val">${esc(c.primaryMessage)}</div></div>
    ${texts}
    <div class="field"><strong>Headlines</strong><div class="val">1. ${esc(c.headlines[0])}\n2. ${esc(c.headlines[1])}</div></div>
    <div class="field"><strong>Description</strong><div class="val">${esc(c.description)}</div></div>
    <div class="field"><strong>On-image text</strong><div class="val">${esc(c.onImageText)}</div></div>
    <div class="field"><strong>Static creative direction</strong><div class="val">${esc(c.staticDirection)}</div></div>
    <div class="field"><strong>Short-form video direction</strong><div class="val">${esc(c.videoDirection)}</div></div>
    <div class="field"><strong>Visual notes</strong><div class="val">${esc(c.visualNotes)}</div></div>
    <div class="field avoid-note"><strong>What to avoid</strong><div class="val">${esc(c.avoid)}</div></div>
  </article>`;
}

function main() {
  const mondayCopy = buildMondayFormCopy();

  const bucketsHtml = TEST_BUCKETS.map(
    (b) => `<div class="bucket" id="bucket-${esc(b.id)}">
      <div class="bucket-head">
        <h3>${esc(b.label)}</h3>
        <p><strong>Angle:</strong> ${esc(b.angle)}</p>
        <p style="margin-top:0.25rem"><strong>Message:</strong> ${esc(b.correctMessage)}</p>
        <p style="margin-top:0.25rem"><strong>Creative:</strong> ${esc(b.creativeDirection)}</p>
      </div>
      ${b.concepts.map(renderConcept).join('')}
    </div>`,
  ).join('');

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
    pageTitle: 'Graphic Request Brief — First Test Batch',
    pageSubtitle: `${FIRST_BATCH_COUNT} ad concepts · 4 test buckets · ready for designer/VA handoff`,
  })}
  <div class="wrap">
    <nav class="nav-anchors">
      <a href="#summary">Summary</a>
      <a href="#rules">Messaging</a>
      <a href="#batch">Test Batch</a>
      <a href="#deliverables">Deliverables</a>
      <a href="#designer-notes">Designer Notes</a>
      <a href="#monday">Monday Form</a>
    </nav>

    <section class="section" id="summary">
      <h2>1. Project Summary</h2>
      <p>We need a <strong>first batch of Meta ad creatives</strong> for ${esc(BRAND_NAME)}. The goal is to test a few clear angles around <strong>hiring full-time virtual medical and dental staff through ${esc(BRAND_NAME)}</strong> — not building an endless copy library.</p>
      <p style="margin-top:0.5rem">This is a modest first Meta test budget. Keep the batch small, specific, and production-ready.</p>
      <p class="links" style="margin-top:0.65rem">
        <strong>Related pages:</strong>
        <a href="/facebook-ad-copy.html">Ad copy (launch batch)</a> ·
        <a href="/template-test-board.html">Template visual reference</a>
      </p>
      <h3>Roles to feature</h3>
      <div class="pill-row">${ROLES.map((r) => `<span class="pill">${esc(r)}</span>`).join('')}</div>
      <h3>Practice types</h3>
      <div class="pill-row">${PRACTICE_TYPES.map((p) => `<span class="pill">${esc(p)}</span>`).join('')}</div>
      <h3>Use cases</h3>
      <div class="pill-row">${USE_CASES.map((u) => `<span class="pill">${esc(u)}</span>`).join('')}</div>
    </section>

    <section class="section" id="rules">
      <h2>2. Messaging Rules</h2>
      <div class="rules-grid">
        <div class="rules-box use">
          <h4>Use</h4>
          <ul>${MESSAGING_RULES.use.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </div>
        <div class="rules-box avoid">
          <h4>Avoid</h4>
          <ul>${MESSAGING_RULES.avoid.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </div>
      </div>
      <h3>Correct positioning</h3>
      <ul>${MESSAGING_RULES.positioning.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    </section>

    <section class="section" id="batch">
      <h2>3. Recommended First Test Batch (${FIRST_BATCH_COUNT} concepts)</h2>
      <p>Four test buckets. Each concept includes copy, creative direction, and what to avoid.</p>
      ${bucketsHtml}
    </section>

    <section class="section" id="deliverables">
      <h2>4. Creative Deliverables</h2>
      <div class="deliverables">
        <div class="item"><strong>Core static concepts</strong>${DELIVERABLES.staticConcepts}</div>
        <div class="item"><strong>Variations</strong>${DELIVERABLES.variationsPerConcept} per concept</div>
        <div class="item"><strong>Feed format</strong>${DELIVERABLES.feedFormat}</div>
        <div class="item"><strong>Story / Reels</strong>${DELIVERABLES.storyFormat}</div>
        <div class="item"><strong>Video</strong>${DELIVERABLES.video}</div>
      </div>
    </section>

    <section class="section" id="designer-notes">
      <h2>5. Designer / VA Notes</h2>
      <ul>
        <li><strong>On-image text = short.</strong> Facebook primary text carries the longer explanation.</li>
        <li><strong>Show the virtual staff member doing the work</strong> — headset, scheduling screen, insurance review.</li>
        <li><strong>Staff should feel like part of the clinic team</strong> — not an external call center.</li>
        <li>Use clean healthcare / clinic visuals. No tiny text. Do not overcrowd the creative.</li>
        <li>Brand name: <strong>MedVirtual</strong> only — never MedVirtual.ai in ad copy or on-image text.</li>
        <li>CTA on creative: <strong>Book a demo.</strong></li>
        <li>Site-backed price claim only: <strong>Starting at $10/hour</strong> (optional stamp).</li>
      </ul>
    </section>

    <section class="section" id="monday">
      <h2>6. Monday Graphic Request Copy</h2>
      <p style="margin-bottom:0.65rem">Ready to paste into the Monday graphic request form:</p>
      <div class="monday" id="monday-text">${esc(mondayCopy)}</div>
      <p style="margin-top:0.65rem">
        <button type="button" class="copy-btn" data-copy="${esc(mondayCopy)}">Copy all Monday form text</button>
      </p>
    </section>
  </div>
  <script>
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const t = btn.getAttribute('data-copy') || '';
        try {
          await navigator.clipboard.writeText(t);
          btn.textContent = 'Copied';
          btn.classList.add('done');
          setTimeout(() => { btn.textContent = btn.id ? 'Copy' : (btn.textContent.includes('Monday') ? 'Copy all Monday form text' : 'Copy'); btn.classList.remove('done'); }, 1400);
        } catch (e) {
          btn.textContent = 'Select text';
        }
      });
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PUBLIC, 'graphic-request-brief.html'), html);
  console.log(`Graphic brief: http://localhost:5173/graphic-request-brief.html (${FIRST_BATCH_COUNT} concepts)`);
}

main();
