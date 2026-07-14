/**
 * Graphic Request Brief = simple jobs list for graphics designers.
 * Source data: creative-hopper-data.mjs · Regenerate: npm run generate:brief
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import {
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
    do_now: 'Job',
    queued: 'Later',
    ready_to_load: 'Done',
    live: 'Live',
    retired: 'Retired',
    killed: 'Do not build',
  };
  return map[s] || s;
}

function refLabel(url) {
  const u = String(url);
  if (u.includes('logo-colored')) return 'MedVirtual logo';
  if (u.includes('clean-master')) return 'Person photo to use';
  if (u.includes('ad-treatment-e-9x16')) return 'Tall draft example (optional)';
  if (u.includes('ad-treatment-e-4x5')) return 'Example finished ad (layout guide)';
  if (u.includes('role-offer-templates')) return 'More layout examples';
  if (u.includes('real-people-creative')) return 'Real People page';
  if (u.includes('template-test-board')) return 'Template board';
  const file = u.split('/').pop() || u;
  return file;
}

function renderJobCard(item, jobNumber) {
  const paste = graphicsFormPaste(item);
  const displayTitle = item.designerTitle || item.title;
  const jobTag = item.batchLabel || 'Design job';

  return `<article class="card work" id="${esc(item.id)}">
    <div class="card-top">
      <span class="badge go">Ad ${esc(String(jobNumber))}</span>
      <span class="batch">${esc(jobTag)}</span>
    </div>
    <h3>${esc(displayTitle)}</h3>
    <dl class="mini">
      <div><dt>Size</dt><dd>${esc(item.resolution)}</dd></div>
      ${item.onImage ? `<div><dt>Big text</dt><dd>${esc(item.onImage)}</dd></div>` : ''}
      ${item.roleLine ? `<div><dt>Role</dt><dd>${esc(item.roleLine)}</dd></div>` : ''}
      <div><dt>Due</dt><dd>${esc(item.dueDate)}</dd></div>
    </dl>
    <div class="desc"><span class="label">Helpful details</span><p>${fmtDesc(item.description)}</p></div>
    <div class="refs"><span class="label">Files &amp; examples to open</span><ul>${(item.references || [])
      .map((r) => {
        const href = r.startsWith('http') || r.startsWith('/') ? r : '#';
        const label = refLabel(r);
        return href === '#'
          ? `<li>${esc(label)}</li>`
          : `<li><a href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a></li>`;
      })
      .join('')}</ul></div>
    <div class="actions">
      <button type="button" class="btn primary" data-copy="${esc(paste)}">Copy full brief</button>
      <button type="button" class="btn" data-copy="${esc(item.description || '')}">Copy details only</button>
    </div>
  </article>`;
}

function renderArchiveCard(item, mode) {
  const isDead = mode === 'dead';
  const isReady = mode === 'ready_to_load';

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

  return `<article class="card ${isReady ? 'ready' : ''}" id="${esc(item.id)}">
    <div class="card-top">
      <span class="badge ${isReady ? 'ok' : 'wait'}">${esc(statusLabel(item.status))}</span>
      <span class="batch">${esc(item.batchLabel || '')}</span>
    </div>
    <h3>${esc(item.designerTitle || item.title)}</h3>
    <dl class="mini">
      <div><dt>Size</dt><dd>${esc(item.resolution)}</dd></div>
      ${item.onImage ? `<div><dt>On-image</dt><dd>${esc(item.onImage)}</dd></div>` : ''}
    </dl>
    <div class="actions">
      ${
        isReady
          ? `<a class="btn primary" href="/meta-launch-build-pack.html">Meta Launch</a>
             ${
               item.uploadFile
                 ? `<a class="btn" href="/exports/meta-upload-ready/${esc(item.uploadFile)}" target="_blank" rel="noopener">Preview PNG</a>`
                 : ''
             }`
          : `<button type="button" class="btn" data-copy="${esc(graphicsFormPaste(item))}">Copy brief (later)</button>`
      }
    </div>
  </article>`;
}

const counts = hopperCounts();
const doNow = hopperByStatus('do_now');
const queued = hopperByStatus('queued');
const ready = hopperByStatus('ready_to_load');
const dead = [...hopperByStatus('killed'), ...hopperByStatus('retired')];

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
  .hero p { margin: 0 0 0.75rem; color: #475569; max-width: 38rem; }
  .hint {
    background: #ecfeff; border: 1px solid #a5f3fc; color: #155e75;
    border-radius: 10px; padding: 0.7rem 0.85rem; margin-bottom: 1rem; font-weight: 600; font-size: 0.92rem;
  }
  .steps {
    display: grid; gap: 0.45rem; margin: 0 0 1.25rem; padding: 0; list-style: none; counter-reset: step;
  }
  .steps li {
    background: #fff; border: 1px solid #d7e2ea; border-radius: 10px; padding: 0.65rem 0.8rem 0.65rem 2.5rem;
    position: relative; font-size: 0.95rem; color: #334155;
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
  section > h2 { margin: 0 0 0.35rem; font-size: 1.15rem; }
  section > .lede { margin: 0 0 0.75rem; color: #64748b; font-size: 0.92rem; }
  .card {
    background: #fff; border: 1px solid #d7e2ea; border-radius: 12px; padding: 1rem 1.05rem; margin-bottom: 0.9rem;
  }
  .card.work { border-color: ${BRAND.colors.main01}; box-shadow: 0 0 0 1px rgba(7,121,153,0.15); }
  .card.ready { border-color: #86efac; }
  .card.dead { opacity: 0.85; background: #f8fafc; }
  .card-top { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; margin-bottom: 0.35rem; }
  .badge {
    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;
    padding: 0.25rem 0.55rem; border-radius: 999px;
  }
  .badge.go { background: #dcfce7; color: #166534; }
  .badge.ok { background: #dbeafe; color: #1e40af; }
  .badge.wait { background: #f1f5f9; color: #475569; }
  .badge.bad { background: #fee2e2; color: #991b1b; }
  .batch, .prio { font-size: 0.75rem; color: #64748b; font-weight: 600; }
  .card h3 { margin: 0 0 0.55rem; font-size: 1.15rem; line-height: 1.25; }
  .mini { margin: 0 0 0.65rem; display: grid; gap: 0.25rem; }
  .mini div { display: grid; grid-template-columns: 6.5rem 1fr; gap: 0.35rem; font-size: 0.9rem; }
  .mini dt { color: #64748b; font-weight: 600; }
  .mini dd { margin: 0; font-weight: 600; }
  .label { display: block; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: #64748b; margin-bottom: 0.3rem; }
  .desc, .refs { margin: 0 0 0.65rem; padding: 0.7rem 0.8rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
  .desc p { margin: 0; font-size: 0.92rem; color: #334155; }
  .refs ul { margin: 0; padding-left: 1.1rem; font-size: 0.9rem; }
  .refs a { color: ${BRAND.colors.main01}; font-weight: 600; word-break: break-word; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0.5rem 0.8rem; border-radius: 8px; border: 1px solid #cbd5e1;
    background: #fff; color: ${BRAND.colors.main03}; font: inherit; font-size: 0.85rem; font-weight: 700;
    text-decoration: none; cursor: pointer;
  }
  .btn.primary { background: ${BRAND.colors.main01}; border-color: ${BRAND.colors.main01}; color: #fff; }
  .kill { margin: 0; font-size: 0.88rem; color: #7f1d1d; }
  main details.archive {
    background: #fff; border: 1px solid #d7e2ea; border-radius: 12px; padding: 0.75rem 0.9rem;
    margin-bottom: 0.55rem;
  }
  main details.archive summary { cursor: pointer; font-weight: 800; color: #64748b; }
  .rules { margin: 0.65rem 0 0; padding-left: 1.1rem; color: #475569; font-size: 0.88rem; }
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
  <title>Graphics brief · MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'brief',
    pageTitle: 'Graphics brief',
    pageSubtitle: 'Four ads we need help with — thank you for taking these on',
  })}
  <main>
    <header class="hero">
      <h1>Four ads to design</h1>
      <p>Thanks for helping with these. Each card is one ad. Open the example, then use the photo and logo linked on the card. The folder at the bottom is just for the producer team if you need it later.</p>
    </header>

    <p class="hint">Ad 1–4 are ready whenever you are. Following the example layout keeps everything consistent — we really appreciate that.</p>

    <ol class="steps">
      ${HOPPER_POLICY.howItWorks.map((s) => `<li>${esc(s)}</li>`).join('')}
    </ol>

    <nav class="jump" aria-label="On this page">
      <a href="#jobs">The four ads</a>
      <a href="/real-people-creative.html">See finished ads</a>
      <a href="/medvirtual-brand-guide.html">Brand guide</a>
    </nav>

    <section id="jobs">
      <h2>Ads we need</h2>
      <p class="lede">Feel free to download the files on each card before you start.</p>
      ${
        doNow.length
          ? doNow.map((i, idx) => renderJobCard(i, idx + 1)).join('')
          : '<p class="lede">Nothing queued right now — feel free to check with your MedVirtual contact.</p>'
      }
    </section>

    <section>
      <h2>Brand notes (short)</h2>
      <ul class="rules">${HOPPER_POLICY.languageRules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
    </section>

    <section id="archive">
      <h2>Producer notes</h2>
      <p class="lede">Optional reference for producers. Designers usually won’t need this.</p>
      <details class="archive">
        <summary>Already finished (${esc(String(ready.length))})</summary>
        <div style="margin-top:0.75rem">${ready.map((i) => renderArchiveCard(i, 'ready_to_load')).join('') || '<p class="lede">None.</p>'}</div>
      </details>
      <details class="archive">
        <summary>Coming later (${esc(String(queued.length))})</summary>
        <div style="margin-top:0.75rem">${queued.map((i) => renderArchiveCard(i, 'queued')).join('') || '<p class="lede">None.</p>'}</div>
      </details>
      <details class="archive">
        <summary>Paused / not needed (${esc(String(dead.length))})</summary>
        <div style="margin-top:0.75rem">${dead.map((i) => renderArchiveCard(i, 'dead')).join('') || '<p class="lede">None.</p>'}</div>
      </details>
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
          flash('Copied');
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
  `Brief (designer jobs): jobs=${doNow.length} queued=${queued.length} ready=${ready.length} dead=${dead.length} (counts do_now=${counts.do_now || 0})`,
);
