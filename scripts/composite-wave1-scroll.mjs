/**
 * Wave 1 SCROLL-STOPPER compositor — Treatments E & F (4:5 only).
 *
 * Builds on the approved Treatment C hierarchy and pushes it into bold, dimensional
 * direct-response styling using layered SVG (no blur/neon/chrome/CSS filters):
 *   - Dimensional headline: dark-teal extrusion + dark stroke + white fill
 *   - Exploding focal word: tilted teal slab + cyan fill + cream outline + swash
 *   - One concept-specific stopping icon as a dimensional top-right badge
 *   - Promo $10/HR block: STARTING AT ribbon, double border, offset shadow, tilt, sparkles
 *   - Physical CTA button: extrusion base, cream border, inner highlight, arrow
 *   - Controlled motion cues: sparkles by the offer, chevrons toward the CTA
 *
 *   Treatment E — evolves C (offer-first, no bullets)
 *   Treatment F — evolves D (adds two large benefit blocks)
 *
 * Real Be Vietnam ExtraBold via font-family="Be Vietnam" + font-weight="800".
 * NO OpenAI / image-generation calls. Approved plates used untouched.
 *
 * Run: node scripts/composite-wave1-scroll.mjs
 * Out: public/exports/wave1-first-launch/treatments/<STEM>_4x5_E.png (+ _F)
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

const W = 1080;
const H = 1350;

const C = {
  cyan: '#00B2E2',
  cyanLt: '#5CD4F2',
  teal: '#077999',
  deep: '#0D546B',
  deeper: '#0A3D4E',
  dark: '#052A38',
  darker: '#03161D',
  navy: '#052733',
  white: '#FFFFFF',
  cream: '#FBF7EE',
  soft: '#DFF6FD',
  navyText: '#06333F',
  extrude: '#0A3A4A',
  stroke: '#03202A',
};

const CONCEPTS = [
  {
    id: 'VMA-33',
    stem: 'MV_VMA_33_SpanishNeverLost',
    headline: [{ t: 'STOP LOSING' }, { t: 'SPANISH', accent: true }, { t: 'PATIENTS' }],
    solution: 'HIRE A BILINGUAL VIRTUAL MEDICAL ASSISTANT',
    benefits: ['BILINGUAL SUPPORT', 'FULL-TIME STAFF'],
    icon: 'enes',
  },
  {
    id: 'VMA-34',
    stem: 'MV_VMA_34_BilingualFrontDesk',
    headline: [{ t: 'SPEAK YOUR' }, { t: "PATIENTS\u2019" }, { t: 'LANGUAGE', accent: true }],
    solution: 'HIRE A BILINGUAL VIRTUAL MEDICAL ASSISTANT',
    benefits: ['ENGLISH & SPANISH', 'DEDICATED STAFF'],
    icon: 'enes',
  },
  {
    id: 'VMA-37',
    stem: 'MV_VMA_37_TrainedWorkflow',
    headline: [{ t: 'TRAINED FOR' }, { t: 'YOUR' }, { t: 'WORKFLOW', accent: true }],
    solution: 'HIRE A VIRTUAL MEDICAL ASSISTANT',
    benefits: ['TRAINED ON YOUR EMR', 'FULL-TIME STAFF'],
    icon: 'workflow',
  },
  {
    id: 'VMA-41',
    stem: 'MV_VMA_41_FrontDeskCapacity',
    headline: [{ t: 'YOUR FRONT' }, { t: 'DESK IS' }, { t: 'MAXED OUT', accent: true }],
    solution: 'HIRE A VIRTUAL MEDICAL ASSISTANT',
    benefits: ['FULL-TIME STAFF', 'DEDICATED SUPPORT'],
    icon: 'bell',
  },
  {
    id: 'VMA-43',
    stem: 'MV_VMA_43_ScheduleMoving',
    headline: [{ t: 'KEEP YOUR' }, { t: 'SCHEDULE' }, { t: 'MOVING', accent: true }],
    solution: 'HIRE A VIRTUAL MEDICAL ASSISTANT',
    benefits: ['FULL-TIME STAFF', 'TRAINED FOR YOUR SYSTEMS'],
    icon: 'calendar',
  },
];

// ---------- measurement (render + trim; no metric guessing) ----------
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
  } catch {
    ratio = text.length * 0.6;
  }
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
  const lines = [];
  let cur = '';
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
  for (let i = ex; i >= 1; i--) {
    svg += `<text x="${x + i}" y="${(y + i).toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${C.extrude}">${esc(text)}</text>`;
  }
  svg += `<text x="${x}" y="${y.toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${C.white}" stroke="${C.stroke}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke">${esc(text)}</text>`;
  return svg;
}

async function focalWordGroup(x, y, text, size) {
  const w = await widthOf(text, WEIGHT.extrabold, size);
  const padX = Math.round(size * 0.16);
  const slabX = x - padX * 0.4;
  const slabTop = y - size * 0.82;
  const slabH = size * 1.02;
  const slabW = w + padX * 1.4;
  const cx = slabX + slabW / 2;
  const cy = slabTop + slabH / 2;
  const ex = Math.max(8, Math.round(size * 0.1));
  const sw = Math.max(5, Math.round(size * 0.06));
  const r = Math.round(size * 0.12);
  let ext = '';
  for (let i = ex; i >= 1; i--) {
    ext += `<text x="${x + i}" y="${(y + i).toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${C.deeper}">${esc(text)}</text>`;
  }
  const underlineY = slabTop + slabH + size * 0.06;
  return `<g transform="rotate(-2.2 ${cx.toFixed(1)} ${cy.toFixed(1)})">
    <rect x="${(slabX + 8).toFixed(1)}" y="${(slabTop + 10).toFixed(1)}" width="${slabW.toFixed(1)}" height="${slabH.toFixed(1)}" rx="${r}" fill="${C.darker}" opacity="0.55"/>
    <rect x="${slabX.toFixed(1)}" y="${slabTop.toFixed(1)}" width="${slabW.toFixed(1)}" height="${slabH.toFixed(1)}" rx="${r}" fill="${C.deep}" stroke="${C.cyan}" stroke-width="4"/>
    ${ext}
    <text x="${x}" y="${y.toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${C.cyan}" stroke="${C.cream}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke">${esc(text)}</text>
    <rect x="${x.toFixed(1)}" y="${underlineY.toFixed(1)}" width="${Math.min(w, slabW - padX).toFixed(1)}" height="${Math.max(8, size * 0.09).toFixed(0)}" rx="5" fill="${C.cyan}"/>
  </g>`;
}

async function headlineStack(lines, x, topY, size, lh) {
  const step = size * lh;
  let svg = '';
  for (let i = 0; i < lines.length; i++) {
    const y = topY + size * 0.82 + i * step;
    if (lines[i].accent) svg += await focalWordGroup(x, y, lines[i].t, size);
    else svg += dimBaseLine(x, y, lines[i].t, size);
  }
  return { svg, height: lines.length * step };
}

// ---------- concept stopping icon (dimensional top-right badge) ----------
function star(cx, cy, r, fill) {
  const p = [];
  for (let i = 0; i < 8; i++) {
    const ang = (Math.PI / 4) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.42;
    p.push(`${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`);
  }
  return `<polygon points="${p.join(' ')}" fill="${fill}"/>`;
}

function iconBadge(kind, cx, cy, r) {
  const shadow = `<circle cx="${cx + 8}" cy="${cy + 10}" r="${r}" fill="${C.darker}" opacity="0.5"/>`;
  const disc = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.cyan}"/><circle cx="${cx}" cy="${cy}" r="${r - 7}" fill="none" stroke="${C.cream}" stroke-width="7"/>`;
  const hi = `<path d="M${cx - r * 0.55} ${cy - r * 0.5} A ${r * 0.72} ${r * 0.72} 0 0 1 ${cx + r * 0.35} ${cy - r * 0.72}" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.5"/>`;
  let inner = '';
  const nk = C.navyText;
  if (kind === 'enes') {
    inner = `
      <g>
        <rect x="${cx - r * 0.62}" y="${cy - r * 0.55}" width="${r * 0.95}" height="${r * 0.72}" rx="10" fill="${C.white}"/>
        <path d="M${cx - r * 0.42} ${cy + r * 0.15} l0 ${r * 0.28} l${r * 0.26} -${r * 0.28} Z" fill="${C.white}"/>
        <text x="${cx - r * 0.15}" y="${cy - r * 0.12}" font-family="${BE}" font-weight="800" font-size="${r * 0.42}" fill="${nk}" text-anchor="middle">EN</text>
        <rect x="${cx - r * 0.12}" y="${cy - r * 0.02}" width="${r * 0.78}" height="${r * 0.66}" rx="10" fill="${C.deep}"/>
        <text x="${cx + r * 0.27}" y="${cy + r * 0.46}" font-family="${BE}" font-weight="800" font-size="${r * 0.42}" fill="${C.white}" text-anchor="middle">ES</text>
      </g>`;
  } else if (kind === 'workflow') {
    inner = `
      <g fill="none" stroke="${nk}" stroke-width="${r * 0.11}" stroke-linecap="round" stroke-linejoin="round">
        <path d="M${cx - r * 0.5} ${cy - r * 0.35} h${r * 0.55} a${r * 0.28} ${r * 0.28} 0 0 1 ${r * 0.28} ${r * 0.28} v${r * 0.2}"/>
        <path d="M${cx + r * 0.26} ${cy + r * 0.02} l${r * 0.12} ${r * 0.16} l${r * 0.16} -${r * 0.16}" />
        <path d="M${cx - r * 0.5} ${cy + r * 0.42} l${r * 0.18} ${r * 0.18} l${r * 0.4} -${r * 0.46}"/>
      </g>`;
  } else if (kind === 'bell') {
    inner = icon('bell', cx, cy, r * 1.15, nk)
      + `<g stroke="${nk}" stroke-width="${r * 0.09}" stroke-linecap="round">
           <path d="M${cx - r * 0.78} ${cy - r * 0.1} a ${r * 0.3} ${r * 0.3} 0 0 0 0 ${r * 0.4}" fill="none"/>
           <path d="M${cx + r * 0.78} ${cy - r * 0.1} a ${r * 0.3} ${r * 0.3} 0 0 1 0 ${r * 0.4}" fill="none"/>
         </g>`;
  } else if (kind === 'calendar') {
    inner = icon('calendar', cx, cy, r * 1.1, nk);
  }
  return `<g>${shadow}${disc}${hi}${inner}</g>`;
}

// ---------- promo $10/HR block ----------
async function offerPro(cx, topY, scale) {
  const dollar = Math.round(132 * scale);
  const hr = Math.round(56 * scale);
  const cap = Math.max(38, Math.round(40 * scale));
  const padX = Math.round(40 * scale);
  const ribbonH = cap + Math.round(24 * scale);
  const priceRowH = dollar + Math.round(30 * scale);
  const dW = await widthOf('$10', WEIGHT.extrabold, dollar);
  const hrW = await widthOf('/HR', WEIGHT.extrabold, hr);
  const capW = await widthOf('STARTING AT', WEIGHT.bold, cap);
  const innerW = Math.max(dW + 10 + hrW, capW);
  const boxW = innerW + padX * 2;
  const boxH = ribbonH + priceRowH;
  const x = cx;
  const y = topY;
  const cxr = x + boxW / 2;
  const cyr = y + boxH / 2;
  const rr = 22 * scale;
  const capBaseline = y + ribbonH * 0.5 + cap * 0.34;
  const priceBaseline = y + ribbonH + priceRowH * 0.5 + dollar * 0.34;

  const sparkles =
    star(x - 14 * scale, y + 12 * scale, 16 * scale, C.cyan) +
    star(x + boxW + 12 * scale, y + ribbonH, 13 * scale, C.cream) +
    star(x + boxW - 6 * scale, y + boxH + 8 * scale, 15 * scale, C.cyan);

  return {
    width: boxW,
    height: boxH,
    dollarSize: dollar,
    capSize: cap,
    svg: `<g transform="rotate(-3 ${cxr.toFixed(1)} ${cyr.toFixed(1)})">
      ${sparkles}
      <rect x="${(x + 12).toFixed(1)}" y="${(y + 14).toFixed(1)}" width="${boxW.toFixed(0)}" height="${boxH.toFixed(0)}" rx="${rr}" fill="${C.darker}" opacity="0.55"/>
      <rect x="${x}" y="${y}" width="${boxW.toFixed(0)}" height="${boxH.toFixed(0)}" rx="${rr}" fill="${C.deep}"/>
      <rect x="${x}" y="${y}" width="${boxW.toFixed(0)}" height="${ribbonH.toFixed(0)}" fill="${C.cyan}"/>
      <text x="${cxr.toFixed(1)}" y="${capBaseline.toFixed(1)}" font-family="${BE}" font-weight="700" font-size="${cap}" fill="${C.navyText}" text-anchor="middle" letter-spacing="3">STARTING AT</text>
      <text x="${(x + padX).toFixed(1)}" y="${priceBaseline.toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${dollar}" fill="${C.white}">$10</text>
      <text x="${(x + padX + dW + 10).toFixed(1)}" y="${priceBaseline.toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${hr}" fill="${C.cyan}">/HR</text>
      <rect x="${(x + 4).toFixed(1)}" y="${(y + 4).toFixed(1)}" width="${(boxW - 8).toFixed(0)}" height="${(boxH - 8).toFixed(0)}" rx="${rr - 4}" fill="none" stroke="${C.cream}" stroke-width="4"/>
      <rect x="${x}" y="${y}" width="${boxW.toFixed(0)}" height="${boxH.toFixed(0)}" rx="${rr}" fill="none" stroke="${C.cyan}" stroke-width="8"/>
    </g>`,
  };
}

// ---------- physical CTA button ----------
async function ctaPro(x, y, label) {
  const size = 52;
  const padX = 54;
  const h = 118;
  const tw = await widthOf(label, WEIGHT.extrabold, size);
  const w = tw + padX * 2 + 66;
  const cy = y + h / 2;
  const ax = x + w - padX;
  return {
    width: w,
    height: h,
    size,
    svg: `
      <rect x="${x}" y="${(y + 14).toFixed(1)}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="${C.deeper}"/>
      <rect x="${(x - 4).toFixed(1)}" y="${(y + 22).toFixed(1)}" width="${(w + 8).toFixed(0)}" height="${h}" rx="${h / 2}" fill="${C.darker}" opacity="0.4"/>
      <rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="${C.cyan}"/>
      <rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="none" stroke="${C.cream}" stroke-width="5"/>
      <path d="M${x + 26} ${y + 20} q${w / 2 - 26} -14 ${w - 52} 0" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
      ${T(x + padX, cy + size * 0.34, label, WEIGHT.extrabold, size, C.navyText)}
      <path d="M${ax - 30} ${cy} h34 M${ax} ${cy - 15} l17 15 l-17 15" fill="none" stroke="${C.navyText}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  };
}

function chevronsToCta(cx, y) {
  let s = '';
  for (let i = 0; i < 3; i++) {
    const yy = y + i * 20;
    const op = 0.4 + i * 0.2;
    s += `<path d="M${cx - 20} ${yy} l20 18 l20 -18" fill="none" stroke="${C.cyan}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`;
  }
  return s;
}

function benefitRow(x, y, label, size) {
  return `
    <rect x="${x - 3}" y="${(y - size * 0.78 - 3).toFixed(1)}" width="${size * 1.15}" height="${size * 1.15}" rx="8" fill="${C.darker}" opacity="0.5"/>
    <rect x="${x}" y="${(y - size * 0.78).toFixed(1)}" width="${size * 1.05}" height="${size * 1.05}" rx="8" fill="${C.cyan}"/>
    <path d="M${x + size * 0.24} ${y - size * 0.2} l${size * 0.2} ${size * 0.2} l${size * 0.4} -${size * 0.5}" fill="none" stroke="${C.navyText}" stroke-width="${size * 0.12}" stroke-linecap="round" stroke-linejoin="round"/>
    ${T(x + size * 1.05 + 22, y, label, WEIGHT.bold, size, C.cream)}
  `;
}

function scrimDefs() {
  return `
    <linearGradient id="lscrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.darker}" stop-opacity="0.94"/>
      <stop offset="0.34" stop-color="${C.dark}" stop-opacity="0.74"/>
      <stop offset="0.62" stop-color="${C.dark}" stop-opacity="0.12"/>
      <stop offset="0.82" stop-color="${C.dark}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bscrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.56" stop-color="${C.darker}" stop-opacity="0"/>
      <stop offset="1" stop-color="${C.darker}" stop-opacity="0.66"/>
    </linearGradient>
    <linearGradient id="tscrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.darker}" stop-opacity="0.6"/>
      <stop offset="0.24" stop-color="${C.darker}" stop-opacity="0"/>
    </linearGradient>`;
}

async function buildE(concept) {
  const x = 64;
  const colW = 600;
  const report = { fontFamily: BE, fontWeightHeadline: WEIGHT.extrabold, fallback: false, effects: ['3d-extrusion', 'focal-slab', 'icon-badge', 'promo-offer', 'physical-cta', 'sparkles', 'chevrons'] };

  const logo = logoMarkup(C.white, x, 56, 0.32);
  const badge = iconBadge(concept.icon, 958, 152, 84);

  const solSize = 46;
  const solLines = await wrapToWidth(concept.solution, WEIGHT.bold, solSize, colW);
  let sy = 168;
  let solSvg = '';
  solLines.forEach((ln, i) => { solSvg += T(x, sy + solSize * 0.82 + i * solSize * 1.06, ln, WEIGHT.bold, solSize, C.cyan); });
  const solBottom = sy + solLines.length * solSize * 1.06;

  const headSize = await fitStack(concept.headline, colW, 132, 86, WEIGHT.extrabold);
  const headTop = solBottom + 30;
  const head = await headlineStack(concept.headline, x, headTop, headSize, 1.02);
  const headBottom = headTop + head.height;

  const offer = await offerPro(x + 6, headBottom + 40, 1.0);
  const cta = await ctaPro(x, H - 66 - 118, 'REQUEST AN INTERVIEW');
  const cue = chevronsToCta(x + 40, H - 66 - 118 - 74);

  Object.assign(report, {
    solutionSize: solSize, headlineSize: headSize, priceDollarSize: offer.dollarSize,
    offerCapSize: offer.capSize, ctaSize: cta.size, offer: 'STARTING AT $10/HR',
    cta: 'REQUEST AN INTERVIEW', icon: concept.icon,
    copy: { headline: concept.headline.map((l) => l.t).join(' '), solution: concept.solution },
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${scrimDefs()}</defs>
  <rect width="${W}" height="${H}" fill="url(#tscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#lscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#bscrim)"/>
  ${logo}
  ${badge}
  ${solSvg}
  ${head.svg}
  ${offer.svg}
  ${cue}
  ${cta.svg}
</svg>`;
  return { svg, report };
}

async function buildF(concept) {
  const x = 64;
  const colW = 600;
  const report = { fontFamily: BE, fontWeightHeadline: WEIGHT.extrabold, fallback: false, effects: ['3d-extrusion', 'focal-slab', 'icon-badge', 'promo-offer', 'physical-cta', 'benefit-chips'] };

  const logo = logoMarkup(C.white, x, 56, 0.32);
  const badge = iconBadge(concept.icon, 958, 152, 84);

  const headSize = await fitStack(concept.headline, colW, 120, 82, WEIGHT.extrabold);
  const headTop = 150;
  const head = await headlineStack(concept.headline, x, headTop, headSize, 1.02);
  const headBottom = headTop + head.height;

  const solSize = 44;
  const solLines = await wrapToWidth(concept.solution, WEIGHT.bold, solSize, colW);
  const solTop = headBottom + 30;
  let solSvg = '';
  solLines.forEach((ln, i) => { solSvg += T(x, solTop + solSize * 0.82 + i * solSize * 1.06, ln, WEIGHT.bold, solSize, C.cyan); });
  const solBottom = solTop + solLines.length * solSize * 1.06;

  const benSize = 42;
  let benSvg = '';
  const by = solBottom + 42;
  concept.benefits.slice(0, 2).forEach((b, i) => { benSvg += benefitRow(x, by + i * (benSize + 30) + benSize * 0.8, b, benSize); });
  const benBottom = by + 2 * (benSize + 30);

  const offer = await offerPro(x + 6, benBottom + 16, 0.8);
  const cta = await ctaPro(x, H - 66 - 118, 'MEET YOUR NEXT HIRE');

  Object.assign(report, {
    headlineSize: headSize, solutionSize: solSize, benefitSize: benSize,
    priceDollarSize: offer.dollarSize, offerCapSize: offer.capSize, ctaSize: cta.size,
    offer: 'STARTING AT $10/HR', cta: 'MEET YOUR NEXT HIRE', icon: concept.icon,
    copy: { headline: concept.headline.map((l) => l.t).join(' '), solution: concept.solution, benefits: concept.benefits },
  });

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${scrimDefs()}</defs>
  <rect width="${W}" height="${H}" fill="url(#tscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#lscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#bscrim)"/>
  ${logo}
  ${badge}
  ${head.svg}
  ${solSvg}
  ${benSvg}
  ${offer.svg}
  ${cta.svg}
</svg>`;
  return { svg, report };
}

function isPink(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max - min < 25) return false;
  let h;
  if (max === r) h = ((g - b) / (max - min)) % 6;
  else if (max === g) h = (b - r) / (max - min) + 2;
  else h = (r - g) / (max - min) + 4;
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
  const report = { generatedAt: new Date().toISOString(), ratio: '4x5', apiCalls: 0, fontFamily: BE, basedOn: 'Treatment C', concepts: [] };

  for (const c of CONCEPTS) {
    const platePath = path.join(PLATE_DIR, c.id, selection[c.id]);
    if (!fs.existsSync(platePath)) throw new Error(`Missing approved plate: ${platePath}`);
    const base = await sharp(fs.readFileSync(platePath)).resize(W, H, { fit: 'cover', position: 'centre' }).toBuffer();
    const entry = { id: c.id, plate: selection[c.id], treatments: {} };
    for (const [t, builder] of [['E', buildE], ['F', buildF]]) {
      const { svg, report: r } = await builder(c);
      const overlay = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
      const png = await sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
      const out = path.join(OUT_DIR, `${c.stem}_4x5_${t}.png`);
      fs.writeFileSync(out, png);
      fs.writeFileSync(path.join(SRC_DIR, `${c.stem}_4x5_${t}.svg`), svg);
      const meta = await sharp(png).metadata();
      const pink = await pinkCount(png);
      entry.treatments[t] = { file: path.basename(out), dimensions: `${meta.width}x${meta.height}`, bytes: png.length, pinkPixels: pink, ...r };
      console.log(`${c.id} ${t} -> ${path.basename(out)} (${meta.width}x${meta.height}, head ${r.headlineSize}px, $10 ${r.priceDollarSize}px, icon ${r.icon}, pink ${pink})`);
    }
    report.concepts.push(entry);
  }
  fs.writeFileSync(path.join(OUT_DIR, 'wave1-scroll-report.json'), JSON.stringify(report, null, 2));
  console.log('\nReport: public/exports/wave1-first-launch/treatments/wave1-scroll-report.json');
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
