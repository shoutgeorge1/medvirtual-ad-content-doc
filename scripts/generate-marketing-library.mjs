/**
 * Marketing Library browse page — Blog / LinkedIn / Newsletter / Print / Social / Web assets.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const CATALOG = path.join(PUBLIC, 'exports', 'marketing-library-catalog.json');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mb(n) {
  if (n == null) return '';
  return `${(n / 1e6).toFixed(1)} MB`;
}

function main() {
  if (!fs.existsSync(CATALOG)) {
    console.error('Missing catalog. Run: node scripts/import-marketing-library.mjs');
    process.exit(1);
  }
  const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const cats = catalog.categories || [];
  const items = catalog.items || [];

  const filterChips = [
    { id: 'all', label: 'All' },
    ...cats.map((c) => ({ id: c.id, label: c.label })),
    { id: 'usable', label: 'Usable only' },
    { id: 'dnu', label: 'DNU / archive' },
  ];

  const cards = items
    .map((it) => {
      const flags = [
        it.doNotUse ? 'dnu' : 'usable',
        it.category,
        it.kind,
      ].join(' ');
      const media =
        it.kind === 'image' && it.webPath
          ? `<button type="button" class="preview-hit" data-preview="${esc(it.webPath)}" aria-label="Preview ${esc(it.title)}">
               <img src="${esc(it.webPath)}" alt="" loading="lazy" width="320" height="200" />
             </button>`
          : `<div class="file-fallback">${esc(it.kind.toUpperCase())}${it.webPath ? '' : ' · local master only'}</div>`;
      const dl =
        it.webPath
          ? `<a class="btn" href="${esc(it.webPath)}" ${it.kind === 'image' ? 'download' : 'target="_blank" rel="noopener"'}>${
              it.kind === 'pdf' ? 'Open PDF' : 'Download'
            }</a>`
          : `<span class="muted">No web file</span>`;
      return `<article class="card" data-flags="${esc(flags)}" data-cat="${esc(it.category)}">
        <div class="media">${media}</div>
        <div class="body">
          <div class="tags">
            <span class="tag">${esc(it.categoryLabel)}</span>
            ${it.doNotUse ? '<span class="tag bad">Do not use</span>' : ''}
            ${it.masterLocal ? '<span class="tag soft">Full-res master local</span>' : ''}
          </div>
          <h3>${esc(it.title)}</h3>
          <p class="meta">${esc(it.originalName)}${it.sizeWeb ? ` · web ${esc(mb(it.sizeWeb))}` : ''}${
            it.sizeOriginal ? ` · orig ${esc(mb(it.sizeOriginal))}` : ''
          }</p>
          ${it.note ? `<p class="note">${esc(it.note)}</p>` : ''}
          <div class="actions">${dl}
            <button type="button" class="btn" data-copy="${esc(it.webPath || it.id)}">Copy path</button>
          </div>
        </div>
      </article>`;
    })
    .join('');

  const css = `
    ${HEADER_CSS}
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ${BRAND.fonts.family};
      color: ${BRAND.colors.ink};
      background: #f4f7fa;
      line-height: 1.45;
    }
    main { max-width: 1100px; margin: 0 auto; padding: 1.25rem 1.1rem 3rem; }
    .hero h1 { margin: 0 0 0.4rem; font-size: clamp(1.5rem, 3vw, 2rem); letter-spacing: -0.02em; }
    .hero p { margin: 0 0 0.75rem; color: #475569; max-width: 48rem; }
    .warn {
      background: #fff7ed; border: 1px solid #fed7aa; color: #9a3412;
      border-radius: 10px; padding: 0.7rem 0.85rem; margin-bottom: 1rem; font-size: 0.9rem;
    }
    .meters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
    .meter {
      background: #fff; border: 1px solid #d7e2ea; border-radius: 999px;
      padding: 0.35rem 0.75rem; font-size: 0.8rem; font-weight: 700; color: #334155;
    }
    .filters { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; position: sticky; top: 72px; z-index: 20; background: rgba(244,247,250,0.92); padding: 0.45rem 0; backdrop-filter: blur(6px); }
    .filters button {
      border: 1px solid #cbd5e1; background: #fff; border-radius: 999px;
      padding: 0.35rem 0.7rem; font: inherit; font-size: 0.78rem; font-weight: 700;
      color: ${BRAND.colors.main03}; cursor: pointer;
    }
    .filters button.active { background: ${BRAND.colors.main01}; border-color: ${BRAND.colors.main01}; color: #fff; }
    .grid { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .card {
      background: #fff; border: 1px solid #d7e2ea; border-radius: 12px; overflow: hidden;
      display: flex; flex-direction: column;
    }
    .card[hidden] { display: none !important; }
    .media img { width: 100%; height: 160px; object-fit: cover; display: block; background: #e2e8f0; }
    .preview-hit { display: block; width: 100%; padding: 0; border: 0; background: transparent; cursor: zoom-in; }
    .file-fallback {
      height: 160px; display: grid; place-items: center; background: #e2e8f0;
      font-weight: 800; color: #64748b; font-size: 0.85rem;
    }
    .body { padding: 0.75rem 0.85rem 0.9rem; display: flex; flex-direction: column; gap: 0.35rem; flex: 1; }
    .tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
    .tag {
      font-size: 0.65rem; font-weight: 800; letter-spacing: 0.03em; text-transform: uppercase;
      padding: 0.15rem 0.45rem; border-radius: 999px; background: #e0f2fe; color: #0c4a6e;
    }
    .tag.bad { background: #fee2e2; color: #991b1b; }
    .tag.soft { background: #f1f5f9; color: #475569; }
    h3 { margin: 0; font-size: 0.95rem; line-height: 1.25; }
    .meta { margin: 0; font-size: 0.75rem; color: #64748b; word-break: break-word; }
    .note { margin: 0; font-size: 0.78rem; color: #9a3412; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: auto; padding-top: 0.35rem; }
    .btn {
      display: inline-flex; align-items: center; border: 1px solid #cbd5e1; background: #fff;
      border-radius: 8px; padding: 0.35rem 0.6rem; font: inherit; font-size: 0.78rem; font-weight: 700;
      color: ${BRAND.colors.main03}; text-decoration: none; cursor: pointer;
    }
    .muted { font-size: 0.78rem; color: #94a3b8; }
    .toast {
      position: fixed; bottom: 1rem; right: 1rem; background: ${BRAND.colors.main03}; color: #fff;
      padding: 0.55rem 0.85rem; border-radius: 8px; font-weight: 700; opacity: 0; pointer-events: none; transition: opacity 0.2s;
    }
    .toast.show { opacity: 1; }
    .lightbox {
      position: fixed; inset: 0; background: rgba(15,23,42,0.82); display: none;
      align-items: center; justify-content: center; z-index: 80; padding: 1rem;
    }
    .lightbox.open { display: flex; }
    .lightbox img { max-width: min(960px, 96vw); max-height: 92vh; border-radius: 8px; }
    .lightbox button {
      position: absolute; top: 1rem; right: 1rem; border: 0; background: #fff;
      border-radius: 8px; padding: 0.4rem 0.7rem; font-weight: 800; cursor: pointer;
    }
  `;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Marketing Library · MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'hub',
    pageTitle: 'Marketing Library',
    pageSubtitle: 'Blog, LinkedIn, newsletter, print, social, and web assets for reference',
  })}
  <main>
    <header class="hero">
      <h1>Marketing library</h1>
      <p>${esc(catalog.policy)}</p>
    </header>
    <div class="warn">
      <strong>Meta ads:</strong> use official logos under Brand Guide / Asset Hub, and Portrait Lead from Real People.
      This pack is inspiration + channel assets — not a replacement for the VA Graphics Queue.
      Items tagged <strong>Do not use</strong> came from DNU folders.
      Intro Zoom MP4 + animated MOV + Illustrator masters stay on the producer machine (.local-masters) — too large for the web doc.
      GTM / SDR / spreadsheet dumps are private and never linked here.
    </div>
    <div class="meters">
      <span class="meter">${esc(String(catalog.counts.total))} files</span>
      <span class="meter">${esc(String(catalog.counts.images))} images</span>
      <span class="meter">${esc(String(catalog.counts.pdfs))} PDFs</span>
      <span class="meter">${esc(String(catalog.counts.dnu))} DNU</span>
      <a class="meter" href="/graphic-request-brief.html">← VA Queue</a>
      <a class="meter" href="/asset-hub.html">Asset Hub</a>
    </div>
    <div class="filters" id="filters">
      ${filterChips
        .map(
          (c, i) =>
            `<button type="button" data-filter="${esc(c.id)}" class="${i === 0 ? 'active' : ''}">${esc(c.label)}</button>`,
        )
        .join('')}
    </div>
    <div class="grid" id="grid">${cards}</div>
  </main>
  <div class="toast" id="toast">Copied</div>
  <div class="lightbox" id="lightbox" hidden>
    <button type="button" id="lightbox-close">Close</button>
    <img id="lightbox-img" alt="" />
  </div>
  <script>
    const cards = [...document.querySelectorAll('.card')];
    const filters = document.getElementById('filters');
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      filters.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      cards.forEach((card) => {
        const flags = card.getAttribute('data-flags') || '';
        const cat = card.getAttribute('data-cat');
        let show = true;
        if (f === 'all') show = true;
        else if (f === 'usable') show = flags.includes('usable') && !flags.includes('dnu');
        else if (f === 'dnu') show = flags.includes('dnu');
        else show = cat === f;
        card.hidden = !show;
      });
    });
    const toast = document.getElementById('toast');
    function flash(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1200);
    }
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.getAttribute('data-copy') || '');
          flash('Copied path');
        } catch { flash('Copy failed'); }
      });
    });
    const box = document.getElementById('lightbox');
    const boxImg = document.getElementById('lightbox-img');
    document.querySelectorAll('.preview-hit').forEach((btn) => {
      btn.addEventListener('click', () => {
        boxImg.src = btn.getAttribute('data-preview');
        box.hidden = false;
        box.classList.add('open');
      });
    });
    function closeBox() {
      box.classList.remove('open');
      box.hidden = true;
      boxImg.removeAttribute('src');
    }
    document.getElementById('lightbox-close').addEventListener('click', closeBox);
    box.addEventListener('click', (e) => { if (e.target === box) closeBox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeBox(); });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PUBLIC, 'marketing-library.html'), html);
  console.log('Wrote public/marketing-library.html');
}

main();
