/**
 * PROMPT 7 — Assemble one component-based proof (1080×1350).
 * Uses approved systems from Prompts 1–6 only. Portrait unchanged (VMA-41).
 *
 * Run: node scripts/composite-component-proof.mjs
 *      node scripts/generate-component-proof-board.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES, BE, WEIGHT, esc, logoMarkup } from './wave1-render-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/exports/component-proof');
const PLATE = path.join(ROOT, 'public/exports/wave1-first-launch/plates/4x5');

const W = 1080, H = 1350;
const X = 52;
const COL = {
  face: '#FAF1D2', focal: '#FFD400', forest: '#14532D', extrude: '#0A3A1E',
  ygreen: '#9DCB3B', highlight: '#FFF7CE', slab: '#073F2A',
  deep: '#073F2A', forest2: '#075C37', yellow: '#F2D72E', cream: '#FFF4D6', ink: '#052818',
};

const SERVICE = ['HIRE A', 'VIRTUAL', 'MEDICAL ASSISTANT'];
const PAIN = ['TOO MANY CALLS.', 'NOT ENOUGH STAFF.'];
const BENEFITS = ['FULL-TIME STAFF', 'DEDICATED TO YOUR PRACTICE'];

// ---- text measure ----
const ratioCache = new Map();
function textPng(text, size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="9000" height="${Math.ceil(size * 1.8)}"><text x="0" y="${Math.round(size * 1.3)}" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5">${esc(text)}</text></svg>`;
  return new Resvg(svg, { font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
}
async function emRatio(text) {
  if (ratioCache.has(text)) return ratioCache.get(text);
  let r;
  try { const info = await sharp(textPng(text, 200)).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true }); r = info.info.width / 200; }
  catch { r = text.length * 0.55; }
  ratioCache.set(text, r); return r;
}
const widthOf = async (t, s) => (await emRatio(t)) * s;

function layeredLineLeft(x, baseline, text, size, cfg, widthLocal) {
  const { scaleX = 0.78, To = 7, Ts = 4, extrudeDepth = 12, focal = false, highlight = true, underline = false } = cfg;
  const face = focal ? COL.focal : COL.face;
  const ux = size * 0.011, uy = size * 0.013;
  const anchor = 'start';
  let inner = '';
  for (let i = extrudeDepth; i >= 1; i--) {
    inner += `<text x="0" y="0" transform="translate(${(ux * i).toFixed(1)} ${(uy * i).toFixed(1)})" text-anchor="${anchor}" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="${COL.extrude}">${esc(text)}</text>`;
  }
  if (Ts > 0) inner += `<text x="0" y="0" text-anchor="${anchor}" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="none" stroke="${COL.ygreen}" stroke-width="${2 * (To + Ts)}" stroke-linejoin="round">${esc(text)}</text>`;
  inner += `<text x="0" y="0" text-anchor="${anchor}" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="none" stroke="${COL.forest}" stroke-width="${2 * To}" stroke-linejoin="round">${esc(text)}</text>`;
  if (highlight) inner += `<text x="0" y="0" transform="translate(-3 -3)" text-anchor="${anchor}" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="${COL.highlight}">${esc(text)}</text>`;
  inner += `<text x="0" y="0" text-anchor="${anchor}" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="${face}">${esc(text)}</text>`;
  if (underline) inner += `<rect x="0" y="${(size * 0.16).toFixed(1)}" width="${widthLocal.toFixed(1)}" height="${(size * 0.11).toFixed(1)}" rx="${(size * 0.05).toFixed(1)}" fill="${COL.focal}"/>`;
  return `<g transform="translate(${x} ${baseline}) scale(${scaleX} 1)">${inner}</g>`;
}

function painLine(x, y, text, accentWord) {
  const parts = text.split(accentWord);
  if (parts.length < 2) return `<text x="${x}" y="${y}" font-family="${BE}" font-weight="800" font-size="44" fill="${COL.cream}" letter-spacing="1">${esc(text)}</text>`;
  return `<text x="${x}" y="${y}" font-family="${BE}" font-weight="800" font-size="44" fill="${COL.cream}" letter-spacing="1">${esc(parts[0])}<tspan fill="${COL.yellow}">${esc(accentWord)}</tspan>${esc(parts[1])}</text>`;
}

function benefitBlock(x, y, text) {
  const w = Math.min(560, text.length * 42 * 0.58 + 120);
  const h = 76;
  const ty = h / 2 + 42 * 0.34;
  return `<g transform="translate(${x} ${y})">
    <rect x="12" y="14" width="${w}" height="${h}" rx="12" fill="${COL.ink}"/>
    <rect x="0" y="0" width="${w}" height="${h}" rx="12" fill="${COL.deep}" stroke="${COL.cream}" stroke-width="8"/>
    <path d="M24 40 l12 14 l28 -30" fill="none" stroke="${COL.yellow}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="68" y="${ty}" font-family="${BE}" font-weight="800" font-size="42" fill="${COL.cream}" letter-spacing="0.5">${esc(text)}</text>
  </g>`;
}

function priceBadge(x, y) {
  const rot = -2;
  const cx = x + 200, cy = y + 108;
  return `<g transform="translate(${x} ${y}) rotate(${rot} ${cx - x} ${cy - y})">
    <rect x="12" y="66" width="400" height="130" rx="16" fill="${COL.yellow}"/>
    <rect x="0" y="56" width="400" height="130" rx="16" fill="${COL.deep}" stroke="${COL.cream}" stroke-width="10"/>
    <rect x="20" y="0" width="360" height="56" rx="10" fill="${COL.forest2}" stroke="${COL.cream}" stroke-width="6"/>
    <text x="200" y="38" font-family="${BE}" font-weight="700" font-size="32" fill="${COL.cream}" text-anchor="middle" letter-spacing="3">STARTING AT</text>
    <text x="146" y="150" font-family="${BE}" font-weight="800" font-size="124" fill="${COL.cream}" text-anchor="middle">$10</text>
    <text x="292" y="142" font-family="${BE}" font-weight="800" font-size="50" fill="${COL.yellow}" text-anchor="middle">/HR</text>
  </g>`;
}

function ctaButton(x, y, w) {
  const h = 124, r = h / 2, label = 'REQUEST AN INTERVIEW', fs = 56;
  const ty = y + h / 2 + fs * 0.34;
  let ext = '';
  for (let i = 14; i >= 1; i--) ext += `<rect x="${i}" y="${y + i + 12}" width="${w}" height="${h}" rx="${r}" fill="${COL.ink}"/>`;
  const ax = x + w - 58;
  return `${ext}
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${COL.yellow}" stroke="${COL.forest2}" stroke-width="10"/>
    <rect x="${x + 12}" y="${y + 10}" width="${w - 24}" height="8" rx="4" fill="${COL.cream}" opacity="0.85"/>
    <text x="${x + 58}" y="${ty}" font-family="${BE}" font-weight="800" font-size="${fs}" fill="${COL.deep}">${esc(label)}</text>
    <path d="M${ax - 30} ${y + h / 2} h34 M${ax + 4} ${y + h / 2 - 15} l16 15 l-16 15" fill="none" stroke="${COL.deep}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function iconBadge(cx, cy) {
  const R = 88;
  return `<g transform="translate(${cx} ${cy}) rotate(-3)">
    <circle cx="12" cy="14" r="${R}" fill="${COL.ink}"/>
    <circle cx="0" cy="0" r="${R}" fill="${COL.deep}" stroke="${COL.ygreen}" stroke-width="10"/>
    <g transform="scale(1.05)">
      <path d="M-18 -42 c-8 0-14 6-14 14 v52 c0 8 6 14 14 14 h8 l22-22 v-36 z" fill="${COL.cream}"/>
      <path d="M12 -8 c14 0 26 12 26 26" fill="none" stroke="${COL.cream}" stroke-width="7"/>
      <path d="M20 4 c10 0 18 8 18 18" fill="none" stroke="${COL.cream}" stroke-width="6"/>
      <circle cx="38" cy="-32" r="10" fill="${COL.yellow}"/>
      <rect x="-8" y="28" width="36" height="14" rx="7" fill="${COL.cream}"/>
    </g>
  </g>`;
}

function focalSlab(x, y, w, h) {
  return `<g transform="translate(${x} ${y}) rotate(-4 ${w / 2} ${h / 2})">
    <rect x="14" y="12" width="${w}" height="${h}" rx="14" fill="${COL.yellow}"/>
    <rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="${COL.slab}"/>
  </g>`;
}

function greenBackground() {
  const cx = W * 0.36, cy = H * 0.28;
  return `<defs>
    <radialGradient id="burst" cx="${cx}" cy="${cy}" r="58%" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0B8F4D"/><stop offset="28%" stop-color="#087A43"/>
      <stop offset="58%" stop-color="#075C37"/><stop offset="100%" stop-color="#073F2A"/>
    </radialGradient>
    <radialGradient id="outer" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.48"/>
    </radialGradient>
    <linearGradient id="portraitFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#073F2A" stop-opacity="0.88"/>
      <stop offset="0.36" stop-color="#073F2A" stop-opacity="0.42"/>
      <stop offset="0.52" stop-color="#073F2A" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.55" stop-color="#073F2A" stop-opacity="0"/><stop offset="1" stop-color="#052818" stop-opacity="0.75"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#073F2A"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${W * 0.62}" ry="${H * 0.38}" fill="url(#burst)"/>
  <g opacity="0.18" transform="rotate(-8 ${cx} ${cy})"><polygon points="${cx - 280},${cy} ${cx},${cy - 420} ${cx + 280},${cy}" fill="#B8D833"/></g>
  <rect width="${W}" height="${H}" fill="url(#outer)"/>`;
}

async function buildOverlay(report) {
  const colW = 620;
  const lh = 0.90, cfg6 = { scaleX: 0.78, To: 7, Ts: 4, extrudeDepth: 12 };
  let size = 108;
  for (const ln of SERVICE) size = Math.min(size, colW / ((await emRatio(ln)) * 0.78));
  size = Math.floor(size);
  const focalSize = Math.round(size * 1.18);

  const painY1 = 118, painY2 = 168;
  let y = 210;
  const headSvg = [];
  const lineYs = [];

  // focal slab behind VIRTUAL (line 2)
  const virtualW = (await widthOf('VIRTUAL', focalSize)) * 0.78 + 48;
  const slabH = Math.round(focalSize * 0.95);
  const virtualY = y + size * 0.80 + size * lh;
  headSvg.push(focalSlab(X - 8, virtualY - slabH * 0.55, virtualW, slabH));

  for (let i = 0; i < SERVICE.length; i++) {
    const isFocal = i === 1;
    const s = isFocal ? focalSize : size;
    const wLocal = (await widthOf(SERVICE[i], s)) * 0.78;
    const baseline = y + s * 0.80;
    lineYs.push(baseline);
    headSvg.push(layeredLineLeft(X, baseline, SERVICE[i], s, { ...cfg6, focal: isFocal, underline: isFocal }, wLocal));
    y += size * lh + (isFocal ? focalSize - size : 0);
  }
  const headBottom = y + 8;

  const benefitY1 = headBottom + 24;
  const benefitY2 = benefitY1 + 84;
  const priceY = benefitY2 + 88;
  const ctaY = H - 72 - 124;
  const ctaW = W - X * 2;

  report.headline = {
    baseSize: size, focalSize, lineHeight: lh, scaleX: 0.78,
    canvasOccupancy: { widthPct: +((virtualW + 80) / W * 100).toFixed(1), heightPct: +((headBottom - 210) / H * 100).toFixed(1) },
    strokeOuter: 14, strokeYgreen: 22, extrusionSteps: 12, extrusionStep: [0.011, 0.013],
    colors: COL,
  };
  report.price = { dollarSize: 124, hrSize: 50, capSize: 32 };
  report.cta = { height: 124, fontSize: 56, width: ctaW };

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${greenBackground()}
  <rect width="${W}" height="${H}" fill="url(#portraitFade)"/>
  <rect width="${W}" height="${H}" fill="url(#floor)"/>
  ${logoMarkup(COL.cream, X, 48, 0.28)}
  ${painLine(X, painY1, PAIN[0], 'CALLS')}
  ${painLine(X, painY2, PAIN[1], 'STAFF')}
  ${headSvg.join('\n')}
  ${benefitBlock(X, benefitY1, BENEFITS[0])}
  ${benefitBlock(X, benefitY2, BENEFITS[1])}
  ${priceBadge(X, priceY)}
  ${ctaButton(X, ctaY, ctaW)}
  ${iconBadge(918, 200)}
</svg>`;
  return svg;
}

export async function renderProof() {
  fs.mkdirSync(OUT, { recursive: true });
  const selection = JSON.parse(fs.readFileSync(path.join(PLATE, 'selection.json'), 'utf8'));
  const platePath = path.join(PLATE, 'VMA-41', selection['VMA-41']);
  const portrait = await sharp(fs.readFileSync(platePath))
    .resize(W, H, { fit: 'cover', position: 'right' })
    .modulate({ saturation: 1.12, brightness: 1.02 })
    .linear(1.1, -10)
    .sharpen({ sigma: 1.05 })
    .toBuffer();

  const report = {
    generatedAt: new Date().toISOString(),
    canvas: `${W}x${H}`,
    plate: `VMA-41/${selection['VMA-41']}`,
    components: {
      headline: 'Prompt 1 · treatment 6',
      background: 'Prompt 2 · green burst',
      focalSlab: 'Prompt 2 · tilted yellow offset',
      priceBadge: 'Prompt 3 · stacked dimensional',
      cta: 'Prompt 4 · yellow physical',
      icon: 'Prompt 5 · call volume · variant A',
      benefits: ['Prompt 6 · FULL-TIME STAFF', 'DEDICATED TO YOUR PRACTICE'],
    },
    messaging: { pain: PAIN, service: SERVICE.join(' / '), price: 'STARTING AT $10/HR', cta: 'REQUEST AN INTERVIEW' },
  };

  const overlaySvg = await buildOverlay(report);
  const overlay = new Resvg(overlaySvg, {
    fitTo: { mode: 'width', value: W },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE },
  }).render().asPng();

  const png = await sharp(portrait).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
  const outFile = 'COMPONENT_PROOF_VMA41_4x5.png';
  fs.writeFileSync(path.join(OUT, outFile), png);
  fs.writeFileSync(path.join(OUT, 'COMPONENT_PROOF_VMA41_4x5.svg'), overlaySvg);
  fs.writeFileSync(path.join(OUT, 'component-proof-report.json'), JSON.stringify(report, null, 2));
  console.log(`Proof -> ${outFile} (headline ${report.headline.baseSize}px / focal ${report.headline.focalSize}px)`);
  return report;
}

if (process.argv[1]?.includes('composite-component-proof')) {
  renderProof().catch((e) => { console.error('Fatal:', e); process.exit(1); });
}
