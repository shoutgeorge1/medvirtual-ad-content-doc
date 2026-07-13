/**
 * CMO Review — light presentation: real VA ad mocks + approve/notes.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { CMO_EXAMPLES, copyPackage } from './cmo-review-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderExample(ex) {
  const pkg = copyPackage(ex);
  return `<section class="person" id="ex-${esc(ex.id)}" data-id="${esc(ex.id)}">
    <header class="person__head">
      <div>
        <h3>${esc(ex.firstName)}</h3>
        <p class="person__role">${esc(ex.role)}</p>
      </div>
      <span class="angle">${esc(ex.angle)}</span>
    </header>
    <div class="ratio-grid">
      <figure>
        <figcaption>4:5</figcaption>
        <button type="button" class="preview-hit" data-preview="${esc(ex.images['4x5'])}" aria-label="Open ${esc(ex.firstName)} 4:5 full size">
          <img src="${esc(ex.images['4x5'])}" alt="${esc(ex.firstName)} 4:5" width="1080" height="1350" loading="lazy" decoding="async" />
        </button>
      </figure>
      <figure>
        <figcaption>1:1</figcaption>
        <button type="button" class="preview-hit" data-preview="${esc(ex.images['1x1'])}" aria-label="Open ${esc(ex.firstName)} 1:1 full size">
          <img src="${esc(ex.images['1x1'])}" alt="${esc(ex.firstName)} 1:1" width="1080" height="1080" loading="lazy" decoding="async" />
        </button>
      </figure>
      <figure class="ratio-916">
        <figcaption>9:16</figcaption>
        <button type="button" class="preview-hit" data-preview="${esc(ex.images['9x16'])}" aria-label="Open ${esc(ex.firstName)} 9:16 full size">
          <img src="${esc(ex.images['9x16'])}" alt="${esc(ex.firstName)} 9:16" width="1080" height="1920" loading="lazy" decoding="async" />
        </button>
      </figure>
    </div>
    <div class="copy-card">
      <p class="hl">${esc(ex.headline)}</p>
      <p class="desc">${esc(ex.description)} · CTA: <strong>${esc(ex.cta)}</strong></p>
      <details>
        <summary>Primary text</summary>
        <p>${esc(ex.primaryText)}</p>
      </details>
      <button type="button" class="copy-btn" data-copy="${esc(pkg)}">Copy package</button>
    </div>
    <div class="review-row">
      <div class="approval" role="group" aria-label="Status for ${esc(ex.firstName)}">
        <button type="button" class="appr" data-appr="approve">Approve</button>
        <button type="button" class="appr" data-appr="revise">Revise</button>
        <button type="button" class="appr" data-appr="hold">Hold</button>
      </div>
      <label class="notes-label">Notes
        <textarea class="notes" rows="2" placeholder="Quick notes from this review…" data-notes></textarea>
      </label>
    </div>
  </section>`;
}

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.45; }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 1rem 1.15rem 2.75rem; }
  .hero {
    background: #0f172a; color: #f8fafc; border-radius: 12px;
    padding: 1rem 1.15rem; margin-bottom: 0.85rem;
  }
  .hero h2 { font-size: 1.25rem; font-weight: 750; margin-bottom: 0.3rem; }
  .hero p { color: #94a3b8; font-size: 0.9rem; max-width: 48ch; }
  .tag {
    display: inline-block; margin-top: 0.65rem; font-size: 0.68rem; font-weight: 750;
    text-transform: uppercase; letter-spacing: 0.03em; color: #99f6e4;
    border: 1px solid rgba(94,234,212,0.35); border-radius: 6px; padding: 0.25rem 0.5rem;
  }
  .intro {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
    padding: 0.75rem 0.9rem; margin-bottom: 0.85rem; font-size: 0.9rem; color: #475569;
  }
  .person {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
    padding: 0.85rem 0.95rem 1rem; margin-bottom: 0.75rem;
  }
  .person__head { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: space-between; align-items: baseline; margin-bottom: 0.65rem; }
  .person h3 { font-size: 1.1rem; font-weight: 800; }
  .person__role { font-size: 0.85rem; color: #64748b; font-weight: 600; }
  .angle {
    font-size: 0.7rem; font-weight: 750; color: #0f766e; background: #f0fdfa;
    border: 1px solid #99f6e4; border-radius: 999px; padding: 0.22rem 0.55rem;
  }
  .ratio-grid { display: grid; grid-template-columns: 1.05fr 0.95fr 0.7fr; gap: 0.55rem; margin-bottom: 0.7rem; }
  @media (max-width: 860px) { .ratio-grid { grid-template-columns: 1fr; max-width: 360px; } }
  .ratio-grid figcaption { font-size: 0.65rem; font-weight: 750; text-transform: uppercase; color: #94a3b8; margin-bottom: 0.25rem; }
  .preview-hit {
    display: block; width: 100%; padding: 0; border: 0; background: transparent; cursor: zoom-in; border-radius: 8px;
  }
  .preview-hit img {
    width: 100%; height: auto; display: block; border-radius: 8px; border: 1px solid #e2e8f0; background: #0f172a;
  }
  .ratio-916 .preview-hit img { max-height: 380px; width: auto; max-width: 100%; margin: 0 auto; }
  .copy-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.65rem 0.75rem; }
  .hl { font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 0.2rem; }
  .desc { font-size: 0.82rem; color: #475569; margin-bottom: 0.4rem; }
  details { margin: 0.35rem 0; }
  details summary { font-size: 0.75rem; font-weight: 700; color: #0d9488; cursor: pointer; }
  details p { margin-top: 0.35rem; font-size: 0.84rem; color: #334155; }
  .copy-btn {
    margin-top: 0.35rem; font-size: 0.74rem; font-weight: 700; color: #0f766e;
    background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 6px; padding: 0.3rem 0.55rem; cursor: pointer;
  }
  .copy-btn.copied { background: #0d9488; color: #fff; border-color: #0d9488; }
  .review-row { display: grid; grid-template-columns: auto 1fr; gap: 0.75rem; margin-top: 0.7rem; align-items: start; }
  @media (max-width: 700px) { .review-row { grid-template-columns: 1fr; } }
  .approval { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .appr {
    font-size: 0.78rem; font-weight: 750; padding: 0.4rem 0.7rem; border-radius: 8px;
    border: 1px solid #cbd5e1; background: #fff; color: #475569; cursor: pointer;
  }
  .appr[data-appr="approve"].on { background: #0d9488; border-color: #0d9488; color: #fff; }
  .appr[data-appr="revise"].on { background: #f59e0b; border-color: #f59e0b; color: #fff; }
  .appr[data-appr="hold"].on { background: #64748b; border-color: #64748b; color: #fff; }
  .notes-label { display: grid; gap: 0.25rem; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; }
  .notes {
    width: 100%; font: inherit; font-size: 0.88rem; font-weight: 500; text-transform: none;
    color: #0f172a; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.5rem 0.6rem; resize: vertical; min-height: 52px;
  }
  .notes:focus { outline: 2px solid #99f6e4; border-color: #0d9488; }
  .lightbox {
    position: fixed; inset: 0; background: rgba(15,23,42,0.88); display: none;
    align-items: center; justify-content: center; z-index: 80; padding: 1rem;
  }
  .lightbox.open { display: flex; }
  .lightbox img { max-width: min(100%, 720px); max-height: 92vh; width: auto; height: auto; border-radius: 10px; }
  .lightbox-close {
    position: absolute; top: 1rem; right: 1rem; background: #fff; border: 0; border-radius: 8px;
    font-weight: 800; padding: 0.45rem 0.7rem; cursor: pointer;
  }
  .toast {
    position: fixed; bottom: 1rem; right: 1rem; background: #0f172a; color: #fff;
    padding: 0.45rem 0.7rem; border-radius: 8px; font-size: 0.78rem; opacity: 0; transition: opacity .2s; z-index: 90;
  }
  .toast.show { opacity: 1; }
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Real People Creative Review — MedVirtual</title>
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'cmo-review',
    pageTitle: 'Real People Creative Review',
    pageSubtitle: 'Named MedVirtual talent as Meta ad creative — quick sample for review.',
  })}
  <div class="wrap">
    <header class="hero">
      <h2>Real People Creative Review</h2>
      <p>Real Talent Pool faces and roles, framed as Meta ads. Click any image to view full size.</p>
      <span class="tag">CMO sample review · not final campaign approval</span>
    </header>

    <p class="intro">Instead of stock headsets, show a real MedVirtual VA the practice can imagine interviewing. Four examples below — mark approve / revise / hold and add notes as you go.</p>

    ${CMO_EXAMPLES.map(renderExample).join('')}
  </div>

  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image preview">
    <button type="button" class="lightbox-close" id="lightbox-close">Close</button>
    <img id="lightbox-img" alt="" />
  </div>
  <div class="toast" id="toast" role="status">Copied</div>
  <script>
    (function () {
      const KEY = 'mv-cmo-review-v1';
      const toast = document.getElementById('toast');
      const lb = document.getElementById('lightbox');
      const lbImg = document.getElementById('lightbox-img');
      function load() {
        try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
      }
      function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }
      let state = load();

      document.querySelectorAll('.person').forEach((sec) => {
        const id = sec.dataset.id;
        const saved = state[id] || {};
        if (saved.appr) {
          const btn = sec.querySelector('.appr[data-appr="' + saved.appr + '"]');
          if (btn) btn.classList.add('on');
        }
        const notes = sec.querySelector('[data-notes]');
        if (notes && saved.notes) notes.value = saved.notes;

        sec.querySelectorAll('.appr').forEach((btn) => {
          btn.addEventListener('click', () => {
            sec.querySelectorAll('.appr').forEach((b) => b.classList.remove('on'));
            btn.classList.add('on');
            state[id] = state[id] || {};
            state[id].appr = btn.getAttribute('data-appr');
            save(state);
          });
        });
        if (notes) {
          notes.addEventListener('input', () => {
            state[id] = state[id] || {};
            state[id].notes = notes.value;
            save(state);
          });
        }
      });

      document.querySelectorAll('[data-copy]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(btn.getAttribute('data-copy') || '');
            btn.classList.add('copied');
            toast.textContent = 'Copied';
            toast.classList.add('show');
            setTimeout(() => { btn.classList.remove('copied'); toast.classList.remove('show'); }, 1000);
          } catch (e) {}
        });
      });

      function openPreview(src) {
        lbImg.src = src;
        lbImg.alt = 'Full-size preview';
        lb.classList.add('open');
      }
      function closePreview() {
        lb.classList.remove('open');
        lbImg.removeAttribute('src');
      }
      document.querySelectorAll('[data-preview]').forEach((btn) => {
        btn.addEventListener('click', () => openPreview(btn.getAttribute('data-preview')));
      });
      document.getElementById('lightbox-close').addEventListener('click', closePreview);
      lb.addEventListener('click', (e) => { if (e.target === lb) closePreview(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePreview(); });
    })();
  </script>
</body>
</html>
`;

const missing = [];
for (const ex of CMO_EXAMPLES) {
  for (const src of Object.values(ex.images)) {
    if (!fs.existsSync(path.join(PUBLIC, src.replace(/^\//, '')))) missing.push(src);
  }
}
if (missing.length) {
  console.error('Missing images', missing);
  process.exit(1);
}

fs.writeFileSync(path.join(PUBLIC, 'real-people-cmo-review.html'), html);
console.log('Wrote public/real-people-cmo-review.html (light CMO review)');
