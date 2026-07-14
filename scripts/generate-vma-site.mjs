/**
 * VMA creative-handoff site generator.
 * Writes Dashboard, Approved Creative, Competitors, Static, Video, Prompts,
 * Production Handoff, History, ideas.html, plus thin meta-refresh redirects.
 *
 * Light, calm site chrome. Large master previews. No CSS ad mockups.
 * Text / HTML / CSS only — never generates image files.
 *
 * Run: node scripts/generate-vma-site.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import {
  VMA_META,
  VMA_NAV,
  VIDEO_SCENES_15S,
  REMOTION_COMPONENTS,
  REMOTION_COMPOSITIONS,
  REMOTION_PLAYBOOK,
  CAPCUT_TEMPLATES,
  CHATGPT_PROMPTS,
  VIDEO_PROMPTS,
  COPY_EN,
  COPY_ES,
  CLAIMS,
} from './vma-site-data.mjs';
import {
  APPROVED_MASTERS,
  COLOR_DIRECTION,
  FORMAT_SPECS,
  VIDEO_OUTPUTS_PER_MASTER,
  VIDEO_STORYBOARD,
  DASHBOARD_CLAIMS,
  HANDOFF_QA,
  CURRENT_META_FORM,
  FEATURED_COMPETITOR_IDS,
  PINK_REFERENCE_COMPETITOR_IDS,
  HISTORY_NOTES,
  presentFormatsSummary,
  formatMatrixCells,
  GRAPHICS_BUILD_ORDER,
  GRAPHICS_DO,
  GRAPHICS_DONT,
} from './vma-approved-masters.mjs';
import { COMPETITOR_ADS, COMPETITOR_META, adLibraryUrl } from './competitor-ads-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

let filesWritten = 0;

function write(name, html) {
  fs.writeFileSync(path.join(PUBLIC, name), html);
  filesWritten += 1;
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Design system (calm site chrome) ────────────────────────────────────────

const PAGE_CSS = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: #0B1F3A;
    background: #F7FAFC;
    line-height: 1.5;
  }
  a { color: #077999; }
  a:hover { color: #00B2E2; }
  main { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1.15rem 4.5rem; }
  h1, h2, h3 { color: #0B1F3A; letter-spacing: -0.02em; }
  h1 { font-size: clamp(1.55rem, 3.5vw, 2.1rem); margin: 0 0 0.35rem; }
  h2 { font-size: 1.15rem; margin: 0 0 0.5rem; }
  h3 { font-size: 1rem; margin: 0 0 0.35rem; }
  .banner {
    margin: 0 0 1.35rem;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    background: #ffffff;
    border: 1px solid #D6E4EC;
    border-left: 4px solid #077999;
    font-size: 0.9rem;
    color: #0B1F3A;
  }
  .banner strong { color: #077999; }
  .banner .sub { display: block; color: #4A6275; margin-top: 0.25rem; font-weight: 400; }
  .hero { margin-bottom: 1.5rem; }
  .hero p, .lede { margin: 0; max-width: 46rem; color: #4A6275; }
  section { margin-top: 2rem; }
  section > h2 { padding-bottom: 0.35rem; border-bottom: 1px solid #E2EBF1; }
  .note {
    margin: 0.75rem 0 1rem;
    padding: 0.7rem 0.85rem;
    border-radius: 8px;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    color: #0D546B;
    font-size: 0.86rem;
  }
  .pill {
    display: inline-block;
    padding: 0.14rem 0.55rem;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    border: 1px solid transparent;
    vertical-align: middle;
  }
  .s-approved, .s-approved-creative-baseline {
    background: #E6F7F4; color: #0F766E; border-color: #99D5CD;
  }
  .s-awaiting-design {
    background: #FFF8E8; color: #A16207; border-color: #F0D78C;
  }
  .s-image-needed, .s-pending {
    background: #EEF2F6; color: #475569; border-color: #CBD5E1;
  }
  .s-rejected, .s-do-not-use {
    background: #FEECEC; color: #B91C1C; border-color: #FECACA;
  }
  .masters-grid {
    display: grid;
    gap: 1.1rem;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  .master-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .master-card__media {
    background: #E8EEF2;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .master-card__media img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  .master-card--lg .master-card__media { min-height: 220px; }
  .master-card--md .master-card__media { min-height: 160px; }
  .master-card__body { padding: 0.85rem 0.95rem 1rem; flex: 1; display: flex; flex-direction: column; gap: 0.35rem; }
  .master-card__meta { font-size: 0.72rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #077999; }
  .master-card h3 { margin: 0; font-size: 1.02rem; }
  .master-card p { margin: 0; font-size: 0.82rem; color: #4A6275; }
  .master-card .dl {
    margin-top: auto;
    padding-top: 0.5rem;
    font-size: 0.8rem;
    font-weight: 700;
  }
  .format-row {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    margin: 0.75rem 0 1.5rem;
  }
  .format-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 10px;
    overflow: hidden;
    font-size: 0.8rem;
  }
  .format-card__preview {
    background: #EEF2F6;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 110px;
    padding: 0.4rem;
  }
  .format-card__preview img {
    max-width: 100%;
    max-height: 160px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }
  .format-card__preview[data-ratio="1x1"] { aspect-ratio: 1 / 1; }
  .format-card__preview[data-ratio="4x5"] { aspect-ratio: 4 / 5; }
  .format-card__preview[data-ratio="9x16"] { aspect-ratio: 9 / 16; max-height: 200px; }
  .format-card__preview[data-ratio="1\\.91x1"] { aspect-ratio: 1.91 / 1; }
  .format-placeholder {
    text-align: center;
    padding: 0.6rem;
    color: #64748B;
    font-size: 0.72rem;
    line-height: 1.35;
  }
  .format-placeholder strong { display: block; color: #A16207; margin-bottom: 0.25rem; }
  .format-card__body { padding: 0.55rem 0.65rem 0.7rem; }
  .format-card__body b { display: block; color: #0B1F3A; }
  .quick-links {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  .quick-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 3.4rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: #077999;
    color: #fff !important;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.92rem;
  }
  .quick-links a:hover { background: #0D546B; }
  .queue-grid, .claim-grid, .comp-grid, .copy-grid, .prompt-grid {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  .soft-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 10px;
    padding: 0.9rem 1rem;
  }
  .soft-card p { margin: 0.25rem 0; font-size: 0.86rem; color: #4A6275; }
  .queue-card .value { font-size: 1.6rem; font-weight: 800; color: #077999; line-height: 1.1; }
  .checklist { list-style: none; margin: 0.5rem 0 0; padding: 0; }
  .checklist li {
    display: flex;
    gap: 0.55rem;
    align-items: flex-start;
    padding: 0.45rem 0;
    border-bottom: 1px solid #E8EEF2;
    font-size: 0.9rem;
  }
  .checklist li:last-child { border-bottom: 0; }
  .checklist input { margin-top: 0.2rem; }
  ul.clean { margin: 0.4rem 0 0; padding-left: 1.15rem; color: #4A6275; font-size: 0.88rem; }
  ul.clean li { margin: 0.2rem 0; }
  .chip {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.12rem 0.45rem;
    border-radius: 6px;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    color: #0D546B;
    margin: 0.1rem 0.15rem 0 0;
  }
  .comp-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .comp-card.incomplete { opacity: 0.72; border-style: dashed; }
  .comp-card__media {
    background: #EEF2F6;
    aspect-ratio: 4 / 5;
    max-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .comp-card__media img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  .comp-card__body { padding: 0.85rem 0.95rem 1rem; font-size: 0.84rem; }
  .comp-card__body h3 { margin: 0 0 0.25rem; font-size: 0.95rem; }
  .comp-card__body .why { font-weight: 700; color: #0B1F3A; margin: 0.2rem 0; }
  .comp-card__body .mini { margin: 0.35rem 0 0; color: #4A6275; font-size: 0.8rem; }
  .comp-card__body .mini b { color: #0B1F3A; }
  .pink-ref {
    display: inline-block;
    margin-bottom: 0.35rem;
    font-size: 0.72rem;
    font-weight: 800;
    color: #0D546B;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    border-radius: 6px;
    padding: 0.2rem 0.45rem;
  }
  .thumb-row { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 0.75rem 0; }
  .thumb-row a, .thumb-row span {
    display: block;
    width: 88px;
    height: 88px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #D6E4EC;
    background: #EEF2F6;
  }
  .thumb-row img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .masters-strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
    margin: 0.75rem 0 0;
  }
  .masters-strip a {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    text-decoration: none;
    color: inherit;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 10px;
    padding: 0.55rem;
  }
  .masters-strip img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: contain;
    border-radius: 6px;
    background: #EEF2F6;
    display: block;
  }
  .masters-strip span {
    font-size: 0.75rem;
    font-weight: 700;
    color: #0B1F3A;
    text-align: center;
  }
  .job-box {
    background: #fff;
    border: 2px solid #077999;
    border-radius: 12px;
    padding: 1.1rem 1.2rem;
  }
  .job-box h2 { margin-top: 0; }
  .job-steps { counter-reset: step; list-style: none; margin: 0.75rem 0 0; padding: 0; }
  .job-steps li {
    counter-increment: step;
    position: relative;
    padding: 0.55rem 0.55rem 0.55rem 2.4rem;
    border-bottom: 1px solid #E8EEF2;
    font-size: 0.92rem;
  }
  .job-steps li::before {
    content: counter(step);
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 999px;
    background: #077999;
    color: #fff;
    font-weight: 800;
    font-size: 0.78rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .two-cols { display: grid; gap: 0.9rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .do-list li::marker { color: #077999; }
  .dont-list li::marker { color: #B42318; }
  @media (max-width: 700px) {
    .masters-strip { grid-template-columns: 1fr 1fr; }
  }
  .matrix { width: 100%; border-collapse: collapse; font-size: 0.8rem; margin-top: 0.5rem; }
  .matrix th, .matrix td { border: 1px solid #D6E4EC; padding: 0.45rem 0.5rem; text-align: center; background: #fff; }
  .matrix th { background: #F0F5F8; color: #4A6275; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.04em; }
  .matrix td.rowhead { text-align: left; font-weight: 700; color: #0B1F3A; }
  .storyboard {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    margin: 0.75rem 0;
  }
  .storyboard .beat {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-top: 3px solid #077999;
    border-radius: 8px;
    padding: 0.55rem 0.65rem;
    font-size: 0.8rem;
  }
  .storyboard .beat b { display: block; color: #0B1F3A; font-size: 0.78rem; }
  .storyboard .beat span { color: #4A6275; font-size: 0.72rem; }
  .tabs { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.85rem 0 0.5rem; }
  .tabs label, .tabs button {
    font: inherit;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    color: #0B1F3A;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 999px;
    padding: 0.35rem 0.85rem;
  }
  .tabs label:hover, .tabs button:hover, .tabs button.active, .tabs input:checked + label {
    background: #077999;
    color: #fff;
    border-color: #077999;
  }
  .tab-panels .tab-panel { display: none; }
  .tab-panels .tab-panel.active { display: block; }
  details.block {
    margin: 0.65rem 0;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 10px;
    padding: 0.65rem 0.9rem;
  }
  details.block > summary {
    cursor: pointer;
    font-weight: 700;
    color: #0B1F3A;
    list-style: none;
  }
  details.block > summary::-webkit-details-marker { display: none; }
  details.block[open] > summary { margin-bottom: 0.55rem; }
  .copytext {
    display: block;
    background: #F0F5F8;
    border: 1px solid #D6E4EC;
    border-radius: 8px;
    padding: 0.55rem 0.7rem;
    font-size: 0.82rem;
    color: #0B1F3A;
    white-space: pre-wrap;
    margin-top: 0.35rem;
  }
  .copy-btn {
    font: inherit;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    background: #077999;
    color: #fff;
    border: none;
    border-radius: 7px;
    padding: 0.28rem 0.6rem;
    margin-top: 0.4rem;
  }
  .copy-btn:hover { background: #0D546B; }
  .copy-btn.copied { background: #0F766E; }
  .swatch-row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.5rem 0; }
  .swatch-chip {
    font-size: 0.78rem;
    padding: 0.25rem 0.55rem;
    border-radius: 6px;
    background: #fff;
    border: 1px solid #D6E4EC;
  }
  .delivery-row {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    margin-top: 0.75rem;
  }
  .delivery-row select {
    font: inherit;
    font-size: 0.82rem;
    margin-top: 0.35rem;
    width: 100%;
    padding: 0.3rem 0.4rem;
    border: 1px solid #D6E4EC;
    border-radius: 6px;
    background: #fff;
    color: #0B1F3A;
  }
  .foot {
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid #D6E4EC;
    color: #64748B;
    font-size: 0.76rem;
  }
  .ideas-list { list-style: none; margin: 0; padding: 0; }
  .ideas-list li { margin: 0.45rem 0; }
  .ideas-list a { font-weight: 700; text-decoration: none; }
  .ideas-list span { display: block; color: #4A6275; font-size: 0.82rem; }
  @media (max-width: 640px) {
    main { padding: 1.1rem 0.85rem 3.5rem; }
    .masters-grid { grid-template-columns: 1fr 1fr; }
    .master-card--lg .master-card__media { min-height: 140px; }
  }
`;

const PAGE_SCRIPT = `
<script>
(function(){
  document.addEventListener('click', function(e){
    var btn = e.target.closest('.copy-btn');
    if(!btn) return;
    var text = btn.getAttribute('data-copy') || '';
    navigator.clipboard.writeText(text).then(function(){
      var old = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function(){ btn.textContent = old; btn.classList.remove('copied'); }, 1400);
    });
  });
  document.querySelectorAll('[data-tabs]').forEach(function(root){
    var buttons = root.querySelectorAll('[data-tab]');
    var panels = root.querySelectorAll('.tab-panel');
    function activate(id){
      buttons.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-tab') === id); });
      panels.forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-panel') === id); });
    }
    buttons.forEach(function(b){
      b.addEventListener('click', function(){ activate(b.getAttribute('data-tab')); });
    });
    var hash = (location.hash || '').replace(/^#/, '');
    if(hash && root.querySelector('[data-panel="'+hash+'"]')) activate(hash);
    else {
      var first = buttons[0];
      if(first) activate(first.getAttribute('data-tab'));
    }
    window.addEventListener('hashchange', function(){
      var h = (location.hash || '').replace(/^#/, '');
      if(h && root.querySelector('[data-panel="'+h+'"]')) activate(h);
    });
  });
  document.querySelectorAll('[data-persist]').forEach(function(el){
    var k = 'vma-'+el.getAttribute('data-persist');
    try {
      var saved = localStorage.getItem(k);
      if(saved !== null){
        if(el.type === 'checkbox') el.checked = saved === '1';
        else el.value = saved;
      }
    } catch(e){}
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function(){
      try {
        localStorage.setItem(k, el.type === 'checkbox' ? (el.checked ? '1' : '0') : el.value);
      } catch(e){}
    });
  });
})();
</script>`;

// ─── Shared helpers ──────────────────────────────────────────────────────────

function statusBadge(status) {
  const raw = String(status ?? '');
  const cls =
    's-' +
    raw
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  return `<span class="pill ${cls}">${esc(raw)}</span>`;
}

function copyBlock(text) {
  return `<span class="copytext">${esc(text)}</span><button type="button" class="copy-btn" data-copy="${esc(text)}">Copy</button>`;
}

function masterCard(master, { size = 'lg' } = {}) {
  const formats = presentFormatsSummary(master);
  return `<article class="master-card master-card--${esc(size)}">
  <div class="master-card__media">
    <img src="${esc(master.masterImage)}" alt="${esc(master.name)} approved master 1:1" width="1080" height="1080" loading="lazy" />
  </div>
  <div class="master-card__body">
    <div class="master-card__meta">VMA-${esc(master.number)} · ${esc(master.name)}</div>
    <h3>${esc(master.headline)}</h3>
    <p>${esc(master.colorFamily)}</p>
    <p>${esc(master.languageOrTrust)}</p>
    <p>Formats: ${esc(formats.availableLabel)}</p>
    <p>${statusBadge(master.status)}</p>
    <p>${esc(master.productionNote)}</p>
    <a class="dl" href="${esc(master.masterImage)}" download>Download 1:1 master</a>
  </div>
</article>`;
}

function mastersGrid(size = 'lg') {
  return `<div class="masters-grid">${APPROVED_MASTERS.map((m) => masterCard(m, { size })).join('')}</div>`;
}

function mastersStrip() {
  return `<div class="thumb-row masters-strip">${APPROVED_MASTERS.map(
    (m) =>
      `<a href="${esc(m.masterImage)}" title="VMA-${esc(m.number)} ${esc(m.name)}"><img src="${esc(m.masterImage)}" alt="${esc(m.name)}" loading="lazy" /><span>0${esc(m.number)} · ${esc(m.name)}</span></a>`,
  ).join('')}</div>`;
}

function formatRow(master) {
  const cards = master.formats
    .map((f) => {
      if (f.path && f.status === 'Approved') {
        return `<div class="format-card">
  <div class="format-card__preview" data-ratio="${esc(f.formatId)}">
    <img src="${esc(f.path)}" alt="${esc(master.name)} ${esc(f.label)}" loading="lazy" />
  </div>
  <div class="format-card__body">
    <b>${esc(f.label)} · ${esc(f.dims)}</b>
    <div>${statusBadge('Approved')}</div>
    <div style="margin-top:0.25rem;color:#4A6275;font-size:0.72rem">${esc(f.placement)}</div>
  </div>
</div>`;
      }
      return `<div class="format-card">
  <div class="format-card__preview" data-ratio="${esc(f.formatId)}">
    <div class="format-placeholder">
      <strong>AWAITING DESIGN</strong>
      ${esc(f.expectedFilename)}<br />${esc(f.dims)}
    </div>
  </div>
  <div class="format-card__body">
    <b>${esc(f.label)} · ${esc(f.dims)}</b>
    <div>${statusBadge('Awaiting Design')}</div>
    <div style="margin-top:0.25rem;color:#4A6275;font-size:0.72rem">${esc(f.layoutNote)}</div>
  </div>
</div>`;
    })
    .join('');
  return `<div class="format-row">${cards}</div>`;
}

function page({ activeId, title, pageTitle, pageSubtitle, body }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} · MedVirtual</title>
  <style>${HEADER_CSS}${PAGE_CSS}</style>
</head>
<body>
  ${renderDocHeader({ activeId, pageTitle, pageSubtitle })}
  <main>
    <div class="banner"><strong>${esc(VMA_META.banner)}</strong><span class="sub">${esc(VMA_META.bannerSub)}</span></div>
    ${body}
    <p class="foot">MedVirtual Ad Production · Virtual Medical Admin · Reviewed ${esc(VMA_META.reviewDateDisplay)} · No pink · Ad-facing brand: MedVirtual.</p>
  </main>
  ${PAGE_SCRIPT}
</body>
</html>`;
}

function renderRedirect(to) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0;url=${esc(to)}" />
  <link rel="canonical" href="${esc(to)}" />
  <title>Redirecting…</title>
</head>
<body>
  <p>Moved to <a href="${esc(to)}">${esc(to)}</a>.</p>
</body>
</html>`;
}

// ─── 1. Dashboard ────────────────────────────────────────────────────────────

function renderDashboard() {
  const body = `
    <div class="hero">
      <h1>Simple overview</h1>
      <p>The four Virtual Medical Admin square ads are already approved. They were created with ChatGPT and then polished. <b>Graphics team job now = change aspect ratios only.</b> Video is later.</p>
    </div>
    <div class="job-box">
      <h2>Start here</h2>
      <p><a class="dl" href="/vma-handoff.html">Open the Graphics Job page →</a></p>
      <p class="note" style="margin-top:0.6rem">That page has the 4 masters, the 4 sizes, build order, and Do / Don’t list.</p>
    </div>
    <section>
      <h2>The 4 approved masters</h2>
      ${mastersStrip()}
    </section>
    <section>
      <h2>Other pages (optional)</h2>
      <div class="quick-links">
        <a href="/vma-static.html">Size checklist</a>
        <a href="/direct-response.html">Rules (no pink)</a>
        <a href="/asset-hub.html">Logo &amp; assets</a>
        <a href="/vma-video.html">Video (later)</a>
      </div>
    </section>`;

  return page({
    activeId: 'studio',
    title: 'Overview',
    pageTitle: 'Overview',
    pageSubtitle: 'Resize job now · video later.',
    body,
  });
}

// ─── 2. Rules (was Approved Creative Direction) ──────────────────────────────

function renderDirection() {
  const grounding = COLOR_DIRECTION.grounding.map((g) => `<span class="swatch-chip">${esc(g)}</span>`).join('');
  const accents = COLOR_DIRECTION.accents.map((a) => `<span class="swatch-chip">${esc(a)}</span>`).join('');
  const forbidden = COLOR_DIRECTION.forbidden.map((f) => `<span class="swatch-chip">${esc(f)}</span>`).join('');
  const rules = [
    ...COLOR_DIRECTION.rules,
    'Keep MedVirtual as the brand name — never MedVirtual.ai.',
    'Keep $10 / Spanish / HIPAA exactly as shown on each approved master. Do not invent new claims.',
  ]
    .map((r) => `<li>${esc(r)}</li>`)
    .join('');

  const body = `
    <div class="hero">
      <h1>Rules for this job</h1>
      <p>Short checklist only. For the actual assignment, use the <a href="/vma-handoff.html">Graphics Job</a> page.</p>
    </div>
    <section>
      <h2>Approved masters (already done)</h2>
      ${mastersStrip()}
      <p class="note">Do not redesign from scratch. Match these.</p>
    </section>
    <section>
      <h2>Color</h2>
      <p class="lede">${esc(COLOR_DIRECTION.summary)}</p>
      <p style="margin:0.75rem 0 0.25rem;font-size:0.8rem;font-weight:700;color:#4A6275">OK grounding</p>
      <div class="swatch-row">${grounding}</div>
      <p style="margin:0.75rem 0 0.25rem;font-size:0.8rem;font-weight:700;color:#4A6275">OK accents</p>
      <div class="swatch-row">${accents}</div>
      <p style="margin:0.75rem 0 0.25rem;font-size:0.8rem;font-weight:700;color:#4A6275">Never</p>
      <div class="swatch-row">${forbidden}</div>
      <ul class="clean">${rules}</ul>
    </section>
    <section>
      <h2>Sizes needed</h2>
      <p><span class="chip">1080×1080</span><span class="chip">1080×1350</span><span class="chip">1080×1920</span><span class="chip">1200×628</span></p>
      <p class="note"><a href="/vma-handoff.html">Back to Graphics Job</a></p>
    </section>`;

  return page({
    activeId: 'vma-direction',
    title: 'Rules',
    pageTitle: 'Rules',
    pageSubtitle: 'No pink · MedVirtual only · keep master claims.',
    body,
  });
}

// ─── 3. Competitors ──────────────────────────────────────────────────────────

function competitorCard(ad, { featured = false } = {}) {
  const incomplete = !ad.image;
  const pink = PINK_REFERENCE_COMPETITOR_IDS.has(ad.id);
  const media = ad.image
    ? `<img src="${esc(ad.image)}" alt="${esc(ad.name)} ad reference" loading="lazy" />`
    : `<div class="format-placeholder"><strong>Image Needed</strong>${statusBadge('Image Needed')}</div>`;

  return `<article class="comp-card${incomplete ? ' incomplete' : ''}${featured ? ' featured' : ''}">
  <div class="comp-card__media">${media}</div>
  <div class="comp-card__body">
    ${pink ? `<span class="pink-ref">Reference only — do not use pink.</span>` : ''}
    <h3>${esc(ad.name)}</h3>
    <p class="why">${esc(ad.whyWatch)}</p>
    <p class="mini"><b>Offer</b> ${esc(ad.fingerprint?.hookStyle || '—')}</p>
    <p class="mini"><a href="${esc(adLibraryUrl(ad.adLibraryQuery))}" target="_blank" rel="noopener">Ad Library source</a></p>
    <p class="mini"><b>What works</b> ${esc(ad.steal)}</p>
    <p class="mini"><b>Learn</b> ${esc(ad.remix)}</p>
    <p class="mini"><b>Not to copy</b> ${esc(ad.reject)}</p>
  </div>
</article>`;
}

function renderCompetitors() {
  const byId = Object.fromEntries(COMPETITOR_ADS.map((a) => [a.id, a]));
  const featuredRaw = FEATURED_COMPETITOR_IDS.map((id) => byId[id]).filter(Boolean);
  const featured = [...featuredRaw]
    .sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)))
    .slice(0, 8);
  const featuredSet = new Set(featured.map((a) => a.id));
  const rest = COMPETITOR_ADS.filter((a) => !featuredSet.has(a.id));

  const body = `
    <div class="hero">
      <h1>Competitor references (optional)</h1>
      <p><b>Not required for the resize job.</b> Look only if you want hierarchy ideas. Do not copy layouts, colors, badges, or pink designs.</p>
    </div>
    <p class="note">External references only — steal structure ideas, invent original MedVirtual executions. Never pink.</p>
    <section>
      <h2>Most Relevant References</h2>
      <p class="note">Use these references for hierarchy, offer clarity, and mobile readability. Do not copy exact layouts, colors, badges, or typography.</p>
      <div class="comp-grid">${featured.map((a) => competitorCard(a, { featured: true })).join('')}</div>
    </section>
    <section>
      <h2>All references</h2>
      <div class="comp-grid">${rest.map((a) => competitorCard(a)).join('')}</div>
    </section>`;

  return page({
    activeId: 'competitors',
    title: 'Competitor Wall',
    pageTitle: 'Competitor Wall',
    pageSubtitle: 'Image-first external references.',
    body,
  });
}

// ─── 4. Static Ads ───────────────────────────────────────────────────────────

function renderStatic() {
  const masterBlocks = APPROVED_MASTERS.map(
    (m) => `<div style="margin-top:1.25rem">
  <h3>Concept ${esc(m.number)} · ${esc(m.name)}</h3>
  <p class="lede"><a href="${esc(m.masterImage)}" target="_blank" rel="noopener">Open approved master</a> · ${esc(m.colorFamily)}</p>
  ${formatRow(m)}
</div>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>Size checklist</h1>
      <p>This page only shows which sizes exist. <b>Yellow = still need to design.</b> Do not invent new concepts here.</p>
    </div>
    <div class="job-box">
      <p><b>Current job:</b> rebuild each approved master into 1080×1350, 1080×1920, and 1200×628 (then confirm 1080×1080).</p>
      <p class="note"><a href="/vma-handoff.html">Full Graphics Job instructions →</a></p>
    </div>
    <section>
      ${masterBlocks}
    </section>
    <details class="block">
      <summary>Ignore for now — old concept bank (not this request)</summary>
      <p class="note">These are future test ideas only. They are <b>not</b> the current graphics job.</p>
    </details>`;

  return page({
    activeId: 'vma-static',
    title: 'Size Checklist',
    pageTitle: 'Size Checklist',
    pageSubtitle: '4 masters × 4 Meta sizes.',
    body,
  });
}

// ─── 5. Video ────────────────────────────────────────────────────────────────

function renderVideo() {
  const outputs = APPROVED_MASTERS.map(
    (m) => `<div class="soft-card">
  <h3>VMA-${esc(m.number)} · ${esc(m.name)}</h3>
  <div class="thumb-row"><a href="${esc(m.masterImage)}"><img src="${esc(m.masterImage)}" alt="" loading="lazy" /></a></div>
  <ul class="clean">${VIDEO_OUTPUTS_PER_MASTER.map((o) => `<li><b>${esc(o.label)}</b> — ${esc(o.purpose)}</li>`).join('')}</ul>
</div>`,
  ).join('');

  const story = VIDEO_STORYBOARD.map(
    (s) => `<div class="beat"><b>${esc(s.scene)}</b><span>${esc(s.timing)}</span><div>${esc(s.note)}</div></div>`,
  ).join('');

  const sceneHint = (VIDEO_SCENES_15S?.structure || [])
    .map((x) => x.label)
    .filter(Boolean)
    .join(' → ');

  const remotionComps = REMOTION_COMPOSITIONS.map(
    (c) => `<div class="soft-card">
  <h3>${esc(c.name)}</h3>
  <p>${esc(c.duration)} · ${esc(c.frames)}f @ ${esc(c.fps)}fps</p>
  <p>${esc(c.purpose)}</p>
  <p>${(c.uses || []).map((u) => `<span class="chip">${esc(u)}</span>`).join('')}</p>
</div>`,
  ).join('');

  const remotionInputs = REMOTION_COMPONENTS.map(
    (c) => `<div class="soft-card"><h3>${esc(c.name)}</h3><p>${esc(c.purpose)}</p><p><span class="chip">${esc(c.props)}</span></p></div>`,
  ).join('');

  const playbook = (REMOTION_PLAYBOOK.steps || []).map((s) => `<li>${esc(s)}</li>`).join('');

  const capcut = CAPCUT_TEMPLATES.map(
    (t) => `<div class="soft-card">
  <h3>${esc(t.name)}</h3>
  <p>${esc(t.duration)} · ${(t.aspectRatios || []).join(', ')}</p>
  <p>${esc(t.exportSpec)}</p>
  <p>${esc(t.colorNote)}</p>
</div>`,
  ).join('');

  const prompts = VIDEO_PROMPTS.map(
    (p) => `<div class="soft-card">
  <h3>${esc(p.id)} · ${esc(p.title)}</h3>
  <p>${esc(p.duration)} · ${esc(p.colorFamily)}</p>
  ${copyBlock(p.prompt)}
</div>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>Video — later</h1>
      <p><b>Not part of the current graphics request.</b> Finish the 16 static PNGs first. Come back here when we animate the approved masters.</p>
    </div>
    <div class="job-box">
      <p>Current job = static sizes only → <a href="/vma-handoff.html">Graphics Job</a></p>
    </div>
    <section>
      <h2>When video starts, use these masters</h2>
      ${mastersStrip()}
    </section>
    <section>
      <h2>Planned outputs per master (future)</h2>
      <div class="queue-grid">${outputs}</div>
    </section>
    <section>
      <h2>Storyboard (15s)</h2>
      <div class="storyboard">${story}</div>
      ${sceneHint ? `<p class="lede">Reference beat string: ${esc(sceneHint)}</p>` : ''}
    </section>
    <section data-tabs>
      <h2>Production Paths</h2>
      <div class="tabs">
        <button type="button" class="active" data-tab="overview">Overview</button>
        <button type="button" data-tab="remotion">Remotion</button>
        <button type="button" data-tab="capcut">CapCut</button>
        <button type="button" data-tab="prompts">Prompt Pack</button>
      </div>
      <div class="tab-panels">
        <div class="tab-panel active" data-panel="overview" id="overview">
          <p class="lede">Animate the approved hierarchy: hook → role clarity → benefits → offer/CTA. Prefer 6s / 10s / 15s from each master after static QA.</p>
          <ul class="clean">${(REMOTION_PLAYBOOK.rules || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
        </div>
        <div class="tab-panel" data-panel="remotion" id="remotion">
          <p class="lede">${esc(REMOTION_PLAYBOOK.studioCmd)} · ${esc(REMOTION_PLAYBOOK.entryFile)}</p>
          <ul class="clean">${playbook}</ul>
          <h3 style="margin-top:1rem">Compositions</h3>
          <div class="queue-grid">${remotionComps}</div>
          <details class="block"><summary>Component inputs</summary>
            <div class="queue-grid">${remotionInputs}</div>
          </details>
        </div>
        <div class="tab-panel" data-panel="capcut" id="capcut">
          <div class="queue-grid">${capcut}</div>
        </div>
        <div class="tab-panel" data-panel="prompts" id="prompts">
          <div class="prompt-grid">${prompts}</div>
        </div>
      </div>
    </section>`;

  return page({
    activeId: 'vma-video',
    title: 'Animated Video',
    pageTitle: 'Animated Video',
    pageSubtitle: 'Motion from the four approved masters.',
    body,
  });
}

// ─── 6. Prompts & Copy ───────────────────────────────────────────────────────

function renderCopyPack(packs, langLabel) {
  return packs
    .map((pack) => {
      const sections = [
        ['Primary texts', pack.primaryTexts],
        ['Headlines', pack.headlines],
        ['Descriptions', pack.descriptions],
        ['CTAs', pack.ctas],
      ]
        .filter(([, lines]) => Array.isArray(lines) && lines.length)
        .map(
          ([title, lines]) => `<details class="block"><summary>${esc(title)} (${lines.length})</summary>
  ${lines.map((line) => `<div style="margin:0.45rem 0">${copyBlock(line)}</div>`).join('')}
</details>`,
        )
        .join('');
      return `<div class="soft-card" style="grid-column:1/-1">
  <h3>${esc(pack.name)} · ${esc(langLabel)}</h3>
  <p>Matching form: ${esc(pack.matchingForm || '—')}</p>
  ${sections}
</div>`;
    })
    .join('');
}

function renderChatgpt() {
  const workflowSteps = [
    { step: 1, title: 'Upload master', instruction: 'Upload one approved 1:1 master as the baseline.' },
    { step: 2, title: 'Analyze', instruction: 'Describe hierarchy and colors — do not invent claims.' },
    { step: 3, title: 'Variation (only if asked)', instruction: 'Keep clarity; never pink; never copy competitors.' },
    { step: 4, title: 'Confirm copy', instruction: 'Use approved EN/ES lines before any new design.' },
    { step: 5, title: 'Brief designer', instruction: 'Hand off master + ratios. Rebuild for each canvas.' },
    { step: 6, title: 'QA', instruction: 'Spelling, MedVirtual brand, dimensions.' },
  ];

  const workflow = workflowSteps
    .map(
      (s) => `<div class="soft-card"><div class="master-card__meta">Step ${s.step}</div><h3>${esc(s.title)}</h3><p>${esc(s.instruction)}</p></div>`,
    )
    .join('');

  const imagePrompts = CHATGPT_PROMPTS.map(
    (p) => `<div class="soft-card">
  <h3>${esc(p.id)} · ${esc(p.title)}</h3>
  <p>${esc(p.conceptNumber)} · ${esc(p.colorFamily)}</p>
  ${copyBlock(p.prompt)}
</div>`,
  ).join('');

  const videoPrompts = VIDEO_PROMPTS.map(
    (p) => `<div class="soft-card">
  <h3>${esc(p.id)} · ${esc(p.title)}</h3>
  <p>${esc(p.duration)}</p>
  ${copyBlock(p.prompt)}
</div>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>ChatGPT notes</h1>
      <p><b>You do not need to remake the ads in ChatGPT for this request.</b> The four square masters are already approved. This page is background for how they were created, plus copy banks for later.</p>
    </div>
    <div class="job-box">
      <p>Current job = resize the approved masters → <a href="/vma-handoff.html">Graphics Job</a></p>
    </div>
    <details class="block">
      <summary>Reference only — prompts &amp; copy banks</summary>
    <section>
      <h2>If leadership asks for a new ChatGPT plate later</h2>
      <div class="queue-grid">${workflow}</div>
    </section>
    <section data-tabs>
      <div class="tabs">
        <button type="button" class="active" data-tab="images">Image prompts</button>
        <button type="button" data-tab="video">Video prompts</button>
        <button type="button" data-tab="english">English copy</button>
        <button type="button" data-tab="spanish">Spanish copy</button>
        <button type="button" data-tab="builder">Copy builder</button>
      </div>
      <div class="tab-panels">
        <div class="tab-panel active" data-panel="images" id="images">
          <div class="prompt-grid">${imagePrompts}</div>
        </div>
        <div class="tab-panel" data-panel="video" id="video">
          <div class="prompt-grid">${videoPrompts}</div>
        </div>
        <div class="tab-panel" data-panel="english" id="english">
          <div class="copy-grid">${renderCopyPack(COPY_EN, 'EN')}</div>
        </div>
        <div class="tab-panel" data-panel="spanish" id="spanish">
          <div class="copy-grid">${renderCopyPack(COPY_ES, 'ES')}</div>
        </div>
        <div class="tab-panel" data-panel="builder" id="builder">
          <div class="soft-card">
            <h3>Simple Copy Builder</h3>
            <p>Pick one primary text, one headline, and one description. Pair with Learn More. Keep claims already on the approved masters.</p>
          </div>
        </div>
      </div>
    </section>
    </details>`;

  return page({
    activeId: 'vma-chatgpt',
    title: 'ChatGPT Notes',
    pageTitle: 'ChatGPT Notes',
    pageSubtitle: 'Background only — not the current resize job.',
    body,
  });
}

// ─── 7. Production Handoff ───────────────────────────────────────────────────

function claimStatusSimple(status) {
  const s = String(status || '').toLowerCase();
  if (s.includes('reject') || s.includes('do not')) return 'Rejected';
  if (s.includes('approved') || s.includes('confirmed')) return 'Approved';
  return 'Pending';
}

function renderHandoff() {
  const byNumber = Object.fromEntries(APPROVED_MASTERS.map((m) => [m.number, m]));
  const ordered = GRAPHICS_BUILD_ORDER.map((n) => byNumber[n]).filter(Boolean);

  const masterLinks = ordered
    .map(
      (m, i) => `<div class="soft-card">
  <div class="master-card__meta">Build order ${i + 1}</div>
  <h3>Concept ${esc(m.number)} — ${esc(m.name)}</h3>
  <p>${esc(m.languageOrTrust)}</p>
  <a class="dl" href="${esc(m.masterImage)}" target="_blank" rel="noopener">Open approved master PNG</a>
  <p style="margin-top:0.45rem;font-size:0.72rem;color:#4A6275;word-break:break-all">${esc(m.masterImage)}</p>
</div>`,
    )
    .join('');

  const buildSteps = ordered
    .map(
      (m, i) =>
        `<li><b>Concept ${esc(m.number)} — ${esc(m.name)}</b><br />First make 1080×1350, then 1080×1920, then 1200×628, then confirm/rebuild 1080×1080.</li>`,
    )
    .join('');

  const sizeChips = FORMAT_SPECS.map((f) => `<span class="chip">${esc(f.dims)} (${esc(f.label)})</span>`).join('');

  const matrix = formatMatrixCells();
  const matrixHead = FORMAT_SPECS.map((f) => `<th>${esc(f.label)}<br /><span style="font-weight:500;text-transform:none;letter-spacing:0">${esc(f.dims)}</span></th>`).join('');
  const matrixRows = matrix
    .map((row) => {
      const cells = row.cells.map((c) => `<td>${statusBadge(c.displayStatus)}</td>`).join('');
      return `<tr><td class="rowhead">Concept ${esc(row.master.number)}<br />${esc(row.master.name)}</td>${cells}</tr>`;
    })
    .join('');

  const dashClaims = DASHBOARD_CLAIMS.map((c) => {
    const full = CLAIMS.find((x) => x.id === c.id);
    const simple = claimStatusSimple(c.status);
    return `<div class="soft-card">
  <h3>${esc(c.label)}</h3>
  <p>${statusBadge(simple)}</p>
  ${full ? `<p style="font-size:0.78rem;color:#4A6275">${esc(full.notes || full.status)}</p>` : ''}
</div>`;
  }).join('');

  const qa = HANDOFF_QA.map(
    (item, i) =>
      `<li><input type="checkbox" data-persist="handoff-qa-${i}" /> <span>${esc(item)}</span></li>`,
  ).join('');

  const delivery = APPROVED_MASTERS.map((m) => {
    const chips = m.formats.map((f) => `<span class="chip">${esc(f.label)}: ${esc(f.status)}</span>`).join('');
    return `<div class="soft-card">
  <h3>Concept ${esc(m.number)} · ${esc(m.name)}</h3>
  <div>${chips}</div>
  <label>Status
    <select data-persist="delivery-${m.id}">
      <option>Needs Review</option>
      <option>Approved</option>
      <option>Needs Revision</option>
    </select>
  </label>
</div>`;
  }).join('');

  const dos = GRAPHICS_DO.map((d) => `<li>${esc(d)}</li>`).join('');
  const donts = GRAPHICS_DONT.map((d) => `<li>${esc(d)}</li>`).join('');

  const form = CURRENT_META_FORM;
  const formFields = (form.requiredFields || []).map((f) => `<span class="chip">${esc(f)}</span>`).join('');
  const answers = (form.routingAnswers || []).map((a) => `<li>${esc(a)}</li>`).join('');

  const body = `
    <div class="hero">
      <h1>Graphics Job — resize 4 masters</h1>
      <p>The square ads are already approved (made with ChatGPT + polish). <b>Your job is aspect ratios only.</b> Do not redesign. Video is later — not this request.</p>
    </div>

    <section id="job">
      <div class="job-box">
        <h2>Deliver 16 PNGs + editable source files</h2>
        <p>Sizes for every concept:</p>
        <div style="margin:0.6rem 0">${sizeChips}</div>
        <p><b>How to work</b></p>
        <ol class="job-steps">${buildSteps}</ol>
        <p class="note" style="margin-top:0.85rem">Rebuild the layout for each size. Do not only crop or stretch the square.</p>
      </div>
    </section>

    <section id="masters">
      <h2>1. Download these 4 approved masters</h2>
      <div class="queue-grid">${masterLinks}</div>
    </section>

    <section>
      <h2>2. Do / Don’t</h2>
      <div class="two-cols">
        <div class="soft-card"><h3>Do</h3><ul class="clean do-list">${dos}</ul></div>
        <div class="soft-card"><h3>Don’t</h3><ul class="clean dont-list">${donts}</ul></div>
      </div>
    </section>

    <section id="matrix">
      <h2>3. Progress board</h2>
      <p class="lede">Yellow = still needed. Green = approved square already done.</p>
      <table class="matrix">
        <thead><tr><th>Concept</th>${matrixHead}</tr></thead>
        <tbody>${matrixRows}</tbody>
      </table>
      <p class="note"><a href="/vma-static.html">Open size checklist page</a></p>
    </section>

    <section>
      <h2>4. Logo</h2>
      <div class="soft-card">
        <p><a href="/assets/brand/medvirtual/logo-colored.svg" target="_blank" rel="noopener">MedVirtual logo (SVG)</a></p>
        <p><a href="/asset-hub.html">More brand assets</a></p>
        <p class="note">Brand spelling: <b>MedVirtual</b> only — never MedVirtual.ai</p>
      </div>
    </section>

    <section id="claims">
      <h2>5. Claims already on the masters</h2>
      <p class="lede"><b>Keep them as shown on each PNG.</b> For this resize job you are not deciding legal approval — just match the approved masters.</p>
      <div class="claim-grid">${dashClaims}</div>
    </section>

    <section id="qa">
      <h2>6. Quick check before upload</h2>
      <ul class="checklist">${qa}</ul>
    </section>

    <section id="approval">
      <h2>7. Delivery status</h2>
      <p class="note">Detailed tracking stays in the team spreadsheet.</p>
      <div class="delivery-row">${delivery}</div>
    </section>

    <details class="block" id="form">
      <summary>Not for graphics — current Meta form (ops only)</summary>
      <div class="soft-card">
        <h3>${esc(form.name)}</h3>
        <p><b>Intro:</b> ${esc(form.introHeadline)} — ${esc(form.introDescription)}</p>
        <p><b>Routing:</b> ${esc(form.routingQuestion)}</p>
        <ul class="clean">${answers}</ul>
        <p style="margin-top:0.5rem">${formFields}</p>
        <p>${esc(form.privacyMessage)}</p>
        <p><b>End:</b> ${esc(form.endHeadline)} — ${esc(form.endDescription)}</p>
        <p><a href="${esc(form.demoLink)}" target="_blank" rel="noopener">${esc(form.demoCta)}</a></p>
      </div>
    </details>`;

  return page({
    activeId: 'vma-handoff',
    title: 'Graphics Job',
    pageTitle: 'Graphics Job',
    pageSubtitle: 'Resize 4 approved masters into 16 Meta PNGs.',
    body,
  });
}

// ─── 8. History ──────────────────────────────────────────────────────────────

function renderHistory() {
  const notes = HISTORY_NOTES.map(
    (n) => `<div class="soft-card">
  <div class="master-card__meta">${esc(n.date)}</div>
  <h3>${esc(n.title)}</h3>
  <p>${esc(n.change)}</p>
</div>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>History</h1>
      <p>Minimal direction notes only.</p>
    </div>
    <section>
      <div class="queue-grid">${notes}</div>
    </section>`;

  return page({
    activeId: 'vma-history',
    title: 'History',
    pageTitle: 'History',
    pageSubtitle: 'Direction changes.',
    body,
  });
}

// ─── ideas.html ──────────────────────────────────────────────────────────────

function renderIdeas() {
  const links = VMA_NAV.map(
    (n) => `<li><a href="${esc(n.href)}">${esc(n.label)}</a><span>${esc(n.description)}</span></li>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>Site Map</h1>
      <p>Primary boards for the Virtual Medical Admin creative handoff.</p>
    </div>
    <ul class="ideas-list">${links}</ul>`;

  return page({
    activeId: '',
    title: 'Ideas / Site Map',
    pageTitle: 'Site Map',
    pageSubtitle: 'Quick links to every board.',
    body,
  });
}

// ─── Redirects ───────────────────────────────────────────────────────────────

const REDIRECTS = [
  // Consolidated VMA pages → handoff / video / prompts
  { from: 'vma-remotion.html', to: '/vma-video.html#remotion' },
  { from: 'vma-capcut.html', to: '/vma-video.html#capcut' },
  { from: 'vma-copy-en.html', to: '/vma-chatgpt.html#english' },
  { from: 'vma-copy-es.html', to: '/vma-chatgpt.html#spanish' },
  { from: 'vma-form.html', to: '/vma-handoff.html#form' },
  { from: 'vma-campaign.html', to: '/vma-handoff.html' },
  { from: 'vma-claims.html', to: '/vma-handoff.html#claims' },
  { from: 'vma-qa.html', to: '/vma-handoff.html#qa' },
  { from: 'vma-queue.html', to: '/vma-handoff.html#matrix' },
  { from: 'vma-approval.html', to: '/vma-handoff.html#approval' },
  // Legacy dr-* → consolidated VMA pages
  { from: 'dr-concepts-en.html', to: '/vma-static.html' },
  { from: 'dr-concepts-es.html', to: '/vma-chatgpt.html#spanish' },
  { from: 'dr-concepts-roles.html', to: '/vma-static.html' },
  { from: 'dr-image-prompts.html', to: '/vma-chatgpt.html#images' },
  { from: 'dr-form.html', to: '/vma-handoff.html#form' },
  { from: 'dr-offers.html', to: '/vma-handoff.html#form' },
  { from: 'dr-claims.html', to: '/vma-handoff.html#claims' },
  { from: 'dr-production-queue.html', to: '/vma-handoff.html#matrix' },
  { from: 'dr-qa-checklist.html', to: '/vma-handoff.html#qa' },
  { from: 'dr-campaign-plan.html', to: '/vma-handoff.html' },
  { from: 'dr-copy-matrix.html', to: '/vma-chatgpt.html#english' },
  { from: 'dr-copy-en.html', to: '/vma-chatgpt.html#english' },
  { from: 'dr-copy-es.html', to: '/vma-chatgpt.html#spanish' },
  { from: 'dr-approval.html', to: '/vma-handoff.html#approval' },
  { from: 'dr-superseded.html', to: '/vma-history.html' },
  { from: 'dr-reference-analysis.html', to: '/competitors.html' },
  { from: 'dr-design-system.html', to: '/direct-response.html' },
  { from: 'dr-color-board.html', to: '/direct-response.html' },
];

// ─── Write all pages ─────────────────────────────────────────────────────────

const primary = [
  ['studio.html', renderDashboard()],
  ['direct-response.html', renderDirection()],
  ['competitors.html', renderCompetitors()],
  ['vma-static.html', renderStatic()],
  ['vma-video.html', renderVideo()],
  ['vma-chatgpt.html', renderChatgpt()],
  ['vma-handoff.html', renderHandoff()],
  ['vma-history.html', renderHistory()],
  ['ideas.html', renderIdeas()],
];

for (const [name, html] of primary) write(name, html);
for (const r of REDIRECTS) write(r.from, renderRedirect(r.to));

console.log(
  `VMA handoff site generated · ${primary.length} primary pages + ${REDIRECTS.length} redirects · ${filesWritten} files total.`,
);
