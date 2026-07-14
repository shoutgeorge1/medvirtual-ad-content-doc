/**
 * Generate editable Role-Offer template board (team-favorite checklist layouts).
 * npm run generate:role-offer
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import {
  ROLE_OFFER_TEMPLATES,
  ROLE_OFFER_META,
  ROLE_OFFER_ICON,
} from './role-offer-templates-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'role-offer-templates.html');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function iconSvg(style) {
  return ROLE_OFFER_ICON[style] || ROLE_OFFER_ICON.checkCircle;
}

function headlineHtml(t) {
  const h = t.headline || '';
  const accent = t.headlineAccent;
  if (!accent || !h.includes(accent)) return esc(h);
  const i = h.indexOf(accent);
  return `${esc(h.slice(0, i))}<span class="accent" data-field="headlineAccent">${esc(accent)}</span>${esc(h.slice(i + accent.length))}`;
}

function bulletsHtml(t) {
  return (t.bullets || [])
    .map(
      (b, i) =>
        `<li><span class="ico" data-icon>${iconSvg(t.iconStyle)}</span><span class="btxt" data-bullet="${i}" contenteditable="true">${esc(b)}</span></li>`,
    )
    .join('');
}

function photosHtml(t) {
  return (t.photos || [])
    .map(
      (src, i) =>
        `<div class="photo photo-${i}" data-photo-slot="${i}"><img src="${esc(src)}" alt="" /></div>`,
    )
    .join('');
}

function priceBlock(t) {
  const style = t.priceStyle || 'circle';
  return `
    <div class="price price-${style}" data-price>
      <span class="plabel" data-field="priceLabel" contenteditable="true">${esc(t.priceLabel)}</span>
      <span class="pamount" data-field="priceAmount" contenteditable="true">${esc(t.priceAmount)}</span>
      <span class="punit" data-field="priceUnit" contenteditable="true">${esc(t.priceUnit)}</span>
    </div>`;
}

function ctaHtml(t) {
  if (!t.cta) return '';
  const icon =
    t.ctaIcon === 'calendar'
      ? `<span class="cta-ico" data-cta-icon="calendar"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="2"/></svg></span>`
      : t.ctaIcon === 'arrow'
        ? `<span class="cta-ico" data-cta-icon="arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="var(--mv-cyan)"/><path d="M10 8l4 4-4 4" fill="none" stroke="var(--mv-deep)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`
        : '';
  return `<button type="button" class="cta" data-cta><span class="cta-txt" data-field="cta" contenteditable="true">${esc(t.cta)}</span>${icon}</button>`;
}

function roleHireHtml(t) {
  return `
    <div class="hire-row">
      <span class="hire" data-field="hirePrefix" contenteditable="true">${esc(t.hirePrefix)}</span>
      <span class="role-pill" data-field="role" contenteditable="true">${esc(t.role)}</span>
    </div>`;
}

function audienceHtml(t) {
  if (!t.audiencePill) return '';
  return `<span class="aud-pill" data-field="audiencePill" contenteditable="true">${esc(t.audiencePill)}</span>`;
}

function renderAd(t) {
  const layout = t.layout;
  const logo = `<div class="logo-wrap"><img src="${esc(ROLE_OFFER_META.logo)}" alt="MedVirtual" /></div>`;

  if (layout === 'ROLE_CENTER_CHECKLIST_COLLAGE') {
    return `
      <article class="ad ad-center" data-id="${esc(t.id)}" data-layout="${esc(layout)}" data-icon-style="${esc(t.iconStyle)}">
        ${logo}
        ${roleHireHtml(t)}
        <h2 class="headline center" data-field="headline" contenteditable="true">${headlineHtml(t)}</h2>
        <div class="mid-row">
          <ul class="bullets">${bulletsHtml(t)}</ul>
          ${priceBlock(t)}
        </div>
        <div class="collage">${photosHtml(t)}</div>
      </article>`;
  }

  if (layout === 'ROLE_SPLIT_PHOTO_LEFT') {
    return `
      <article class="ad ad-split-left" data-id="${esc(t.id)}" data-layout="${esc(layout)}" data-icon-style="${esc(t.iconStyle)}">
        <div class="col-photo">${photosHtml(t)}</div>
        <div class="col-copy">
          <div class="top-row">${logo}${roleHireHtml(t)}</div>
          <h2 class="headline" data-field="headline" contenteditable="true">${headlineHtml(t)}</h2>
          <div class="rule"></div>
          <ul class="bullets">${bulletsHtml(t)}</ul>
          ${priceBlock(t)}
        </div>
      </article>`;
  }

  if (layout === 'ROLE_SPLIT_COPY_LEFT') {
    return `
      <article class="ad ad-split-copy" data-id="${esc(t.id)}" data-layout="${esc(layout)}" data-icon-style="${esc(t.iconStyle)}">
        <div class="top-bar">${logo}${audienceHtml(t)}</div>
        <div class="body">
          <div class="col-copy">
            ${roleHireHtml(t)}
            <h2 class="headline" data-field="headline" contenteditable="true">${headlineHtml(t)}</h2>
            <div class="rule"></div>
            <ul class="bullets">${bulletsHtml(t)}</ul>
            ${ctaHtml(t)}
          </div>
          <div class="col-photo">
            ${photosHtml(t)}
            ${priceBlock(t)}
          </div>
        </div>
      </article>`;
  }

  if (layout === 'ROLE_SPLIT_COPY_PRICE_LEFT') {
    return `
      <article class="ad ad-nurse" data-id="${esc(t.id)}" data-layout="${esc(layout)}" data-icon-style="${esc(t.iconStyle)}">
        <div class="top-bar">${logo}${audienceHtml(t)}</div>
        <div class="body">
          <div class="col-copy">
            ${roleHireHtml(t)}
            <h2 class="headline" data-field="headline" contenteditable="true">${headlineHtml(t)}</h2>
            <ul class="bullets">${bulletsHtml(t)}</ul>
            ${priceBlock(t)}
          </div>
          <div class="col-photo">
            ${photosHtml(t)}
            ${ctaHtml(t)}
          </div>
        </div>
      </article>`;
  }

  // ROLE_PILL_CHECKLIST_SPLIT
  return `
    <article class="ad ad-burnout" data-id="${esc(t.id)}" data-layout="${esc(layout)}" data-icon-style="${esc(t.iconStyle)}">
      <div class="top-bar">${audienceHtml(t)}${logo}</div>
      <div class="body">
        <div class="col-copy">
          <h2 class="headline" data-field="headline" contenteditable="true">${headlineHtml(t)}</h2>
          <div class="rule cyan"></div>
          ${roleHireHtml(t)}
          <ul class="bullets">${bulletsHtml(t)}</ul>
          ${ctaHtml(t)}
        </div>
        <div class="col-photo">
          ${photosHtml(t)}
          ${priceBlock(t)}
        </div>
      </div>
    </article>`;
}

function editorPanel(t) {
  const bulletLines = (t.bullets || []).join('\n');
  const photoLines = (t.photos || []).join('\n');
  return `
    <aside class="editor" data-editor-for="${esc(t.id)}">
      <h3>${esc(t.label)}</h3>
      <p class="note">${esc(t.notes)}</p>
      <label>Audience pill <input data-bind="audiencePill" value="${esc(t.audiencePill)}" placeholder="e.g. DOCTORS!" /></label>
      <label>Hire prefix <input data-bind="hirePrefix" value="${esc(t.hirePrefix)}" /></label>
      <label>Role pill <input data-bind="role" value="${esc(t.role)}" /></label>
      <label>Headline <textarea data-bind="headline" rows="3">${esc(t.headline)}</textarea></label>
      <label>Headline accent (optional) <input data-bind="headlineAccent" value="${esc(t.headlineAccent || '')}" /></label>
      <label>Bullets (one per line) <textarea data-bind="bullets" rows="6">${esc(bulletLines)}</textarea></label>
      <label>Icon style
        <select data-bind="iconStyle">
          <option value="checkCircle"${t.iconStyle === 'checkCircle' ? ' selected' : ''}>Check circles</option>
          <option value="bulletDot"${t.iconStyle === 'bulletDot' ? ' selected' : ''}>Simple dots</option>
        </select>
      </label>
      <label>Price label <input data-bind="priceLabel" value="${esc(t.priceLabel)}" /></label>
      <label>Price amount <input data-bind="priceAmount" value="${esc(t.priceAmount)}" /></label>
      <label>Price unit <input data-bind="priceUnit" value="${esc(t.priceUnit)}" /></label>
      <label>Price style
        <select data-bind="priceStyle">
          ${['circle', 'box', 'bar', 'overlay']
            .map(
              (s) =>
                `<option value="${s}"${t.priceStyle === s ? ' selected' : ''}>${s}</option>`,
            )
            .join('')}
        </select>
      </label>
      <label>CTA <input data-bind="cta" value="${esc(t.cta)}" /></label>
      <label>CTA icon
        <select data-bind="ctaIcon">
          ${['none', 'arrow', 'calendar']
            .map(
              (s) =>
                `<option value="${s}"${t.ctaIcon === s ? ' selected' : ''}>${s}</option>`,
            )
            .join('')}
        </select>
      </label>
      <label>Photo URLs (one per line) <textarea data-bind="photos" rows="3">${esc(photoLines)}</textarea></label>
      <label>Upload photo(s)
        <input type="file" accept="image/*" multiple data-upload />
      </label>
      <button type="button" class="copy-json" data-copy>Copy JSON for this ad</button>
    </aside>`;
}

const CSS = `
${HEADER_CSS}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: var(--mv-font);
  background: #0b1220;
  color: #e2e8f0;
}
.intro {
  padding: 1.25rem 2rem 0.5rem;
  border-bottom: 1px solid #1f2937;
  background: #111827;
}
.intro h1 { font-size: 1.35rem; color: #f8fafc; margin: 0 0 0.35rem; }
.intro p { margin: 0; font-size: 0.88rem; color: #94a3b8; max-width: 70ch; }
.intro .tips { margin-top: 0.65rem; font-size: 0.8rem; color: #67e8f9; }
.stack { display: flex; flex-direction: column; gap: 2.5rem; padding: 1.5rem 2rem 3rem; }
.row {
  display: grid;
  grid-template-columns: minmax(320px, 540px) minmax(280px, 1fr);
  gap: 1.25rem;
  align-items: start;
}
@media (max-width: 960px) {
  .row { grid-template-columns: 1fr; }
}
.ad-frame {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 14px;
  padding: 0.75rem;
}
.ad-frame .label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}
.ad-frame .layout-id { color: #67e8f9; font-family: ui-monospace, monospace; }

/* ——— Ad canvas (1:1) ——— */
.ad {
  --mv-deep: #0D546B;
  --mv-primary: #077999;
  --mv-cyan: #00B2E2;
  --ink: #0D546B;
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  background:
    linear-gradient(180deg, #f7fbff 0%, #eef6fb 55%, #e8f3f9 100%);
  color: var(--ink);
  font-family: var(--mv-font);
}
.ad::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 178, 226, 0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 178, 226, 0.09) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
  z-index: 0;
}
.ad > * { position: relative; z-index: 1; }
.logo-wrap img { height: 1.55rem; width: auto; display: block; }
.hire { color: var(--mv-cyan); font-weight: 600; font-size: 0.95rem; }
.role-pill, .aud-pill {
  display: inline-flex;
  align-items: center;
  background: var(--mv-deep);
  color: #fff;
  font-weight: 700;
  border-radius: 999px;
  padding: 0.28rem 0.85rem;
  font-size: 0.82rem;
  letter-spacing: 0.02em;
}
.aud-pill { text-transform: uppercase; font-size: 0.75rem; }
.hire-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.45rem; }
.headline {
  font-weight: 800;
  font-size: clamp(1.05rem, 3.2vw, 1.45rem);
  line-height: 1.2;
  color: var(--mv-deep);
  margin: 0.55rem 0;
  outline: none;
}
.headline.center { text-align: center; }
.headline .accent { color: var(--mv-cyan); }
.rule {
  width: 3rem;
  height: 3px;
  background: var(--mv-deep);
  border-radius: 2px;
  margin: 0.35rem 0 0.7rem;
}
.rule.cyan { background: var(--mv-cyan); width: 4rem; }
.bullets {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.bullets li {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  font-size: 0.82rem;
  color: var(--mv-deep);
  font-weight: 500;
}
.bullets .ico {
  flex: 0 0 1.05rem;
  width: 1.05rem;
  height: 1.05rem;
  color: var(--mv-cyan);
  margin-top: 0.1rem;
}
.bullets .ico svg { width: 100%; height: 100%; display: block; }
.ad[data-icon-style="bulletDot"] .bullets .ico { color: var(--mv-deep); }
.btxt, [contenteditable="true"] { outline: none; border-radius: 3px; }
[contenteditable="true"]:focus {
  box-shadow: 0 0 0 2px rgba(0, 178, 226, 0.45);
  background: rgba(255,255,255,0.55);
}

.price {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.1rem;
}
.price .plabel { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
.price .pamount { font-size: 1.65rem; font-weight: 800; line-height: 1; }
.price .punit { font-size: 0.7rem; font-weight: 600; }
.price-circle {
  width: 6.2rem;
  height: 6.2rem;
  border-radius: 50%;
  background: linear-gradient(160deg, var(--mv-deep), var(--mv-primary));
  color: #fff;
  box-shadow: 0 8px 20px rgba(13, 84, 107, 0.28);
  transform: rotate(-6deg);
}
.price-box {
  border: 2px solid var(--mv-cyan);
  border-radius: 12px;
  padding: 0.55rem 0.9rem;
  background: #fff;
  color: var(--mv-deep);
  align-self: flex-end;
}
.price-box .pamount { color: var(--mv-cyan); font-size: 1.8rem; }
.price-bar {
  align-self: flex-start;
  background: linear-gradient(90deg, var(--mv-primary), var(--mv-cyan));
  color: #fff;
  border-radius: 12px;
  padding: 0.55rem 1rem;
  box-shadow: 0 6px 16px rgba(7, 121, 153, 0.28);
  flex-direction: row;
  gap: 0.45rem;
  align-items: baseline;
}
.price-bar .plabel { color: rgba(255,255,255,0.9); }
.price-bar .pamount { font-size: 1.4rem; }
.price-overlay {
  position: absolute;
  left: 8%;
  bottom: 8%;
  background: rgba(240, 248, 255, 0.92);
  border-radius: 12px;
  padding: 0.55rem 0.9rem;
  color: var(--mv-deep);
  box-shadow: 0 6px 18px rgba(13, 84, 107, 0.18);
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: var(--mv-deep);
  color: #fff;
  border: 0;
  border-radius: 12px;
  padding: 0.7rem 1rem;
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  cursor: default;
  margin-top: 0.85rem;
}
.cta-ico { width: 1.5rem; height: 1.5rem; display: inline-flex; }
.cta-ico svg { width: 100%; height: 100%; }

.photo { overflow: hidden; }
.photo img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Layout-specific */
.ad-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.1rem 1.15rem 0.9rem;
}
.ad-center .logo-wrap { margin-bottom: 0.35rem; }
.ad-center .hire-row { justify-content: center; margin-bottom: 0.35rem; }
.ad-center .mid-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  width: 100%;
  align-items: center;
  flex: 1;
  padding: 0 0.25rem;
}
.ad-center .collage {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.55rem;
  width: 100%;
  margin-top: 0.35rem;
  height: 28%;
  align-items: end;
}
.ad-center .photo {
  border: 3px solid #fff;
  border-radius: 10px;
  box-shadow: 0 6px 14px rgba(13, 84, 107, 0.2);
  height: 100%;
}
.ad-center .photo-0 { transform: rotate(-7deg) translateY(6%); }
.ad-center .photo-1 { transform: translateY(-4%); z-index: 2; }
.ad-center .photo-2 { transform: rotate(7deg) translateY(6%); }

