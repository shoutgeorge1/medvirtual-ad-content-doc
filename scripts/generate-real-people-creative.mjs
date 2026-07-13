/**
 * Real People — one combined strategy + designer page.
 * Active concept: Treatment E (Studio Profile). C/D retired.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import {
  CONCEPT_DIRECTION,
  META_AD_PACKAGES,
  MONDAY_REAL_PEOPLE_BATCH,
  SOURCE_CHECKED_AT,
  STRATEGY,
  TALENT,
  TALENT_POOL_URL,
  TREATMENT_E,
  metaAdPackageText,
  talentById,
  treatmentEPackage,
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

const DESIGNER_NOTES = {
  chelsea: 'Scheduling pain stays in Meta primary text. Studio Profile owns the frame. No checklist.',
  mark: 'Verification angle in copy only. Candidate interview framing. No reimbursement promises.',
  jessica: 'Admin / calls pain in Meta copy. Dedicated staff joining the practice — not a call center.',
  angelica: 'Front-desk pressure without “we run your front desk.” Offer a real person to interview.',
};

function primaryParagraphs(text) {
  return text
    .split(/\n\n+/)
    .map((p) => `<p>${esc(p)}</p>`)
    .join('');
}

function tePath(slug, ratio) {
  return `/assets/real-people/${slug}/ad-treatment-e-${ratio}.png`;
}

function renderPersonCards(cat) {
  return MONDAY_REAL_PEOPLE_BATCH.map((row) => {
    const t = talentById(row.talentId);
    const te = TREATMENT_E.find((x) => x.talentId === row.talentId);
    const pkg = META_AD_PACKAGES.find((x) => x.talentId === row.talentId);
    const slug = t.assetSlug || t.id;
    const person = (cat.people || []).find((p) => p.slug === slug || p.id === t.id);
    const files = person?.files || {};
    const raw = files.cleanMaster?.path || files.original?.path || t.imagePath;
    const copyText = metaAdPackageText(pkg);
    const briefText = treatmentEPackage(te);

    return `<article class="person" id="person-${esc(slug)}">
      <div class="person__art">
        <button type="button" class="preview-hit" data-preview="${esc(tePath(slug, '4x5'))}" aria-label="Preview ${esc(t.firstName)} Studio Profile">
          <img src="${esc(tePath(slug, '4x5'))}" alt="${esc(te.meetLine)} — Studio Profile 4:5" width="432" height="540" loading="lazy" />
        </button>
        <div class="ratio-row">
          <a href="${esc(tePath(slug, '4x5'))}" download>4:5</a>
          <a href="${esc(tePath(slug, '1x1'))}" download>1:1</a>
          <a href="${esc(tePath(slug, '9x16'))}" download>9:16</a>
        </div>
      </div>
      <div class="person__body">
        <header>
          <p class="angle">${esc(pkg.creativeAngle)}</p>
          <h3>${esc(t.firstName)}</h3>
          <p class="role">${esc(t.title)}</p>
          <p class="meta"><a href="${esc(t.profileUrl)}" target="_blank" rel="noopener noreferrer">Talent Pool</a> · source ${esc(SOURCE_CHECKED_AT)}</p>
        </header>
        <dl class="facts">
          <div><dt>On-image</dt><dd>${esc(pkg.onImageHook)} · ${esc(pkg.supportingLine)}</dd></div>
          <div><dt>Meta headline</dt><dd>${esc(pkg.headline)}</dd></div>
          <div><dt>CTA</dt><dd>${esc(pkg.cta)}</dd></div>
        </dl>
        <div class="primary">
          <span class="label">Primary text</span>
          ${primaryParagraphs(pkg.primaryText)}
        </div>
        <p class="note"><strong>Designer:</strong> ${esc(DESIGNER_NOTES[t.id] || 'Studio Profile only. Official colored logo.')}</p>
        <div class="actions">
          <a class="btn primary" href="${esc(raw)}" download>Source photo</a>
          <a class="btn" href="${esc(BRAND.assets.logoColoredSvg)}" download>Logo SVG</a>
          <a class="btn" href="${esc(BRAND.assets.logoWhiteSvg)}" download>Logo white</a>
          <button type="button" class="btn" data-copy="${esc(copyText)}">Copy Meta package</button>
          <button type="button" class="btn" data-copy="${esc(briefText)}">Copy layout brief</button>
          ${person?.personZip ? `<a class="btn" href="${esc(person.personZip)}" download>All crops ZIP</a>` : ''}
        </div>
      </div>
    </article>`;
  }).join('');
}

function renderLibrary(cat) {
  const batchIds = new Set(MONDAY_REAL_PEOPLE_BATCH.map((r) => r.talentId));
  return `<div class="library-grid">${TALENT.map((t) => {
    const slug = t.assetSlug || t.id;
    const person = (cat.people || []).find((p) => p.slug === slug || p.id === t.id);
    const files = person?.files || {};
    const thumb = files.profile11?.path || files.feed45?.path || t.imagePath;
    const inBatch = batchIds.has(t.id);
    return `<article class="lib-card">
      <button type="button" class="preview-hit" data-preview="${esc(thumb)}" aria-label="Preview ${esc(t.firstName)}">
        <img src="${esc(thumb)}" alt="" width="160" height="160" loading="lazy" />
      </button>
      <div>
        <h4>${esc(t.firstName)}${inBatch ? ' <span class="pill">Batch</span>' : ''}</h4>
        <p>${esc(t.title)}</p>
        <div class="actions tight">
          ${files.cleanMaster ? `<a class="btn" href="${esc(files.cleanMaster.path)}" download>Master</a>` : ''}
          ${files.feed45 ? `<a class="btn" href="${esc(files.feed45.path)}" download>4:5</a>` : ''}
          ${files.profile11 ? `<a class="btn" href="${esc(files.profile11.path)}" download>1:1</a>` : ''}
          ${files.vertical ? `<a class="btn" href="${esc(files.vertical.path)}" download>9:16</a>` : ''}
          ${person?.personZip ? `<a class="btn" href="${esc(person.personZip)}" download>ZIP</a>` : ''}
        </div>
      </div>
    </article>`;
  }).join('')}</div>`;
}

function renderRetiredNote() {
  return `<p class="reject-banner" style="margin-top:0.75rem"><strong>Old layouts removed from this page.</strong> Treatment C (checklist flyer) and Treatment D (dark teal scrim) are retired. Do not rebuild them. Active system is Studio Profile only.</p>`;
}

const cat = loadCatalog();
const css = `
  ${HEADER_CSS}
  :root {
    --ink: ${BRAND.colors.ink};
    --paper: #f7fafc;
    --line: #d7e2ea;
    --deep: ${BRAND.colors.main03};
    --cyan: ${BRAND.colors.accent01};
    --teal: ${BRAND.colors.main01};
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: var(--ink);
    background:
      radial-gradient(ellipse 90% 50% at 10% -10%, rgba(0,192,212,0.14), transparent 55%),
      radial-gradient(ellipse 70% 40% at 100% 0%, rgba(7,121,153,0.10), transparent 50%),
      var(--paper);
  }
  main { max-width: 1120px; margin: 0 auto; padding: 1.5rem 1.25rem 4rem; }
  .hero h1 {
    font-size: clamp(1.85rem, 4vw, 2.6rem);
    line-height: 1.1;
    margin: 0 0 0.55rem;
    letter-spacing: -0.02em;
  }
  .hero .lede { max-width: 42rem; font-size: 1.05rem; line-height: 1.5; margin: 0 0 1rem; color: #334155; }
  .status-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
  .status {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.35rem 0.7rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700;
  }
  .status.go { background: #dcfce7; color: #166534; }
  .status.no { background: #fee2e2; color: #991b1b; }
  .status.soft { background: #e0f2fe; color: #0c4a6e; }
  .jump { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-bottom: 1.75rem; }
  .jump a {
    color: var(--teal); font-weight: 700; text-decoration: none;
    border-bottom: 2px solid rgba(7,121,153,0.25);
  }
  section { margin-bottom: 2.25rem; }
  section > h2 {
    font-size: 1.15rem; margin: 0 0 0.65rem; letter-spacing: -0.01em;
  }
  .concept {
    display: grid; gap: 1rem;
    grid-template-columns: 1.2fr 1fr;
    background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 1.1rem 1.15rem;
  }
  @media (max-width: 800px) { .concept { grid-template-columns: 1fr; } }
  .concept p { margin: 0 0 0.65rem; line-height: 1.45; color: #334155; }
  .concept strong.kicker { display: block; color: var(--deep); font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.35rem; }
  .rules { display: grid; gap: 0.75rem; grid-template-columns: 1fr 1fr; }
  @media (max-width: 700px) { .rules { grid-template-columns: 1fr; } }
  .rules ul { margin: 0; padding-left: 1.1rem; color: #334155; }
  .rules li { margin: 0.25rem 0; }
  .why { display: grid; gap: 0.65rem; grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 800px) { .why { grid-template-columns: 1fr; } }
  .why article {
    background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 0.85rem 0.95rem;
  }
  .why h3 { margin: 0 0 0.3rem; font-size: 0.95rem; }
  .why p { margin: 0; font-size: 0.88rem; color: #475569; line-height: 1.4; }
  .person {
    display: grid; gap: 1rem; grid-template-columns: 280px 1fr;
    background: #fff; border: 1px solid var(--line); border-radius: 14px;
    padding: 1rem; margin-bottom: 1rem;
  }
  @media (max-width: 800px) { .person { grid-template-columns: 1fr; } }
  .person__art img { width: 100%; height: auto; display: block; border-radius: 8px; }
  .preview-hit {
    display: block; width: 100%; padding: 0; border: 0; background: transparent; cursor: zoom-in;
  }
  .ratio-row { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
  .ratio-row a, .actions a, .actions button, .btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0.4rem 0.7rem; border-radius: 8px; border: 1px solid var(--line);
    background: #fff; color: var(--deep); font: inherit; font-size: 0.8rem; font-weight: 700;
    text-decoration: none; cursor: pointer;
  }
  .btn.primary, .actions .btn.primary { background: var(--teal); border-color: var(--teal); color: #fff; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }
  .actions.tight { margin-top: 0.4rem; }
  .person header h3 { margin: 0.15rem 0; font-size: 1.45rem; }
  .angle { margin: 0; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: var(--teal); }
  .role { margin: 0; color: #475569; }
  .meta { margin: 0.35rem 0 0; font-size: 0.82rem; color: #64748b; }
  .meta a { color: var(--teal); font-weight: 700; text-decoration: none; }
  .facts { margin: 0.75rem 0; display: grid; gap: 0.35rem; }
  .facts div { display: grid; grid-template-columns: 7.5rem 1fr; gap: 0.4rem; font-size: 0.9rem; }
  .facts dt { color: #64748b; font-weight: 600; }
  .facts dd { margin: 0; }
  .primary { background: #f8fafc; border: 1px solid var(--line); border-radius: 10px; padding: 0.7rem 0.85rem; }
  .primary .label { display: block; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: #64748b; margin-bottom: 0.35rem; }
  .primary p { margin: 0 0 0.55rem; line-height: 1.45; font-size: 0.92rem; }
  .primary p:last-child { margin-bottom: 0; }
  .note { margin: 0.7rem 0 0; font-size: 0.88rem; color: #475569; }
  details {
    background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 0.85rem 1rem;
  }
  details + details { margin-top: 0.65rem; }
  summary { cursor: pointer; font-weight: 800; color: var(--deep); }
  .reject-banner {
    margin: 0.75rem 0; padding: 0.65rem 0.8rem; border-radius: 10px;
    background: #fef2f2; border: 1px solid #fecaca; color: #7f1d1d; font-size: 0.9rem;
  }
  .reject-grid { display: grid; gap: 0.75rem; grid-template-columns: repeat(4, 1fr); margin-top: 0.85rem; }
  @media (max-width: 800px) { .reject-grid { grid-template-columns: repeat(2, 1fr); } }
  .reject-card { margin: 0; }
  .reject-card img { width: 100%; border-radius: 8px; opacity: 0.72; filter: grayscale(0.35); }
  .reject-card figcaption { font-size: 0.78rem; color: #7f1d1d; margin-top: 0.3rem; font-weight: 700; }
  .library-grid { display: grid; gap: 0.75rem; grid-template-columns: repeat(2, 1fr); margin-top: 0.85rem; }
  @media (max-width: 800px) { .library-grid { grid-template-columns: 1fr; } }
  .lib-card {
    display: grid; grid-template-columns: 96px 1fr; gap: 0.75rem; align-items: center;
    border: 1px solid var(--line); border-radius: 10px; padding: 0.65rem;
  }
  .lib-card img { width: 96px; height: 96px; object-fit: cover; border-radius: 8px; }
  .lib-card h4 { margin: 0; font-size: 1rem; }
  .lib-card p { margin: 0.15rem 0 0; font-size: 0.85rem; color: #64748b; }
  .pill { font-size: 0.65rem; background: #dcfce7; color: #166534; padding: 0.12rem 0.4rem; border-radius: 999px; font-weight: 800; }
  .toast {
    position: fixed; bottom: 1rem; right: 1rem; background: var(--deep); color: #fff;
    padding: 0.55rem 0.85rem; border-radius: 8px; font-weight: 700; opacity: 0; pointer-events: none;
    transition: opacity 0.2s;
  }
  .toast.show { opacity: 1; }
  .lightbox {
    position: fixed; inset: 0; background: rgba(15,23,42,0.82); display: none;
    align-items: center; justify-content: center; z-index: 80; padding: 1rem;
  }
  .lightbox.open { display: flex; }
  .lightbox img { max-width: min(920px, 96vw); max-height: 92vh; border-radius: 8px; }
  .lightbox button {
    position: absolute; top: 1rem; right: 1rem; border: 0; background: #fff; color: var(--ink);
    font-weight: 800; border-radius: 8px; padding: 0.4rem 0.7rem; cursor: pointer;
  }
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Real People · MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'real-people',
    pageTitle: 'Real People',
    pageSubtitle: 'Named Talent Pool creative — Portrait Lead concept + source downloads in one place.',
  })}
  <main>
    <header class="hero">
      <h1>Real people. One concept.</h1>
      <p class="lede">${esc(STRATEGY.intro)} Source: <a href="${esc(TALENT_POOL_URL)}" target="_blank" rel="noopener noreferrer">Talent Pool</a>.</p>
      <div class="status-row">
        <span class="status go">Now → ${esc(CONCEPT_DIRECTION.activeName)}</span>
        <span class="status no">Rejected → Treatment C</span>
        <span class="status soft">Draft mocks · not final approved art</span>
      </div>
      <nav class="jump" aria-label="On this page">
        <a href="#concept">Concept</a>
        <a href="#batch">Four people</a>
        <a href="#downloads">Downloads</a>
        <a href="#archive">Retired layouts</a>
      </nav>
    </header>

    <section id="concept">
      <h2>Treatment D — Portrait Lead</h2>
      <div class="concept">
        <div>
          <strong class="kicker">Forward concept</strong>
          <p>${esc(CONCEPT_DIRECTION.thesis)}</p>
          <div class="rules">
            <div>
              <strong class="kicker">Do</strong>
              <ul>${CONCEPT_DIRECTION.rulesDo.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            </div>
            <div>
              <strong class="kicker">Don’t</strong>
              <ul>${CONCEPT_DIRECTION.rulesDont.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
        <div>
          <strong class="kicker">Why C died</strong>
          <ul>${CONCEPT_DIRECTION.rejectedWhy.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </div>
      </div>
    </section>

    <section>
      <h2>Why named talent still matters</h2>
      <div class="why">${STRATEGY.whyMayWork
        .map(
          (w) => `<article><h3>${esc(w.title)}</h3><p>${esc(w.note)}</p></article>`,
        )
        .join('')}</div>
    </section>

    <section id="batch">
      <h2>First batch · four people</h2>
      <p style="margin:0 0 0.85rem;color:#475569;max-width:40rem">Jessica, Chelsea, Mark, Angelica. Studio Profile PNGs are concept drafts for design — Meta paste fields are ready. Pain lives in primary text / headline, not on the face.</p>
      ${renderPersonCards(cat)}
    </section>

    <section id="downloads">
      <h2>Downloads</h2>
      <details open>
        <summary>Source photos &amp; crops (all six profiles)</summary>
        ${cat.masterZip ? `<p style="margin:0.65rem 0"><a class="btn primary" href="${esc(cat.masterZip)}" download>Download all Real People assets</a></p>` : ''}
        ${renderLibrary(cat)}
      </details>
      <details>
        <summary>Brand logos</summary>
        <div class="actions" style="margin-top:0.75rem">
          <a class="btn" href="${esc(BRAND.assets.logoColoredSvg)}" download>Logo colored SVG</a>
          <a class="btn" href="${esc(BRAND.assets.logoWhiteSvg)}" download>Logo white SVG</a>
          <a class="btn" href="/medvirtual-brand-guide.html">Brand Guide</a>
          <a class="btn" href="/meta-launch-build-pack.html">Meta Launch pack</a>
        </div>
      </details>
    </section>

    <section id="archive">
      <h2>Retired layouts</h2>
      ${renderRetiredNote()}
    </section>
  </main>

  <div class="toast" id="toast" role="status">Copied</div>
  <div class="lightbox" id="lightbox" hidden>
    <button type="button" id="lightbox-close">Close</button>
    <img id="lightbox-img" alt="" />
  </div>

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
    const box = document.getElementById('lightbox');
    const boxImg = document.getElementById('lightbox-img');
    document.querySelectorAll('.preview-hit').forEach((btn) => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-preview');
        if (!src) return;
        boxImg.src = src;
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

fs.writeFileSync(path.join(PUBLIC, 'real-people-creative.html'), html);
console.log('Wrote public/real-people-creative.html');
