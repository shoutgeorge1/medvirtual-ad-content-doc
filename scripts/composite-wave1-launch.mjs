/**
 * Wave 1 LAUNCH compositor — two variants per concept (4:5), launch-polish pass.
 *
 * Improvements over Treatment V:
 *   - Base plate SHARPEN + contrast/saturation boost (kills the soft/"blurry" look).
 *   - Icons POP: larger colored badges with rings, shadow, and burst accents; each
 *     concept gets its own accent color for variety.
 *   - VMA-33 icon = round Mexican-flag emblem (bilingual test), VMA-34 keeps EN/ES
 *     bubble so the two bilingual icon approaches can be A/B compared.
 *   - VMA-37 icon replaced with a clear checklist/clipboard emblem.
 *   - Two variants per concept (V + W) with different focal word style, top callout,
 *     offer theme, and CTA so we can see what works.
 *
 * Real Be Vietnam ExtraBold (font-weight 800). NO image-generation calls.
 * Approved plates from selection.json used untouched (only tone/sharpen for output).
 *
 * Run: node scripts/composite-wave1-launch.mjs
 * Out: treatments/<STEM>_4x5_V.png and _W.png
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
  // popping accent palette (brand, no pink)
  yellow: '#FFD400', green: '#1FA64A', red: '#E4002B', cobalt: '#1D4ED8',
  flagGreen: '#006847', flagRed: '#CE1126',
};

const DIRECTIVE = 'HIRE A VIRTUAL MEDICAL ADMIN';
const DIRECTIVE_BILINGUAL = 'HIRE A BILINGUAL VIRTUAL MEDICAL ADMIN';

// Per-concept base + two variants (V primary, W alternate for comparison).
const CONCEPTS = [
  {
    id: 'VMA-33', stem: 'MV_VMA_33_SpanishNeverLost',
    headline: [{ t: 'STOP LOSING' }, { t: 'SPANISH', accent: true }, { t: 'PATIENTS' }],
    directive: DIRECTIVE_BILINGUAL, iconKind: 'flag', iconAccent: 'flag',
    V: { style: 'banner', focal: 'underline', audience: 'ATTENTION: CLINIC OWNERS', cta: 'REQUEST AN INTERVIEW', ctaStyle: 'solid', offer: 'teal' },
    W: { style: 'ribbon', focal: 'knockout', audience: 'CLINIC OWNERS', cta: 'MEET YOUR NEXT HIRE', ctaStyle: 'navy', offer: 'cream' },
  },
  {
    id: 'VMA-34', stem: 'MV_VMA_34_BilingualFrontDesk',
    headline: [{ t: 'SPEAK YOUR' }, { t: "PATIENTS\u2019" }, { t: 'LANGUAGE', accent: true }],
    directive: DIRECTIVE_BILINGUAL, iconKind: 'enes', iconAccent: 'cyan',
    V: { style: 'pill', focal: 'highlighter', audience: 'MEDICAL PRACTICE OWNERS', cta: 'MEET YOUR NEXT HIRE', ctaStyle: 'light', offer: 'teal' },
    W: { style: 'banner', focal: 'colorswap', audience: 'PRACTICE OWNERS', cta: 'REQUEST AN INTERVIEW', ctaStyle: 'solid', offer: 'cream' },
  },
  {
    id: 'VMA-37', stem: 'MV_VMA_37_TrainedWorkflow',
    headline: [{ t: 'TRAINED FOR' }, { t: 'YOUR' }, { t: 'WORKFLOW', accent: true }],
    directive: DIRECTIVE, iconKind: 'checklist', iconAccent: 'yellow',
    V: { style: 'kicker', focal: 'outlinebox', audience: 'FOR BUSY MEDICAL PRACTICES', cta: 'FIND YOUR VIRTUAL STAFF', ctaStyle: 'solid', offer: 'teal' },
    W: { style: 'pill', focal: 'underline', audience: 'MEDICAL PRACTICE OWNERS', cta: 'MEET YOUR NEXT HIRE', ctaStyle: 'navy', offer: 'cream' },
  },
  {
    id: 'VMA-41', stem: 'MV_VMA_41_FrontDeskCapacity',
    headline: [{ t: 'YOUR FRONT' }, { t: 'DESK IS' }, { t: 'MAXED OUT', accent: true }],
    directive: DIRECTIVE, iconKind: 'bell', iconAccent: 'red',
    V: { style: 'ribbon', focal: 'knockout', audience: 'FOR BUSY FRONT DESKS', cta: 'REQUEST AN INTERVIEW', ctaStyle: 'solid', offer: 'teal' },
    W: { style: 'directive', focal: 'highlighter', audience: 'PRACTICE OWNERS & OFFICE MANAGERS', cta: 'FIND YOUR VIRTUAL STAFF', ctaStyle: 'navy', offer: 'cream' },
  },
  {
    id: 'VMA-43', stem: 'MV_VMA_43_ScheduleMoving',
    headline: [{ t: 'KEEP YOUR' }, { t: 'SCHEDULE' }, { t: 'MOVING', accent: true }],
    directive: DIRECTIVE, iconKind: 'calendar', iconAccent: 'green',
    V: { style: 'directive', focal: 'colorswap', audience: 'PRACTICE OWNERS & OFFICE MANAGERS', cta: 'MEET YOUR NEXT HIRE', ctaStyle: 'solid', offer: 'teal' },
    W: { style: 'kicker', focal: 'outlinebox', audience: 'FOR BUSY MEDICAL PRACTICES', cta: 'REQUEST AN INTERVIEW', ctaStyle: 'navy', offer: 'cream' },
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

// ---------- dimensional text ----------
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

// ---------- focal-word styles ----------
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

// ---------- POPPING icon badges ----------
function burst(cx, cy, r, color) {
  // small pointed rays behind the badge for pop
  let s = '';
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI / 6) * i;
    const r0 = r + 6, r1 = r + 22;
    s += `<line x1="${(cx + r0 * Math.cos(a)).toFixed(1)}" y1="${(cy + r0 * Math.sin(a)).toFixed(1)}" x2="${(cx + r1 * Math.cos(a)).toFixed(1)}" y2="${(cy + r1 * Math.sin(a)).toFixed(1)}" stroke="${color}" stroke-width="6" stroke-linecap="round" opacity="0.55"/>`;
  }
  return s;
}
function iconBadge(kind, accentKey, cx, cy, r, uid) {
  const accent = { flag: C.white, cyan: C.cyan, yellow: C.yellow, red: C.red, green: C.green, cobalt: C.cobalt }[accentKey] || C.cyan;
  // icon color chosen for contrast against the disc
  const dark = accentKey === 'yellow' || accentKey === 'cyan' || accentKey === 'flag';
  const ink = dark ? C.navyText : C.white;
  const shadow = `<circle cx="${cx + 8}" cy="${cy + 11}" r="${r}" fill="${C.darker}" opacity="0.55"/>`;
  const rays = burst(cx, cy, r, accent);
  let defs = '';
  let disc = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${accent}"/><circle cx="${cx}" cy="${cy}" r="${r - 8}" fill="none" stroke="${dark ? C.deep : C.cream}" stroke-width="8"/>`;
  const hi = `<path d="M${cx - r * 0.55} ${cy - r * 0.5} A ${r * 0.72} ${r * 0.72} 0 0 1 ${cx + r * 0.35} ${cy - r * 0.72}" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0.45"/>`;
  let inner = '';

  if (kind === 'flag') {
    const cid = `mxflag-${uid}`;
    defs = `<clipPath id="${cid}"><circle cx="${cx}" cy="${cy}" r="${r - 12}"/></clipPath>`;
    const d = r - 12, left = cx - d, band = (2 * d) / 3;
    disc = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.white}"/>`
      + `<g clip-path="url(#${cid})">`
      + `<rect x="${left}" y="${cy - d}" width="${band}" height="${2 * d}" fill="${C.flagGreen}"/>`
      + `<rect x="${left + band}" y="${cy - d}" width="${band}" height="${2 * d}" fill="${C.white}"/>`
      + `<rect x="${left + 2 * band}" y="${cy - d}" width="${band}" height="${2 * d}" fill="${C.flagRed}"/>`
      + `<circle cx="${cx}" cy="${cy}" r="${r * 0.16}" fill="none" stroke="#7a5b2e" stroke-width="4"/>`
      + `</g>`
      + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.cream}" stroke-width="8"/>`;
    return { svg: `<g>${shadow}${rays}${disc}${hi}</g>`, defs };
  }
  if (kind === 'enes') {
    inner = `<rect x="${cx - r * 0.62}" y="${cy - r * 0.55}" width="${r * 0.95}" height="${r * 0.72}" rx="10" fill="${C.white}"/>`
      + `<path d="M${cx - r * 0.42} ${cy + r * 0.15} l0 ${r * 0.28} l${r * 0.26} -${r * 0.28} Z" fill="${C.white}"/>`
      + `<text x="${cx - r * 0.15}" y="${cy - r * 0.12}" font-family="${BE}" font-weight="800" font-size="${r * 0.42}" fill="${C.navyText}" text-anchor="middle">EN</text>`
      + `<rect x="${cx - r * 0.12}" y="${cy - r * 0.02}" width="${r * 0.78}" height="${r * 0.66}" rx="10" fill="${C.deep}"/>`
      + `<text x="${cx + r * 0.27}" y="${cy + r * 0.46}" font-family="${BE}" font-weight="800" font-size="${r * 0.42}" fill="${C.white}" text-anchor="middle">ES</text>`;
  } else if (kind === 'checklist') {
    const bw = r * 1.02, bh = r * 1.24, bx = cx - bw / 2, by = cy - bh / 2;
    inner = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="12" fill="${ink}"/>`
      + `<rect x="${bx + bw * 0.28}" y="${by - r * 0.12}" width="${bw * 0.44}" height="${r * 0.26}" rx="7" fill="${ink}"/>`;
    const rows = 3;
    for (let i = 0; i < rows; i++) {
      const ry = by + bh * (0.30 + i * 0.24);
      inner += `<path d="M${bx + bw * 0.16} ${ry} l${bw * 0.08} ${bw * 0.09} l${bw * 0.16} -${bw * 0.18}" fill="none" stroke="${accent}" stroke-width="${r * 0.09}" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<rect x="${bx + bw * 0.46}" y="${ry - r * 0.05}" width="${bw * 0.36}" height="${r * 0.1}" rx="4" fill="${accent}"/>`;
    }
  } else if (kind === 'bell') {
    inner = icon('bell', cx, cy, r * 1.15, ink)
      + `<g stroke="${ink}" stroke-width="${r * 0.09}" stroke-linecap="round" fill="none">`
      + `<path d="M${cx - r * 0.82} ${cy - r * 0.12} a ${r * 0.32} ${r * 0.32} 0 0 0 0 ${r * 0.44}"/>`
      + `<path d="M${cx + r * 0.82} ${cy - r * 0.12} a ${r * 0.32} ${r * 0.32} 0 0 1 0 ${r * 0.44}"/></g>`;
  } else if (kind === 'calendar') {
    inner = icon('calendar', cx, cy, r * 1.12, ink);
  }
  return { svg: `<g>${shadow}${rays}${disc}${hi}${inner}</g>`, defs };
}

// ---------- offer block (themeable) ----------
async function offerBlock(x, y, scale, theme) {
  const dollar = Math.round(128 * scale), hr = Math.round(54 * scale);
  const cap = Math.max(38, Math.round(40 * scale)), padX = Math.round(38 * scale);
  const ribbonH = cap + Math.round(22 * scale), priceRowH = dollar + Math.round(28 * scale);
  const dW = await widthOf('$10', WEIGHT.extrabold, dollar), hrW = await widthOf('/HR', WEIGHT.extrabold, hr);
  const capW = await widthOf('STARTING AT', WEIGHT.bold, cap);
  const boxW = Math.max(dW + 10 + hrW, capW) + padX * 2, boxH = ribbonH + priceRowH, rr = 22 * scale;
  const capBaseline = y + ribbonH * 0.5 + cap * 0.34, priceBaseline = y + ribbonH + priceRowH * 0.5 + dollar * 0.34;

  const cream = theme === 'cream';
  const fill = cream ? C.cream : C.deep;
  const ribbon = C.cyan;
  const priceInk = cream ? C.navyText : C.white;
  const hrInk = cream ? C.teal : C.cyan;
  const outerStroke = cream ? C.teal : C.cyan;

  return {
    width: boxW, height: boxH, dollarSize: dollar, capSize: cap,
    svg: `<rect x="${x + 10}" y="${y + 12}" width="${boxW.toFixed(0)}" height="${boxH.toFixed(0)}" rx="${rr}" fill="${C.darker}" opacity="0.55"/>
      <rect x="${x}" y="${y}" width="${boxW.toFixed(0)}" height="${boxH.toFixed(0)}" rx="${rr}" fill="${fill}"/>
      <rect x="${x}" y="${y}" width="${boxW.toFixed(0)}" height="${ribbonH.toFixed(0)}" fill="${ribbon}"/>
      <text x="${(x + boxW / 2).toFixed(1)}" y="${capBaseline.toFixed(1)}" font-family="${BE}" font-weight="700" font-size="${cap}" fill="${C.navyText}" text-anchor="middle" letter-spacing="3">STARTING AT</text>
      ${T(x + padX, priceBaseline, '$10', WEIGHT.extrabold, dollar, priceInk)}
      ${T(x + padX + dW + 10, priceBaseline, '/HR', WEIGHT.extrabold, hr, hrInk)}
      <rect x="${x + 4}" y="${y + 4}" width="${(boxW - 8).toFixed(0)}" height="${(boxH - 8).toFixed(0)}" rx="${rr - 4}" fill="none" stroke="${cream ? C.cream : C.cream}" stroke-width="4"/>
      <rect x="${x}" y="${y}" width="${boxW.toFixed(0)}" height="${boxH.toFixed(0)}" rx="${rr}" fill="none" stroke="${outerStroke}" stroke-width="8"/>`,
  };
}

// ---------- CTA (themeable) ----------
async function ctaPro(x, y, label, style) {
  const size = 50, padX = 52, h = 116;
  const tw = await widthOf(label, WEIGHT.extrabold, size), w = tw + padX * 2 + 64;
  const cy = y + h / 2, ax = x + w - padX;
  let bg, fg, base;
  if (style === 'solid') { bg = C.cyan; fg = C.navyText; base = C.deeper; }
  else if (style === 'light') { bg = C.white; fg = C.deep; base = C.deeper; }
  else { bg = C.navyText; fg = C.cyan; base = C.darker; } // navy
  const border = style === 'navy' ? C.cyan : C.cream;
  return {
    width: w, height: h, size,
    svg: `<rect x="${x}" y="${(y + 14).toFixed(1)}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="${base}"/>
      <rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="${bg}"/>
      <rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="none" stroke="${border}" stroke-width="5"/>
      ${T(x + padX, cy + size * 0.34, label, WEIGHT.extrabold, size, fg)}
      <path d="M${ax - 28} ${cy} h32 M${ax} ${cy - 14} l16 14 l-16 14" fill="none" stroke="${fg}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
}

// ---------- top callouts ----------
// Shrink font so the rendered line (text + `pad` of decoration) never exceeds maxW.
async function fitLine(text, weight, maxW, startSize = 38, minSize = 24, pad = 0) {
  let size = startSize;
  while (size > minSize && (await widthOf(text, weight, size)) + pad > maxW) size -= 1;
  return size;
}

async function callout(style, x, y, text, colW, topSafeW) {
  // topSafeW = horizontal room before the top-right icon badge (never overlap it).
  const maxW = Math.min(colW, topSafeW);
  if (style === 'banner') {
    const size = await fitLine(text, WEIGHT.bold, maxW, 38, 24, 56);
    const w = (await widthOf(text, WEIGHT.bold, size)) + 56;
    const h = size + 26;
    return { bottom: y + h, svg: `<rect x="${x + 6}" y="${y + 7}" width="${w.toFixed(0)}" height="${h}" rx="10" fill="${C.darker}" opacity="0.5"/>
      <rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="10" fill="${C.cyan}"/>
      ${T(x + 28, y + h / 2 + size * 0.34, text, WEIGHT.bold, size, C.navyText, ' letter-spacing="1"')}` };
  }
  if (style === 'pill') {
    let size = await fitLine(text, WEIGHT.bold, maxW, 38, 24, 60);
    let h = size + 26;
    // refine for the rounded-cap contribution (h/2) so nothing clips
    size = await fitLine(text, WEIGHT.bold, maxW - h / 2, size, 24, 60);
    h = size + 26;
    const w = (await widthOf(text, WEIGHT.bold, size)) + 44 + h / 2 + 16;
    return { bottom: y + h, svg: `<rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="none" stroke="${C.cyan}" stroke-width="4"/>
      <circle cx="${x + 26}" cy="${y + h / 2}" r="7" fill="${C.cyan}"/>
      ${T(x + 44, y + h / 2 + size * 0.34, text, WEIGHT.bold, size, C.cyan, ' letter-spacing="1"')}` };
  }
  if (style === 'kicker') {
    const size = await fitLine(text, WEIGHT.bold, maxW, 38, 24, 0);
    const w = await widthOf(text, WEIGHT.bold, size);
    return { bottom: y + size + 22, svg: `${T(x, y + size * 0.82, text, WEIGHT.bold, size, C.cyan, ' letter-spacing="2"')}
      <rect x="${x}" y="${(y + size + 6).toFixed(1)}" width="${w.toFixed(1)}" height="6" rx="3" fill="${C.cyan}"/>` };
  }
  if (style === 'ribbon') {
    const size = await fitLine(text, WEIGHT.bold, maxW, 38, 24, 78); // tail + rotation slack
    const w = (await widthOf(text, WEIGHT.bold, size)) + 60;
    const h = size + 24, cx = x + w / 2, cy = y + h / 2;
    return { bottom: y + h + 8, svg: `<g transform="rotate(-4 ${cx.toFixed(1)} ${cy.toFixed(1)})">
      <path d="M${x} ${y} h${w} l-18 ${h / 2} l18 ${h / 2} h-${w} Z" fill="${C.darker}" opacity="0.5" transform="translate(6,7)"/>
      <path d="M${x} ${y} h${w} l-18 ${h / 2} l18 ${h / 2} h-${w} Z" fill="${C.cyan}"/>
      ${T(x + 24, cy + size * 0.34, text, WEIGHT.bold, size, C.navyText, ' letter-spacing="1"')}</g>` };
  }
  // directive: audience tag (fit to top-safe width) + big two-line HIRE directive (left column only)
  const aSize = await fitLine(text, WEIGHT.bold, maxW, 38, 24, 0);
  const dSize = 54;
  const dLines = await wrapToWidth(DIRECTIVE, WEIGHT.extrabold, dSize, colW);
  let svg = T(x, y + aSize * 0.82, text, WEIGHT.bold, aSize, C.cyan, ' letter-spacing="1"');
  let yy = y + aSize + 16;
  dLines.forEach((ln) => { svg += dimBaseLine(x, yy + dSize * 0.82, ln, dSize); yy += dSize * 1.02; });
  return { bottom: yy + 6, svg, isDirective: true };
}

function scrimDefs() {
  return `<linearGradient id="lscrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.darker}" stop-opacity="0.96"/><stop offset="0.34" stop-color="${C.dark}" stop-opacity="0.8"/>
      <stop offset="0.62" stop-color="${C.dark}" stop-opacity="0.14"/><stop offset="0.82" stop-color="${C.dark}" stop-opacity="0"/></linearGradient>
    <linearGradient id="bscrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0.54" stop-color="${C.darker}" stop-opacity="0"/><stop offset="1" stop-color="${C.darker}" stop-opacity="0.72"/></linearGradient>
    <linearGradient id="tscrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.darker}" stop-opacity="0.66"/><stop offset="0.24" stop-color="${C.darker}" stop-opacity="0"/></linearGradient>`;
}

async function buildAd(concept, variantKey) {
  const v = concept[variantKey];
  const x = 64, colW = 600;
  const uid = `${concept.id}-${variantKey}`;
  const report = { fontFamily: BE, fallback: false, variant: variantKey, style: v.style, focal: v.focal, audience: v.audience, icon: concept.iconKind, iconAccent: concept.iconAccent, offerTheme: v.offer };

  const logo = logoMarkup(C.white, x, 48, 0.30);
  const ICON_CX = 958, ICON_R = 88, ICON_RAYS = 22;
  const badge = iconBadge(concept.iconKind, concept.iconAccent, ICON_CX, ICON_R + 64, ICON_R, uid);
  // top row must clear the icon badge (incl. burst rays) with a 24px margin
  const topSafeW = (ICON_CX - ICON_R - ICON_RAYS - 24) - x;

  const co = await callout(v.style, x, 120, v.audience, colW, topSafeW);
  let y = co.bottom + 20;
  let directiveSvg = '';
  if (!co.isDirective) {
    const dSize = 44;
    const dLines = await wrapToWidth(concept.directive, WEIGHT.bold, dSize, colW);
    dLines.forEach((ln, i) => { directiveSvg += T(x, y + dSize * 0.82 + i * dSize * 1.04, ln, WEIGHT.bold, dSize, C.cyan); });
    y += dLines.length * dSize * 1.04 + 22;
  }

  const headSize = await fitStack(concept.headline, colW, 118, 82, WEIGHT.extrabold);
  const head = await headlineStack(concept.headline, x, y, headSize, 1.04, v.focal);
  const headBottom = y + head.height;

  const offer = await offerBlock(x + 4, headBottom + 40, 0.92, v.offer);
  const cta = await ctaPro(x, H - 64 - 116, v.cta, v.ctaStyle);

  Object.assign(report, {
    headlineSize: headSize, priceDollarSize: offer.dollarSize, ctaSize: cta.size,
    directive: co.isDirective ? DIRECTIVE : concept.directive, cta: v.cta,
    copy: { headline: concept.headline.map((l) => l.t).join(' ') },
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${scrimDefs()}${badge.defs}</defs>
  <rect width="${W}" height="${H}" fill="url(#tscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#lscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#bscrim)"/>
  ${logo}
  ${badge.svg}
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
  const report = { generatedAt: new Date().toISOString(), ratio: '4x5', apiCalls: 0, fontFamily: BE, note: 'launch polish: sharpen+contrast base, popping colored icons, Mexican flag on 33, new 37 icon, V+W variants', concepts: [] };

  for (const c of CONCEPTS) {
    const platePath = path.join(PLATE_DIR, c.id, selection[c.id]);
    if (!fs.existsSync(platePath)) throw new Error(`Missing approved plate: ${platePath}`);
    // sharpen + contrast/saturation to kill softness and add pop
    const base = await sharp(fs.readFileSync(platePath))
      .resize(W, H, { fit: 'cover', position: 'centre' })
      .modulate({ saturation: 1.12, brightness: 1.02 })
      .linear(1.10, -10)
      .sharpen({ sigma: 1.1 })
      .toBuffer();

    const entry = { id: c.id, plate: selection[c.id], treatments: {} };
    for (const variantKey of ['V', 'W']) {
      const { svg, report: r } = await buildAd(c, variantKey);
      const overlay = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
      const png = await sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
      const out = path.join(OUT_DIR, `${c.stem}_4x5_${variantKey}.png`);
      fs.writeFileSync(out, png);
      fs.writeFileSync(path.join(SRC_DIR, `${c.stem}_4x5_${variantKey}.svg`), svg);
      const meta = await sharp(png).metadata();
      const pink = await pinkCount(png);
      entry.treatments[variantKey] = { file: path.basename(out), dimensions: `${meta.width}x${meta.height}`, bytes: png.length, pinkPixels: pink, ...r };
      console.log(`${c.id} ${variantKey} [${r.style}/${r.focal}] icon=${c.iconKind}(${c.iconAccent}) -> ${path.basename(out)} (${meta.width}x${meta.height}, head ${r.headlineSize}px, pink ${pink})`);
    }
    report.concepts.push(entry);
  }
  fs.writeFileSync(path.join(OUT_DIR, 'wave1-launch-report.json'), JSON.stringify(report, null, 2));
  console.log('\nReport: public/exports/wave1-first-launch/treatments/wave1-launch-report.json');
}
main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