.ad-split-left {
  display: grid;
  grid-template-columns: 42% 1fr;
  padding: 0;
}
.ad-split-left .col-photo {
  position: relative;
  height: 100%;
}
.ad-split-left .photo { position: absolute; inset: 0; height: 100%; }
.ad-split-left .col-copy {
  padding: 1rem 1rem 1rem 0.85rem;
  display: flex;
  flex-direction: column;
}
.ad-split-left .top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}
.ad-split-left .top-row .hire-row { flex-direction: column; align-items: flex-end; }
.ad-split-left .price { margin-top: auto; align-self: flex-end; }

.ad-split-copy, .ad-nurse, .ad-burnout {
  display: flex;
  flex-direction: column;
  padding: 0.9rem 1rem 1rem;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.55rem;
}
.ad-burnout .top-bar { justify-content: space-between; }
.body {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 0.75rem;
  flex: 1;
  min-height: 0;
}
.col-copy { display: flex; flex-direction: column; min-width: 0; }
.col-photo {
  position: relative;
  min-height: 0;
  border-radius: 12px;
  overflow: hidden;
}
.col-photo .photo { position: absolute; inset: 0; }
.ad-split-copy .price-circle,
.ad-nurse .cta {
  position: absolute;
  z-index: 3;
}
.ad-split-copy .price-circle { left: 6%; bottom: 8%; }
.ad-nurse .cta { left: 50%; bottom: 8%; transform: translateX(-50%); }
.ad-nurse .price-bar { margin-top: auto; }
.ad-burnout .price-overlay { position: absolute; }

