/**
 * Wave 1 BOLD compositor — direct-response revision (4:5 only).
 *
 * Two coded treatments per approved talent plate:
 *   Treatment A — Bold Offer  (max headline + dominant $10/HR badge)
 *   Treatment B — Talent First (portrait more prominent, still bold $10/HR)
 *
 * Does NOT regenerate plates and makes NO OpenAI calls. Reads the approved
 * selected plates from plates/4x5/selection.json.
 *
 * MedVirtual brand system: #0D546B #077999 #00B2E2 + white/cream/soft-cyan.
 * $10/HR offer uses approved phrasing only ("STARTING AT $10/HR").
 *
 * Run: node scripts/composite-wave1-bold.mjs
 * Out: public/exports/wave1-first-launch/treatments/<STEM>_4x5_A.png (+ _B)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES, FAM, esc, measure, logoMarkup } from './wave1-render-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PLATE_DIR = path.join(ROOT, 'public/exports/wave1-first-launch/plates/4x5');
const OUT_DIR = path.join(ROOT, 'public/exports/wave1-first-launch/treatments');
const SRC_DIR = path.join(OUT_DIR, 'sources');

const W = 1080;
const H = 1350;

// MedVirtual brand palette (coded overlays only — portraits untouched)
const C = {
  cyan: '#00B2E2',
  teal: '#077999',
  deep: '#0D546B',
  dark: '#052A38',
  darker: '#041F29',
  ink: '#FFFFFF',
  cream: '#FBF7EE',
  soft: '#E6F7FC',
  navyText: '#06333F',
};

const CTA_A = 'REQUEST AN INTERVIEW';
const CTA_B = 'MEET YOUR NEXT HIRE';

const CONCEPTS = [
  {
    id: 'VMA-33',
    stem: 'MV_VMA_33_SpanishNeverLost',
    fullHeadline: 'YOUR SPANISH-SPEAKING PATIENTS SHOULD NEVER FEEL LOST',
    lines: [
      { t: "DON\u2019T LOSE" },
      { t: 'SPANISH', accent: true },
      { t: 'PATIENTS' },
    ],
    proof: 'Bilingual calls, scheduling & follow-up',
  },
  {
    id: 'VMA-34',
    stem: 'MV_VMA_34_BilingualFrontDesk',
    fullHeadline: 'ADD BILINGUAL SUPPORT WITHOUT OVERLOADING YOUR FRONT DESK',
    lines: [
      { t: 'ADD' },
      { t: 'BILINGUAL', accent: true },
      { t: 'SUPPORT' },
    ],
    proof: 'English & Spanish calls, scheduling & insurance',
  },
  {
    id: 'VMA-37',
    stem: 'MV_VMA_37_TrainedWorkflow',
    fullHeadline: 'TRAINED FOR THE WAY YOUR PRACTICE WORKS',
    lines: [
      { t: 'TRAINED ON' },
      { t: 'YOUR' },
      { t: 'WORKFLOW', accent: true },
    ],
    proof: 'Learns your systems, EMR & protocols',
  },
  {
    id: 'VMA-41',
    stem: 'MV_VMA_41_FrontDeskCapacity',
    fullHeadline: 'YOUR FRONT DESK CAN\u2019T DO EVERYTHING',
    lines: [
      { t: 'YOUR FRONT' },
      { t: 'DESK IS' },
      { t: 'MAXED OUT', accent: true },
    ],
    proof: 'Calls, scheduling, insurance & follow-up',
  },
  {
    id: 'VMA-43',
    stem: 'MV_VMA_43_ScheduleMoving',
    fullHeadline: 'KEEP THE SCHEDULE MOVING',
    lines: [
      { t: 'KEEP THE' },
      { t: 'SCHEDULE' },
      { t: 'MOVING', accent: true },
    ],
    proof: 'Confirmations, reminders & rescheduling',
  },
];

const em = (t) => measure(t, 1);

function readSelection() {
  const p = path.join(PLATE_DIR, 'selection.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
}

function fitStack(lines, maxWidth, maxSize, minSize) {
  let size = maxSize;
  for (const ln of lines) size = Math.min(size, maxWidth / em(ln.t));
  return Math.max(minSize, Math.min(maxSize, Math.floor(size)));
}

function stackSvg(lines, x, topY, size, lh, accentColor) {
  const step = size * lh;
  let out = '';
  let widest = 0;
  lines.forEach((ln, i) => {
    const y = topY + size * 0.8 + i * step;
    const fill = ln.accent ? accentColor : C.ink;
    out += `<text x="${x}" y="${y.toFixed(1)}" font-family="${FAM.head}" font-size="${size}" fill="${fill}">${esc(ln.t)}</text>\n`;
    widest = Math.max(widest, em(ln.t) * size);
  });
  return { svg: out, height: lines.length * step, widest };
}

// Dominant $10/HR offer badge. big=true → Treatment A scale.
function offerBadge(x, y, big) {
  const dollarSize = big ? 116 : 86;
  const hrSize = big ? 48 : 38;
  const capSize = big ? 24 : 20;
  const padX = big ? 34 : 26;
  const padTop = big ? 44 : 34;
  const priceW = em('$10').toFixed ? em('$10') * dollarSize : 0;
  const hrW = em('/HR') * hrSize;
  const innerW = priceW + 10 + hrW;
  const capW = em('STARTING AT') * capSize + 2 * (capSize * 0.5);
  const Wb = Math.max(innerW + padX * 2, capW + padX * 2, big ? 320 : 250);
  const Hb = padTop + dollarSize + (big ? 34 : 26);
  const priceBaseline = y + padTop + dollarSize * 0.82;
  const svg = `
    <rect x="${x + 8}" y="${y + 10}" width="${Wb.toFixed(0)}" height="${Hb.toFixed(0)}" rx="26" fill="${C.darker}" opacity="0.45"/>
    <rect x="${x}" y="${y}" width="${Wb.toFixed(0)}" height="${Hb.toFixed(0)}" rx="26" fill="${C.cyan}"/>
    <rect x="${x}" y="${y}" width="${Wb.toFixed(0)}" height="${Hb.toFixed(0)}" rx="26" fill="none" stroke="${C.ink}" stroke-width="3" opacity="0.35"/>
    <text x="${x + padX}" y="${y + padTop - (big ? 12 : 8)}" font-family="${FAM.bold}" font-size="${capSize}" fill="${C.navyText}" letter-spacing="2">STARTING AT</text>
    <text x="${x + padX}" y="${priceBaseline.toFixed(1)}" font-family="${FAM.head}" font-size="${dollarSize}" fill="${C.navyText}">$10</text>
    <text x="${(x + padX + priceW + 10).toFixed(1)}" y="${priceBaseline.toFixed(1)}" font-family="${FAM.head}" font-size="${hrSize}" fill="${C.navyText}">/HR</text>
  `;
  return { svg, width: Wb, height: Hb };
}

function ctaButton(x, y, label, style) {
  const textSize = 34;
  const padX = 46;
  const h = 98;
  const tw = em(label) * textSize;
  const w = tw + padX * 2 + 52;
  const bg = style === 'solid' ? C.cyan : C.ink;
  const fg = style === 'solid' ? C.navyText : C.deep;
  const arrowX = x + w - padX - 6;
  const cy = y + h / 2;
  const svg = `
    <rect x="${x + 6}" y="${y + 8}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="${C.darker}" opacity="0.4"/>
    <rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="${bg}"/>
    <text x="${x + padX}" y="${cy + textSize * 0.34}" font-family="${FAM.head}" font-size="${textSize}" fill="${fg}" letter-spacing="0.5">${esc(label)}</text>
    <path d="M${arrowX - 26} ${cy} h30 M${arrowX - 2} ${cy - 11} l12 11 l-12 11" fill="none" stroke="${fg}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  `;
  return { svg, width: w, height: h };
}

function eyebrow(x, y) {
  const size = 22;
  const label = 'VIRTUAL MEDICAL ADMIN';
  const w = em(label) * size + 46;
  const h = size + 24;
  return `
    <rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="${h}" rx="${h / 2}" fill="${C.cyan}"/>
    <text x="${x + w / 2}" y="${y + h / 2 + size * 0.34}" font-family="${FAM.bold}" font-size="${size}" fill="${C.navyText}" text-anchor="middle" letter-spacing="1.6">${esc(label)}</text>
  `;
}

const TRUST = 'Dedicated staff \u2014 not a call center, not AI, not software.';

function scrimDefs(treatment) {
  if (treatment === 'A') {
    return `
      <linearGradient id="hscrim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${C.darker}" stop-opacity="0.97"/>
        <stop offset="0.42" stop-color="${C.dark}" stop-opacity="0.92"/>
        <stop offset="0.60" stop-color="${C.dark}" stop-opacity="0.40"/>
        <stop offset="0.80" stop-color="${C.dark}" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="vscrim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.68" stop-color="${C.darker}" stop-opacity="0"/>
        <stop offset="1" stop-color="${C.darker}" stop-opacity="0.55"/>
      </linearGradient>`;
  }
  return `
    <linearGradient id="hscrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.darker}" stop-opacity="0.9"/>
      <stop offset="0.38" stop-color="${C.dark}" stop-opacity="0.66"/>
      <stop offset="0.58" stop-color="${C.dark}" stop-opacity="0.16"/>
      <stop offset="0.8" stop-color="${C.dark}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="vscrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.6" stop-color="${C.darker}" stop-opacity="0"/>
      <stop offset="1" stop-color="${C.darker}" stop-opacity="0.7"/>
    </linearGradient>`;
}

function buildOverlay(concept, treatment) {
  const margin = 64;
  const x = margin;
  const colW = treatment === 'A' ? 520 : 540;

  const logoScale = 0.30;
  const logoY = 60;
  const ebY = 170;
  const ebH = 46;

  const maxSize = treatment === 'A' ? 96 : 88;
  const lh = 0.98;
  const headSize = fitStack(concept.lines, colW, maxSize, 58);
  const headTop = ebY + ebH + 34;
  const head = stackSvg(concept.lines, x, headTop, headSize, lh, C.cyan);
  const headBottom = headTop + head.height;

  // accent underline beneath the stack
  const underlineY = headBottom + 6;
  const underline = `<rect x="${x}" y="${underlineY}" width="132" height="12" rx="6" fill="${C.cyan}"/>`;

  const report = { headSize, lines: concept.lines.map((l) => l.t) };

  let midSvg = '';
  const trustSize = 20;
  const trustY = H - 44;

  if (treatment === 'A') {
    const badge = offerBadge(x, underlineY + 40, true);
    const proofY = underlineY + 40 + badge.height + 46;
    const proofSize = 30;
    const proof = `<text x="${x}" y="${proofY}" font-family="${FAM.semi}" font-size="${proofSize}" fill="${C.soft}">${esc(concept.proof)}</text>`;
    const cta = ctaButton(x, H - 96 - 92, CTA_A, 'solid');
    midSvg = badge.svg + proof + cta.svg;
    report.offer = 'STARTING AT $10/HR';
    report.offerDollarSize = 116;
    report.cta = CTA_A;
    report.ctaSize = 34;
    report.proofSize = proofSize;
  } else {
    // Talent First: role lockup near person (lower), cleaner offer pill
    const badge = offerBadge(x, underlineY + 44, false);
    const proofY = underlineY + 44 + badge.height + 44;
    const proofSize = 30;
    const proof = `<text x="${x}" y="${proofY}" font-family="${FAM.semi}" font-size="${proofSize}" fill="${C.soft}">${esc(concept.proof)}</text>`;
    const cta = ctaButton(x, H - 96 - 92, CTA_B, 'light');
    // role tag lower-right over torso (never face)
    const roleX = 604;
    const roleY = H - 250;
    const roleTag = `
      <rect x="${roleX}" y="${roleY}" width="14" height="118" rx="7" fill="${C.cyan}"/>
      <text x="${roleX + 32}" y="${roleY + 46}" font-family="${FAM.head}" font-size="38" fill="${C.ink}">Your dedicated</text>
      <text x="${roleX + 32}" y="${roleY + 92}" font-family="${FAM.head}" font-size="38" fill="${C.cyan}">Virtual Medical Admin</text>`;
    midSvg = badge.svg + proof + roleTag + cta.svg;
    report.offer = 'STARTING AT $10/HR';
    report.offerDollarSize = 86;
    report.cta = CTA_B;
    report.ctaSize = 34;
    report.proofSize = proofSize;
    report.roleLockup = 'Your dedicated / Virtual Medical Admin';
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${scrimDefs(treatment)}</defs>
  <rect width="${W}" height="${H}" fill="url(#hscrim)"/>
  <rect width="${W}" height="${H}" fill="url(#vscrim)"/>
  ${logoMarkup(C.ink, x, logoY, logoScale)}
  ${eyebrow(x, ebY)}
  ${head.svg}
  ${underline}
  ${midSvg}
  <text x="${x}" y="${trustY}" font-family="${FAM.med}" font-size="${trustSize}" fill="${C.cream}" opacity="0.9">${esc(TRUST)}</text>
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
  let pink = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (isPink(data[i], data[i + 1], data[i + 2])) pink++;
  }
  return pink;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(SRC_DIR, { recursive: true });
  const selection = readSelection();
  const report = { generatedAt: new Date().toISOString(), ratio: '4x5', apiCalls: 0, concepts: [] };

  for (const c of CONCEPTS) {
    const plateFile = selection[c.id] || 'candidate-1.png';
    const platePath = path.join(PLATE_DIR, c.id, plateFile);
    if (!fs.existsSync(platePath)) throw new Error(`Missing approved plate: ${platePath}`);
    const base = await sharp(fs.readFileSync(platePath))
      .resize(W, H, { fit: 'cover', position: 'centre' })
      .toBuffer();

    const entry = { id: c.id, plate: plateFile, fullHeadline: c.fullHeadline, treatments: {} };

    for (const t of ['A', 'B']) {
      const { svg, report: r } = buildOverlay(c, t);
      const overlay = new Resvg(svg, {
        fitTo: { mode: 'width', value: W },
        font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Be Vietnam' },
      }).render().asPng();
      const out = path.join(OUT_DIR, `${c.stem}_4x5_${t}.png`);
      const png = await sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
      fs.writeFileSync(out, png);
      fs.writeFileSync(path.join(SRC_DIR, `${c.stem}_4x5_${t}.svg`), svg);
      const meta = await sharp(png).metadata();
      const pink = await pinkCount(png);
      entry.treatments[t] = {
        file: path.basename(out),
        dimensions: `${meta.width}x${meta.height}`,
        bytes: png.length,
        pinkPixels: pink,
        ...r,
      };
      console.log(`${c.id} ${t} -> ${path.basename(out)} (${meta.width}x${meta.height}, ${png.length}b, head ${r.headSize}px, pink ${pink})`);
    }
    report.concepts.push(entry);
  }

  fs.writeFileSync(path.join(OUT_DIR, 'wave1-bold-report.json'), JSON.stringify(report, null, 2));
  console.log('\nReport: public/exports/wave1-first-launch/treatments/wave1-bold-report.json');
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
