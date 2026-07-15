/**
 * GREEN-WINNER PROOF (4:5) — one test concept rebuilt on the exact visual system of the
 * running winners (VMA-01 SpanishGreen / VMA-04 HIPAAGreen), measured in
 * green-winner-style-profile.json. Portrait NOT regenerated (uses approved VMA-33 plate).
 *
 * System (from pixels, not memory):
 *   - Near-black copy field (#050807), person on the right.
 *   - Title Case 4-line headline "Hire a / Virtual / Medical / Admin", huge (~55% h),
 *     white with ONE lime-green word. Clean heavy letters, NO outline/extrusion/sparkle.
 *   - Lime green sampled #55C63A. Cyan price accent #09BDE6. White #FAFAFA.
 *   - $10 huge white + cyan /HR on a black card (SpanishGreen price grammar).
 *   - Minimal secondary copy; one Spanish availability pill; one big CTA button.
 *
 * Run: node scripts/composite-green-proof.mjs
 * Out: public/exports/wave1-first-launch/treatments/GREEN_PROOF_VMA_33_4x5.png
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

const W = 1080, H = 1350;
// MedVirtual-anchored: deep navy/teal field (reads near-black, keeps brand), cyan/navy as the
// system, lime green as the performance accent. Winning green-ad hierarchy, not a clone.
const C = {
  field: '#07202B', fieldDeep: '#04161E', white: '#FAFAFA',
  lime: '#55C63A', limeDeep: '#3FA129', cyan: '#00B2E2', cyanDeep: '#0782A0', navyInk: '#052732',
  flagGreen: '#006847', flagRed: '#CE1126',
};

// ---- text measurement (trim-based, real Be Vietnam) ----
const ratioCache = new Map();
function textPng(text, weight, size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="9000" height="${Math.ceil(size * 1.8)}"><text x="0" y="${Math.round(size * 1.3)}" font-family="${BE}" font-weight="${weight}" font-size="${size}" fill="#fff">${esc(text)}</text></svg>`;
  return new Resvg(svg, { font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
}
async function emRatio(text, weight) {
  const key = `${weight}|${text}`;
  if (ratioCache.has(key)) return ratioCache.get(key);
  let ratio;
  try { const info = await sharp(textPng(text, weight, 200)).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true }); ratio = info.info.width / 200; }
  catch { ratio = text.length * 0.6; }
  ratioCache.set(key, ratio); return ratio;
}
const widthOf = async (t, w, s) => (await emRatio(t, w)) * s;
function T(x, y, text, weight, size, fill, extra = '') {
  return `<text x="${x}" y="${y.toFixed(1)}" font-family="${BE}" font-weight="${weight}" font-size="${size}" fill="${fill}"${extra}>${esc(text)}</text>`;
}

async function build() {
  const x = 72;
  // Headline: Title Case, one green word, tight leading, clean (subtle shadow only — no outline)
  const lines = [
    { t: 'Hire a', color: C.white },
    { t: 'Virtual', color: C.lime },
    { t: 'Medical', color: C.white },
    { t: 'Admin', color: C.white },
  ];
  const colW = 640;
  let size = 176;
  for (const ln of lines) size = Math.min(size, colW / (await emRatio(ln.t, WEIGHT.extrabold)));
  size = Math.floor(size);
  const lh = size * 0.92;
  const topY = 118;
  let headSvg = '';
  lines.forEach((ln, i) => {
    const yy = topY + size * 0.80 + i * lh;
    // subtle depth: one soft dark offset, then clean letter (no stroke)
    headSvg += `<text x="${x + 4}" y="${(yy + 5).toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="#000000" opacity="0.55">${esc(ln.t)}</text>`;
    headSvg += `<text x="${x}" y="${yy.toFixed(1)}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${ln.color}">${esc(ln.t)}</text>`;
  });
  const headBottom = topY + size * 0.80 + (lines.length - 1) * lh + size * 0.22;

  // Spanish availability pill (compact, one secondary message)
  const pillY = headBottom + 34, pillH = 66, fSize = 34;
  const pillText = 'Spanish Speaking Available';
  const pillTextW = await widthOf(pillText, WEIGHT.bold, fSize);
  const flagD = 40, pillW = 30 + flagD + 16 + pillTextW + 30;
  const spanishPill = `<rect x="${x}" y="${pillY}" width="${pillW.toFixed(0)}" height="${pillH}" rx="${pillH / 2}" fill="${C.fieldDeep}" stroke="${C.lime}" stroke-width="3"/>
    <clipPath id="pf"><circle cx="${x + 30 + flagD / 2}" cy="${pillY + pillH / 2}" r="${flagD / 2}"/></clipPath>
    <g clip-path="url(#pf)">
      <rect x="${x + 30}" y="${pillY + pillH / 2 - flagD / 2}" width="${flagD / 3}" height="${flagD}" fill="${C.flagGreen}"/>
      <rect x="${x + 30 + flagD / 3}" y="${pillY + pillH / 2 - flagD / 2}" width="${flagD / 3}" height="${flagD}" fill="#FFFFFF"/>
      <rect x="${x + 30 + 2 * flagD / 3}" y="${pillY + pillH / 2 - flagD / 2}" width="${flagD / 3}" height="${flagD}" fill="${C.flagRed}"/>
    </g>
    <circle cx="${x + 30 + flagD / 2}" cy="${pillY + pillH / 2}" r="${flagD / 2}" fill="none" stroke="#FFFFFF" stroke-width="2"/>
    ${T(x + 30 + flagD + 16, pillY + pillH / 2 + fSize * 0.34, pillText, WEIGHT.bold, fSize, C.white)}`;

  // Price card — SpanishGreen grammar: black card, cyan STARTING AT, huge white $10, cyan /HR parallelogram
  const priceY = pillY + pillH + 30;
  const capSize = 40, dollarSize = 132, hrSize = 52;
  const dW = await widthOf('$10', WEIGHT.extrabold, dollarSize);
  const capW = await widthOf('STARTING AT', WEIGHT.bold, capSize);
  const hrW = await widthOf('/HR', WEIGHT.extrabold, hrSize);
  const cardPadX = 34, cardW = Math.max(dW + 24 + hrW + 60, capW) + cardPadX * 2, cardH = capSize + 28 + dollarSize + 30;
  const capBaseY = priceY + 34 + capSize * 0.34;
  const dollarBaseY = priceY + 34 + capSize + dollarSize * 0.80;
  const hrH = hrSize + 22, hrX = x + cardPadX + dW + 22, hrY = dollarBaseY - hrH * 0.72;
  const priceCard = `<rect x="${x}" y="${priceY}" width="${cardW.toFixed(0)}" height="${cardH.toFixed(0)}" rx="22" fill="${C.fieldDeep}" stroke="${C.cyan}" stroke-width="4"/>
    <rect x="${x + cardPadX}" y="${priceY + 30}" width="14" height="${capSize + 2}" fill="${C.cyan}"/>
    ${T(x + cardPadX + 26, capBaseY, 'STARTING AT', WEIGHT.bold, capSize, C.cyan, ' letter-spacing="4"')}
    ${T(x + cardPadX, dollarBaseY, '$10', WEIGHT.extrabold, dollarSize, C.white)}
    <g transform="skewX(-12)"><rect x="${(hrX + hrY * 0.21).toFixed(1)}" y="${hrY.toFixed(1)}" width="${(hrW + 40).toFixed(0)}" height="${hrH}" rx="6" fill="${C.cyan}"/></g>
    ${T(hrX + 20, hrY + hrH * 0.5 + hrSize * 0.34, '/HR', WEIGHT.extrabold, hrSize, '#04222B')}`;

  // CTA — big physical button, brand cyan solid, deep-navy text
  const ctaLabel = 'REQUEST AN INTERVIEW';
  const ctaSize = 52, ctaH = 128, ctaPadX = 56;
  const ctaTW = await widthOf(ctaLabel, WEIGHT.extrabold, ctaSize);
  const ctaW = Math.min(W - x * 2, ctaTW + ctaPadX * 2 + 70);
  const ctaY = H - 72 - ctaH, ctaCy = ctaY + ctaH / 2, arrowX = x + ctaW - ctaPadX;
  const cta = `<rect x="${x}" y="${ctaY + 14}" width="${ctaW.toFixed(0)}" height="${ctaH}" rx="${ctaH / 2}" fill="${C.cyanDeep}"/>
    <rect x="${x}" y="${ctaY}" width="${ctaW.toFixed(0)}" height="${ctaH}" rx="${ctaH / 2}" fill="${C.cyan}"/>
    ${T(x + ctaPadX, ctaCy + ctaSize * 0.34, ctaLabel, WEIGHT.extrabold, ctaSize, C.navyInk)}
    <path d="M${arrowX - 30} ${ctaCy} h34 M${arrowX + 4} ${ctaCy - 15} l17 15 l-17 15" fill="none" stroke="${C.navyInk}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="field" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.fieldDeep}" stop-opacity="1"/>
      <stop offset="0.46" stop-color="${C.field}" stop-opacity="0.98"/>
      <stop offset="0.60" stop-color="${C.field}" stop-opacity="0.74"/>
      <stop offset="0.78" stop-color="${C.field}" stop-opacity="0.14"/>
      <stop offset="0.9" stop-color="${C.field}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.6" stop-color="${C.fieldDeep}" stop-opacity="0"/>
      <stop offset="1" stop-color="${C.fieldDeep}" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#field)"/>
  <rect width="${W}" height="${H}" fill="url(#floor)"/>
  ${logoMarkup(C.white, x, 52, 0.30)}
  ${headSvg}
  ${spanishPill}
  ${priceCard}
  ${cta}
</svg>`;

  return { svg, report: { headlineSize: size, lineHeight: +(lh / size).toFixed(2), lines: lines.map((l) => l.t), accentGreen: C.lime, priceDollarSize: dollarSize, ctaSize, ctaLabel, secondaryMessages: ['STARTING AT $10/HR', 'Spanish Speaking Available'] } };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const selection = JSON.parse(fs.readFileSync(path.join(PLATE_DIR, 'selection.json'), 'utf8'));
  const platePath = path.join(PLATE_DIR, 'VMA-33', selection['VMA-33']);
  const base = await sharp(fs.readFileSync(platePath))
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .modulate({ saturation: 1.14, brightness: 1.02 })
    .linear(1.12, -12)
    .sharpen({ sigma: 1.1 })
    .toBuffer();

  const { svg, report } = await build();
  const overlay = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
  const png = await sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
  const out = path.join(OUT_DIR, 'GREEN_PROOF_VMA_33_4x5.png');
  fs.writeFileSync(out, png);
  fs.writeFileSync(path.join(OUT_DIR, 'sources', 'GREEN_PROOF_VMA_33_4x5.svg'), svg);
  const meta = await sharp(png).metadata();
  fs.writeFileSync(path.join(OUT_DIR, 'green-proof-report.json'), JSON.stringify({ ...report, plate: `VMA-33/${selection['VMA-33']}`, dimensions: `${meta.width}x${meta.height}`, file: path.basename(out) }, null, 2));
  console.log(`Green proof -> ${path.basename(out)} (${meta.width}x${meta.height}, headline ${report.headlineSize}px, leading ${report.lineHeight})`);
}
main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
