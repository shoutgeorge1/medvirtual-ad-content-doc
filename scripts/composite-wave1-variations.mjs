/**
 * Wave 1 VARIATIONS compositor — one UNIQUE formatting scenario per concept (4:5).
 *
 * Replaces the "weird" tilted focal slab with five different, cleaner focal-word
 * styles, and gives each concept a different owner-targeted top callout so every
 * ad reads differently and can be A/B compared. Directive locked to the brand
 * term "HIRE A VIRTUAL MEDICAL ADMIN".
 *
 *   VMA-33  callout: filled banner        focal: underline
 *   VMA-34  callout: outline pill         focal: highlighter marker
 *   VMA-37  callout: underlined kicker    focal: outline box
 *   VMA-41  callout: angled ribbon        focal: knockout band
 *   VMA-43  callout: big directive top    focal: color-swap + chevrons
 *
 * Real Be Vietnam ExtraBold (font-weight 800). NO image-generation calls.
 * Approved plates used untouched. Run: node scripts/composite-wave1-variations.mjs
 * Out: public/exports/wave1-first-launch/treatments/<STEM>_4x5_V.png
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES, BE, WEIGHT, esc, logoMarkup, icon } from './wave1-render-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PLATE_DIR = path.join(ROOT, 'public/exports/wave1-first-launch/plates/4x5');
const OUT_DIR = path.join(ROOT, 'public/exports/wave1-first-launch/treatments');
const SRC_DIR = path.join(OUT_DIR, 'sources');

const W = 1080, H = 1350;
const C = {
  cyan: '#00B2E2', teal: '#077999', deep: '#0D546B', deeper: '#0A3D4E',
  dark: '#052A38', darker: '#03161D', white: '#FFFFFF', cream: '#FBF7EE',
  soft: '#DFF6FD', navyText: '#06333F', extrude: '#0A3A4A', stroke: '#03202A',
};

const DIRECTIVE = 'HIRE A VIRTUAL MEDICAL ADMIN';
const DIRECTIVE_BILINGUAL = 'HIRE A BILINGUAL VIRTUAL MEDICAL ADMIN';

const CONCEPTS = [
  {
    id: 'VMA-33', stem: 'MV_VMA_33_SpanishNeverLost',
    headline: [{ t: 'STOP LOSING' }, { t: 'SPANISH', accent: true }, { t: 'PATIENTS' }],
    directive: DIRECTIVE_BILINGUAL, icon: 'enes',
    style: 'banner', focal: 'underline',
    audience: 'ATTENTION: CLINIC OWNERS', cta: 'REQUEST AN INTERVIEW', ctaStyle: 'solid',
  },
  {
    id: 'VMA-34', stem: 'MV_VMA_34_BilingualFrontDesk',
    headline: [{ t: 'SPEAK YOUR' }, { t: "PATIENTS\u2019" }, { t: 'LANGUAGE', accent: true }],
    directive: DIRECTIVE_BILINGUAL, icon: 'enes',
    style: 'pill', focal: 'highlighter',
    audience: 'MEDICAL PRACTICE OWNERS', cta: 'MEET YOUR NEXT HIRE', ctaStyle: 'light',
  },
  {
    id: 'VMA-37', stem: 'MV_VMA_37_TrainedWorkflow',
    headline: [{ t: 'TRAINED FOR' }, { t: 'YOUR' }, { t: 'WORKFLOW', accent: true }],
    directive: DIRECTIVE, icon: 'workflow',
    style: 'kicker', focal: 'outlinebox',
    audience: 'FOR BUSY MEDICAL PRACTICES', cta: 'FIND YOUR VIRTUAL STAFF', ctaStyle: 'solid',
  },
  {
    id: 'VMA-41', stem: 'MV_VMA_41_FrontDeskCapacity',
    headline: [{ t: 'YOUR FRONT' }, { t: 'DESK IS' }, { t: 'MAXED OUT', accent: true }],
    directive: DIRECTIVE, icon: 'bell',
    style: 'ribbon', focal: 'knockout',
    audience: 'FOR BUSY FRONT DESKS', cta: 'REQUEST AN INTERVIEW', ctaStyle: 'solid',
  },
  {
    id: 'VMA-43', stem: 'MV_VMA_43_ScheduleMoving',
    headline: [{ t: 'KEEP YOUR' }, { t: 'SCHEDULE' }, { t: 'MOVING', accent: true }],
    directive: DIRECTIVE, icon: 'calendar',
    style: 'directive', focal: 'colorswap',
    audience: 'PRACTICE OWNERS & OFFICE MANAGERS', cta: 'MEET YOUR NEXT HIRE', ctaStyle: 'solid',
  },
];

// ---------- measurement ----------
const ratioCache = new Map();
function textOnlyPng(text, weight, size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8000" height="${Math.ceil(size * 1.8)}"><text x="0" y="${Math.round(size * 1.3)}" font-family="${BE}" font-weight="${weight}" font-size="${size}" fill="#fff">${esc(text)}</text></svg>`;
  return new Resvg(svg, { font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
}
async function emRatio(text, weight) {
  const key = `${weight}|${text}`;
  if (ratioCache.has(key)) return ratioCache.get(key);
  let ratio;
  try {
    const info = await sharp(textOnlyPng(text, weight, 200)).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
    ratio = info.info.width / 200;
  } catch { ratio = text.length * 0.6; }
  ratioCache.set(key, ratio);
  return ratio;
}
const widthOf = async (t, w, s) => (await emRatio(t, w)) * s;
async function fitStack(lines, maxWidth, maxSize, minSize, weight) {
  let size = maxSize;
  for (const ln of lines) size = Math.min(size, maxWidth / (await emRatio(ln.t, weight)));
  return Math.max(minSize, Math.min(maxSize, Math.floor(size)));
}
async function wrapToWidth(text, weight, size, maxWidth) {
  const words = text.split(' ');
  const lines = []; let cur = '';
  for (const w of words) {
    const trial = cur ? `${cur} ${w}` : w;
    if ((await widthOf(trial, weight, size)) <= maxWidth || !cur) cur = trial;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}
function T(x, y, text, weight, size, fill, extra = '') {
  return `<text x="${x}" y="${y.toFixed(1)}" font-family="${BE}" font-weight="${weight}" font-size="${size}" fill="${fill}"${extra}>${esc(text)}</text>`;
}

// ---------- base dimensional line ----------
function dimBaseLine(x, y, text, size) {
  const ex = Math.max(8, Math.round(size * 0.1));
  const sw = Math.max(4, Math.round(size * 0.05));
  let svg = '';
  for (let i = ex; i >= 1; i--) svg += `<text x="${x + i}" y="${(y + i).toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${C.extrude}">${esc(text)}</text>`;
  svg += `<text x="${x}" y="${y.toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${C.white}" stroke="${C.stroke}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke">${esc(text)}</text>`;
  return svg;
}
function dimExtrude(x, y, text, size, color) {
  const ex = Math.max(8, Math.round(size * 0.1));
  let svg = '';
  for (let i = ex; i >= 1; i--) svg += `<text x="${x + i}" y="${(y + i).toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${color}">${esc(text)}</text>`;
  return svg;
}

// ---------- 5 focal-word styles ----------
async function focal(style, x, y, text, size) {
  const w = await widthOf(text, WEIGHT.extrabold, size);
  const sw = Math.max(5, Math.round(size * 0.055));
  if (style === 'underline') {
    return dimExtrude(x, y, text, size, C.extrude)
      + `<text x="${x}" y="${y.toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${C.cyan}" stroke="${C.stroke}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke">${esc(text)}</text>`
      + `<rect x="${x}" y="${(y + size * 0.14).toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(10, size * 0.1).toFixed(0)}" rx="5" fill="${C.cyan}"/>`;
  }
  if (style === 'highlighter') {
    const padX = size * 0.14, top = y - size * 0.8, h = size * 1.0;
    return `<rect x="${(x - padX + 7).toFixed(1)}" y="${(top + 8).toFixed(1)}" width="${(w + padX * 2).toFixed(1)}" height="${h.toFixed(1)}" rx="8" fill="${C.darker}" opacity="0.5"/>`
      + `<rect x="${(x - padX).toFixed(1)}" y="${top.toFixed(1)}" width="${(w + padX * 2).toFixed(1)}" height="${h.toFixed(1)}" rx="8" fill="${C.cyan}"/>`
      + `<text x="${x}" y="${y.toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${C.navyText}">${esc(text)}</text>`;
  }
  if (style === 'outlinebox') {
    const padX = size * 0.16, top = y - size * 0.82, h = size * 1.04;
    return dimExtrude(x, y, text, size, C.extrude)
      + `<rect x="${(x - padX).toFixed(1)}" y="${top.toFixed(1)}" width="${(w + padX * 2).toFixed(1)}" height="${h.toFixed(1)}" rx="14" fill="none" stroke="${C.cyan}" stroke-width="8"/>`
      + `<text x="${x}" y="${y.toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${C.cyan}" stroke="${C.stroke}" stroke-width="${Math.round(size * 0.04)}" stroke-linejoin="round" paint-order="stroke">${esc(text)}</text>`;
  }
  if (style === 'knockout') {
    const padX = size * 0.2, top = y - size * 0.82, h = size * 1.04, bandW = w + padX * 2;
    return `<rect x="${(x - padX + 8).toFixed(1)}" y="${(top + 9).toFixed(1)}" width="${bandW.toFixed(1)}" height="${h.toFixed(1)}" fill="${C.darker}" opacity="0.5"/>`
      + `<rect x="${(x - padX).toFixed(1)}" y="${top.toFixed(1)}" width="${bandW.toFixed(1)}" height="${h.toFixed(1)}" fill="${C.cyan}"/>`
      + `<rect x="${(x - padX).toFixed(1)}" y="${top.toFixed(1)}" width="${bandW.toFixed(1)}" height="${Math.max(6, size * 0.06).toFixed(0)}" fill="${C.cream}"/>`
      + `<text x="${x}" y="${y.toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${C.navyText}">${esc(text)}</text>`;
  }
  // colorswap + chevrons
  const chx = x + w + size * 0.24;
  let chev = '';
  for (let i = 0; i < 3; i++) chev += `<path d="M${chx + i * size * 0.2} ${(y - size * 0.5).toFixed(1)} l${size * 0.18} ${size * 0.24} l-${size * 0.18} ${size * 0.24}" fill="none" stroke="${C.cyan}" stroke-width="${Math.max(7, size * 0.08)}" stroke-linecap="round" stroke-linejoin="round" opacity="${0.4 + i * 0.25}"/>`;
  return dimExtrude(x, y, text, size, C.extrude)
    + `<text x="${x}" y="${y.toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${C.cyan}" stroke="${C.stroke}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke">${esc(text)}</text>`
    + chev;
}

async function headlineStack(lines, x, topY, size, lh, focalStyle) {
  const step = size * lh;
  let svg = '';
  for (let i = 0; i < lines.length; i++) {
    const y = topY + size * 0.82 + i * step;
    svg += lines[i].accent ? await focal(focalStyle, x, y, lines[i].t, size) : dimBaseLine(x, y, lines[i].t, size);
  }
  return { svg, height: lines.length * step };
}

// ---------- 5 top callout styles → returns {svg, bottom} ----------
async function callout(style, x, y, text, colW) {
  const size = 38;
  if (style === 'banner') {
    const w = Math.min(colW, (await widthOf(text, WEIGHT.bold, size)) + 56);
    const h = size + 26;
    return {
      bottom: y + h,
      svg: `<rect x="${x + 6}" y="${y + 7}" width="${w.toFixed(0)}" height="${h}" rx="10" fill="${C.darker}" opacity="0.5"/>
        <rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="10" fill="${C.cyan}"/>
        ${T(x + 28, y + h / 2 + size * 0.34, text, WEIGHT.bold, size, C.navyText, ' letter-spacing="1"')}`,
    };
  }
  if (style === 'pill') {
    const h = size + 26;
    const w = (await widthOf(text, WEIGHT.bold, size)) + 44 + h / 2 + 16; // left pad + rounded-cap clearance

    return {
      bottom: y + h,
      svg: `<rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="none" stroke="${C.cyan}" stroke-width="4"/>
        <circle cx="${x + 26}" cy="${y + h / 2}" r="7" fill="${C.cyan}"/>
        ${T(x + 44, y + h / 2 + size * 0.34, text, WEIGHT.bold, size, C.cyan, ' letter-spacing="1"')}`,
    };
  }
  if (style === 'kicker') {
    const w = await widthOf(text, WEIGHT.bold, size);
    return {
      bottom: y + size + 22,
      svg: `${T(x, y + size * 0.82, text, WEIGHT.bold, size, C.cyan, ' letter-spacing="2"')}
        <rect x="${x}" y="${(y + size + 6).toFixed(1)}" width="${w.toFixed(1)}" height="6" rx="3" fill="${C.cyan}"/>`,
    };
  }
  if (style === 'ribbon') {
    const w = (await widthOf(text, WEIGHT.bold, size)) + 60;
    const h = size + 24;
    const cx = x + w / 2, cy = y + h / 2;
    return {
      bottom: y + h + 8,
      svg: `<g transform="rotate(-4 ${cx.toFixed(1)} ${cy.toFixed(1)})">
        <path d="M${x} ${y} h${w} l-18 ${h / 2} l18 ${h / 2} h-${w} Z" fill="${C.darker}" opacity="0.5" transform="translate(6,7)"/>
        <path d="M${x} ${y} h${w} l-18 ${h / 2} l18 ${h / 2} h-${w} Z" fill="${C.cyan}"/>
        ${T(x + 24, cy + size * 0.34, text, WEIGHT.bold, size, C.navyText, ' letter-spacing="1"')}
      </g>`,
    };
  }
  // 'directive' — big two-line directive as the top statement, small audience subtag
  const subSize = 34 < 38 ? 38 : 34;
  const dSize = 54;
  const dLines = await wrapToWidth(DIRECTIVE, WEIGHT.extrabold, dSize, colW);
  let svg = T(x, y + 38 * 0.82, text, WEIGHT.bold, 38, C.cyan, ' letter-spacing="1"');
  let yy = y + 38 + 16;
  dLines.forEach((ln) => { svg += dimBaseLine(x, yy + dSize * 0.82, ln, dSize); yy += dSize * 1.02; });
  return { bottom: yy + 6, svg, isDirective: true };
}

// ---------- offer / cta (upright, clean, dimensional) ----------
async function offerBlock(x, y, scale) {
  const dollar = Math.round(128 * scale), hr = Math.round(54 * scale);
  const cap = Math.max(38, Math.round(40 * scale)), padX = Math.round(38 * scale);
  const ribbonH = cap + Math.round(22 * scale), priceRowH = dollar + Math.round(28 * scale);
  const dW = await widthOf('$10', WEIGHT.extrabold, dollar), hrW = await widthOf('/HR', WEIGHT.extrabold, hr);
  const capW = await widthOf('STARTING AT', WEIGHT.bold, cap);
  const boxW = Math.max(dW + 10 + hrW, capW) + padX * 2, boxH = ribbonH + priceRowH, rr = 22 * scale;
  const capBaseline = y + ribbonH * 0.5 + cap * 0.34, priceBaseline = y + ribbonH + priceRowH * 0.5 + dollar * 0.34;
  return {
    width: boxW, height: boxH, dollarSize: dollar, capSize: cap,
    svg: `<rect x="${x + 10}" y="${y + 12}" width="${boxW.toFixed(0)}" height="${boxH.toFixed(0)}" rx="${rr}" fill="${C.darker}" opacity="0.55"/>
      <rect x="${x}" y="${y}" width="${boxW.toFixed(0)}" height="${boxH.toFixed(0)}" rx="${rr}" fill="${C.deep}"/>
      <rect x="${x}" y="${y}" width="${boxW.toFixed(0)}" height="${ribbonH.toFixed(0)}" fill="${C.cyan}"/>
      <text x="${(x + boxW / 2).toFixed(1)}" y="${capBaseline.toFixed(1)}" font-family="${BE}" font-weight="700" font-size="${cap}" fill="${C.navyText}" text-anchor="middle" letter-spacing="3">STARTING AT</text>
      ${T(x + padX, priceBaseline, '$10', WEIGHT.extrabold, dollar, C.white)}
      ${T(x + padX + dW + 10, priceBaseline, '/HR', WEIGHT.extrabold, hr, C.cyan)}
      <rect x="${x + 4}" y="${y + 4}" width="${(boxW - 8).toFixed(0)}" height="${(boxH - 8).toFixed(0)}" rx="${rr - 4}" fill="none" stroke="${C.cream}" stroke-width="4"/>
      <rect x="${x}" y="${y}" width="${boxW.toFixed(0)}" height="${boxH.toFixed(0)}" rx="${rr}" fill="none" stroke="${C.cyan}" stroke-width="8"/>`,
  };
}
async function ctaPro(x, y, label, style) {
  const size = 50, padX = 52, h = 116;
  const tw = await widthOf(label, WEIGHT.extrabold, size), w = tw + padX * 2 + 64;
  const cy = y + h / 2, ax = x + w - padX;
  const solid = style === 'solid';
  const bg = solid ? C.cyan : C.white, fg = solid ? C.navyText : C.deep;
  return {
    width: w, height: h, size,
    svg: `<rect x="${x}" y="${(y + 14).toFixed(1)}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="${C.deeper}"/>
      <rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="${bg}"/>
      <rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="none" stroke="${C.cream}" stroke-width="5"/>
      ${T(x + padX, cy + size * 0.34, label, WEIGHT.extrabold, size, fg)}
      <path d="M${ax - 28} ${cy} h32 M${ax} ${cy - 14} l16 14 l-16 14" fill="none" stroke="${fg}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
}
function iconBadge(kind, cx, cy, r) {
  const shadow = `<circle cx="${cx + 8}" cy="${cy + 10}" r="${r}" fill="${C.darker}" opacity="0.5"/>`;
  const disc = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.cyan}"/><circle cx="${cx}" cy="${cy}" r="${r - 7}" fill="none" stroke="${C.cream}" stroke-width="7"/>`;
  const hi = `<path d="M${cx - r * 0.55} ${cy - r * 0.5} A ${r * 0.72} ${r * 0.72} 0 0 1 ${cx + r * 0.35} ${cy - r * 0.72}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.5"/>`;
  const nk = C.navyText;
  let inner = '';
  if (kind === 'enes') {
    inner = `<rect x="${cx - r * 0.62}" y="${cy - r * 0.55}" width="${r * 0.95}" height="${r * 0.72}" rx="10" fill="${C.white}"/>
      <path d="M${cx - r * 0.42} ${cy + r * 0.15} l0 ${r * 0.28} l${r * 0.26} -${r * 0.28} Z" fill="${C.white}"/>
      <text x="${cx - r * 0.15}" y="${cy - r * 0.12}" font-family="${BE}" font-weight="800" font-size="${r * 0.42}" fill="${nk}" text-anchor="middle">EN</text>
      <rect x="${cx - r * 0.12}" y="${cy - r * 0.02}" width="${r * 0.78}" height="${r * 0.66}" rx="10" fill="${C.deep}"/>
      <text x="${cx + r * 0.27}" y="${cy + r * 0.46}" font-family="${BE}" font-weight="800" font-size="${r * 0.42}" fill="${C.white}" text-anchor="middle">ES</text>`;
  } else if (kind === 'workflow') {
    inner = `<g fill="none" stroke="${nk}" stroke-width="${r * 0.11}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M${cx - r * 0.5} ${cy - r * 0.35} h${r * 0.55} a${r * 0.28} ${r * 0.28} 0 0 1 ${r * 0.28} ${r * 0.28} v${r * 0.2}"/>
      <path d="M${cx + r * 0.26} ${cy + r * 0.02} l${r * 0.12} ${r * 0.16} l${r * 0.16} -${r * 0.16}"/>
      <path d="M${cx - r * 0.5} ${cy + r * 0.42} l${r * 0.18} ${r * 0.18} l${r * 0.4} -${r * 0.46}"/></g>`;
  } else if (kind === 'bell') {
    inner = icon('bell', cx, cy, r * 1.15, nk) + `<g stroke="${nk}" stroke-width="${r * 0.09}" stroke-linecap="round" fill="none">
      <path d="M${cx - r * 0.78} ${cy - r * 0.1} a ${r * 0.3} ${r * 0.3} 0 0 0 0 ${r * 0.4}"/>
      <path d="M${cx + r * 0.78} ${cy - r * 0.1} a ${r * 0.3} ${r * 0.3} 0 0 1 0 ${r * 0.4}"/></g>`;
  } else if (kind === 'calendar') {
    inner = icon('calendar', cx, cy, r * 1.1, nk);
  }
  return `<g>${shadow}${disc}${hi}${inner}</g>`;
}
function scrimDefs() {
  return `<linearGradient id="lscrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.darker}" stop-opacity="0.94"/><stop offset="0.34" stop-color="${C.dark}" stop-opacity="0.74"/>
      <stop offset="0.62" stop-color="${C.dark}" stop-opacity="0.12"/><stop offset="0.82" stop-color="${C.dark}" stop-opacity="0"/></linearGradient>
    <linearGradient id="bscrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0.56" stop-color="${C.darker}" stop-opacity="0"/><stop offset="1" stop-color="${C.darker}" stop-opacity="0.66"/></linearGradient>
    <linearGradient id="tscrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.darker}" stop-opacity="0.6"/><stop offset="0.24" stop-color="${C.darker}" stop-opacity="0"/></linearGradient>`;
}

async function build(concept) {
  const x = 64, colW = 600;
  const report = { fontFamily: BE, fallback: false, style: concept.style, focal: concept.focal, audience: concept.audience, icon: concept.icon };
  const logo = logoMarkup(C.white, x, 48, 0.30);
  const badge = iconBadge(concept.icon, 962, 150, 78);

  const co = await callout(concept.style, x, 120, concept.audience, colW);
  let y = co.bottom + 20;
  let directiveSvg = '';
  if (!co.isDirective) {
    const dSize = 44;
    const dLines = await wrapToWidth(concept.directive, WEIGHT.bold, dSize, colW);
    dLines.forEach((ln, i) => { directiveSvg += T(x, y + dSize * 0.82 + i * dSize * 1.04, ln, WEIGHT.bold, dSize, C.cyan); });
    y += dLines.length * dSize * 1.04 + 22;
  }

  const headSize = await fitStack(concept.headline, colW, 118, 82, WEIGHT.extrabold);
  const head = await headlineStack(concept.headline, x, y, headSize, 1.04, concept.focal);
  const headBottom = y + head.height;

  const offer = await offerBlock(x + 4, headBottom + 40, 0.92);
  const cta = await ctaPro(x, H - 64 - 116, concept.cta, concept.ctaStyle);

  Object.assign(report, {
    headlineSize: headSize, priceDollarSize: offer.dollarSize, ctaSize: cta.size,
    directive: co.isDirective ? DIRECTIVE : concept.directive, cta: concept.cta,
    copy: { headline: concept.headline.map((l) => l.t).join(' ') },
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${scrimDefs()}</defs>
  <rect width="${W}" height="${H}" fill="url(#tscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#lscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#bscrim)"/>
  ${logo}
  ${badge}
  ${co.svg}
  ${directiveSvg}
  ${head.svg}
  ${offer.svg}
  ${cta.svg}
</svg>`;
  return { svg, report };
}

function isPink(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max - min < 25) return false;
  let h;
  if (max === r) h = ((g - b) / (max - min)) % 6; else if (max === g) h = (b - r) / (max - min) + 2; else h = (r - g) / (max - min) + 4;
  h *= 60; if (h < 0) h += 360;
  return (max - min) / max > 0.25 && h >= 290 && h <= 345;
}
async function pinkCount(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let n = 0;
  for (let i = 0; i < data.length; i += info.channels) if (isPink(data[i], data[i + 1], data[i + 2])) n++;
  return n;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(SRC_DIR, { recursive: true });
  const selection = JSON.parse(fs.readFileSync(path.join(PLATE_DIR, 'selection.json'), 'utf8'));
  const report = { generatedAt: new Date().toISOString(), ratio: '4x5', apiCalls: 0, fontFamily: BE, note: 'one unique formatting scenario per concept', concepts: [] };

  for (const c of CONCEPTS) {
    const platePath = path.join(PLATE_DIR, c.id, selection[c.id]);
    if (!fs.existsSync(platePath)) throw new Error(`Missing approved plate: ${platePath}`);
    const base = await sharp(fs.readFileSync(platePath)).resize(W, H, { fit: 'cover', position: 'centre' }).toBuffer();
    const { svg, report: r } = await build(c);
    const overlay = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
    const png = await sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
    const out = path.join(OUT_DIR, `${c.stem}_4x5_V.png`);
    fs.writeFileSync(out, png);
    fs.writeFileSync(path.join(SRC_DIR, `${c.stem}_4x5_V.svg`), svg);
    const meta = await sharp(png).metadata();
    const pink = await pinkCount(png);
    report.concepts.push({ id: c.id, plate: selection[c.id], file: path.basename(out), dimensions: `${meta.width}x${meta.height}`, bytes: png.length, pinkPixels: pink, ...r });
    console.log(`${c.id} V [${c.style}/${c.focal}] -> ${path.basename(out)} (${meta.width}x${meta.height}, head ${r.headlineSize}px, pink ${pink})`);
  }
  fs.writeFileSync(path.join(OUT_DIR, 'wave1-variations-report.json'), JSON.stringify(report, null, 2));
  console.log('\nReport: public/exports/wave1-first-launch/treatments/wave1-variations-report.json');
}
main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
