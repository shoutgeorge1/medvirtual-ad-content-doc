/**
 * Wave 1 direct-response compositor — Treatments C & D (4:5 only).
 *
 * Fixes the font bug found in scripts/audit-fonts.mjs: text is now rendered with
 * font-family="Be Vietnam" + numeric font-weight (800 = ExtraBold), NOT the
 * non-existent family "Be Vietnam ExtraBold" that silently fell back to Regular.
 *
 * Real rendered-width measurement (resvg render + sharp trim) drives auto-fit so
 * huge headlines never clip. NO OpenAI / image-generation calls. Approved plates
 * from plates/4x5/selection.json are used untouched.
 *
 *   Treatment C — Maximum Direct Response (solution kicker + huge headline +
 *                 big bordered $10/HR block + oversized CTA; no bullets/footer)
 *   Treatment D — DR With Two Benefits    (huge headline + HIRE solution line +
 *                 $10/HR block + two large benefit blocks + oversized CTA)
 *
 * Run: node scripts/composite-wave1-cd.mjs
 * Out: public/exports/wave1-first-launch/treatments/<STEM>_4x5_C.png (+ _D)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES, BE, WEIGHT, esc, logoMarkup } from './wave1-render-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PLATE_DIR = path.join(ROOT, 'public/exports/wave1-first-launch/plates/4x5');
const OUT_DIR = path.join(ROOT, 'public/exports/wave1-first-launch/treatments');
const SRC_DIR = path.join(OUT_DIR, 'sources');

const W = 1080;
const H = 1350;

const C = {
  cyan: '#00B2E2',
  teal: '#077999',
  deep: '#0D546B',
  dark: '#052A38',
  darker: '#03161D',
  white: '#FFFFFF',
  cream: '#FBF7EE',
  soft: '#DFF6FD',
  navyText: '#06333F',
};

const OFFER_CAP = 'STARTING AT';

const CONCEPTS = [
  {
    id: 'VMA-33',
    stem: 'MV_VMA_33_SpanishNeverLost',
    headline: [{ t: 'STOP LOSING' }, { t: 'SPANISH', accent: true }, { t: 'PATIENTS' }],
    solution: 'HIRE A BILINGUAL VIRTUAL MEDICAL ASSISTANT',
    benefits: ['BILINGUAL SUPPORT', 'FULL-TIME STAFF'],
  },
  {
    id: 'VMA-34',
    stem: 'MV_VMA_34_BilingualFrontDesk',
    headline: [{ t: 'SPEAK YOUR' }, { t: "PATIENTS\u2019" }, { t: 'LANGUAGE', accent: true }],
    solution: 'HIRE A BILINGUAL VIRTUAL MEDICAL ASSISTANT',
    benefits: ['ENGLISH & SPANISH', 'DEDICATED STAFF'],
  },
  {
    id: 'VMA-37',
    stem: 'MV_VMA_37_TrainedWorkflow',
    headline: [{ t: 'TRAINED FOR' }, { t: 'YOUR' }, { t: 'WORKFLOW', accent: true }],
    solution: 'HIRE A VIRTUAL MEDICAL ASSISTANT',
    benefits: ['TRAINED ON YOUR EMR', 'FULL-TIME STAFF'],
  },
  {
    id: 'VMA-41',
    stem: 'MV_VMA_41_FrontDeskCapacity',
    headline: [{ t: 'YOUR FRONT' }, { t: 'DESK IS' }, { t: 'MAXED OUT', accent: true }],
    solution: 'HIRE A VIRTUAL MEDICAL ASSISTANT',
    benefits: ['FULL-TIME STAFF', 'DEDICATED SUPPORT'],
  },
  {
    id: 'VMA-43',
    stem: 'MV_VMA_43_ScheduleMoving',
    headline: [{ t: 'KEEP YOUR' }, { t: 'SCHEDULE' }, { t: 'MOVING', accent: true }],
    solution: 'HIRE A VIRTUAL MEDICAL ASSISTANT',
    benefits: ['FULL-TIME STAFF', 'TRAINED FOR YOUR SYSTEMS'],
  },
];

// ---- real rendered-width measurement (no font-metric guessing) ----
const ratioCache = new Map();
function textOnlyPng(text, weight, size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8000" height="${Math.ceil(size * 1.8)}"><text x="0" y="${Math.round(size * 1.3)}" font-family="${BE}" font-weight="${weight}" font-size="${size}" fill="#ffffff">${esc(text)}</text></svg>`;
  return new Resvg(svg, {
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE },
  }).render().asPng();
}
async function emRatio(text, weight) {
  const key = `${weight}|${text}`;
  if (ratioCache.has(key)) return ratioCache.get(key);
  const S = 200;
  let ratio;
  try {
    const info = await sharp(textOnlyPng(text, weight, S)).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
    ratio = info.info.width / S;
  } catch {
    ratio = text.length * 0.6; // safe fallback (only if text trims to empty)
  }
  ratioCache.set(key, ratio);
  return ratio;
}
const widthOf = async (text, weight, size) => (await emRatio(text, weight)) * size;

async function fitStack(lines, maxWidth, maxSize, minSize, weight) {
  let size = maxSize;
  for (const ln of lines) {
    const r = await emRatio(ln.t, weight);
    size = Math.min(size, maxWidth / r);
  }
  return Math.max(minSize, Math.min(maxSize, Math.floor(size)));
}

async function wrapToWidth(text, weight, size, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const trial = cur ? `${cur} ${w}` : w;
    if ((await widthOf(trial, weight, size)) <= maxWidth || !cur) cur = trial;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function T(x, y, text, weight, size, fill, extra = '') {
  return `<text x="${x}" y="${y.toFixed(1)}" font-family="${BE}" font-weight="${weight}" font-size="${size}" fill="${fill}"${extra}>${esc(text)}</text>`;
}

async function stack(lines, x, topY, size, lh, accentColor, baseColor) {
  const step = size * lh;
  let svg = '';
  lines.forEach((ln, i) => {
    const y = topY + size * 0.82 + i * step;
    svg += T(x, y, ln.t, WEIGHT.extrabold, size, ln.accent ? accentColor : baseColor) + '\n';
  });
  return { svg, height: lines.length * step };
}

// Big bordered $10/HR offer block. Returns svg + box height.
async function offerBlock(x, y, scale) {
  const dollar = Math.round(128 * scale);
  const hr = Math.round(56 * scale);
  const cap = Math.max(38, Math.round(40 * scale)); // keep >= 38px readability floor
  const padX = Math.round(38 * scale);
  const padTop = Math.round(30 * scale);
  const gap = Math.round(14 * scale);
  const border = Math.round(9 * scale);

  const capW = await widthOf(OFFER_CAP, WEIGHT.bold, cap);
  const dW = await widthOf('$10', WEIGHT.extrabold, dollar);
  const hrW = await widthOf('/HR', WEIGHT.extrabold, hr);
  const priceW = dW + 8 + hrW;
  const innerW = Math.max(capW, priceW);
  const boxW = innerW + padX * 2;
  const boxH = padTop + cap + gap + dollar + Math.round(26 * scale);

  const capY = y + padTop + cap * 0.82;
  const priceBaseline = y + padTop + cap + gap + dollar * 0.82;

  const svg = `
    <rect x="${x + 10}" y="${y + 12}" width="${boxW.toFixed(0)}" height="${boxH.toFixed(0)}" rx="${28 * scale}" fill="${C.darker}" opacity="0.5"/>
    <rect x="${x}" y="${y}" width="${boxW.toFixed(0)}" height="${boxH.toFixed(0)}" rx="${28 * scale}" fill="${C.deep}"/>
    <rect x="${x + border / 2}" y="${y + border / 2}" width="${(boxW - border).toFixed(0)}" height="${(boxH - border).toFixed(0)}" rx="${24 * scale}" fill="none" stroke="${C.cyan}" stroke-width="${border}"/>
    ${T(x + padX, capY, OFFER_CAP, WEIGHT.bold, cap, C.soft, ' letter-spacing="3"')}
    ${T(x + padX, priceBaseline, '$10', WEIGHT.extrabold, dollar, C.white)}
    ${T(x + padX + dW + 8, priceBaseline, '/HR', WEIGHT.extrabold, hr, C.cyan)}
  `;
  return { svg, width: boxW, height: boxH, dollarSize: dollar, capSize: cap };
}

async function ctaButton(x, y, label, style) {
  const size = 52;
  const padX = 56;
  const h = 116;
  const tw = await widthOf(label, WEIGHT.extrabold, size);
  const arrowGap = 62;
  const w = tw + padX * 2 + arrowGap;
  const solid = style === 'solid';
  const bg = solid ? C.cyan : C.white;
  const fg = solid ? C.navyText : C.deep;
  const cy = y + h / 2;
  const ax = x + w - padX;
  const svg = `
    <rect x="${x + 8}" y="${y + 10}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="${C.darker}" opacity="0.45"/>
    <rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="${bg}"/>
    ${T(x + padX, cy + size * 0.34, label, WEIGHT.extrabold, size, fg)}
    <path d="M${ax - 30} ${cy} h34 M${ax} ${cy - 14} l16 14 l-16 14" fill="none" stroke="${fg}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  `;
  return { svg, width: w, height: h, size };
}

function benefitRow(x, y, label, size) {
  const barW = 12;
  const barH = size * 1.15;
  return `
    <rect x="${x}" y="${y - barH * 0.78}" width="${barW}" height="${barH.toFixed(0)}" rx="6" fill="${C.cyan}"/>
    ${T(x + barW + 22, y, label, WEIGHT.bold, size, C.cream)}
  `;
}

function eyebrowLogoRow(x, y) {
  return logoMarkup(C.white, x, y, 0.32);
}

function scrim(treatment) {
  // soft left + bottom gradient; fades out before the face (right side stays bright)
  const leftStop = treatment === 'C' ? '0.62' : '0.66';
  return `
    <linearGradient id="lscrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.darker}" stop-opacity="0.92"/>
      <stop offset="0.34" stop-color="${C.dark}" stop-opacity="0.72"/>
      <stop offset="${leftStop}" stop-color="${C.dark}" stop-opacity="0.12"/>
      <stop offset="0.82" stop-color="${C.dark}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bscrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.58" stop-color="${C.darker}" stop-opacity="0"/>
      <stop offset="1" stop-color="${C.darker}" stop-opacity="0.62"/>
    </linearGradient>
    <linearGradient id="tscrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.darker}" stop-opacity="0.55"/>
      <stop offset="0.22" stop-color="${C.darker}" stop-opacity="0"/>
    </linearGradient>`;
}

async function buildC(concept) {
  const x = 64;
  const colW = 606;
  const report = { fontFamily: BE, fontWeightHeadline: WEIGHT.extrabold, fallback: false };

  const logo = eyebrowLogoRow(x, 56);

  // solution kicker (cyan), wrapped
  const solSize = 46;
  const solLines = await wrapToWidth(concept.solution, WEIGHT.bold, solSize, colW);
  let sy = 168;
  let solSvg = '';
  solLines.forEach((ln, i) => {
    solSvg += T(x, sy + solSize * 0.82 + i * solSize * 1.06, ln, WEIGHT.bold, solSize, C.cyan) + '\n';
  });
  const solBottom = sy + solLines.length * solSize * 1.06;

  const headSize = await fitStack(concept.headline, colW, 138, 88, WEIGHT.extrabold);
  const headTop = solBottom + 26;
  const head = await stack(concept.headline, x, headTop, headSize, 0.94, C.cyan, C.white);
  const headBottom = headTop + head.height;
  const underline = `<rect x="${x}" y="${(headBottom + 8).toFixed(1)}" width="150" height="14" rx="7" fill="${C.cyan}"/>`;

  const offer = await offerBlock(x, headBottom + 54, 1.0);
  const cta = await ctaButton(x, H - 72 - 116, 'REQUEST AN INTERVIEW', 'solid');

  report.solutionSize = solSize;
  report.headlineSize = headSize;
  report.priceDollarSize = offer.dollarSize;
  report.offerCapSize = offer.capSize;
  report.ctaSize = cta.size;
  report.offer = `${OFFER_CAP} $10/HR`;
  report.cta = 'REQUEST AN INTERVIEW';
  report.copy = { headline: concept.headline.map((l) => l.t).join(' '), solution: concept.solution };

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${scrim('C')}</defs>
  <rect width="${W}" height="${H}" fill="url(#tscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#lscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#bscrim)"/>
  ${logo}
  ${solSvg}
  ${head.svg}
  ${underline}
  ${offer.svg}
  ${cta.svg}
</svg>`;
  return { svg, report };
}

async function buildD(concept) {
  const x = 64;
  const colW = 606;
  const report = { fontFamily: BE, fontWeightHeadline: WEIGHT.extrabold, fallback: false };

  const logo = eyebrowLogoRow(x, 56);

  const headSize = await fitStack(concept.headline, colW, 120, 82, WEIGHT.extrabold);
  const headTop = 150;
  const head = await stack(concept.headline, x, headTop, headSize, 0.94, C.cyan, C.white);
  const headBottom = headTop + head.height;
  const underline = `<rect x="${x}" y="${(headBottom + 6).toFixed(1)}" width="140" height="12" rx="6" fill="${C.cyan}"/>`;

  // solution line
  const solSize = 44;
  const solLines = await wrapToWidth(concept.solution, WEIGHT.bold, solSize, colW);
  const solTop = headBottom + 40;
  let solSvg = '';
  solLines.forEach((ln, i) => {
    solSvg += T(x, solTop + solSize * 0.82 + i * solSize * 1.06, ln, WEIGHT.bold, solSize, C.cyan) + '\n';
  });
  const solBottom = solTop + solLines.length * solSize * 1.06;

  // two benefit rows
  const benSize = 42;
  let benSvg = '';
  let by = solBottom + 40;
  concept.benefits.slice(0, 2).forEach((b, i) => {
    benSvg += benefitRow(x, by + i * (benSize + 26) + benSize * 0.8, b, benSize);
  });
  const benBottom = by + 2 * (benSize + 26);

  const offer = await offerBlock(x, benBottom + 18, 0.82);
  const cta = await ctaButton(x, H - 72 - 116, 'MEET YOUR NEXT HIRE', 'light');

  report.headlineSize = headSize;
  report.solutionSize = solSize;
  report.benefitSize = benSize;
  report.priceDollarSize = offer.dollarSize;
  report.offerCapSize = offer.capSize;
  report.ctaSize = cta.size;
  report.offer = `${OFFER_CAP} $10/HR`;
  report.cta = 'MEET YOUR NEXT HIRE';
  report.copy = {
    headline: concept.headline.map((l) => l.t).join(' '),
    solution: concept.solution,
    benefits: concept.benefits,
  };

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${scrim('D')}</defs>
  <rect width="${W}" height="${H}" fill="url(#tscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#lscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#bscrim)"/>
  ${logo}
  ${head.svg}
  ${underline}
  ${solSvg}
  ${benSvg}
  ${offer.svg}
  ${cta.svg}
</svg>`;
  return { svg, report };
}

function isPink(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 25) return false;
  let h;
  if (max === r) h = ((g - b) / (max - min)) % 6;
  else if (max === g) h = (b - r) / (max - min) + 2;
  else h = (r - g) / (max - min) + 4;
  h *= 60;
  if (h < 0) h += 360;
  const sat = (max - min) / max;
  return sat > 0.25 && h >= 290 && h <= 345;
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
  const report = {
    generatedAt: new Date().toISOString(),
    ratio: '4x5',
    apiCalls: 0,
    fontFamily: BE,
    fontFix: 'font-family="Be Vietnam" + numeric font-weight (800=ExtraBold); prior named-family fell back to Regular',
    concepts: [],
  };

  for (const c of CONCEPTS) {
    const plateFile = selection[c.id];
    const platePath = path.join(PLATE_DIR, c.id, plateFile);
    if (!fs.existsSync(platePath)) throw new Error(`Missing approved plate: ${platePath}`);
    const base = await sharp(fs.readFileSync(platePath)).resize(W, H, { fit: 'cover', position: 'centre' }).toBuffer();

    const entry = { id: c.id, plate: plateFile, treatments: {} };
    for (const [t, builder] of [['C', buildC], ['D', buildD]]) {
      const { svg, report: r } = await builder(c);
      const overlay = new Resvg(svg, {
        fitTo: { mode: 'width', value: W },
        font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE },
      }).render().asPng();
      const png = await sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
      const out = path.join(OUT_DIR, `${c.stem}_4x5_${t}.png`);
      fs.writeFileSync(out, png);
      fs.writeFileSync(path.join(SRC_DIR, `${c.stem}_4x5_${t}.svg`), svg);
      const meta = await sharp(png).metadata();
      const pink = await pinkCount(png);
      entry.treatments[t] = { file: path.basename(out), dimensions: `${meta.width}x${meta.height}`, bytes: png.length, pinkPixels: pink, ...r };
      console.log(`${c.id} ${t} -> ${path.basename(out)} (${meta.width}x${meta.height}, head ${r.headlineSize}px, $10 ${r.priceDollarSize}px, cta ${r.ctaSize}px, pink ${pink})`);
    }
    report.concepts.push(entry);
  }

  fs.writeFileSync(path.join(OUT_DIR, 'wave1-cd-report.json'), JSON.stringify(report, null, 2));
  console.log('\nReport: public/exports/wave1-first-launch/treatments/wave1-cd-report.json');
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
