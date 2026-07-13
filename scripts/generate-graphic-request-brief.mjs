/**
 * Graphic Request Brief = VA Graphics Queue.
 * Copy-paste ready for the Graphics Request Form. Hopper target 15–30 ready ads.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import {
  GRAPHICS_REQUEST_EMAIL,
  HOPPER_POLICY,
  hopperByStatus,
  hopperCounts,
  graphicsFormPaste,
} from './creative-hopper-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtDesc(text) {
  return esc(text).replace(/\n/g, '<br>');
}

function statusLabel(s) {
  const map = {
    do_now: 'Do now',
    queued: 'Queued',
    ready_to_load: 'Ready to load',
    live: 'Live',
    retired: 'Retired',
    killed: 'Killed',
  };
  return map[s] || s;
}

function renderFormCard(item, mode) {
  const paste = graphicsFormPaste(item);
  const isWork = mode === 'do_now';
  const isReady = mode === 'ready_to_load';
  const isDead = mode === 'dead';

  if (isDead) {
    return `<article class="card dead">
      <div class="card-top">
        <span class="badge bad">${esc(statusLabel(item.status))}</span>
        <span class="batch">${esc(item.batchLabel || '')}</span>
      </div>
      <h3>${esc(item.title)}</h3>
      <p class="kill">${esc(item.killReason || item.description || '')}</p>
    </article>`;
  }

  return `<article class="card ${isWork ? 'work' : ''} ${isReady ? 'ready' : ''}" id="${esc(item.id)}">
    <div class="card-top">
      <span class="badge ${isWork ? 'go' : isReady ? 'ok' : 'wait'}">${esc(statusLabel(item.status))}</span>
      <span class="batch">${esc(item.batchLabel || '')}</span>
      ${item.priority && item.priority < 90 ? `<span class="prio">P${esc(item.priority)}</span>` : ''}
    </div>
    <h3>${esc(item.title)}</h3>
    <dl class="mini">
      <div><dt>Type</dt><dd>${esc(item.formType)}</dd></div>
      <div><dt>Resolution</dt><dd>${esc(item.resolution)}</dd></div>
      <div><dt>Due</dt><dd>${esc(item.dueDate)}</dd></div>
      <div><dt>Brand</dt><dd>${esc(HOPPER_POLICY.brand)}</dd></div>
      ${item.onImage ? `<div><dt>On-image</dt><dd>${esc(item.onImage)}</dd></div>` : ''}
      ${item.metaHeadline ? `<div><dt>Meta headline</dt><dd>${esc(item.metaHeadline)}</dd></div>` : ''}
      ${item.uploadFile ? `<div><dt>Upload file</dt><dd class="mono">${esc(item.uploadFile)}</dd></div>` : ''}
    </dl>
    ${
      isWork
        ? `<div class="desc"><span class="label">Description (goes in form field 5)</span><p>${fmtDesc(item.description)}</p></div>
           <div class="refs"><span class="label">References to attach</span><ul>${(item.references || [])
             .map((r) =>
               r.startsWith('http') || r.startsWith('/')
                 ? `<li><a href="${esc(r)}" target="_blank" rel="noopener">${esc(r)}</a></li>`
                 : `<li>${esc(r)}</li>`,
             )
             .join('')}</ul></div>`
        : ''
    }
    <div class="actions">
      ${
        isWork
          ? `<button type="button" class="btn primary" data-copy="${esc(paste)}">Copy Graphics Form</button>
             <button type="button" class="btn" data-copy="${esc(item.description || '')}">Copy description only</button>`
          : ''
      }
      ${
        isReady
          ? `<a class="btn primary" href="/meta-launch-build-pack.html">Open Meta Launch</a>
             ${
               item.uploadFile
                 ? `<a class="btn" href="/exports/meta-upload-ready/${esc(item.uploadFile)}" target="_blank" rel="noopener">Preview PNG</a>`
                 : ''
             }
             <button type="button" class="btn" data-copy="${esc(paste)}">Copy form archive</button>`
          : ''
      }
      ${
        !isWork && !isReady
          ? `<button type="button" class="btn" data-copy="${esc(paste)}">Copy Graphics Form (when assigned)</button>`
          : ''
      }
    </div>
  </article>`;
}

const counts = hopperCounts();
const doNow = hopperByStatus('do_now');
const queued = hopperByStatus('queued');
const ready = hopperByStatus('ready_to_load');
const dead = [...hopperByStatus('killed'), ...hopperByStatus('retired')];
const readyCount = counts.ready_to_load || 0;
const pipelineCount = (counts.do_now || 0) + (counts.queued || 0) + readyCount;
const targetHint =
  readyCount < HOPPER_POLICY.targetReadyMin
    ? `Hopper below target (${readyCount} ready · aim ${HOPPER_POLICY.targetReadyMin}–${HOPPER_POLICY.targetReadyMax}). Keep moving DO NOW.`
    : readyCount > HOPPER_POLICY.targetReadyMax
      ? `Ready count high (${readyCount}). Pause new builds; load and test first.`
      : `Ready count on track (${readyCount} / ${HOPPER_POLICY.targetReadyMin}–${HOPPER_POLICY.targetReadyMax}).`;

const css = `
  ${HEADER_CSS}
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: ${BRAND.colors.ink};
    background:
      radial-gradient(ellipse 80% 45% at 0% 0%, rgba(0,192,212,0.12), transparent 55%),
      #f4f7fa;
    line-height: 1.45;
  }
  main { max-width: 860px; margin: 0 auto; padding: 1.25rem 1.1rem 3.5rem; }
  .hero h1 { margin: 0 0 0.4rem; font-size: clamp(1.6rem, 3.5vw, 2.1rem); letter-spacing: -0.02em; }
  .hero p { margin: 0 0 0.75rem; color: #475569; max-width: 40rem; }
  .meters {
    display: grid; gap: 0.5rem; grid-template-columns: repeat(4, 1fr);
    margin: 0 0 1rem;
  }
  @media (max-width: 700px) { .meters { grid-template-columns: repeat(2, 1fr); } }
  .meter {
    background: #fff; border: 1px solid #d7e2ea; border-radius: 10px; padding: 0.65rem 0.75rem;
  }
  .meter b { display: block; font-size: 1.35rem; color: ${BRAND.colors.main03}; }
  .meter span { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; }
  .hint {
    background: #ecfeff; border: 1px solid #a5f3fc; color: #155e75;
    border-radius: 10px; padding: 0.7rem 0.85rem; margin-bottom: 1rem; font-weight: 600; font-size: 0.92rem;
  }
  .steps {
    display: grid; gap: 0.45rem; margin: 0 0 1.25rem; padding: 0; list-style: none; counter-reset: step;
  }
  .steps li {
    background: #fff; border: 1px solid #d7e2ea; border-radius: 10px; padding: 0.65rem 0.8rem 0.65rem 2.5rem;
    position: relative; font-size: 0.92rem; color: #334155;
  }
  .steps li::before {
    counter-increment: step; content: counter(step);
    position: absolute; left: 0.65rem; top: 0.55rem;
    width: 1.35rem; height: 1.35rem; border-radius: 999px;
    background: ${BRAND.colors.main01}; color: #fff; font-size: 0.75rem; font-weight: 800;
    display: grid; place-items: center;
  }
  .jump { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-bottom: 1.5rem; }
  .jump a { color: ${BRAND.colors.main01}; font-weight: 700; text-decoration: none; border-bottom: 2px solid rgba(7,121,153,0.25); }
  section { margin-bottom: 1.75rem; }
  section > h2 { margin: 0 0 0.35rem; font-size: 1.1rem; }
  section > .lede { margin: 0 0 0.75rem; color: #64748b; font-size: 0.9rem; }
  .card {
    background: #fff; border: 1px solid #d7e2ea; border-radius: 12px; padding: 0.9rem 1rem; margin-bottom: 0.75rem;
  }
  .card.work { border-color: ${BRAND.colors.main01}; box-shadow: 0 0 0 1px rgba(7,121,153,0.15); }
  .card.ready { border-color: #86efac; }
  .card.dead { opacity: 0.85; background: #f8fafc; }
  .card-top { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; margin-bottom: 0.35rem; }
  .badge {
    font-size: 0.68rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;
    padding: 0.2rem 0.5rem; border-radius: 999px;
  }
  .badge.go { background: #dcfce7; color: #166534; }
  .badge.ok { background: #dbeafe; color: #1e40af; }
  .badge.wait { background: #f1f5f9; color: #475569; }
  .badge.bad { background: #fee2e2; color: #991b1b; }
  .batch, .prio { font-size: 0.75rem; color: #64748b; font-weight: 600; }
  .card h3 { margin: 0 0 0.55rem; font-size: 1.02rem; line-height: 1.25; }
  .mini { margin: 0 0 0.65rem; display: grid; gap: 0.25rem; }
  .mini div { display: grid; grid-template-columns: 7rem 1fr; gap: 0.35rem; font-size: 0.86rem; }
  .mini dt { color: #64748b; font-weight: 600; }
  .mini dd { margin: 0; }
  .mono { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.8rem; word-break: break-all; }
  .label { display: block; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: #64748b; margin-bottom: 0.3rem; }
  .desc, .refs { margin: 0 0 0.65rem; padding: 0.65rem 0.75rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
  .desc p { margin: 0; font-size: 0.88rem; color: #334155; }
  .refs ul { margin: 0; padding-left: 1.1rem; font-size: 0.82rem; }
  .refs a { color: ${BRAND.colors.main01}; word-break: break-all; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0.45rem 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1;
    background: #fff; color: ${BRAND.colors.main03}; font: inherit; font-size: 0.82rem; font-weight: 700;
    text-decoration: none; cursor: pointer;
  }
  .btn.primary { background: ${BRAND.colors.main01}; border-color: ${BRAND.colors.main01}; color: #fff; }
  .kill { margin: 0; font-size: 0.88rem; color: #7f1d1d; }
  details { background: #fff; border: 1px solid #d7e2ea; border-radius: 12px; padding: 0.75rem 0.9rem; }
  details + details { margin-top: 0.55rem; }
  summary { cursor: pointer; font-weight: 800; color: ${BRAND.colors.main03}; }
  .rules { margin: 0.65rem 0 0; padding-left: 1.1rem; color: #475569; font-size: 0.88rem; }
  .retire-help {
    margin-top: 0.75rem; padding: 0.75rem 0.85rem; background: #fff7ed; border: 1px solid #fed7aa;
    border-radius: 10px; font-size: 0.88rem; color: #9a3412;
  }
  .retire-help code { background: #ffedd5; padding: 0.05rem 0.3rem; border-radius: 4px; font-size: 0.8rem; }
  .toast {
    position: fixed; bottom: 1rem; right: 1rem; background: ${BRAND.colors.main03}; color: #fff;
    padding: 0.55rem 0.85rem; border-radius: 8px; font-weight: 700; opacity: 0; pointer-events: none; transition: opacity 0.2s;
  }
  .toast.show { opacity: 1; }
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>VA Graphics Queue · MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'brief',
    pageTitle: 'VA Graphics Queue',
    pageSubtitle: 'Graphics Request Form paste · hopper toward 15–30 ads ready to load',
  })}
  <main>
    <header class="hero">
      <h1>Do these next. Ignore the rest.</h1>
      <p>This page feeds your <strong>Graphics Request Form</strong>. One card = one submission. Max <strong>${esc(String(HOPPER_POLICY.maxDoNow))}</strong> open at a time. Layout default: <strong>${esc(HOPPER_POLICY.primaryLayout)}</strong>.</p>
    </header>

    <div class="meters">
      <div class="meter"><b>${esc(String(counts.do_now || 0))}</b><span>Do now</span></div>
      <div class="meter"><b>${esc(String(counts.queued || 0))}</b><span>Queued</span></div>
      <div class="meter"><b>${esc(String(readyCount))}</b><span>Ready to load</span></div>
      <div class="meter"><b>${esc(String(pipelineCount))}</b><span>In hopper</span></div>
    </div>
    <p class="hint">${esc(targetHint)}</p>

    <ol class="steps">
      ${HOPPER_POLICY.howItWorks.map((s) => `<li>${esc(s)}</li>`).join('')}
    </ol>

    <nav class="jump" aria-label="On this page">
      <a href="#do-now">Do now</a>
      <a href="#ready">Ready to load</a>
      <a href="#queued">Queued</a>
      <a href="#retired">Retired / killed</a>
      <a href="/real-people-creative.html">Real People layout</a>
      <a href="/meta-launch-build-pack.html">Meta Launch</a>
      <a href="/marketing-library.html">Marketing Library</a>
    </nav>

    <section id="do-now">
      <h2>1. Do now — submit these</h2>
      <p class="lede">Copy Graphics Form → paste into the form → attach references → set due date. Email field default: <strong>${esc(GRAPHICS_REQUEST_EMAIL)}</strong> (change if your inbox differs).</p>
      ${doNow.map((i) => renderFormCard(i, 'do_now')).join('') || '<p class="lede">Nothing in DO NOW. Promote the next queued items in <code>scripts/creative-hopper-data.mjs</code>.</p>'}
    </section>

    <section id="ready">
      <h2>2. Ready to load — Media Buyer</h2>
      <p class="lede">Art is done. Do <strong>not</strong> re-request graphics unless polishing. Load from Meta Launch.</p>
      ${ready.map((i) => renderFormCard(i, 'ready_to_load')).join('')}
    </section>

    <section id="queued">
      <h2>3. Queued — waiting</h2>
      <p class="lede">Do not start these until DO NOW is empty or producer promotes them. Keeps the team from drowning.</p>
      <details>
        <summary>Show ${esc(String(queued.length))} queued items</summary>
        <div style="margin-top:0.75rem">${queued.map((i) => renderFormCard(i, 'queued')).join('')}</div>
      </details>
    </section>

    <section id="retired">
      <h2>4. Retired / killed — do not rebuild</h2>
      <p class="lede">Losers and rejected systems stay here so nobody “helpfully” remakes them.</p>
      <details>
        <summary>Show ${esc(String(dead.length))} killed / retired items</summary>
        <div style="margin-top:0.75rem">${dead.map((i) => renderFormCard(i, 'dead')).join('')}</div>
      </details>
      <div class="retire-help">
        <strong>How to clear a loser:</strong> In <code>scripts/creative-hopper-data.mjs</code>, set that item’s
        <code>status</code> to <code>retired</code> or <code>killed</code>, add a one-line <code>killReason</code>,
        then run <code>npm run generate:brief</code>. It drops out of Do now / Queued / Ready and only shows here.
      </div>
    </section>

    <section>
      <h2>Language guardrails</h2>
      <ul class="rules">${HOPPER_POLICY.languageRules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      <p class="lede" style="margin-top:0.75rem">Full brand: <a href="/medvirtual-brand-guide.html">Brand Guide</a> · Layout: <a href="/real-people-creative.html#concept">Portrait Lead</a></p>
    </section>
  </main>

  <div class="toast" id="toast" role="status">Copied</div>
  <script>
    const toast = document.getElementById('toast');
    function flash(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1400);
    }
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.getAttribute('data-copy') || '');
          flash('Copied — paste into Graphics Request Form');
        } catch {
          flash('Copy failed');
        }
      });
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'graphic-request-brief.html'), html);
console.log(
  `Creative brief (VA queue): do_now=${doNow.length} queued=${queued.length} ready=${ready.length} dead=${dead.length}`,
);