/* Editor */
.editor {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 14px;
  padding: 1rem 1.1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.editor h3 { margin: 0; font-size: 1rem; color: #f8fafc; }
.editor .note { margin: 0; font-size: 0.78rem; color: #94a3b8; }
.editor label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #94a3b8;
}
.editor input, .editor textarea, .editor select {
  font: inherit;
  text-transform: none;
  letter-spacing: normal;
  font-size: 0.88rem;
  color: #e2e8f0;
  background: #0b1220;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 0.45rem 0.55rem;
}
.editor textarea { resize: vertical; }
.copy-json {
  margin-top: 0.35rem;
  background: var(--mv-primary);
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
  font-weight: 700;
  cursor: pointer;
}
.copy-json:hover { filter: brightness(1.08); }
.toast {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  background: #065f46;
  color: #ecfdf5;
  padding: 0.65rem 0.9rem;
  border-radius: 8px;
  font-size: 0.85rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 50;
}
.toast.show { opacity: 1; }
`;

const ICONS_JSON = JSON.stringify(ROLE_OFFER_ICON);
const DATA_JSON = JSON.stringify(ROLE_OFFER_TEMPLATES);

const cards = ROLE_OFFER_TEMPLATES.map(
  (t) => `
  <section class="row" id="${esc(t.id)}">
    <div class="ad-frame">
      <div class="label">${esc(t.label)} · <span class="layout-id">${esc(t.layout)}</span></div>
      ${renderAd(t)}
    </div>
    ${editorPanel(t)}
  </section>`,
).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(ROLE_OFFER_META.title)} · MedVirtual</title>
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'templates',
    pageTitle: 'Role-Offer Templates',
    pageSubtitle: 'Editable checklist layouts the team loves',
    subnav: [
      { href: '/template-test-board.html', label: 'Layout refs' },
      { href: '/role-offer-templates.html', label: 'Role-Offer' },
    ],
    activeSubHref: '/role-offer-templates.html',
  })}
  <div class="intro">
    <h1>${esc(ROLE_OFFER_META.title)}</h1>
    <p>${esc(ROLE_OFFER_META.subtitle)}</p>
    <p class="tips">Click any text on the ad to edit · use the side panel for bullets, icons, price, CTA, photos · Copy JSON to paste back into <code>scripts/role-offer-templates-data.mjs</code>. Stock/AI people only — not Talent Pool portraits.</p>
  </div>
  <div class="stack">
    ${cards}
  </div>
  <div class="toast" id="toast">Copied</div>
  <script>
    const ICONS = ${ICONS_JSON};
    const state = ${DATA_JSON};

    function toast(msg) {
      const el = document.getElementById('toast');
      el.textContent = msg;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 1600);
    }

    function findTpl(id) {
      return state.find((t) => t.id === id);
    }

    function renderBullets(ad, t) {
      const ul = ad.querySelector('.bullets');
      if (!ul) return;
      const icon = ICONS[t.iconStyle] || ICONS.checkCircle;
      ul.innerHTML = (t.bullets || []).map((b, i) =>
        '<li><span class="ico" data-icon>' + icon + '</span><span class="btxt" data-bullet="' + i + '" contenteditable="true">' + escapeHtml(b) + '</span></li>'
      ).join('');
      ad.dataset.iconStyle = t.iconStyle;
    }

    function renderPhotos(ad, t) {
      const slots = ad.querySelectorAll('[data-photo-slot]');
      slots.forEach((slot) => {
        const i = Number(slot.dataset.photoSlot);
        const img = slot.querySelector('img');
        if (img && t.photos[i]) img.src = t.photos[i];
      });
    }

    function renderPrice(ad, t) {
      const price = ad.querySelector('[data-price]');
      if (!price) return;
      price.className = 'price price-' + (t.priceStyle || 'circle');
      const label = price.querySelector('[data-field="priceLabel"]');
      const amount = price.querySelector('[data-field="priceAmount"]');
      const unit = price.querySelector('[data-field="priceUnit"]');
      if (label) label.textContent = t.priceLabel || '';
      if (amount) amount.textContent = t.priceAmount || '';
      if (unit) unit.textContent = t.priceUnit || '';
    }

    function renderCta(ad, t) {
      let cta = ad.querySelector('[data-cta]');
      if (!t.cta) {
        if (cta) cta.remove();
        return;
      }
      if (!cta) {
        const host = ad.querySelector('.col-copy') || ad.querySelector('.col-photo') || ad;
        cta = document.createElement('button');
        cta.type = 'button';
        cta.className = 'cta';
        cta.dataset.cta = '';
        host.appendChild(cta);
      }
      const arrow = '<span class="cta-ico" data-cta-icon="arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="var(--mv-cyan)"/><path d="M10 8l4 4-4 4" fill="none" stroke="var(--mv-deep)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
      const cal = '<span class="cta-ico" data-cta-icon="calendar"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="2"/></svg></span>';
      const icon = t.ctaIcon === 'calendar' ? cal : t.ctaIcon === 'arrow' ? arrow : '';
      cta.innerHTML = '<span class="cta-txt" data-field="cta" contenteditable="true">' + escapeHtml(t.cta) + '</span>' + icon;
    }

    function escapeHtml(s) {
      return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function syncFieldFromBind(id, key, value) {
      const t = findTpl(id);
      if (!t) return;
      if (key === 'bullets') {
        t.bullets = String(value).split(/\\n/).map((x) => x.trim()).filter(Boolean);
      } else if (key === 'photos') {
        t.photos = String(value).split(/\\n/).map((x) => x.trim()).filter(Boolean);
      } else {
        t[key] = value;
      }
      const ad = document.querySelector('.ad[data-id="' + id + '"]');
      if (!ad) return;

      if (key === 'bullets' || key === 'iconStyle') renderBullets(ad, t);
      if (key === 'photos') renderPhotos(ad, t);
      if (key === 'priceLabel' || key === 'priceAmount' || key === 'priceUnit' || key === 'priceStyle') renderPrice(ad, t);
      if (key === 'cta' || key === 'ctaIcon') renderCta(ad, t);

      const map = {
        audiencePill: '[data-field="audiencePill"]',
        hirePrefix: '[data-field="hirePrefix"]',
        role: '[data-field="role"]',
        headline: '[data-field="headline"]',
        priceLabel: '[data-field="priceLabel"]',
        priceAmount: '[data-field="priceAmount"]',
        priceUnit: '[data-field="priceUnit"]',
        cta: '[data-field="cta"]',
      };
      if (map[key]) {
        const el = ad.querySelector(map[key]);
        if (el && document.activeElement !== el) {
          if (key === 'headline' && t.headlineAccent && String(t.headline).includes(t.headlineAccent)) {
            const h = t.headline;
            const a = t.headlineAccent;
            const i = h.indexOf(a);
            el.innerHTML = escapeHtml(h.slice(0, i)) + '<span class="accent">' + escapeHtml(a) + '</span>' + escapeHtml(h.slice(i + a.length));
          } else {
            el.textContent = value;
          }
        }
      }
      // audience pill may be absent — create if needed
      if (key === 'audiencePill') {
        let pill = ad.querySelector('[data-field="audiencePill"]');
        if (!value && pill) pill.remove();
        if (value && !pill) {
          const bar = ad.querySelector('.top-bar');
          if (bar) {
            pill = document.createElement('span');
            pill.className = 'aud-pill';
            pill.dataset.field = 'audiencePill';
            pill.contentEditable = 'true';
            pill.textContent = value;
            bar.insertBefore(pill, bar.firstChild);
          }
        } else if (pill) {
          pill.textContent = value;
        }
      }
    }

    document.querySelectorAll('[data-editor-for]').forEach((panel) => {
      const id = panel.dataset.editorFor;
      panel.querySelectorAll('[data-bind]').forEach((input) => {
        const key = input.dataset.bind;
        const handler = () => syncFieldFromBind(id, key, input.value);
        input.addEventListener('input', handler);
        input.addEventListener('change', handler);
      });
      const upload = panel.querySelector('[data-upload]');
      if (upload) {
        upload.addEventListener('change', () => {
          const t = findTpl(id);
          const files = [...upload.files];
          if (!files.length || !t) return;
          Promise.all(files.map((f) => new Promise((res) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.readAsDataURL(f);
          }))).then((urls) => {
            t.photos = urls;
            const ta = panel.querySelector('[data-bind="photos"]');
            if (ta) ta.value = '(uploaded local previews — replace with /assets/… paths before shipping)';
            const ad = document.querySelector('.ad[data-id="' + id + '"]');
            if (ad) renderPhotos(ad, t);
            toast('Photos updated (local preview)');
          });
        });
      }
      const copyBtn = panel.querySelector('[data-copy]');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          const t = findTpl(id);
          const text = JSON.stringify(t, null, 2);
          try {
            await navigator.clipboard.writeText(text);
            toast('JSON copied — paste into role-offer-templates-data.mjs');
          } catch {
            toast('Copy failed — select JSON manually');
            console.log(text);
          }
        });
      }
    });

    // Sync contenteditable on the ad back into state + panel
    document.querySelectorAll('.ad').forEach((ad) => {
      ad.addEventListener('input', (e) => {
        const id = ad.dataset.id;
        const t = findTpl(id);
        if (!t) return;
        const target = e.target;
        if (target.matches('[data-bullet]')) {
          const i = Number(target.dataset.bullet);
          t.bullets[i] = target.textContent.trim();
          const panel = document.querySelector('[data-editor-for="' + id + '"]');
          const ta = panel && panel.querySelector('[data-bind="bullets"]');
          if (ta) ta.value = t.bullets.join('\\n');
          return;
        }
        const field = target.getAttribute('data-field');
        if (!field) return;
        let val = target.textContent.trim();
        if (field === 'headline') val = target.innerText.trim();
        t[field] = val;
        const panel = document.querySelector('[data-editor-for="' + id + '"]');
        const input = panel && panel.querySelector('[data-bind="' + field + '"]');
        if (input) input.value = val;
      });
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
console.log('Wrote', path.relative(path.join(__dirname, '..'), OUT));
console.log('Templates:', ROLE_OFFER_TEMPLATES.map((t) => t.id).join(', '));
