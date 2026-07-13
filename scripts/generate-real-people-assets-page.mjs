/**
 * Real People Assets — download library for graphics / video / AI reference.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import {
  SYNTHETIC_VIDEO_HANDOFF,
  TALENT,
  TREATMENT_C,
  MONDAY_REAL_PEOPLE_BATCH,
  treatmentCPackage,
  talentById,
  SOURCE_CHECKED_AT,
} from './real-people-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const CATALOG = path.join(PUBLIC, 'exports', 'real-people', 'real-people-assets-catalog.json');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loadCatalog() {
  if (!fs.existsSync(CATALOG)) return { people: [], masterZip: null };
  return JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
}

function statusPills(st = {}) {
  const rows = [
    ['Public still approved', !!st.publicStillApproved],
    ['Static ad approved', !!st.staticAdApproved],
    ['Synthetic animation approval needed', !!st.syntheticAnimationApprovalNeeded],
    ['Real video requested', !!st.realVideoRequested],
    ['Final creative approved', !!st.finalCreativeApproved],
  ];
  return rows
    .map(
      ([label, on]) =>
        `<span class="status ${on ? (label.includes('needed') ? 'status-warn' : 'status-on') : 'status-off'}">${esc(label)}</span>`,
    )
    .join('');
}

function dl(href, label) {
  if (!href) return `<span class="dl disabled">${esc(label)}</span>`;
  return `<a class="dl" href="${esc(href)}" download>${esc(label)}</a>`;
}

function renderPerson(t, catPerson) {
  const slug = t.assetSlug || t.id;
  const files = catPerson?.files || {};
  const notes = t.assetNotes || {};
  const limits = catPerson?.limitations || [];
  const src = files.original || files.cleanMaster;
  return `<article class="asset-card" id="asset-${esc(slug)}">
    <div class="asset-card__media">
      <button type="button" class="preview-hit" data-preview="${esc(files.profile11?.path || t.imagePath)}" aria-label="Preview ${esc(t.firstName)} profile">
        <img src="${esc(files.profile11?.path || t.imagePath)}" alt="${esc(t.fullPublicName)} — clean profile crop" width="320" height="320" loading="lazy" decoding="async" />
      </button>
    </div>
    <div class="asset-card__body">
      <h3>${esc(t.firstName)} <span class="muted">${esc(t.fullPublicName)}</span></h3>
      <p class="role">${esc(t.title)}</p>
      <p class="meta"><a href="${esc(t.profileUrl)}" target="_blank" rel="noopener noreferrer">Talent Pool profile</a> · source checked ${esc(t.sourceCheckedAt || SOURCE_CHECKED_AT)}</p>
      <dl class="facts">
        <div><dt>Original</dt><dd>${src ? `${esc(src.width)}×${esc(src.height)} · ${esc(src.format)} · ${esc(src.sizeLabel)}` : 'See folder'}</dd></div>
        <div><dt>Recommended usage</dt><dd>${esc(notes.recommendedUsage || '—')}</dd></div>
        <div><dt>Crop quality</dt><dd>${esc(notes.cropQuality || '—')}</dd></div>
        <div><dt>Background</dt><dd>${esc(notes.backgroundNotes || '—')}</dd></div>
        <div><dt>Face / shoulders</dt><dd>${esc(notes.faceVisibility || '—')} · shoulders ${notes.shouldersVisible ? 'visible' : 'limited'}</dd></div>
        <div><dt>AI speaking reference</dt><dd>${notes.aiSpeakingSuitable ? 'Suitable (face forward, unobstructed)' : 'SOURCE LIMITATION — MANUAL REVIEW REQUIRED'}</dd></div>
      </dl>
      ${limits.length ? `<p class="limit">${limits.map(esc).join(' ')}</p>` : ''}
      <div class="status-row">${statusPills(t.approvalStatus)}</div>
      <div class="dl-row">
        ${dl(files.original?.path, 'Original')}
        ${dl(files.cleanMaster?.path, 'Clean master')}
        ${dl(files.profile11?.path, '1:1')}
        ${dl(files.feed45?.path, '4:5')}
        ${dl(files.vertical?.path, '9:16 ref')}
        ${dl(files.aiReference?.path, 'AI reference')}
        ${dl(catPerson?.personZip, 'Download all for this person')}
      </div>
      <div class="thumb-row">
        ${['cleanMaster', 'profile11', 'feed45', 'vertical', 'aiReference']
          .filter((k) => files[k])
          .map(
            (k) =>
              `<button type="button" class="thumb preview-hit" data-preview="${esc(files[k].path)}" aria-label="Preview ${esc(k)}">
                <img src="${esc(files[k].path)}" alt="${esc(k)} preview" width="96" height="96" loading="lazy" />
               </button>`,
          )
          .join('')}
      </div>
      <p class="preview-hint">Click any image to preview full size. Use the buttons above to download.</p>
    </div>
  </article>`;
}

function renderMonday(cat) {
  return MONDAY_REAL_PEOPLE_BATCH.map((row) => {
    const tc = TREATMENT_C.find((x) => x.talentId === row.talentId);
    const t = talentById(row.talentId);
    const slug = t.assetSlug || t.id;
    const person = (cat.people || []).find((p) => p.slug === slug || p.id === t.id);
    const raw = person?.files?.cleanMaster?.path || person?.files?.original?.path || t.imagePath;
    const ad45 = `/assets/real-people/${slug}/ad-treatment-c-4x5.png`;
    const pkg = treatmentCPackage(tc);
    return `<article class="monday-card">
      <div class="monday-card__preview">
        <button type="button" class="preview-hit" data-preview="${esc(ad45)}" aria-label="Preview ${esc(t.firstName)} 4:5 Treatment C">
          <img src="${esc(ad45)}" alt="${esc(tc.meetLine)} Treatment C 4:5 preview" width="270" height="338" loading="lazy" />
        </button>
      </div>
      <div>
        <h3>${esc(t.firstName)} — ${esc(row.angle)}</h3>
        <ul class="monday-list">
          <li><strong>Canvas:</strong> 1080 × 1350 (primary)</li>
          <li><strong>Headline:</strong> ${esc(tc.headlineLines.join(' / '))}</li>
          <li><strong>Name:</strong> ${esc(tc.meetLine)}</li>
          <li><strong>Role:</strong> ${esc(tc.role)}</li>
          <li><strong>Bullets:</strong> ${esc(tc.bullets.map((b) => b.text).join(' · '))}</li>
          <li><strong>CTA strip:</strong> ${esc(tc.ctaStrip)}</li>
          <li><strong>Logo:</strong> Larger MedVirtual mark in white high-contrast plate</li>
          <li><strong>Raw image:</strong> <a href="${esc(raw)}" download>Download clean master</a></li>
          <li><strong>Source:</strong> <a href="${esc(t.profileUrl)}" target="_blank" rel="noopener noreferrer">Talent Pool</a></li>
          <li><strong>Claim restrictions:</strong> No HIPAA / YOE / software / availability / outcome inventions. Full-Time only when employment type is shown.</li>
        </ul>
        <button type="button" class="copy-btn" data-copy="${esc(pkg)}">Copy all for Monday</button>
        <a class="dl" href="${esc(ad45)}" download>Download 4:5 Treatment C PNG</a>
      </div>
    </article>`;
  }).join('');
}

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.45; }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 1rem 1.15rem 3rem; }
  .hero { background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.1rem 1.2rem; margin-bottom: 0.75rem; }
  .hero h2 { font-size: 1.15rem; margin-bottom: 0.35rem; }
  .hero p { color: #cbd5e1; font-size: 0.88rem; max-width: 65ch; }
  .top-actions { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 0.75rem 0; }
  .dl, .copy-btn {
    display: inline-block; font-size: 0.74rem; font-weight: 700; padding: 0.4rem 0.65rem; border-radius: 7px;
    text-decoration: none; border: 1px solid #99f6e4; background: #f0fdfa; color: #0f766e; cursor: pointer;
  }
  .dl:hover, .copy-btn:hover { background: #ccfbf1; }
  .dl.primary { background: #0d9488; color: #fff; border-color: #0d9488; }
  .dl.disabled { opacity: 0.45; pointer-events: none; }
  .section { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.9rem 1rem; margin-bottom: 0.7rem; }
  .section > h2 { font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: #64748b; margin-bottom: 0.5rem; }
  .asset-card { display: grid; grid-template-columns: 200px 1fr; gap: 0.85rem; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #fff; margin-bottom: 0.75rem; }
  @media (max-width: 720px) { .asset-card { grid-template-columns: 1fr; } }
  .asset-card__media img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; background: #0f172a; }
  .asset-card__body { padding: 0.75rem 0.85rem 0.9rem; }
  .muted { font-size: 0.75rem; color: #64748b; font-weight: 600; }
  .role { font-size: 0.9rem; font-weight: 700; margin: 0.15rem 0; }
  .meta { font-size: 0.76rem; color: #64748b; margin-bottom: 0.45rem; }
  .meta a { color: #0d9488; font-weight: 700; text-decoration: none; }
  .facts { display: grid; gap: 0.25rem; margin-bottom: 0.5rem; }
  .facts dt { font-size: 0.62rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; }
  .facts dd { font-size: 0.8rem; color: #334155; }
  .limit { font-size: 0.76rem; color: #b45309; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 0.35rem 0.5rem; margin-bottom: 0.4rem; }
  .status-row { display: flex; flex-wrap: wrap; gap: 0.3rem; margin: 0.4rem 0; }
  .status { font-size: 0.65rem; font-weight: 750; padding: 0.18rem 0.4rem; border-radius: 5px; }
  .status-on { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
  .status-warn { background: #fff7ed; color: #c2410c; border: 1px solid #fdba74; }
  .status-off { background: #f8fafc; color: #94a3b8; border: 1px solid #e2e8f0; }
  .dl-row { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.45rem; }
  .thumb-row { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.55rem; }
  .thumb-row img { width: 72px; height: 72px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0; display: block; }
  .thumb { padding: 0; border: 0; background: transparent; cursor: zoom-in; border-radius: 6px; }
  .preview-hit { padding: 0; border: 0; background: transparent; cursor: zoom-in; display: block; width: 100%; }
  .preview-hit img { width: 100%; display: block; border-radius: 8px; }
  .asset-card__media .preview-hit img { aspect-ratio: 1; object-fit: cover; }
  .preview-hint { font-size: 0.72rem; color: #64748b; margin-top: 0.35rem; }
  .lightbox {
    position: fixed; inset: 0; background: rgba(15,23,42,0.88); display: none;
    align-items: center; justify-content: center; z-index: 80; padding: 1rem;
  }
  .lightbox.open { display: flex; }
  .lightbox img { max-width: min(100%, 900px); max-height: 92vh; width: auto; height: auto; border-radius: 10px; background: #0f172a; }
  .lightbox-close {
    position: absolute; top: 1rem; right: 1rem; background: #fff; border: 0; border-radius: 8px;
    font-weight: 800; padding: 0.45rem 0.7rem; cursor: pointer;
  }
  .monday-card { display: grid; grid-template-columns: 180px 1fr; gap: 0.85rem; border: 2px solid #0d9488; border-radius: 12px; padding: 0.75rem; margin-bottom: 0.65rem; }
  @media (max-width: 720px) { .monday-card { grid-template-columns: 1fr; } }
  .monday-card__preview img { width: 100%; border-radius: 8px; display: block; }
  .monday-list { padding-left: 1.1rem; font-size: 0.8rem; color: #334155; }
  .monday-list li { margin: 0.18rem 0; }
  .synth li { font-size: 0.82rem; margin: 0.2rem 0; color: #334155; }
  .toast { position: fixed; bottom: 1rem; right: 1rem; background: #0f172a; color: #fff; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.78rem; opacity: 0; transition: opacity .2s; z-index: 40; }
  .toast.show { opacity: 1; }
`;

const cat = loadCatalog();
const bySlug = Object.fromEntries((cat.people || []).map((p) => [p.slug, p]));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Real People Assets — MedVirtual</title>
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'real-people-assets',
    pageTitle: 'Real People Assets',
    pageSubtitle: 'Clean Talent Pool originals, production crops, Treatment C previews, and AI/video reference files.',
  })}
  <div class="wrap">
    <header class="hero">
      <h2>Asset library for graphics, Ronald, Jin, and editors</h2>
      <p>Not a strategy page — download sources and crops here. Strategy and copy live on Real People Creative. Public avatar sources are typically 1024×1024; crops use mild resize to 1080 — no generative face fill.</p>
      <div class="top-actions">
        ${cat.masterZip ? `<a class="dl primary" href="${esc(cat.masterZip)}" download>Download all Real People assets</a>` : '<span class="dl disabled">Master ZIP unavailable — run generate:real-people-assets</span>'}
        <a class="dl" href="/real-people-creative.html">Open Real People Creative</a>
      </div>
    </header>

    <section class="section" id="monday">
      <h2>Monday Graphics Request — first batch only</h2>
      <p style="font-size:0.84rem;color:#64748b;margin-bottom:0.65rem">Produce these four 1080×1350 Treatment C ads. Full library is below — do not expand the first request to all six profiles.</p>
      ${renderMonday(cat)}
    </section>

    <section class="section" id="synthetic">
      <h2>Synthetic Video Handoff</h2>
      <ul class="synth">${SYNTHETIC_VIDEO_HANDOFF.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <p style="margin-top:0.55rem;font-size:0.8rem;color:#b45309;font-weight:700">Still-image approval does not auto-approve synthetic animation.</p>
    </section>

    <section class="section" id="library">
      <h2>Full profile asset library</h2>
      ${TALENT.map((t) => renderPerson(t, bySlug[t.assetSlug || t.id])).join('')}
    </section>
  </div>
  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image preview">
    <button type="button" class="lightbox-close" id="lightbox-close">Close</button>
    <img id="lightbox-img" alt="" />
  </div>
  <div class="toast" id="toast">Copied</div>
  <script>
    const toast = document.getElementById('toast');
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.getAttribute('data-copy') || '');
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 1100);
        } catch (e) {}
      });
    });
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
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
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'real-people-assets.html'), html);
console.log('Wrote public/real-people-assets.html');
