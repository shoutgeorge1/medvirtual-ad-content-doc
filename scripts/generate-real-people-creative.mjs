/**
 * Real People — one page: Ready (was Launch 1) · Next (was Launch 2) · concept · downloads.
 * Active look: Hailey / Role-Offer Meet (Treatment E).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import {
  LAUNCHES,
  LAUNCH_SUBNAV,
  LAUNCH_1_CARDS,
  LAUNCH_2_ITEMS,
} from './launch-sequences-data.mjs';
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
import { HAILEY_VARIANTS } from './generate-real-people-treatment-e.mjs';

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
  chelsea:
    'Match today’s Hailey Meet look. Scheduling pain stays in Meta primary — not on the image.',
  mark: 'Verification angle in Meta copy only. Public skills checklist OK. No reimbursement promises.',
  jessica: 'Admin / calls pain in Meta copy. Same DNA as Role-Offer Templates.',
  angelica: 'Front-desk pressure without “we run your front desk.” Interview framing.',
};

function primaryParagraphs(text) {
  return text
    .split(/\n\n+/)
    .map((p) => `<p>${esc(p)}</p>`)
    .join('');
}

function tePath(slug, ratio, variantId) {
  if (!variantId || variantId === 'photo-right') {
    return `/assets/real-people/${slug}/ad-treatment-e-${ratio}.png`;
  }
  return `/assets/real-people/${slug}/ad-treatment-e-${variantId}-${ratio}.png`;
}

function renderHaileyRefs() {
  return `<div class="hailey-refs">
    ${HAILEY_VARIANTS.map(
      (v) => `<figure>
        <a href="${esc(v.ref)}" target="_blank" rel="noopener">
          <img src="${esc(v.ref)}" alt="${esc(v.label)}" width="240" height="240" loading="lazy" />
        </a>
        <figcaption><strong>${esc(v.label)}</strong><span>${esc(v.note)}</span></figcaption>
      </figure>`,
    ).join('')}
  </div>`;
}

function renderVariantStrip(slug, firstName) {
  return `<div class="var-strip">
    ${HAILEY_VARIANTS.map((v) => {
      const src = tePath(slug, '4x5', v.id);
      return `<button type="button" class="var-card preview-hit" data-preview="${esc(src)}" aria-label="Preview ${esc(firstName)} · ${esc(v.label)}">
        <img src="${esc(src)}" alt="${esc(firstName)} · ${esc(v.label)}" width="216" height="270" loading="lazy" />
        <span>${esc(v.label)}</span>
      </button>`;
    }).join('')}
  </div>`;
}

function renderReadyGrid() {
  return LAUNCH_1_CARDS.map((c, i) => {
    const t = talentById(c.talentId);
    const te = TREATMENT_E.find((x) => x.talentId === c.talentId);
    const pkg = META_AD_PACKAGES.find((x) => x.talentId === c.talentId);
    const slug = t.assetSlug || t.id;
    return `<article class="ready-block">
      <div class="ready-head">
        <h3>${i + 1}. ${esc(t.firstName)}</h3>
        <p>${esc(te.role)} · Meta: ${esc(pkg.headline)}</p>
      </div>
      ${renderVariantStrip(slug, t.firstName)}
    </article>`;
  }).join('');
}

function renderNextCards() {
  return LAUNCH_2_ITEMS.map((item, i) => {
    const t = talentById(item.talentId);
    return `<article class="next-card">
      <h3>${i + 1}. ${esc(item.title)}</h3>
      <p class="meta">${esc(t?.title || '')} · ${esc(item.ratio)}</p>
      <p class="note"><strong>On-image:</strong> ${esc(item.onImage)}</p>
      <p class="note">${esc(item.note)}</p>
      <div class="actions">
        <a class="btn primary" href="${esc(item.source)}" download>Source photo</a>
        <a class="btn" href="${esc(item.ref)}" target="_blank" rel="noopener">Layout ref</a>
        <a class="btn" href="${esc(BRAND.assets.logoColoredSvg)}" download>Logo SVG</a>
        <a class="btn" href="/graphic-request-brief.html#do-now">Brief card</a>
      </div>
    </article>`;
  }).join('');
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
      <div class="person__body full">
        <header>
          <p class="angle">${esc(pkg.creativeAngle)}</p>
          <h3>${esc(t.firstName)}</h3>
          <p class="role">${esc(t.title)}</p>
          <p class="meta"><a href="${esc(t.profileUrl)}" target="_blank" rel="noopener noreferrer">Talent Pool</a> · source ${esc(SOURCE_CHECKED_AT)}</p>
        </header>
        <p class="note" style="margin-top:0.5rem"><strong>Hailey variations</strong> — same person, her four layout DNA:</p>
        ${renderVariantStrip(slug, t.firstName)}
        <div class="ratio-row" style="margin-top:0.65rem">
          <a href="${esc(tePath(slug, '4x5'))}" download>Flagship 4:5</a>
          <a href="${esc(tePath(slug, '1x1'))}" download>1:1</a>
          <a href="${esc(tePath(slug, '9x16'))}" download>9:16</a>
        </div>
        <dl class="facts">
          <div><dt>On-image</dt><dd>${esc(te.meetLine)} · ${esc(te.role)} · interview CTA · Hailey price placements</dd></div>
          <div><dt>Meta headline</dt><dd>${esc(pkg.headline)}</dd></div>
          <div><dt>CTA</dt><dd>${esc(pkg.cta)}</dd></div>
        </dl>
        <div class="primary">
          <span class="label">Primary text</span>
          ${primaryParagraphs(pkg.primaryText)}
        </div>
        <p class="note"><strong>Designer:</strong> ${esc(DESIGNER_NOTES[t.id] || 'Match Hailey Role-Offer comps — photo left/right + her price treatments.')}</p>
        <div class="actions">
          <a class="btn primary" href="${esc(raw)}" download>Source photo</a>
          <a class="btn" href="${esc(BRAND.assets.logoColoredSvg)}" download>Logo SVG</a>
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
        <h4>${esc(t.firstName)}${inBatch ? ' <span class="pill">Ready</span>' : ''}</h4>
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

const launch1 = LAUNCHES.find((l) => l.id === '1');
const launch2 = LAUNCHES.find((l) => l.id === '2');
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
  .hero .lede { max-width: 44rem; font-size: 1.05rem; line-height: 1.5; margin: 0 0 1rem; color: #334155; }
  .status-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
  .status {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.35rem 0.7rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700;
  }
  .status.go { background: #dcfce7; color: #166534; }
  .status.next { background: #e0f2fe; color: #0c4a6e; }
  .status.soft { background: #f1f5f9; color: #475569; }
  .jump { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-bottom: 1.75rem; }
  .jump a {
    color: var(--teal); font-weight: 700; text-decoration: none;
    border-bottom: 2px solid rgba(7,121,153,0.25);
  }
  section { margin-bottom: 2.25rem; }
  section > h2 {
    font-size: 1.15rem; margin: 0 0 0.45rem; letter-spacing: -0.01em;
  }
  section > .sec-lede { margin: 0 0 0.85rem; color: #475569; max-width: 44rem; font-size: 0.95rem; }
  .ready-grid {
    display: grid; gap: 1.15rem;
  }
  .ready-block {
    background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 0.9rem 1rem 1.05rem;
  }
  .ready-head h3 { margin: 0 0 0.2rem; font-size: 1.05rem; }
  .ready-head p { margin: 0 0 0.75rem; font-size: 0.88rem; color: #64748b; }
  .hailey-refs {
    display: grid; gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    margin: 0 0 1rem;
  }
  .hailey-refs figure { margin: 0; background: #fff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
  .hailey-refs img { width: 100%; height: auto; display: block; aspect-ratio: 1; object-fit: cover; }
  .hailey-refs figcaption { padding: 0.55rem 0.65rem 0.7rem; }
  .hailey-refs strong { display: block; font-size: 0.78rem; color: var(--deep); margin-bottom: 0.2rem; }
  .hailey-refs span { font-size: 0.72rem; color: #64748b; line-height: 1.35; display: block; }
  .var-strip {
    display: grid; gap: 0.55rem;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (max-width: 900px) { .var-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  .var-card {
    display: block; width: 100%; text-align: left; text-decoration: none; color: inherit;
    background: #f8fafc; border: 1px solid var(--line); border-radius: 10px; padding: 0.4rem;
    cursor: zoom-in; font: inherit;
  }
  .var-card img { width: 100%; height: auto; border-radius: 6px; display: block; }
  .var-card span { display: block; margin-top: 0.35rem; font-size: 0.7rem; font-weight: 700; color: #475569; line-height: 1.25; }
  .ready-card {
    background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 0.75rem;
    text-decoration: none; color: inherit;
  }
  .ready-card img { width: 100%; height: auto; border-radius: 8px; display: block; }
  .ready-card h3 { margin: 0.55rem 0 0.15rem; font-size: 1rem; }
  .ready-card p { margin: 0; font-size: 0.82rem; color: #64748b; }
  .ready-card .hook { margin-top: 0.35rem; color: #334155; }
  .ready-card .file { margin-top: 0.35rem; font-size: 0.7rem; font-family: ui-monospace, monospace; word-break: break-all; }
  .next-card {
    background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 0.9rem 1rem; margin-bottom: 0.75rem;
  }
  .next-card h3 { margin: 0 0 0.35rem; font-size: 1.02rem; }
  .next-card .meta { font-size: 0.82rem; color: #64748b; margin: 0 0 0.45rem; }
  .next-card .note { margin: 0 0 0.55rem; font-size: 0.9rem; color: #334155; }
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
  .person {
    display: block;
    background: #fff; border: 1px solid var(--line); border-radius: 14px;
    padding: 1rem; margin-bottom: 1rem;
  }
  .person__body.full { max-width: 100%; }
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
  main details {
    background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 0.85rem 1rem;
  }
  main details + details { margin-top: 0.65rem; }
  main summary { cursor: pointer; font-weight: 800; color: var(--deep); }
  .reject-banner {
    margin: 0.75rem 0; padding: 0.65rem 0.8rem; border-radius: 10px;
    background: #fef2f2; border: 1px solid #fecaca; color: #7f1d1d; font-size: 0.9rem;
  }
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
    pageSubtitle: 'Hailey Role-Offer variations · Ready ads · next wave · Talent Pool downloads.',
    subnav: LAUNCH_SUBNAV,
    activeSubHref: '/real-people-creative.html#ready',
  })}
  <main>
    <header class="hero">
      <h1>Real People</h1>
      <p class="lede">${esc(STRATEGY.intro)} Layouts = what Hailey likes — Meet {Name} on her Role-Offer comps. Source: <a href="${esc(TALENT_POOL_URL)}" target="_blank" rel="noopener noreferrer">Talent Pool</a>.</p>
      <div class="status-row">
        <span class="status go">Ready · ${esc(launch1.people.join(' · '))}</span>
        <span class="status next">Next · ${esc(launch2.people.join(' · '))}</span>
        <span class="status soft">${esc(CONCEPT_DIRECTION.activeName)}</span>
      </div>
      <nav class="jump" aria-label="On this page">
        <a href="#hailey">Hailey refs</a>
        <a href="#ready">Ready variations</a>
        <a href="#next">Next up</a>
        <a href="#batch">Four people + copy</a>
        <a href="#concept">Look / rules</a>
        <a href="#downloads">Downloads</a>
        <a href="/role-offer-templates.html">Role-Offer templates</a>
        <a href="/graphic-request-brief.html">Brief</a>
      </nav>
    </header>

    <section id="hailey">
      <h2>Hailey’s refs — build variations of these</h2>
      <p class="sec-lede">These are the comps she likes. Real People = same layouts with Meet {Name} + public role/skills.</p>
      ${renderHaileyRefs()}
    </section>

    <section id="ready">
      <h2>${esc(launch1.title)} · 4 layout variations each</h2>
      <p class="sec-lede">${esc(launch1.forGraphics)} Each person has burnout / biller / nurse / dental DNA.</p>
      <div class="actions" style="margin:0 0 0.85rem">
        <a class="btn primary" href="/graphic-request-brief.html">Brief / form paste</a>
        <a class="btn" href="/exports/meta-upload-ready/">Upload-ready folder</a>
        <a class="btn" href="/role-offer-templates.html">Editable Role-Offer board</a>
        <a class="btn" href="/meta-launch-build-pack.html">Ads Manager pack</a>
      </div>
      <div class="ready-grid">${renderReadyGrid()}</div>
    </section>

    <section id="next">
      <h2>${esc(launch2.title)}</h2>
      <p class="sec-lede">${esc(launch2.forGraphics)} Work cards also live in Brief DO NOW.</p>
      ${renderNextCards()}
    </section>

    <section id="batch">
      <h2>Four people · Meta copy + downloads</h2>
      <p class="sec-lede">Jessica, Chelsea, Mark, Angelica — full packages for the Ready set. Pain stays in Meta text.</p>
      ${renderPersonCards(cat)}
    </section>

    <section id="concept">
      <h2>${esc(CONCEPT_DIRECTION.activeName)}</h2>
      <div class="concept">
        <div>
          <strong class="kicker">Look</strong>
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
          <strong class="kicker">Retired</strong>
          <ul>${CONCEPT_DIRECTION.rejectedWhy.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          <p style="margin-top:0.75rem"><a class="btn" href="/role-offer-templates.html">Match Role-Offer comps →</a></p>
        </div>
      </div>
    </section>

    <section id="downloads">
      <h2>Downloads</h2>
      <details open>
        <summary>Source photos &amp; crops (all Talent Pool profiles)</summary>
        ${cat.masterZip ? `<p style="margin:0.65rem 0"><a class="btn primary" href="${esc(cat.masterZip)}" download>Download all Real People assets</a></p>` : ''}
        ${renderLibrary(cat)}
      </details>
      <details>
        <summary>Brand logos</summary>
        <div class="actions" style="margin-top:0.75rem">
          <a class="btn" href="${esc(BRAND.assets.logoColoredSvg)}" download>Logo colored SVG</a>
          <a class="btn" href="${esc(BRAND.assets.logoWhiteSvg)}" download>Logo white SVG</a>
          <a class="btn" href="/medvirtual-brand-guide.html">Brand Guide</a>
        </div>
      </details>
    </section>

    <section id="archive">
      <h2>Retired</h2>
      <p class="reject-banner"><strong>Dark mud + old flyer layouts are dead.</strong> Do not rebuild Treatment C/D. Use Hailey / Role-Offer Meet only.</p>
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
